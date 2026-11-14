from __future__ import annotations

import contextlib
import sqlite3
from pathlib import Path

from agent_cli import kanban_db as kb
from agent_cli import kanban_db_connect as kbc


















def _default_board_db(tmp_path, monkeypatch) -> Path:
    """Point the kanban root at a temp home and return the default board's DB
    (the back-compat top-level ``<root>/kanban.db`` #83445 reports on)."""
    home = tmp_path / ".hermes"
    home.mkdir()
    monkeypatch.setenv("HERMES_HOME", str(home))
    monkeypatch.setattr(Path, "home", lambda: tmp_path)
    db_path = kb.kanban_db_path(board="default")
    db_path.parent.mkdir(parents=True, exist_ok=True)
    kb._INITIALIZED_PATHS.discard(str(db_path.resolve()))
    return db_path


def _tables(path: Path) -> set[str]:
    conn = sqlite3.connect(str(path))
    try:
        return {r[0] for r in conn.execute("SELECT name FROM sqlite_master WHERE type='table'")}
    finally:
        conn.close()


def test_connect_reinitializes_schema_when_db_file_vanished(tmp_path, monkeypatch):
    """#83445: the schema cache is process-local, but the schema is on disk.

    A long-lived process (gateway, dispatcher, dashboard API) that already
    initialized a path keeps taking the ``_INITIALIZED_PATHS`` fast path after
    the file is deleted underneath it. SQLite recreates an empty DB on the next
    open, so every query then fails with ``no such table: tasks`` and the board
    renders empty until that process itself is restarted.
    """
    db_path = _default_board_db(tmp_path, monkeypatch)

    with kbc.connect_closing(db_path) as conn:
        conn.execute(
            "INSERT INTO tasks (id, title, status, created_at) VALUES ('t-1', 'T', 'ready', 1000)"
        )
        conn.commit()
    assert str(db_path.resolve()) in kb._INITIALIZED_PATHS

    # External deletion (manual cleanup, restore, sync tool) while the process
    # that cached this path is still alive.
    for suffix in ("", "-wal", "-shm"):
        db_path.with_name(db_path.name + suffix).unlink(missing_ok=True)

    with kbc.connect_closing(db_path) as conn:
        assert conn.execute("SELECT COUNT(*) FROM tasks").fetchone()[0] == 0
    assert "tasks" in _tables(db_path)


def test_connect_reinitializes_schema_when_db_replaced_by_empty_file(tmp_path, monkeypatch):
    """Same defect, restore shape: the file still exists and passes both the
    header and the integrity probes, but carries no schema at all."""
    db_path = _default_board_db(tmp_path, monkeypatch)

    with kbc.connect_closing(db_path):
        pass

    for suffix in ("", "-wal", "-shm"):
        db_path.with_name(db_path.name + suffix).unlink(missing_ok=True)
    sqlite3.connect(str(db_path)).close()
    assert "tasks" not in _tables(db_path)

    with kbc.connect_closing(db_path) as conn:
        conn.execute(
            "INSERT INTO tasks (id, title, status, created_at) VALUES ('t-2', 'T', 'ready', 1000)"
        )
        conn.commit()
    assert "tasks" in _tables(db_path)


def test_healthy_fast_path_stays_lock_free(tmp_path, monkeypatch):
    """The self-heal must cost nothing in steady state: an intact cached path
    still skips the cross-process init lock (#36644), and only pays for it when
    the schema is actually gone."""
    db_path = _default_board_db(tmp_path, monkeypatch)

    with kbc.connect_closing(db_path):
        pass

    locks: list[Path] = []
    real_lock = kbc._cross_process_init_lock

    @contextlib.contextmanager
    def recording_lock(path):
        locks.append(path)
        with real_lock(path):
            yield

    monkeypatch.setattr(kbc, "_cross_process_init_lock", recording_lock)

    with kbc.connect_closing(db_path):
        pass
    assert locks == []

    db_path.unlink()
    with kbc.connect_closing(db_path):
        pass
    assert len(locks) == 1
