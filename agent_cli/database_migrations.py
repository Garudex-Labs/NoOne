"""The numbered NoOne database foundation, shared by independently owned stores.

Each component of migration 0001 belongs to its existing database file. There
is deliberately no importer for historical schemas. Caller-owned transactions
are preserved, and failed initialization never publishes a version marker.
"""

from __future__ import annotations

import contextlib
import datetime
import functools
import sqlite3
import uuid
from pathlib import Path


BASE_VERSION = 1
_BASE_DIR = Path(__file__).parent / "data" / "migrations" / "0001_base"
_DEPENDENCIES = {
    "hosted_room_tasks": ("hosted_rooms",),
    "hosted_room_policy": ("hosted_rooms",),
    "hosted_room_work": ("hosted_rooms",),
}
_VERSION_DDL = """CREATE TABLE schema_migrations (
    component TEXT PRIMARY KEY,
    version INTEGER NOT NULL CHECK (version >= 1)
)"""


class UnsupportedDatabaseSchema(RuntimeError):
    """The store is not a supported NoOne database; its data is left intact."""


@functools.cache
def base_sql(component: str) -> str:
    if not component.isidentifier():
        raise ValueError(f"Invalid database component: {component!r}")
    return (_BASE_DIR / f"{component}.sql").read_text(encoding="utf-8-sig")


def execute_script(cursor: sqlite3.Cursor, script: str) -> None:
    """Execute complete SQL statements without executescript's implicit COMMIT."""
    statement = ""
    for character in script:
        statement += character
        if character == ";" and sqlite3.complete_statement(statement):
            cursor.execute(statement)
            statement = ""
    if statement.strip() and not all(
        not line.strip() or line.lstrip().startswith("--") for line in statement.splitlines()
    ):
        raise ValueError("Incomplete database migration statement")


@functools.cache
def base_table_shapes(component: str) -> dict[str, tuple]:
    """Column/FK contracts of the base migration, including affinity and defaults."""
    with contextlib.closing(sqlite3.connect(":memory:")) as reference:
        for dependency in _DEPENDENCIES.get(component, ()):
            execute_script(reference.cursor(), base_sql(dependency))
        inherited = {row[0] for row in reference.execute("SELECT name FROM sqlite_master")}
        execute_script(reference.cursor(), base_sql(component))
        tables = [row[0] for row in reference.execute(
            "SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'"
        ) if row[0] not in inherited]
        return {
            table: (
                tuple(tuple(row) for row in reference.execute(f'PRAGMA table_info("{table}")')),
                tuple(tuple(row) for row in reference.execute(f'PRAGMA foreign_key_list("{table}")')),
            )
            for table in tables
        }


@functools.cache
def base_objects(component: str) -> dict[str, str]:
    """Stored DDL contracts, including CHECKs, UNIQUEs, indexes and triggers."""
    with contextlib.closing(sqlite3.connect(":memory:")) as reference:
        for dependency in _DEPENDENCIES.get(component, ()):
            execute_script(reference.cursor(), base_sql(dependency))
        inherited = {row[0] for row in reference.execute("SELECT name FROM sqlite_master")}
        execute_script(reference.cursor(), base_sql(component))
        return {row[0]: " ".join(row[1].split()) for row in reference.execute(
            "SELECT name,sql FROM sqlite_master WHERE sql IS NOT NULL AND name NOT LIKE 'sqlite_%'"
        ) if row[0] not in inherited}


def validate_base_schema(conn: sqlite3.Connection, component: str) -> None:
    """Reject schema drift; adding missing columns is not a migration strategy."""
    for table, expected in base_table_shapes(component).items():
        actual = (
            tuple(tuple(row) for row in conn.execute(f'PRAGMA table_info("{table}")')),
            tuple(tuple(row) for row in conn.execute(f'PRAGMA foreign_key_list("{table}")')),
        )
        if actual != expected:
            raise UnsupportedDatabaseSchema(
                f"Unsupported {component} database schema: {table} differs from migration 0001. "
                "No data was converted or deleted. Use a fresh NoOne data directory or restore a compatible backup."
            )
    for name, expected in base_objects(component).items():
        row = conn.execute("SELECT sql FROM sqlite_master WHERE name=?", (name,)).fetchone()
        if row is None or " ".join((row[0] or "").split()) != expected:
            raise UnsupportedDatabaseSchema(
                f"Unsupported {component} database schema: {name} differs from migration 0001. "
                "No data was converted or deleted."
            )


def _version(conn: sqlite3.Connection, component: str) -> int | None:
    if conn.execute(
        "SELECT 1 FROM sqlite_master WHERE type='table' AND name='schema_migrations'"
    ).fetchone() is None:
        return None
    row = conn.execute("SELECT version FROM schema_migrations WHERE component=?", (component,)).fetchone()
    return row[0] if row is not None else None


def database_is_current(conn: sqlite3.Connection, component: str) -> bool:
    """Read-only readiness probe; initialization belongs under the caller's writer gate."""
    if _version(conn, component) != BASE_VERSION:
        return False
    if not all(database_is_current(conn, dependency) for dependency in _DEPENDENCIES.get(component, ())):
        return False
    validate_base_schema(conn, component)
    return True


