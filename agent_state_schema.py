"""Base migration initialization and recoverable FTS management for SessionDB.

Plain mixin for ``agent_state.SessionDB`` (no ``__init__``/state of its own).
Must never import agent_state (cycle); shared constants live in agent_state_common.
"""

import contextlib
import logging
import json
import sqlite3
import time
from typing import Optional, Sequence


from agent_startup_watchdog import report_startup_progress
from utils import safe_json_loads
from agent_state_common import (
    FTS_REBUILD_DEFERRAL_KEY, FTS_STALE_KEY, FTS_SQL,
    FTS_STORAGE_VERSION, FTS_TRIGRAM_SQL, SCHEMA_SQL,
    _FTS_TRIGGERS, fts_rebuild_admission,
)
from agent_state_fts import (
    _drop_orphan_fts_shadow_tables, base_source_view_is_stale, fts_layout_current, fts_layout_drift,
)
from agent_state_holders import _read_proc_argv
from agent_state_search import _meta_row

# Pre-split logger identity so log filtering/capture is unchanged.
logger = logging.getLogger("agent_state")

_FTS_HOLDER_ESCALATE_ATTEMPTS = 3
_FTS_HOLDER_ESCALATE_SECONDS = 60.0
# The same holder PID set blocking this many deferrals over this long is a structurally resident
# peer (a supervised service on the same HERMES_HOME), not a transient one worth waiting out (#106393).
_FTS_HOLDER_FUTILE_ATTEMPTS = 10
_FTS_HOLDER_FUTILE_SECONDS = 1800.0
# retry_deferred_fts_recovery cadence: startup paid the full admission wait once; later
# retries are non-blocking probes whose spacing doubles up to the cap.
_FTS_STALE_RETRY_SECONDS = 60.0
_FTS_STALE_RETRY_MAX_SECONDS = 3600.0
def _holder_cmdline(pid: int) -> str:
    argv = _read_proc_argv(pid)
    return " ".join(argv)[:120] if argv else "<cmdline unavailable>"

# schema_read_probe_statements() cache (parses SCHEMA_SQL in an in-memory DB; once per process).
_READ_PROBE_STATEMENTS: Optional[tuple] = None

# Trigram triggers need the trigram tokenizer (SQLite >= 3.34); without it _ensure_fts_schema
# soft-fails that DDL and "all six present" is unsatisfiable, so a trigger's absence is
# measured only against the DDL that can create it.
_FTS_TRIGRAM_TRIGGERS = tuple(n for n in _FTS_TRIGGERS if "_trigram_" in n)
_FTS_BASE_TRIGGERS = tuple(n for n in _FTS_TRIGGERS if n not in _FTS_TRIGRAM_TRIGGERS)

_STALE_KEY_UPSERT_SQL = (
    "INSERT INTO state_meta (key, value) VALUES (?, '1') ON CONFLICT(key) DO UPDATE SET value = excluded.value"
)
_STATE_META_UPSERT_SQL = (
    "INSERT INTO state_meta (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value"
)
_CLEAR_REBUILD_MARKERS_SQL = "DELETE FROM state_meta WHERE key IN ('fts_rebuild_high_water', 'fts_rebuild_progress')"




def _q(ident: str) -> str:
    """Double-quote an SQL identifier."""
    return '"' + ident.replace('"', '""') + '"'


def schema_read_probe_statements() -> tuple:
    """SELECT statements that fail iff a live store is behind SCHEMA_SQL. Read-only opens skip
    ``_reconcile_columns()`` (no DDL against another profile's live DB), so healing callers
    run these afterwards: a missing table/column raises at prepare time. Derived from
    SCHEMA_SQL (a hand-maintained list went stale within days). Columns are
    table-qualified: an unqualified double-quoted identifier that fails to resolve silently
    degrades to a string literal (SQLite misfeature) and would pass on the stale store."""
    global _READ_PROBE_STATEMENTS
    if _READ_PROBE_STATEMENTS is None:
        tables = SessionSchemaMixin._parse_schema_columns(SCHEMA_SQL)
        _READ_PROBE_STATEMENTS = tuple(
            "SELECT {} FROM {} LIMIT 0".format(", ".join(f"{_q(table)}.{_q(col)}" for col in cols), _q(table))
            for table, cols in sorted(tables.items())
        )
    return _READ_PROBE_STATEMENTS


