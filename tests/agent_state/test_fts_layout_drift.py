"""Only current FTS projections may be attached to a NoOne state store."""
import sqlite3

import pytest

from agent_cli.database_migrations import UnsupportedDatabaseSchema
from agent_state import SessionDB
from agent_state_common import FTS_STORAGE_VERSION
from agent_state_fts import fts_layout_current, fts_layout_drift


def test_fresh_indexes_are_current_and_stamped(tmp_path):
    with SessionDB(tmp_path / "state.db") as db:
        if not db._fts_enabled:
            pytest.skip("FTS5 unavailable")
        assert fts_layout_current(db._conn.cursor())
        assert not fts_layout_drift(db._conn.cursor())
        assert db.get_meta("fts_storage_version") == str(FTS_STORAGE_VERSION)


def test_unknown_index_layout_cannot_be_attached_or_optimized(tmp_path):
    path = tmp_path / "state.db"
    with SessionDB(path) as db:
        if not db._fts_enabled:
            pytest.skip("FTS5 unavailable")
        db.create_session("s", source="cli")
        db.append_message("s", "user", "retained")
        db._conn.execute("DROP TABLE messages_fts")
        db._conn.execute("CREATE VIRTUAL TABLE messages_fts USING fts5(content,tokenize='porter')")
        db._conn.commit()
        assert fts_layout_drift(db._conn.cursor()) == ["messages_fts"]
        assert db.optimize_fts_storage(vacuum=False)["reason"] == "unsupported_fts_layout"
    with pytest.raises(UnsupportedDatabaseSchema, match="search-index layout"):
        SessionDB(path)
    with sqlite3.connect(path) as conn:
        assert conn.execute("SELECT content FROM messages").fetchone()[0] == "retained"


def test_settle_refuses_incomplete_current_backfill(tmp_path, monkeypatch):
    with SessionDB(tmp_path / "state.db") as db:
        if not db._fts_enabled:
            pytest.skip("FTS5 unavailable")
        db.create_session("s", source="cli")
        db.append_message("s", "user", "pending rebuild")
        db._execute_write(lambda conn: db._seed_fts_rebuild_markers(conn, force=True))
        monkeypatch.setattr(db, "fts_rebuild_step", lambda: False)
        assert db.optimize_fts_storage(vacuum=False)["reason"] == "backfill_incomplete"
        assert db.get_meta("fts_rebuild_high_water") is not None
