"""Fresh-release schema, transaction ownership and unsupported-store contracts."""

from __future__ import annotations

import contextlib
import sqlite3
import threading
from concurrent.futures import ThreadPoolExecutor

import pytest

from agent_cli.database_migrations import (
    BASE_VERSION, UnsupportedDatabaseSchema, database_is_current, initialize_database,
)
from agent_state import SessionDB


@pytest.mark.parametrize("component", [
    "state", "kanban", "projects", "cron_executions", "cron_incidents", "cron_delivery",
    "cron_notepad", "delivery_ledger", "verification", "hosted_rooms", "hosted_room_replicas",
    "hosted_room_tasks", "hosted_room_policy", "hosted_room_work", "hosted_room_router",
    "hosted_room_attachments", "hosted_room_handoff", "responses", "run_idempotency", "metrics",
])
def test_component_creation_and_reopen_are_idempotent(tmp_path, component):
    path = tmp_path / "store.db"
    with contextlib.closing(sqlite3.connect(path)) as conn:
        conn.execute("PRAGMA foreign_keys=ON")
        assert initialize_database(conn, component)
        assert database_is_current(conn, component)
        assert conn.execute("PRAGMA integrity_check").fetchone()[0] == "ok"
        assert conn.execute("PRAGMA foreign_key_check").fetchall() == []
    with contextlib.closing(sqlite3.connect(path)) as conn:
        assert not initialize_database(conn, component)
        assert conn.execute(
            "SELECT version FROM schema_migrations WHERE component=?", (component,),
        ).fetchone()[0] == BASE_VERSION


def test_session_runtime_and_content_addressed_prompt_survive_reopen(tmp_path):
    path = tmp_path / "state.db"
    with SessionDB(path) as db:
        for sid in ("parent", "child"):
            db.create_session(sid, source="cli", system_prompt="immutable prompt",
                              parent_session_id="parent" if sid == "child" else None)
        db.append_message("parent", "user", "searchable text")
        db.append_message("parent", "assistant", "answer")
        db.set_session_title("parent", "Unique title")
        assert db.get_session("parent")["system_prompt"] == "immutable prompt"
        assert db._conn.execute("SELECT COUNT(*) FROM system_prompts").fetchone()[0] == 1
        assert "system_prompt" not in {
            row[1] for row in db._conn.execute("PRAGMA table_info(sessions)")
        }
        before = db.get_session("parent")["transcript_revision"]
        db._conn.execute("UPDATE messages SET content='updated answer' WHERE role='assistant'")
        db._conn.commit()
        assert db.get_session("parent")["transcript_revision"] > before
        with pytest.raises(sqlite3.IntegrityError):
            db._conn.execute("UPDATE sessions SET title='Unique title' WHERE id='child'")
        db._conn.rollback()
        with pytest.raises(sqlite3.IntegrityError):
            db._conn.execute("UPDATE messages SET active=NULL")
        db._conn.rollback()
    with SessionDB(path) as db:
        assert db.get_session("child")["parent_session_id"] == "parent"
        assert db.get_session("child")["system_prompt"] == "immutable prompt"
        assert db.get_messages("parent")[-1]["content"] == "updated answer"
        assert db._conn.execute("PRAGMA foreign_key_check").fetchall() == []


def test_topic_schema_does_not_enable_topic_mode(tmp_path):
    with SessionDB(tmp_path / "state.db") as db:
        assert not db.is_telegram_topic_mode_enabled(chat_id="chat", user_id="user")
        db.enable_telegram_topic_mode(chat_id="chat", user_id="user", profile_name="a")
        assert db.is_telegram_topic_mode_enabled(chat_id="chat", user_id="user", profile_name="a")
        assert not db.is_telegram_topic_mode_enabled(chat_id="chat", user_id="user", profile_name="b")


