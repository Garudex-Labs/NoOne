"""An owning-install handoff remains interactive, but cannot hang indefinitely."""

import subprocess

import pytest

from agent_cli import update_owning_install


def test_owning_updater_deadline_is_reported_with_a_nonzero_exit(tmp_path, monkeypatch, capsys):
    calls = []
    monkeypatch.setattr(update_owning_install, "owning_install_root", lambda root: tmp_path)

    def timed_out(argv, **kwargs):
        calls.append(kwargs)
        raise subprocess.TimeoutExpired(argv, kwargs["timeout"])

    monkeypatch.setattr(update_owning_install.subprocess, "call", timed_out)
    with pytest.raises(SystemExit) as exc:
        update_owning_install.retarget_to_owning_install(tmp_path)
    assert exc.value.code == 1
    assert calls[0]["timeout"] == 3600
    assert "deadline" in capsys.readouterr().err
