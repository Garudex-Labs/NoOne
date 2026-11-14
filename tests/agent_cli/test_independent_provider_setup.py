"""Provider setup uses independent credentials and never revives retired managed routes."""
import json
from types import SimpleNamespace

import pytest


@pytest.mark.parametrize("provider", ["nous", "nous-portal", "nousresearch"])
def test_removed_provider_cannot_be_resolved(provider):
    from agent_cli.auth import AuthError, resolve_provider

    with pytest.raises(AuthError) as error:
        resolve_provider(provider)
    assert error.value.code == "invalid_provider"


def test_retired_pin_never_falls_back_to_an_external_key(tmp_path, monkeypatch):
    from agent_cli.auth import AuthError, resolve_provider

    monkeypatch.setenv("HERMES_HOME", str(tmp_path))
    monkeypatch.setenv("OPENROUTER_API_KEY", "sk-or-independent-key")
    (tmp_path / "config.yaml").write_text(json.dumps({
        "model": {"provider": "nous", "default": "retired-model"},
    }))
    with pytest.raises(AuthError) as error:
        resolve_provider("auto")
    assert error.value.code == "invalid_provider"
    assert not (tmp_path / "auth.json").exists()


def test_keyless_self_hosted_provider_resolves_without_an_account(tmp_path, monkeypatch):
    from agent_cli.runtime_provider import resolve_runtime_provider

    monkeypatch.setenv("HERMES_HOME", str(tmp_path))
    (tmp_path / "config.yaml").write_text(json.dumps({
        "model": {
            "provider": "custom", "default": "local-model",
            "base_url": "http://127.0.0.1:18991/v1",
        },
    }))
    runtime = resolve_runtime_provider()
    assert runtime["provider"] == "custom"
    assert runtime["base_url"] == "http://127.0.0.1:18991/v1"
    assert runtime["api_key"] == "no-key-required"
    assert not (tmp_path / "auth.json").exists()


@pytest.mark.parametrize("section", ["web", "browser", "tts", "stt", "image_gen", "video_gen"])
def test_retired_tool_routing_cannot_adopt_independent_credentials(tmp_path, monkeypatch, section):
    from tools.tool_backend_helpers import read_selection

    monkeypatch.setenv("HERMES_HOME", str(tmp_path))
    monkeypatch.setenv("OPENAI_API_KEY", "independent-audio-key")
    (tmp_path / "config.yaml").write_text(json.dumps({section: {"use_gateway": True}}))
    with pytest.raises(ValueError, match="Managed tool routing is no longer supported"):
        read_selection(section)


def test_direct_tool_selection_is_preserved(tmp_path, monkeypatch):
    from tools.tool_backend_helpers import read_selection

    monkeypatch.setenv("HERMES_HOME", str(tmp_path))
    (tmp_path / "config.yaml").write_text(json.dumps({"stt": {"provider": "local"}}))
    assert read_selection("stt") == "local"


def test_inventory_recognizes_independent_host_iam_credentials(tmp_path, monkeypatch):
    from agent import bedrock_adapter
    from agent_cli import main, setup_inventory

    monkeypatch.setenv("HERMES_HOME", str(tmp_path))
    monkeypatch.setattr(main, "_has_any_provider_configured", lambda **kwargs: False)
    monkeypatch.setattr(bedrock_adapter, "has_aws_credentials", lambda **kwargs: True)
    assert setup_inventory.provider_configured()
    record = setup_inventory.refresh_record(announce=False)
    assert record.provider_configured
    assert record.inference_provider == "bedrock"
    assert not setup_inventory.provider_configured(strict_profile_scope=True)


def test_independent_rate_limit_can_be_classified():
    from agent.error_classifier import classify_api_error

    error = RuntimeError("Rate limit exceeded")
    error.status_code = 429
    error.body = {"error": {"message": "Rate limit exceeded"}}
    result = classify_api_error(error, provider="openrouter", model="fixture-model")
    assert result.status_code == 429
    assert result.retryable


def test_alias_fallback_checks_the_independent_provider(monkeypatch):
    from agent_cli import model_switch

    checked = []
    def resolve(name, provider, *args):
        checked.append(provider)
    monkeypatch.setattr(model_switch, "resolve_alias", resolve)
    assert model_switch._resolve_alias_fallback("fixture-alias") is None
    assert checked == ["openrouter"]


def test_inline_local_mcp_dispatch_preserves_its_session(monkeypatch):
    from agent import inline_tool_executors
    from tools.connectors import tool

    calls = []
    def run(names, action, **kwargs):
        calls.append((names, action, kwargs))
        return json.dumps({"success": True, "targets": []})
    monkeypatch.setattr(tool, "run_mcp_operation", run)
    agent = SimpleNamespace(session_id="local-session", connection_callback=None)
    context = SimpleNamespace(tool_call_id="local-call")
    inline_tool_executors._manage_connections(agent, {
        "action": "enable", "connectors": [{"name": "local-server", "mcp": True}],
    }, context)
    assert calls[0][0:2] == (["local-server"], "enable")
    assert calls[0][2]["session_id"] == "local-session"
    assert calls[0][2]["tool_call_id"] == "local-call"


def test_independent_catalog_keeps_the_desktop_card_capability(monkeypatch):
    from agent import inline_tool_executors
    from tools.connectors import catalog_tool

    calls = []
    def manage(args, **kwargs):
        calls.append(kwargs)
        return json.dumps({"success": True})
    monkeypatch.setattr(catalog_tool, "manage_catalog", manage)
    agent = SimpleNamespace(session_id="local-session", platform="desktop", connection_callback=None)
    context = SimpleNamespace(tool_call_id="local-call")
    inline_tool_executors._manage_catalog(agent, {"action": "search"}, context)
    assert calls[0]["card_surface"] is True


def test_retired_modal_mode_rejects_before_selecting_an_independent_account(monkeypatch):
    from tools import terminal_tool

    monkeypatch.setenv("TERMINAL_ENV", "modal")
    monkeypatch.setenv("TERMINAL_MODAL_MODE", "managed")
    monkeypatch.setenv("MODAL_TOKEN_ID", "independent-account")
    monkeypatch.setenv("MODAL_TOKEN_SECRET", "independent-secret")
    with pytest.raises(ValueError, match="Managed execution is no longer supported"):
        terminal_tool._get_env_config()
