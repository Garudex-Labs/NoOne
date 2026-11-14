"""Unsupported snapshots and cached opens cannot bypass migration authority."""

import contextlib
import sqlite3

import pytest

from agent_cli import backup_restore, kanban_db_connect, projects_db
from agent_cli.database_migrations import BASE_VERSION, UnsupportedDatabaseSchema
from agent_state import SessionDB


def test_restore_rejects_historical_snapshot_without_overwriting_current_data(tmp_path):
    source = tmp_path / "snapshot.db"
    destination = tmp_path / "state.db"
    with contextlib.closing(sqlite3.connect(source)) as conn:
        conn.execute("CREATE TABLE sessions(id TEXT PRIMARY KEY, source TEXT)")
        conn.execute("INSERT INTO sessions VALUES ('old','cli')")
        conn.commit()
    with SessionDB(destination) as db:
        db.create_session("current", source="cli", system_prompt="retained")
    assert not backup_restore._safe_restore_db(source, destination)
    with SessionDB(destination) as db:
        assert db.get_session("current")["system_prompt"] == "retained"
        assert db.get_session("old") is None


def test_restore_rejects_future_snapshot_without_overwriting_current_data(tmp_path):
    source, destination = tmp_path / "snapshot.db", tmp_path / "state.db"
    for path, sid in ((source, "snapshot"), (destination, "current")):
        with SessionDB(path) as db:
            db.create_session(sid, source="cli")
    with sqlite3.connect(source) as conn:
        conn.execute("UPDATE schema_migrations SET version=?", (BASE_VERSION + 1,))
    assert not backup_restore._safe_restore_db(source, destination)
    with SessionDB(destination) as db:
        assert db.get_session("current") is not None
        assert db.get_session("snapshot") is None


@pytest.mark.parametrize("component,opener", [("kanban", kanban_db_connect.connect), ("projects", projects_db.connect)])
def test_cached_reopen_rejects_a_changed_version(tmp_path, component, opener):
    path = tmp_path / "store.db"
    opener(path).close()
    with sqlite3.connect(path) as conn:
        conn.execute("UPDATE schema_migrations SET version=? WHERE component=?", (BASE_VERSION + 1, component))
    with pytest.raises(UnsupportedDatabaseSchema, match="version"):
        opener(path)
    with sqlite3.connect(path) as conn:
        assert conn.execute("SELECT version FROM schema_migrations WHERE component=?", (component,)).fetchone()[0] == BASE_VERSION + 1


def test_unversioned_present_component_prevents_snapshot_publication(tmp_path):
    from agent_cli.database_migrations import base_sql, execute_script
    source, destination = tmp_path / "snapshot.db", tmp_path / "state.db"
    for path, sid in ((source, "snapshot"), (destination, "current")):
        with SessionDB(path) as db:
            db.create_session(sid, source="cli")
    with sqlite3.connect(source) as conn:
        execute_script(conn.cursor(), base_sql("delivery_ledger"))
    assert not backup_restore._safe_restore_db(source, destination)
    with SessionDB(destination) as db:
        assert db.get_session("current") is not None


def test_new_target_import_rejects_unsupported_schema(tmp_path):
    import zipfile
    source, destination = tmp_path / "old.db", tmp_path / "state.db"
    with sqlite3.connect(source) as conn:
        conn.execute("CREATE TABLE sessions(id TEXT)")
    archive = tmp_path / "backup.zip"
    with zipfile.ZipFile(archive, "w") as zf:
        zf.write(source, "state.db")
    with zipfile.ZipFile(archive) as zf:
        with pytest.raises(OSError, match="schema is unsupported"):
            backup_restore._import_db_member(zf, "state.db", destination)
    assert not destination.exists()


def test_foreign_migration_metadata_is_not_interpreted_as_host_metadata(tmp_path):
    from agent_cli.database_migrations import validate_database_snapshot
    with contextlib.closing(sqlite3.connect(tmp_path / "external.db")) as conn:
        conn.execute("CREATE TABLE schema_migrations(id INTEGER PRIMARY KEY, applied_at TEXT)")
        conn.execute("INSERT INTO schema_migrations VALUES (1,'external')")
        validate_database_snapshot(conn)
        with pytest.raises(UnsupportedDatabaseSchema, match="host migration metadata"):
            validate_database_snapshot(conn, expected_component="state")
