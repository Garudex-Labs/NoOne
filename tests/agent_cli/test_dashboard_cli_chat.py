"""Dashboard chat uses the existing CLI while preserving viewer state and event isolation."""
import asyncio
import json
from types import SimpleNamespace

import pytest


def test_dashboard_launcher_uses_cli_and_preserves_resume(monkeypatch, tmp_path):
    from agent_cli import web_server_chat as chat
    from agent_cli import web_server
    from agent_cli import web_server_sessions as sessions
    monkeypatch.setattr(sessions, '_open_session_db_for_profile', lambda *a, **k: SimpleNamespace(close=lambda: None))
    monkeypatch.setattr(sessions, '_session_latest_descendant', lambda *a: ('latest-session', None))
    monkeypatch.setattr(web_server.app.state, 'bound_host', '127.0.0.1', raising=False)
    monkeypatch.setattr(web_server.app.state, 'bound_port', 9119, raising=False)
    argv, cwd, env = chat._resolve_chat_argv(
        resume='old-session', workspace_cwd=str(tmp_path),
        active_session_file=str(tmp_path / 'active.json'), sidecar_url='ws://127.0.0.1/events')
    assert argv[-2:] == ['--resume', 'latest-session']
    assert argv[1:4] == ['-m', 'agent_cli.main', '--cli']
    assert cwd == str(tmp_path) and env['HERMES_CWD'] == str(tmp_path)
    assert env['HERMES_TUI_ACTIVE_SESSION_FILE'] == str(tmp_path / 'active.json')
    assert env['HERMES_TUI_SIDECAR_URL'] == 'ws://127.0.0.1/events'
    assert 'HERMES_TUI_GATEWAY_URL' not in env


def test_cli_session_adoption_updates_dashboard_marker(monkeypatch, tmp_path):
    from agent_cli.cli_session_mixin import CLISessionMixin
    path = tmp_path / 'active.json'
    monkeypatch.setenv('HERMES_TUI_ACTIVE_SESSION_FILE', str(path))
    cli = SimpleNamespace(session_id='first')
    CLISessionMixin._write_terminal_breadcrumb(cli)
    cli.session_id = 'continued'
    CLISessionMixin._write_terminal_breadcrumb(cli)
    assert json.loads(path.read_text()) == {'session_id': 'continued'}


def test_chat_credentials_and_marker_never_reach_model_children(monkeypatch):
    from tools.environments.local import agent_subprocess_env
    monkeypatch.setenv('HERMES_TUI_SIDECAR_URL', 'ws://example.test/api/pub?token=private')
    monkeypatch.setenv('HERMES_TUI_ACTIVE_SESSION_FILE', '/private/viewer.json')
    for credentials in (False, True):
        env = agent_subprocess_env(inherit_credentials=credentials)
        assert 'HERMES_TUI_SIDECAR_URL' not in env
        assert 'HERMES_TUI_ACTIVE_SESSION_FILE' not in env


@pytest.mark.asyncio
async def test_cli_forwards_event_frame_without_consuming_it(monkeypatch):
    from agent_cli.gateway_connection import GatewayConnection
    publisher = SimpleNamespace(frames=[], close=lambda: None)
    publisher.write = publisher.frames.append
    monkeypatch.delenv('HERMES_TUI_SIDECAR_URL', raising=False)
    connection = GatewayConnection()
    connection._event_publisher = publisher
    client = SimpleNamespace(events=asyncio.Queue())
    frame = {'jsonrpc': '2.0', 'method': 'event', 'params': {
        'type': 'tool.start', 'session_id': 's', 'payload': {'tool': 'terminal'}}}
    await client.events.put(frame)
    await client.events.put(RuntimeError('end'))
    await connection._pump(client)
    assert publisher.frames == [frame]
    assert connection.events.get_nowait() == frame


def test_explicit_default_profile_cannot_follow_saved_active_profile(monkeypatch, tmp_path):
    import contextlib
    import os
    from agent_cli import main, web_server_chat as chat, web_server_profiles as profiles
    root = tmp_path / 'home'
    root.mkdir()
    (root / 'config.yaml').write_text('{}\n')
    (root / 'active_profile').write_text('work')
    (root / 'profiles' / 'work').mkdir(parents=True)
    (root / 'profiles' / 'work' / 'config.yaml').write_text('{}\n')
    monkeypatch.setenv('HERMES_HOME', str(root))
    monkeypatch.setattr(profiles, '_resolve_profile_dir', lambda name: root)
    monkeypatch.setattr(profiles, '_config_profile_scope', lambda name: contextlib.nullcontext())
    argv, _cwd, env = chat._resolve_chat_argv(profile='default')
    assert argv[-2:] == ['--profile', 'default']
    assert env['HERMES_GATEWAY_PROFILE_PIN'] == '1'
    monkeypatch.setattr(main.sys, 'argv', argv[3:])
    monkeypatch.setenv('HERMES_HOME', env['HERMES_HOME'])
    monkeypatch.setenv('HERMES_GATEWAY_PROFILE_PIN', env['HERMES_GATEWAY_PROFILE_PIN'])
    main._apply_profile_override()
    assert os.environ['HERMES_HOME'] == str(root)


def test_current_profile_child_keeps_the_dashboard_home(monkeypatch, tmp_path):
    import os
    from agent_cli import main, web_server_chat as chat
    root = tmp_path / 'home'
    root.mkdir()
    (root / 'config.yaml').write_text('{}\n')
    (root / 'active_profile').write_text('work')
    (root / 'profiles' / 'work').mkdir(parents=True)
    monkeypatch.setenv('HERMES_HOME', str(root))
    argv, _cwd, env = chat._resolve_chat_argv(profile='current')
    assert env['HERMES_GATEWAY_PROFILE_PIN'] == '1'
    monkeypatch.setattr(main.sys, 'argv', argv[3:])
    monkeypatch.setenv('HERMES_HOME', env['HERMES_HOME'])
    monkeypatch.setenv('HERMES_GATEWAY_PROFILE_PIN', env['HERMES_GATEWAY_PROFILE_PIN'])
    main._apply_profile_override()
    assert os.environ['HERMES_HOME'] == str(root)


def test_real_cli_entry_point_does_not_consult_removed_interface(tmp_path):
    import os
    import subprocess
    import sys
    env = {**os.environ, 'HERMES_HOME': str(tmp_path), 'HERMES_GATEWAY_PROFILE_PIN': '1'}
    for args in (['--help'], ['dashboard', '--help']):
        result = subprocess.run([sys.executable, '-m', 'agent_cli.main', *args], env=env,
                                capture_output=True, text=True, timeout=45, check=False)
        assert result.returncode == 0, result.stderr
        assert 'usage:' in result.stdout.lower()


def test_nonchat_dispatch_does_not_use_removed_launcher(monkeypatch):
    from agent_cli import main, config
    monkeypatch.setattr(main.sys, 'argv', ['noone', 'dashboard', '--no-open'])
    monkeypatch.setattr(config, 'get_container_exec_info', lambda: None)
    assert main._try_fast_chat_launch() is False


def test_nonchat_dispatch_under_portable_light_parser_gate(monkeypatch):
    from agent_cli import main
    # Exercise routing only: no host APIs or interpreter platform are replaced.
    monkeypatch.setattr(main, '_is_termux_startup_environment', lambda: True)
    monkeypatch.setattr(main.sys, 'argv', ['noone', 'dashboard', '--no-open'])
    assert main._try_termux_fast_cli_launch() is False
