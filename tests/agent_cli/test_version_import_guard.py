"""Old-updater version lookup distinguishes absent PM from a broken PM import."""

import sys

import pytest

import agent_cli


class _MissingPaths:
    def __init__(self, error):
        self.error = error

    def find_spec(self, fullname, path=None, target=None):
        if fullname == "pm.paths":
            raise self.error


def _fail_paths_import(monkeypatch, error):
    monkeypatch.delitem(sys.modules, "pm.paths", raising=False)
    monkeypatch.setattr(sys, "meta_path", [_MissingPaths(error), *sys.meta_path])


@pytest.mark.parametrize("missing", ["pm", "pm.paths"])
def test_version_uses_checkout_stamp_when_pm_is_absent(monkeypatch, tmp_path, missing):
    package = tmp_path / "agent_cli"
    package.mkdir()
    monkeypatch.setattr(agent_cli, "__file__", str(package / "__init__.py"))
    (tmp_path / "install-stamp.json").write_text('{"baseVersion": "1.2.3"}', encoding="utf-8")
    _fail_paths_import(monkeypatch, ModuleNotFoundError(name=missing))

    assert agent_cli.__getattr__("__version__") == "1.2.3"


@pytest.mark.parametrize("missing", ["pm.other", "pm.paths.dependency", "pm.paths_extra", "yaml", None])
def test_canonical_version_import_does_not_depend_on_pm(monkeypatch, missing):
    error = ModuleNotFoundError(name=missing)
    _fail_paths_import(monkeypatch, error)
    from agent_cli.version_info import project_version

    assert agent_cli.__getattr__("__version__") == project_version()