def require_database_schema(conn: sqlite3.Connection, component: str) -> None:
    """Validate a read-only attachment without initializing or upgrading anything."""
    for dependency in _DEPENDENCIES.get(component, ()):
        require_database_schema(conn, dependency)
    version = _version(conn, component)
    if version != BASE_VERSION:
        raise UnsupportedDatabaseSchema(
            f"Unsupported {component} database version {version!r}; NoOne requires migration 0001. "
            "Use a fresh NoOne data directory or restore a compatible backup. No data was changed."
        )
    validate_base_schema(conn, component)


def require_initializable_schema(conn: sqlite3.Connection, component: str) -> None:
    """Read-only admission before journal/pragma changes or base initialization."""
    if _version(conn, component) is not None:
        require_database_schema(conn, component)
        return
    existing = {row[0] for row in conn.execute("SELECT name FROM sqlite_master WHERE type='table'")}
    if existing.intersection(base_table_shapes(component)):
        raise UnsupportedDatabaseSchema(
            f"Unversioned or historical {component} database is unsupported by NoOne 0.1.0. "
            "No data was converted or deleted. Use a fresh NoOne data directory or restore a compatible backup."
        )


def validate_database_snapshot(conn: sqlite3.Connection, *, expected_component: str | None = None) -> None:
    """Reject unsupported host snapshots before restore publishes any pages.

    Arbitrary external/plugin databases without host migration records retain
    their owner's schema policy. Independently initialized host components may
    coexist without requiring a feature that had not yet created its tables.
    """
    has_history = conn.execute(
        "SELECT 1 FROM sqlite_master WHERE type='table' AND name='schema_migrations'"
    ).fetchone() is not None
    if not has_history:
        if expected_component is not None:
            raise UnsupportedDatabaseSchema(f"Historical {expected_component} snapshot is unsupported; destination unchanged")
        return
    columns = {row[1] for row in conn.execute("PRAGMA table_info(schema_migrations)")}
    if not {"component", "version"}.issubset(columns):
        if expected_component is not None:
            raise UnsupportedDatabaseSchema("Snapshot has incompatible host migration metadata; destination unchanged")
        return  # Foreign migration metadata belongs to the external database owner.
    records = conn.execute("SELECT component,version FROM schema_migrations").fetchall()
    components = {row[0] for row in records}
    if expected_component is not None and expected_component not in components:
        raise UnsupportedDatabaseSchema(
            f"Snapshot does not contain the required {expected_component} component; destination unchanged"
        )
    known = {path.stem for path in _BASE_DIR.glob("*.sql")} - {"state_fts", "state_fts_trigram"}
    if expected_component is None and not components.intersection(known):
        return  # An external owner's migration table, not NoOne's.
    if not records:
        raise UnsupportedDatabaseSchema("Snapshot has no initialized database components; destination unchanged")
    for component in components:
        if component not in known:
            raise UnsupportedDatabaseSchema(f"Unsupported snapshot component {component!r}; destination unchanged")
        require_database_schema(conn, component)
    tables = {row[0] for row in conn.execute("SELECT name FROM sqlite_master WHERE type='table'")}
    for component in known:
        if tables.intersection(base_table_shapes(component)):
            require_database_schema(conn, component)


def initialize_database(conn: sqlite3.Connection, component: str) -> bool:
    """Apply migration 0001 exactly once. Return True only for a newly created component.

    A database may contain several independently initialized components. Existing
    unversioned tables owned by this component are never silently adopted.
    """
    version = _version(conn, component)
    if version is not None:
        if version != BASE_VERSION:
            raise UnsupportedDatabaseSchema(
                f"Unsupported {component} database version {version}; this release supports {BASE_VERSION}. "
                "No data was converted or deleted."
            )
        require_database_schema(conn, component)
        return False

    owns_transaction = not conn.in_transaction
    conn.execute("BEGIN IMMEDIATE" if owns_transaction else "SAVEPOINT base_migration")
    try:
        for dependency in _DEPENDENCIES.get(component, ()):
            initialize_database(conn, dependency)
        # Recheck under the writer lock: another process may have initialized it.
        version = _version(conn, component)
        if version is not None:
            if version != BASE_VERSION:
                raise UnsupportedDatabaseSchema(f"Unsupported {component} database version {version}")
            require_database_schema(conn, component)
            created = False
        else:
            existing = {row[0] for row in conn.execute("SELECT name FROM sqlite_master WHERE type='table'")}
            require_initializable_schema(conn, component)
            if "schema_migrations" not in existing:
                conn.execute(_VERSION_DDL)
            execute_script(conn.cursor(), base_sql(component))
            validate_base_schema(conn, component)
            if component == "state":
                conn.executemany(
                    "INSERT INTO state_meta(key,value) VALUES (?,?)",
                    [("store_instance_id", str(uuid.uuid4())),
                     ("store_created_at_utc", datetime.datetime.now(datetime.UTC).isoformat())],
                )
            conn.execute("INSERT INTO schema_migrations(component,version) VALUES (?,?)", (component, BASE_VERSION))
            created = True
        conn.execute("COMMIT" if owns_transaction else "RELEASE base_migration")
        return created
    except BaseException:
        if owns_transaction:
            conn.rollback()
        else:
            conn.execute("ROLLBACK TO base_migration")
            conn.execute("RELEASE base_migration")
        raise
