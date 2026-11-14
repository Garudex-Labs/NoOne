"""Only code honoring NoOne migration metadata may replace an initialized runtime."""
import subprocess
from unittest.mock import Mock

import pytest

from agent_cli import database_migrations, update_downgrade_guard as guard
from agent_state import SessionDB


def git(root, *args):
    return subprocess.run(["git", *args], cwd=root, check=True, capture_output=True, text=True).stdout.strip()


@pytest.fixture
def repo(tmp_path):
    root = tmp_path / "checkout"
    root.mkdir()
    git(root, "init", "-b", "main")
    git(root, "config", "user.email", "fixture@example.invalid")
    git(root, "config", "user.name", "Fixture")
    directory = root / "agent_cli"
    directory.mkdir()
    source = directory / "database_migrations.py"
    source.write_text("# no migration authority\n")
    git(root, "add", ".")
    git(root, "commit", "-m", "pre-foundation")
    git(root, "tag", "old-release")
    source.write_text(database_migrations._VERSION_DDL)
    git(root, "commit", "-am", "database foundation")
    return root


def _ledgered_store(home):
    home.mkdir(parents=True, exist_ok=True)
    with SessionDB(home / "state.db") as db:
        db.create_session("s", source="cli")


def test_empty_initialized_store_is_protected_before_first_admission(repo, tmp_path, monkeypatch):
    home = tmp_path / "profile"
    home.mkdir()
    SessionDB(home / "state.db").close()
    monkeypatch.setattr("agent_cli.backup._sibling_profile_homes", lambda home: [])
    refusal = guard.downgrade_refusal(["git"], repo, "old-release", home=home)
    assert refusal is not None and "database foundation" in refusal
    assert str(home / "state.db") in refusal
    assert guard.downgrade_refusal(["git"], repo, "HEAD", home=home) is None


def test_uninitialized_home_does_not_need_a_schema_guard(repo, tmp_path, monkeypatch):
    home = tmp_path / "empty"
    home.mkdir()
    monkeypatch.setattr("agent_cli.backup._sibling_profile_homes", lambda home: [])
    assert guard.downgrade_refusal(["git"], repo, "old-release", home=home) is None


def test_sibling_current_store_is_protected(repo, tmp_path, monkeypatch):
    home, sibling = tmp_path / "empty", tmp_path / "sibling"
    home.mkdir()
    sibling.mkdir()
    SessionDB(sibling / "state.db").close()
    monkeypatch.setattr("agent_cli.backup._sibling_profile_homes", lambda home: [("sibling", sibling)])
    assert str(sibling / "state.db") in guard.downgrade_refusal(["git"], repo, "old-release", home=home)


def test_guard_recognizes_the_migration_authority_not_an_old_ledger_declaration():
    assert guard.defines_runtime([database_migrations._VERSION_DDL])
    assert not guard.defines_runtime(["CREATE TABLE IF NOT EXISTS session_admissions(seq INTEGER)"])


@pytest.mark.parametrize("remote_result", [True, False, None])
def test_missing_local_source_uses_the_readonly_remote_answer(tmp_path, remote_result):
    probe = Mock(side_effect=[1, 1])
    assert guard.target_predates_runtime(None, tmp_path, "target", git=probe,
        remote=lambda ref: remote_result) is (remote_result is True)
