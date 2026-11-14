"""Real SQLite schema reconciliation and storage-failure controls."""
import sqlite3

import pytest

from agent_state import SessionDB
from agent_state_common import SCHEMA_VERSION
import agent_state_runtime as rt


def test_schema_drift_is_refused_without_losing_history(tmp_path):
    from agent_cli.database_migrations import UnsupportedDatabaseSchema
    path = tmp_path / 'state.db'
    with SessionDB(path) as db:
        db.create_session('existing', source='test')
        db.append_message('existing', role='user', content='retained')
    with sqlite3.connect(path) as conn:
        conn.execute('ALTER TABLE sessions DROP COLUMN runtime_generation')
    with pytest.raises(UnsupportedDatabaseSchema, match='sessions differs'):
        SessionDB(path)
    with sqlite3.connect(path) as conn:
        assert conn.execute('SELECT content FROM messages').fetchone()[0] == 'retained'


def test_real_sqlite_full_aborts_admission_and_epoch_failure_is_atomic(tmp_path):
    db = SessionDB(db_path=tmp_path / 'state.db')
    try:
        db.create_session('s', source='test')
        epoch = rt.begin_runtime_epoch(db, instance_id='boot')
        db._conn.execute("CREATE TRIGGER refuse_epoch BEFORE UPDATE ON runtime_epoch BEGIN SELECT RAISE(ABORT, 'epoch fixture'); END")
        with pytest.raises(sqlite3.IntegrityError, match='epoch fixture'):
            rt.begin_runtime_epoch(db, instance_id='refused')
        assert tuple(db._conn.execute('SELECT epoch,instance_id FROM runtime_epoch').fetchone()) == (epoch, 'boot')
        db._conn.execute('DROP TRIGGER refuse_epoch')
        pages = db._conn.execute('PRAGMA page_count').fetchone()[0]
        db._conn.execute(f'PRAGMA max_page_count={pages}')
        args = dict(epoch=epoch, principal_id='human', session_id='s', request_id='full', payload={'text': 'x' * (2 * 1024 * 1024)})
        with pytest.raises(sqlite3.OperationalError) as exc:
            rt.admit_session_input(db, **args)
        assert exc.value.sqlite_errorcode == sqlite3.SQLITE_FULL
        assert rt.list_session_admissions(db, session_id='s') == []
        db._conn.execute('PRAGMA max_page_count=2147483646')
        assert rt.admit_session_input(db, **args)['status'] == 'queued'
    finally:
        db.close()
