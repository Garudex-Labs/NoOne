"""Display identity is cosmetic, profile-scoped, and preserves configuration."""

from types import SimpleNamespace

import pytest

from agent_cli.application_identity import DEFAULT_APP_NAME, app_text, get_app_name, normalize_app_name


@pytest.mark.parametrize("value", [None, "", "  ", 42, [], "bad\nname", "bad\x1bname", "x" * 129])
def test_invalid_names_fall_back(value):
    assert normalize_app_name(value) == DEFAULT_APP_NAME


def test_custom_name_and_explicit_placeholder():
    config = {"display": {"app_name": "  星 Atlas {count}  "}}
    assert get_app_name(config) == "星 Atlas {count}"
    assert app_text("Welcome to {app_name}; {count}", config) == "Welcome to 星 Atlas {count}; {count}"
    assert app_text("noone --help and Hermes-4", config) == "noone --help and Hermes-4"
    assert app_text("{app_name}", {"display": {"app_name": "A {app_name}"}}) == "A {app_name}"


def test_profile_config_is_read_without_rewriting_user_file(tmp_path, monkeypatch):
    from agent.runtime_scope import bind_profile_scope

    first, second = tmp_path / "first", tmp_path / "second"
    first.mkdir()
    second.mkdir()
    original = "model: old-model\ndisplay:\n  app_name: My Atlas\n"
    (first / "config.yaml").write_text(original)
    (second / "config.yaml").write_text("display:\n  app_name: My Nova\n")
    monkeypatch.setenv("HERMES_HOME", str(first))
    assert get_app_name() == "My Atlas"
    with bind_profile_scope(second, hydrate_secrets=False):
        assert get_app_name() == "My Nova"
    assert get_app_name() == "My Atlas"
    assert (first / "config.yaml").read_text() == original
    assert __import__("os").environ["HERMES_HOME"] == str(first)


def test_owning_home_and_reentrant_diagnostics(tmp_path, monkeypatch):
    from agent_cli import config_effective

    launch, owning = tmp_path / "launch", tmp_path / "owning"
    launch.mkdir()
    owning.mkdir()
    (launch / "config.yaml").write_text("display:\n  app_name: Launch Atlas\n")
    (owning / "config.yaml").write_text("display:\n  app_name: Owner Nova\n")
    monkeypatch.setenv("HERMES_HOME", str(launch))
    assert get_app_name(home=owning) == "Owner Nova"
    assert get_app_name() == "Launch Atlas"
    def read_with_diagnostic():
        assert app_text("diagnostic from {app_name}") == f"diagnostic from {DEFAULT_APP_NAME}"
        return {"display": {"app_name": "Recovered Atlas"}}
    monkeypatch.setattr(config_effective, "load_user_config_effective", read_with_diagnostic)
    assert get_app_name() == "Recovered Atlas"


def test_name_is_literal_in_rich_and_percent_formatting(caplog):
    import logging
    from rich.text import Text

    config = {"display": {"app_name": "Atlas [/oops] %s"}}
    label = app_text("{app_name}", config, markup=True)
    assert Text.from_markup(f"[bold]{label}[/]").plain == "Atlas [/oops] %s"
    logging.getLogger("identity-contract").warning(
        app_text("{app_name}: %s", config, percent_format=True), "ready"
    )
    assert caplog.messages[-1] == "Atlas [/oops] %s: ready"


def test_translations_and_skin_use_the_configured_identity(tmp_path, monkeypatch):
    from agent.i18n import t
    from agent_cli.skin_engine import get_active_skin, init_skin_from_config
    from gateway.session_config import _client_config

    monkeypatch.setenv("HERMES_HOME", str(tmp_path))
    cfg = {"display": {"app_name": "Atlas"}}
    (tmp_path / "config.yaml").write_text("display:\n  app_name: Atlas\n")
    init_skin_from_config(cfg)
    assert get_active_skin().get_branding("agent_name") == "Atlas"
    assert "Atlas" in get_active_skin().get_branding("welcome")
    assert _client_config(cfg)["display"]["app_name"] == "Atlas"
    # Exercise a real bundled catalog rather than rewriting arbitrary output.
    assert "Atlas" in t("gateway.status.header", lang="en")


def test_prompt_identity_is_resolved_when_constructed(tmp_path, monkeypatch):
    from agent.system_prompt import _identity_parts

    monkeypatch.setenv("HERMES_HOME", str(tmp_path))
    config_path = tmp_path / "config.yaml"
    config_path.write_text("display:\n  app_name: Atlas\n")
    agent = SimpleNamespace(load_soul_identity=False, skip_context_files=True)
    existing, _ = _identity_parts(agent, None)
    config_path.write_text("display:\n  app_name: My Supernova\n")
    new, _ = _identity_parts(agent, None)
    assert existing[0].startswith("You are Atlas.")
    assert new[0].startswith("You are My Supernova.")
    assert existing[0].startswith("You are Atlas.")
