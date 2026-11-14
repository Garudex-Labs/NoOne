"""Canonical fork targeting and legacy imports must retain real runtime behavior."""

import pytest

from agent_cli.source_releases import OFFICIAL_REPOSITORY
from agent_cli.update_cmd_git import _is_fork


@pytest.mark.parametrize("url", [
    "https://github.com/Garudex-Labs/NoOne",
    "https://github.com/garudex-labs/noone.git/",
    "git@github.com:Garudex-Labs/NoOne.git",
])
def test_canonical_origins_are_not_forks(url):
    assert OFFICIAL_REPOSITORY == "Garudex-Labs/NoOne"
    assert not _is_fork(url)
    assert _is_fork("https://github.com/someone/another-agent.git")


def test_legacy_constants_share_profile_state(tmp_path, monkeypatch):
    import agent_constants
    import hermes_constants

    monkeypatch.setenv("HERMES_HOME", str(tmp_path))
    assert hermes_constants is agent_constants
    assert hermes_constants.get_hermes_home is agent_constants.get_agent_home
    assert agent_constants.get_agent_home() == tmp_path


def test_primary_help_uses_new_command_and_dynamic_display_name():
    from agent_cli._parser import build_top_level_parser

    parser, _, _ = build_top_level_parser()
    assert parser.prog == "noone"
    assert "AI assistant" in parser.format_help()
