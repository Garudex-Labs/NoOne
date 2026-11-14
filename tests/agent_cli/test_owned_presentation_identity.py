"""Owned CLI copy resolves identity at rendering, never at import time."""

import io
from types import SimpleNamespace

import pytest
from rich.console import Console


@pytest.mark.parametrize("width", [24, 100])
def test_compact_banner_uses_owning_identity_and_preserves_literal_markup(tmp_path, monkeypatch, width):
    from agent_cli import cli_render, skin_engine
    from agent.runtime_scope import bind_profile_scope

    monkeypatch.setattr(cli_render.shutil, "get_terminal_size", lambda: SimpleNamespace(columns=width))
    monkeypatch.setattr(cli_render, "format_banner_version_label", lambda: "version canary")
    monkeypatch.setattr(skin_engine, "get_active_skin", lambda: None)
    for index, name in enumerate(["星 [red]", "Nova"]):
        home = tmp_path / str(index)
        home.mkdir()
        (home / "config.yaml").write_text(f"display:\n  app_name: '{name}'\n")
        with bind_profile_scope(home, hydrate_secrets=False):
            text = cli_render._build_compact_banner()
        output = io.StringIO()
        Console(file=output, color_system=None, width=width).print(text)
        assert name in output.getvalue()


def test_setup_copy_tracks_profile_without_mutating_configs(tmp_path, capsys):
    from agent_cli import setup
    from agent.runtime_scope import bind_profile_scope

    for index, name in enumerate(["My Atlas", "星 Nova"]):
        home = tmp_path / str(index)
        home.mkdir()
        original = f"display:\n  app_name: '{name}'\n"
        (home / "config.yaml").write_text(original)
        with bind_profile_scope(home, hydrate_secrets=False):
            setup.print_noninteractive_setup_guidance()
        assert name in capsys.readouterr().out
        assert (home / "config.yaml").read_text() == original


@pytest.mark.platforms("macos")
def test_desktop_executable_lookup_ignores_cosmetic_identity(tmp_path):
    from agent.runtime_scope import bind_profile_scope
    from agent_cli.main_desktop import _desktop_packaged_executable_in

    home = tmp_path / "profile"
    home.mkdir()
    (home / "config.yaml").write_text("display:\n  app_name: '星 [red]'\n")
    release = tmp_path / "release"
    executable = release / "mac-arm64" / "Hermes.app" / "Contents" / "MacOS" / "Hermes"
    executable.parent.mkdir(parents=True)
    executable.write_bytes(b"native artifact identity canary")
    with bind_profile_scope(home, hydrate_secrets=False):
        assert _desktop_packaged_executable_in(release) == executable
