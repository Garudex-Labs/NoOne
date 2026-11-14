"""Foreground maintenance resumes current-layout backfills without historical demotion."""
import pytest

from agent_state import SessionDB


@pytest.fixture
def rebuilding_db(tmp_path, monkeypatch):
    with SessionDB(tmp_path / "state.db") as db:
        if not db._fts_enabled:
            pytest.skip("FTS5 unavailable")
        db.create_session("s", source="cli")
        for index in range(20):
            db.append_message("s", "user", f"needle message {index}")
        db._execute_write(lambda conn: db._seed_fts_rebuild_markers(conn, force=True))
        monkeypatch.setattr(db, "_FTS_REBUILD_CHUNK_ROWS", 2)
        db._fts_chunk_rows = 2
        yield db


def test_progress_counts_rows_and_rebuild_restores_search(rebuilding_db):
    events = []
    result = rebuilding_db.optimize_fts_storage(progress_cb=events.append, vacuum=False)
    assert result["ok"]
    backfill = [event for event in events if event["phase"] == "backfill"]
    assert all(0 <= event["indexed"] <= event["total"] for event in backfill)
    assert backfill[-1]["indexed"] > 0
    assert rebuilding_db.get_meta("fts_rebuild_high_water") is None
    assert rebuilding_db.search_messages("needle")


def test_interrupted_progress_callback_preserves_a_resumable_checkpoint(rebuilding_db):
    def interrupt(event):
        if event["phase"] == "backfill" and event["indexed"] > 0:
            raise RuntimeError("interrupted foreground")

    with pytest.raises(RuntimeError, match="interrupted foreground"):
        rebuilding_db.optimize_fts_storage(progress_cb=interrupt, vacuum=False)
    assert rebuilding_db.get_meta("fts_rebuild_high_water") is not None
    assert rebuilding_db.optimize_fts_storage(vacuum=False)["ok"]
    assert rebuilding_db.search_messages("needle")


def test_new_message_during_backfill_remains_indexed(rebuilding_db):
    inserted = False

    def write_during_progress(event):
        nonlocal inserted
        if event["phase"] == "backfill" and not inserted:
            rebuilding_db.append_message("s", "user", "concurrent unique sentinel")
            inserted = True

    assert rebuilding_db.optimize_fts_storage(progress_cb=write_during_progress, vacuum=False)["ok"]
    assert rebuilding_db.search_messages("sentinel")
