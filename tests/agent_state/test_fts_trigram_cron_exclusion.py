"""Cron-source exclusion from the external-content trigram FTS index."""

from __future__ import annotations

import sqlite3

import pytest

from agent_state import SessionDB
from agent_state_common import FTS_TRIGRAM_SQL, SCHEMA_VERSION

# The trigram cron-exclusion rebuild is the v30 data migration: a store one version behind IT, not one
# behind the current SCHEMA_VERSION (later migrations do not re-run it).
_PRE_TRIGRAM_EXCLUSION_VERSION = 29


@pytest.fixture
def db(tmp_path):
    session_db = SessionDB(db_path=tmp_path / "state.db")
    if not session_db._trigram_available:
        session_db.close()
        pytest.skip("trigram tokenizer unavailable in this SQLite build")
    yield session_db
    session_db.close()


def _trigram_rowids(db: SessionDB) -> set[int]:
    return {
        row[0]
        for row in db._conn.execute(
            "SELECT id FROM messages_fts_trigram_docsize ORDER BY id"
        ).fetchall()
    }


def _install_pre_v27_trigram(db: SessionDB, *, with_tool_calls: bool = False) -> None:
    """Recreate the pre-cron-exclusion external-content trigram boundary.

    ``with_tool_calls=True`` reproduces the FTS_STORAGE_VERSION 1 vtable
    (``tool_calls`` projected) that installs upgraded before #88217 carry;
    the default is the v2 column set with only the view/trigger predicates
    behind, which is what the in-place v29 migration handles.
    """
    cols = "content, tool_name" + (", tool_calls" if with_tool_calls else "")
    vals = "new.content, new.tool_name" + (", new.tool_calls" if with_tool_calls else "")
    db._conn.executescript(
        f"""
        DROP TRIGGER messages_fts_trigram_insert;
        DROP TRIGGER messages_fts_trigram_delete;
        DROP TRIGGER messages_fts_trigram_update;
        DROP TABLE messages_fts_trigram;
        DROP VIEW messages_fts_trigram_src;
        CREATE VIEW messages_fts_trigram_src AS
            SELECT id, role, content, tool_name, tool_calls
            FROM messages WHERE role <> 'tool';
        CREATE VIRTUAL TABLE messages_fts_trigram USING fts5(
            {cols},
            content='messages_fts_trigram_src',
            content_rowid='id',
            tokenize='trigram'
        );
        CREATE TRIGGER messages_fts_trigram_insert AFTER INSERT ON messages
        WHEN new.role <> 'tool'
        BEGIN
            INSERT INTO messages_fts_trigram(rowid, {cols})
            VALUES (new.id, {vals});
        END;
        """
    )


def test_fresh_trigram_indexes_conversations_but_not_cron(db: SessionDB):
    db.create_session("cli", source="cli")
    db.create_session("cron", source="cron")
    cli_id = db.append_message("cli", role="user", content="交付状态正常")
    cron_id = db.append_message("cron", role="user", content="定时任务状态正常")

    assert _trigram_rowids(db) == {cli_id}
    assert cron_id not in _trigram_rowids(db)
    assert db._conn.execute(
        "SELECT id FROM messages_fts_docsize WHERE id = ?", (cron_id,)
    ).fetchone() is not None


def test_cron_remains_searchable_via_standard_fts_and_explicit_cjk_fallback(
    db: SessionDB,
):
    db.create_session("cron", source="cron")
    db.append_message(
        "cron", role="assistant", content="quarterly archive 大别山项目 complete"
    )

    assert [row["session_id"] for row in db.search_messages("quarterly")] == [
        "cron"
    ]
    assert [
        row["session_id"]
        for row in db.search_messages("大别山项目", source_filter=["cron"])
    ] == ["cron"]


def test_deferred_rebuild_does_not_reintroduce_cron(db: SessionDB):
    db.create_session("cli", source="cli")
    db.create_session("cron", source="cron")
    cli_id = db.append_message("cli", role="assistant", content="交互会话内容")
    db.append_message("cron", role="assistant", content="定时会话内容")

    with db._lock:
        db._reset_fts_index_to_empty(db._conn)
        db._seed_fts_rebuild_markers(db._conn, force=True)
        db._conn.commit()
    while db.fts_rebuild_step():
        pass

    assert _trigram_rowids(db) == {cli_id}










def test_delete_of_unindexed_cron_row_keeps_trigram_consistent(db: SessionDB):
    db.create_session("cron", source="cron")
    cron_id = db.append_message("cron", role="user", content="不会进入索引")
    assert cron_id not in _trigram_rowids(db)

    db._conn.execute("DELETE FROM messages WHERE id = ?", (cron_id,))
    db._conn.execute(
        "INSERT INTO messages_fts_trigram(messages_fts_trigram) VALUES('integrity-check')"
    )
