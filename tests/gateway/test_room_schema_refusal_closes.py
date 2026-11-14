"""Room reads relinquish their connection when a schema readiness probe refuses."""

import sqlite3

import pytest

from agent_cli.database_migrations import UnsupportedDatabaseSchema
from gateway import hosted_rooms


def test_schema_refusal_closes_opened_room_connection(tmp_path, monkeypatch):
    path = tmp_path / "shared-state.db"
    hosted_rooms._connect(path).close()
    with sqlite3.connect(path) as conn:
        conn.execute("DROP INDEX idx_hosted_room_events_cursor")
    opened = []
    original = hosted_rooms.open_sqlite

    def capture(*args, **kwargs):
        conn = original(*args, **kwargs)
        opened.append(conn)
        return conn

    monkeypatch.setattr(hosted_rooms, "open_sqlite", capture)
    with pytest.raises(UnsupportedDatabaseSchema, match="idx_hosted_room_events_cursor"):
        hosted_rooms._read_connection(path)
    for conn in opened:
        with pytest.raises(sqlite3.ProgrammingError, match="closed"):
            conn.execute("SELECT 1")
