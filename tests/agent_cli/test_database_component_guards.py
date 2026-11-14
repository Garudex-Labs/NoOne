"""Restore/reopen admission protects component ownership, not only column shapes."""

import sqlite3

import pytest

from agent_cli import backup_restore
from agent_cli.database_migrations import (
    UnsupportedDatabaseSchema, database_is_current, initialize_database,
    require_database_schema, validate_database_snapshot,
)
from agent_state import SessionDB


@pytest.mark.parametrize("existing", [False, True])
def test_projects_snapshot_cannot_replace_a_session_store(tmp_path, existing):
    source, destination = tmp_path / "projects-only.db", tmp_path / "state.db"
    with sqlite3.connect(source) as conn:
        initialize_database(conn, "projects")
    source_bytes = source.read_bytes()
    if existing:
        with SessionDB(destination) as db:
            db.create_session("retained", source="cli")
            db.append_message("retained", "user", "must survive")
            db._conn.execute("INSERT INTO runtime_epoch VALUES(1,3,'previous')")
            db._conn.commit()
    original = destination.read_bytes() if existing else None
    assert backup_restore._safe_restore_db(source, destination) is False
    assert source.read_bytes() == source_bytes
    assert (destination.read_bytes() if existing else None) == original
    if existing:
        with SessionDB(destination) as db:
            assert db.get_messages("retained")[0]["content"] == "must survive"
    else:
        assert not destination.exists()


def test_missing_target_archive_import_rejects_the_wrong_component(tmp_path):
    import zipfile
    source, destination = tmp_path / "projects.db", tmp_path / "state.db"
    with sqlite3.connect(source) as conn:
        initialize_database(conn, "projects")
    archive = tmp_path / "backup.zip"
    with zipfile.ZipFile(archive, "w") as zf:
        zf.write(source, "state.db")
    with zipfile.ZipFile(archive) as zf:
        with pytest.raises(OSError, match="schema is unsupported"):
            backup_restore._import_db_member(zf, "state.db", destination)
    assert not destination.exists()


@pytest.mark.parametrize("version", [None, 2])
def test_existing_child_requires_its_parent_component(tmp_path, version):
    path = tmp_path / "rooms.db"
    with sqlite3.connect(path) as conn:
        initialize_database(conn, "hosted_room_tasks")
        if version is None:
            conn.execute("DELETE FROM schema_migrations WHERE component='hosted_rooms'")
        else:
            conn.execute("UPDATE schema_migrations SET version=? WHERE component='hosted_rooms'", (version,))
    original = path.read_bytes()
    with sqlite3.connect(path) as conn:
        assert database_is_current(conn, "hosted_room_tasks") is False
        with pytest.raises(UnsupportedDatabaseSchema, match="hosted_rooms"):
            require_database_schema(conn, "hosted_room_tasks")
        with pytest.raises(UnsupportedDatabaseSchema, match="hosted_rooms"):
            initialize_database(conn, "hosted_room_tasks")
        with pytest.raises(UnsupportedDatabaseSchema, match="hosted_rooms"):
            validate_database_snapshot(conn, expected_component="hosted_room_tasks")
    assert path.read_bytes() == original
