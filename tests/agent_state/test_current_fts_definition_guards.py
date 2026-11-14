"""Present incompatible search objects must not masquerade as the current index."""

import sqlite3

import pytest

from agent_cli.database_migrations import UnsupportedDatabaseSchema
from agent_state import SessionDB


@pytest.mark.parametrize("trigger", ["messages_fts_insert", "messages_fts_trigram_insert"])
def test_same_name_noop_trigger_is_refused_without_losing_transcripts(tmp_path, trigger):
    path = tmp_path / "state.db"
    with SessionDB(path) as db:
        db.create_session("retained", source="cli")
        db.append_message("retained", "user", "protected transcript")
        db._conn.execute(f"DROP TRIGGER {trigger}")
        db._conn.execute(f"CREATE TRIGGER {trigger} AFTER INSERT ON messages BEGIN SELECT 1; END;")
        db._conn.commit()
    with pytest.raises(UnsupportedDatabaseSchema, match="search-index layout"):
        SessionDB(path)
    with sqlite3.connect(path) as conn:
        assert conn.execute("SELECT content FROM messages").fetchone()[0] == "protected transcript"


def test_missing_sync_trigger_is_rebuilt_and_search_keeps_working(tmp_path):
    path = tmp_path / "state.db"
    with SessionDB(path) as db:
        db.create_session("retained", source="cli")
        db.append_message("retained", "user", "previouscanary")
        db._conn.execute("DROP TRIGGER messages_fts_insert")
        db._conn.commit()
    with SessionDB(path) as db:
        db.append_message("retained", "user", "newcanary")
        assert db.search_messages("previouscanary")
        assert db.search_messages("newcanary")