class SessionSchemaMixin:
    """See module docstring — mixin for SessionDB (Schema cluster)."""


    def _sqlite_supports_fts5(self, cursor: sqlite3.Cursor) -> bool:
        try:
            cursor.execute("CREATE VIRTUAL TABLE temp._agent_fts5_probe USING fts5(x)")
            cursor.execute("DROP TABLE temp._agent_fts5_probe")
            return True
        except sqlite3.OperationalError as exc:
            if not self._is_fts5_unavailable_error(exc):
                raise
            self._warn_fts5_unavailable(exc)
            return False

    def _drop_all_fts_triggers(self, cursor: sqlite3.Cursor) -> None:
        self._drop_fts_triggers(cursor)

    @staticmethod
    def _fts_triggers_missing(cursor: sqlite3.Cursor, names: Sequence[str]) -> bool:
        """True unless every trigger in *names* (one DDL half) exists."""
        if not names:
            return False  # "name IN ()" is a SQLite syntax error
        placeholders = ",".join("?" for _ in names)
        sql = f"SELECT COUNT(*) FROM sqlite_master WHERE type = 'trigger' AND name IN ({placeholders})"
        return int(cursor.execute(sql, tuple(names)).fetchone()[0]) < len(names)




    @staticmethod
    def _rebuild_fts_indexes(cursor: sqlite3.Cursor, *, include_trigram: bool = True) -> None:
        """Rebuild derived search indexes from their canonical projection views."""
        tables = ("messages_fts", "messages_fts_trigram") if include_trigram else ("messages_fts",)
        for table in tables:
            cursor.execute(f"INSERT INTO {table}({table}) VALUES('rebuild')")
        cursor.execute(_CLEAR_REBUILD_MARKERS_SQL)

    def _fts_table_probe(self, cursor: sqlite3.Cursor, table_name: str) -> Optional[bool]:
        """True = queryable, False = absent, None = FTS module/tokenizer missing or content
        undecodable (index degraded, store accessible). Invalid UTF-8 surfaces as a bare
        UnicodeDecodeError on some builds and OperationalError("Could not decode to UTF-8")
        on others; both are caught so the probe never raises into init/recovery flows.
        Anything else (malformed schema, corrupt vtable) re-raises."""
        try:
            cursor.execute(f"SELECT * FROM {table_name} LIMIT 0")
            return True
        except UnicodeDecodeError as exc:
            decode_exc = exc
        except sqlite3.OperationalError as exc:
            if self._is_fts5_unavailable_error(exc):
                # A missing trigram tokenizer only affects trigram search; only a missing
                # FTS5 module disables FTS entirely.
                if self._is_trigram_unavailable_error(exc):
                    self._warn_trigram_unavailable(exc)
                else:
                    self._warn_fts5_unavailable(exc)
                return None
            if "no such table" in str(exc).lower():
                return False
            if "decode to utf-8" not in str(exc).lower():
                raise
            decode_exc = exc
        logger.warning(
            "%s probe encountered invalid UTF-8 in FTS content; "
            "search may return incomplete results until FTS is rebuilt: %s", table_name, decode_exc,
        )
        return None

    # ── Stale-FTS recovery ─────────────────────────────────────────────────

    def _defer_stale_fts_for_holders(self, cursor: sqlite3.Cursor, foreign_holders) -> bool:
        """Record a deferral diagnostic for the foreign processes holding the DB; True = defer
        (holders remain). After ``_FTS_HOLDER_ESCALATE_ATTEMPTS`` deferrals spanning
        ``_FTS_HOLDER_ESCALATE_SECONDS``, provably inactive orphan Desktop backends are
        reaped and the holders re-checked. The orphan reap is the only exit, so a supervised
        peer (never an orphan) blocks forever: once the SAME PID set has blocked
        ``_FTS_HOLDER_FUTILE_ATTEMPTS`` deferrals over ``_FTS_HOLDER_FUTILE_SECONDS`` the
        record is marked ``futile`` and the escalation names the holders and the remedy that
        works from inside a gateway session (stop only the other holder; this process's own
        retry tick admits the rebuild). A changed holder set restarts that window."""
        now = time.time()
        try:
            row = cursor.execute(
                "SELECT value FROM state_meta WHERE key = ? LIMIT 1", (FTS_REBUILD_DEFERRAL_KEY,),
            ).fetchone()
        except sqlite3.Error:
            row = None
        parsed = safe_json_loads(row[0]) if row else None
        record = parsed if isinstance(parsed, dict) else {}
        try:
            first_seen = float(record.get("first_seen", now))
            attempts = int(record.get("attempts", 0)) + 1
            holders_since = float(record.get("holders_since", now))
            holders_attempts = int(record.get("holders_attempts", 0)) + 1
        except (TypeError, ValueError):
            first_seen, attempts, holders_since, holders_attempts = now, 1, now, 1
        if first_seen > now or first_seen < 0:
            first_seen = now
        holder_pids = sorted({pid for pid, _path in foreign_holders if pid > 0})
        if holder_pids != record.get("holder_pids"):
            holders_since, holders_attempts = now, 1
        if attempts >= _FTS_HOLDER_ESCALATE_ATTEMPTS and now - first_seen >= _FTS_HOLDER_ESCALATE_SECONDS:
            reaped = self._reap_inactive_orphan_desktop_holders(
                foreign_holders, min_age_seconds=_FTS_HOLDER_ESCALATE_SECONDS,
            )
            if reaped:
                logger.error(
                    "Reaped inactive orphan Desktop backend(s) %s after %d "
                    "state.db FTS rebuild deferrals; checking holders again.", reaped, attempts,
                )
                foreign_holders = self._foreign_state_db_holders()
                holder_pids = sorted({pid for pid, _path in foreign_holders if pid > 0})
        futile = bool(holder_pids) and (
            holders_attempts >= _FTS_HOLDER_FUTILE_ATTEMPTS and now - holders_since >= _FTS_HOLDER_FUTILE_SECONDS
        )
        diagnostic = {
            "first_seen": first_seen, "last_seen": now, "attempts": attempts, "holder_pids": holder_pids,
            "holders_since": holders_since, "holders_attempts": holders_attempts, "futile": futile,
        }
        cursor.execute(
            "INSERT INTO state_meta (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value",
            (FTS_REBUILD_DEFERRAL_KEY, json.dumps(diagnostic, sort_keys=True)),
        )
        if not foreign_holders:
            self._fts_deferred_holder_pids = None
            return False
        self._fts_deferred_holder_pids = holder_pids
        if futile:
            logger.error(
                "state.db FTS repair has been blocked by the same holder(s) for %d deferrals over %.0f min "
                "(%s); waiting is futile. Stop ONLY the other holder(s) — this process keeps running and its "
                "own retry admits the rebuild within %.0fs of the holder leaving. `noone doctor` shows this.",
                holders_attempts, (now - holders_since) / 60.0,
                ", ".join(f"pid {pid}: {_holder_cmdline(pid)}" for pid in holder_pids), _FTS_STALE_RETRY_SECONDS,
            )
        elif attempts >= _FTS_HOLDER_ESCALATE_ATTEMPTS and now - first_seen >= _FTS_HOLDER_ESCALATE_SECONDS:
            logger.error(
                "state.db FTS repair remains blocked after %d deferrals by holder(s) %s. Stop the listed "
                "processes (this process's own retry then rebuilds), or run `hermes sessions optimize-storage` "
                "with every holder stopped. `noone doctor` reports this degraded state.", attempts, foreign_holders,
            )
        logger.warning(
            "Deferred stale state.db FTS rebuild while foreign processes "
            "hold the database or WAL sidecars (%s); canonical writes and LIKE search remain available (deferral %d).",
            foreign_holders, attempts,
        )
        return True

    def _recover_stale_fts(self, cursor: sqlite3.Cursor, *, timeout_seconds=None) -> bool:
        """Atomically rebuild stale base/trigram indexes and resume syncing. *timeout_seconds*
        bounds the admission wait (None = full startup budget, ``0`` = non-blocking retry).
        Fails closed: holders or a lost admission race leave the breadcrumb set."""
        foreign_holders = self._foreign_state_db_holders()
        if foreign_holders and self._defer_stale_fts_for_holders(cursor, foreign_holders):
            return False
        with fts_rebuild_admission(self.db_path, timeout_seconds=timeout_seconds) as admitted:
            if not admitted:
                logger.warning(
                    "Deferred stale state.db FTS rebuild: another process holds the rebuild authority; "
                    "canonical writes and LIKE search remain available."
                )
                return False
            return self._recover_stale_fts_locked(cursor)

    def retry_deferred_fts_recovery(self) -> bool:
        """Retry a deferred stale-FTS rebuild (gateway housekeeping tick). ``_recover_stale_fts``
        fails closed at open, leaving search on LIKE; live write/search paths must never
        start a full rebuild, and a gateway opens state.db once for days, so "next open"
        never comes. Bounded doubling backoff, non-blocking admission, no new thread. True
        only when the index was rebuilt and sync triggers restored. Never raises.

        This is the in-process retry: bounded backoff from ``_FTS_STALE_RETRY_SECONDS`` doubling to
        ``_FTS_STALE_RETRY_MAX_SECONDS``, non-blocking admission (``timeout=0``) so a live holder is skipped
        and tried again later, no new thread — the caller is an existing periodic tick (gateway
        housekeeping). See #100108, #97940.
        """
        if not self._fts_stale:
            return False
        if self._quarantine_reason() is not None:
            # Quarantined: never run FTS DDL/DML against a damaged image or a stale/replaced generation
            # (mirrors _try_wal_checkpoint / close). Reset the backoff so a future un-quarantine starts
            # from the default interval.
            self._fts_stale_retry_after = 0.0
            self._fts_stale_retry_interval = 0.0
            return False
        if self.read_only or self._conn is None:
            return False
        now = time.monotonic()
        deferred_pids = getattr(self, "_fts_deferred_holder_pids", None)
        if now < getattr(self, "_fts_stale_retry_after", 0.0):
            # The backoff was earned by a specific holder set; once that set changes (the other
            # service stopped) a capped backoff would idle up to an hour with nothing blocking (#106393).
            if deferred_pids is None or sorted(
                {pid for pid, _path in self._foreign_state_db_holders() if pid > 0}
            ) == deferred_pids:
                return False
            self._fts_stale_retry_interval = 0.0
        interval = float(getattr(self, "_fts_stale_retry_interval", 0.0))
        if interval <= 0.0:
            interval = _FTS_STALE_RETRY_SECONDS
        self._fts_stale_retry_after = now + interval
        self._fts_stale_retry_interval = min(
            max(interval, _FTS_STALE_RETRY_SECONDS, 1.0) * 2.0, _FTS_STALE_RETRY_MAX_SECONDS,
        )
        try:
            with self._lock:
                if self._conn is None or not self._fts_stale:
                    return False
                cursor = self._conn.cursor()
                recovered = self._recover_stale_fts(cursor, timeout_seconds=0.0)
                if recovered:
                    self._fts_stale_retry_interval = 0.0
                with contextlib.suppress(sqlite3.Error):
                    self._conn.commit()
                return recovered
        except Exception:
            logger.warning(
                "In-process retry of the deferred stale state.db FTS rebuild failed; will retry later.", exc_info=True,
            )
            return False

    def _recover_stale_fts_locked(self, cursor: sqlite3.Cursor) -> bool:
        """Body of :meth:`_recover_stale_fts`; caller holds rebuild authority. One write
        transaction, so no canonical writer slips between rebuild and trigger restoration."""
        try:
            trigram_present = self._fts_table_probe(cursor, "messages_fts_trigram") is True
        except (sqlite3.DatabaseError, UnicodeDecodeError):
            # A corrupt vtable may fail even a LIMIT 0 probe; still include it in the drop-and-recreate.
            include_trigram = True
        else:
            include_trigram = trigram_present or self._trigram_tokenizer_available(cursor)

        drop_sql = "".join(f"DROP TRIGGER IF EXISTS {trigger};" for trigger in _FTS_TRIGGERS)
        if include_trigram:
            drop_sql += "DROP TABLE IF EXISTS messages_fts_trigram;"
        drop_sql += "DROP VIEW IF EXISTS messages_fts_trigram_src;DROP TABLE IF EXISTS messages_fts;"
        rebuild_sql = FTS_SQL + (FTS_TRIGRAM_SQL if include_trigram else "")
        rebuild_sql += "INSERT INTO messages_fts(messages_fts) VALUES('rebuild');"
        if include_trigram:
            rebuild_sql += "INSERT INTO messages_fts_trigram(messages_fts_trigram) VALUES('rebuild');"
        rebuild_sql += _CLEAR_REBUILD_MARKERS_SQL + ";"
        recovery_sql = (
            "BEGIN IMMEDIATE;" + drop_sql + rebuild_sql
            + f"DELETE FROM state_meta WHERE key IN ('{FTS_STALE_KEY}', '{FTS_REBUILD_DEFERRAL_KEY}');COMMIT;"
        )
        try:
            cursor.executescript(recovery_sql)
        except sqlite3.DatabaseError as exc:
            with contextlib.suppress(sqlite3.Error):
                self._conn.rollback()
            # Stale indexes must stay detached even on builds whose DDL transaction behavior differs.
            self._drop_all_fts_triggers(cursor)
            self._conn.commit()
            logger.error(
                "Automatic rebuild of stale FTS indexes failed (%s); "
                "canonical writes remain enabled with FTS detached.", exc,
            )
            return False
        self._fts_stale = False
        self._fts_enabled = True
        self._trigram_available = include_trigram
        logger.warning("Rebuilt stale state.db FTS indexes from canonical messages and restored sync triggers.")
        return True

    def _trigram_tokenizer_available(self, cursor: sqlite3.Cursor) -> bool:
        """Probe trigram support without publishing a persistent FTS object."""
        probe = "temp.hermes_fts5_trigram_probe"
        cursor.execute(f"DROP TABLE IF EXISTS {probe}")
        try:
            cursor.execute(f"CREATE VIRTUAL TABLE {probe} USING fts5(content, tokenize='trigram')")
        except sqlite3.OperationalError as exc:
            if not self._is_trigram_unavailable_error(exc):
                raise
            self._warn_trigram_unavailable(exc)
            return False
        finally:
            cursor.execute(f"DROP TABLE IF EXISTS {probe}")
        return True

    # ── Declarative column reconciliation ──────────────────────────────────

    @staticmethod
    def _parse_schema_columns(schema_sql: str) -> dict[str, dict[str, str]]:
        """Read declared columns from SQL; used by read-only probes and corruption salvage."""
        with contextlib.closing(sqlite3.connect(":memory:")) as reference:
            reference.executescript(schema_sql)
            tables = [row[0] for row in reference.execute(
                "SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'")]
            return {table: {row[1]: row[2] for row in reference.execute(f'PRAGMA table_info("{table}")')}
                    for table in tables}


    # ── _init_schema ───────────────────────────────────────────────────────

    def _init_schema(self):
        """Initialize the first-release base once, then attach recoverable search indexes."""
        from agent_cli.database_migrations import initialize_database

        report_startup_progress(600.0, phase="state_db_init_schema")
        cursor = self._conn.cursor()
        initialize_database(self._conn, "state")
        fts5_available = self._sqlite_supports_fts5(cursor)
        self._fts_stale = cursor.execute(
            "SELECT 1 FROM state_meta WHERE key=?", (FTS_STALE_KEY,)
        ).fetchone() is not None
        if self._fts_stale or not fts5_available:
            self._drop_all_fts_triggers(cursor)
        if fts5_available:
            self._init_fts(cursor)
            self._stamp_settled_fts_layout(cursor)
        self._conn.commit()

    def _stamp_settled_fts_layout(self, cursor: sqlite3.Cursor) -> None:
        """Write ``fts_storage_version`` once the stored layout is exactly current and nothing is in flight.

        The only open-time writer of the stamp, run after _init_fts so a fresh store is stamped on creation
        and a realigned base index is stamped only when the trigram also matches. A definition this code does
        not recognise (a newer release's) is never stamped down to this release's version. An interrupted
        optimize (markers, trash, an empty external index against non-empty messages) keeps the stamp
        unwritten so the resume offer stays alive. Reads before writing: a settled store never takes the write
        lock here.
        """
        if (
            self._fts_stale
            or not fts_layout_current(cursor)
            or _meta_row(cursor, "fts_rebuild_high_water") is not None
            or self._fts_external_index_empty_with_messages(cursor)
        ):
            return
        if cursor.execute(
            "SELECT 1 FROM state_meta WHERE key = 'fts_storage_version' AND value = ? LIMIT 1",
            (str(FTS_STORAGE_VERSION),),
        ).fetchone() is None:
            cursor.execute(_STATE_META_UPSERT_SQL, ("fts_storage_version", str(FTS_STORAGE_VERSION)))





    def _init_fts(self, cursor: sqlite3.Cursor) -> None:
        """Attach current FTS indexes, repairing missing derived objects after corruption.

        Missing SQLite capabilities keep their existing LIKE fallback. There is
        no inline-index upgrade or historical projection realignment.
        """
        from agent_cli.database_migrations import UnsupportedDatabaseSchema
        if fts_layout_drift(cursor) or base_source_view_is_stale(cursor):
            raise UnsupportedDatabaseSchema(
                "Unsupported state search-index layout; NoOne requires the migration 0001 projections. "
                "No data was converted or deleted."
            )
        # A `.recover`-restored image keeps the shadow tables but not the vtable rows; the DDL
        # below would fail on the first shadow. Drop only orphaned families, then rebuild the
        # recreated (empty) index like a missing-trigger repair (#103840).
        orphan_repaired = _drop_orphan_fts_shadow_tables(
            cursor, ("messages_fts", "messages_fts_trigram"),
        )
        if self._fts_stale:
            if not self._recover_stale_fts(cursor):
                self._fts_enabled = self._trigram_available = False
        else:
            base_sql, trigram_sql = FTS_SQL, FTS_TRIGRAM_SQL
            # Measure before any DDL. Publishing missing base triggers before rebuild admission lets
            # another process write through an index whose bootstrap/repair has no owner (#105790).
            base_triggers_missing = (
                self._fts_triggers_missing(cursor, _FTS_BASE_TRIGGERS) or "messages_fts" in orphan_repaired
            )
            trigram_triggers_missing = (
                self._fts_triggers_missing(cursor, _FTS_TRIGRAM_TRIGGERS) or "messages_fts_trigram" in orphan_repaired
            )

            def ensure_and_rebuild() -> None:
                self._fts_enabled = self._ensure_fts_schema(cursor, "messages_fts", base_sql)
                if not self._fts_enabled:
                    return
                self._trigram_available = self._ensure_fts_schema(cursor, "messages_fts_trigram", trigram_sql)
                self._rebuild_fts_indexes(
                    cursor, include_trigram=self._trigram_available,
                )

            if base_triggers_missing:
                # The authority covers the whole first-publication sequence, not merely the final rebuild.
                # ``executescript`` commits DDL statement-by-statement, so acquiring after ensure exposed a
                # partially initialized FTS family while another opener held the rebuild lock.
                self._run_admitted_startup_rebuild(cursor, ensure_and_rebuild)
            else:
                self._fts_enabled = self._ensure_fts_schema(cursor, "messages_fts", base_sql)
                if self._fts_enabled:
                    # Trigram is optional; without it CJK search falls back to LIKE.
                    trigram_enabled = self._ensure_fts_schema(cursor, "messages_fts_trigram", trigram_sql)
                    self._trigram_available = trigram_enabled
                    if trigram_enabled and trigram_triggers_missing:
                        self._run_admitted_startup_rebuild(
                            cursor,
                            lambda: self._rebuild_fts_indexes(
                                cursor, include_trigram=trigram_enabled,
                            ),
                        )

    def _run_admitted_startup_rebuild(self, cursor, rebuild_fn) -> None:
        """Run FTS bootstrap or trigger-repair rebuild under cross-process admission.

        The fresh/base-missing path includes DDL in ``rebuild_fn`` so no process can publish
        triggers before it owns the rebuild. Other repair paths may already have recreated an
        optional trigger; deferral therefore still drops every trigger and persists the stale
        breadcrumb. A later recovery path restores the complete family.

        See #93200.
        See #105790.
        """
        with fts_rebuild_admission(self.db_path) as admitted:
            if admitted:
                rebuild_fn()
                return
        logger.warning(
            "Deferred startup FTS rebuild: another process holds the "
            "rebuild authority for this state.db; detaching FTS sync until the stale-index recovery path rebuilds it."
        )
        cursor.execute(_STALE_KEY_UPSERT_SQL, (FTS_STALE_KEY,))
        self._drop_all_fts_triggers(cursor)
        self._fts_stale = True
        self._fts_enabled = self._trigram_available = False