def test_shared_file_components_do_not_rewrite_each_other(tmp_path):
    with contextlib.closing(sqlite3.connect(tmp_path / "executions.db")) as conn:
        initialize_database(conn, "cron_executions")
        conn.execute("INSERT INTO executions(id,job_id,source,process_id,pid,status,claimed_at) "
                     "VALUES ('attempt','job','cron','process',1,'missed','2026-11-14')")
        initialize_database(conn, "cron_incidents")
        conn.commit()
        assert conn.execute("SELECT status FROM executions").fetchone()[0] == "missed"
        assert not initialize_database(conn, "cron_executions")
        assert not initialize_database(conn, "cron_incidents")


def test_nested_initialization_does_not_commit_the_callers_transaction(tmp_path):
    with contextlib.closing(sqlite3.connect(tmp_path / "store.db")) as conn:
        conn.execute("BEGIN IMMEDIATE")
        initialize_database(conn, "hosted_room_policy")
        assert conn.in_transaction
        conn.rollback()
        assert conn.execute("SELECT name FROM sqlite_master").fetchall() == []


class _FailingCursor(sqlite3.Cursor):
    def execute(self, sql, parameters=()):
        if "CREATE INDEX idx_sessions_source " in sql:
            raise sqlite3.OperationalError("injected migration failure")
        return super().execute(sql, parameters)


class _FailingConnection(sqlite3.Connection):
    def cursor(self, factory=_FailingCursor):
        return super().cursor(factory)


def test_failed_ddl_rolls_back_schema_and_version_marker(tmp_path):
    with contextlib.closing(sqlite3.connect(tmp_path / "store.db", factory=_FailingConnection)) as conn:
        with pytest.raises(sqlite3.OperationalError, match="injected migration failure"):
            initialize_database(conn, "state")
        assert not conn.in_transaction
        assert conn.execute("SELECT name FROM sqlite_master").fetchall() == []


def test_concurrent_initializers_publish_one_complete_base(tmp_path):
    path = tmp_path / "state.db"
    barrier = threading.Barrier(4)

    def initialize():
        with contextlib.closing(sqlite3.connect(path, timeout=30)) as conn:
            barrier.wait(timeout=30)
            created = initialize_database(conn, "state")
            assert database_is_current(conn, "state")
            return created

    with ThreadPoolExecutor(max_workers=4) as pool:
        results = list(pool.map(lambda _: initialize(), range(4)))
    assert results.count(True) == 1


def test_historical_store_is_refused_without_conversion_or_deletion(tmp_path):
    with contextlib.closing(sqlite3.connect(tmp_path / "state.db")) as conn:
        conn.execute("CREATE TABLE sessions(id TEXT PRIMARY KEY, source TEXT)")
        conn.execute("INSERT INTO sessions VALUES ('old','cli')")
        conn.commit()
        with pytest.raises(UnsupportedDatabaseSchema, match="historical state"):
            initialize_database(conn, "state")
        assert conn.execute("SELECT * FROM sessions").fetchall() == [("old", "cli")]
        assert conn.execute("SELECT name FROM sqlite_master WHERE name='schema_migrations'").fetchone() is None


def test_future_version_and_missing_constraints_are_not_silently_repaired(tmp_path):
    with contextlib.closing(sqlite3.connect(tmp_path / "store.db")) as conn:
        initialize_database(conn, "state")
        conn.execute("UPDATE schema_migrations SET version=? WHERE component='state'", (BASE_VERSION + 1,))
        conn.commit()
        with pytest.raises(UnsupportedDatabaseSchema, match="version"):
            initialize_database(conn, "state")
        assert conn.execute("SELECT version FROM schema_migrations").fetchone()[0] == BASE_VERSION + 1
        conn.execute("UPDATE schema_migrations SET version=?", (BASE_VERSION,))
        conn.execute("DROP INDEX idx_sessions_title_unique")
        conn.commit()
        with pytest.raises(UnsupportedDatabaseSchema, match="idx_sessions_title_unique"):
            initialize_database(conn, "state")
        assert conn.execute("SELECT name FROM sqlite_master WHERE name='idx_sessions_title_unique'").fetchone() is None
