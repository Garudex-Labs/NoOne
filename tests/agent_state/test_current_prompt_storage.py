"""Every current prompt operation uses the content-addressed base relation."""

from agent_state import SessionDB
from agent_state_worker_context import worker_prompt


def test_worker_prompt_update_and_profile_refresh_use_hash_storage(tmp_path):
    with SessionDB(tmp_path / "state.db") as db:
        db.create_session("with-prompt", source="cli", system_prompt="initial")
        db.create_session("without-prompt", source="cli")
        assert db.count_sessions_with_stored_prompt() == 1
        db._execute_write(lambda conn: worker_prompt(db, conn, "with-prompt", {"system_prompt": "updated"}))
        assert db.get_session("with-prompt")["system_prompt"] == "updated"
        assert db.count_sessions_with_stored_prompt() == 1
        epoch = db.request_prompt_refresh()
        assert db.prompt_refresh_epoch("with-prompt") == epoch
        assert db.prompt_refresh_epoch("without-prompt") == epoch
        db._execute_write(lambda conn: worker_prompt(db, conn, "with-prompt", {"system_prompt": None}))
        assert db.get_session("with-prompt")["system_prompt"] is None
        assert db.count_sessions_with_stored_prompt() == 0
        assert db._conn.execute("SELECT COUNT(*) FROM system_prompts").fetchone()[0] == 0
