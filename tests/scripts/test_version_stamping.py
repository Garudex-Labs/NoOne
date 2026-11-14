"""Version stamping changes local project records, never dependency versions."""
import json
from pathlib import Path
import tomllib

import pytest

from scripts.releases.stamping import stamp, validate_bootstrap_version


def _tree(root: Path) -> None:
    (root / "pyproject.toml").write_text('[project]\nname = "hermes-agent"\nversion = "0.0.0"\n')
    (root / "uv.lock").write_text(
        '[[package]]\nname = "hermes-agent"\nversion = "0.0.0"\nsource = { editable = "." }\n'
        '[[package]]\nname = "dependency"\nversion = "2.3.4"\nsource = { registry = "https://example.invalid" }\n'
    )
    desktop = root / "apps/desktop"
    desktop.mkdir(parents=True)
    (desktop / "package.json").write_text('{"version":"0.0.0"}\n')
    (desktop / "package-lock.json").write_text(json.dumps({
        "version": "0.0.0", "lockfileVersion": 3,
        "packages": {"": {"version": "0.0.0"}, "node_modules/dependency": {"version": "2.3.4"}},
    }))
    installer = root / "apps/bootstrap-installer/src-tauri"
    installer.mkdir(parents=True)
    (installer / "tauri.conf.json").write_text('{"version":"0.0.0"}\n')
    (installer / "Cargo.toml").write_text('[package]\nname = "agent-bootstrap"\nversion = "0.0.0"\n')
    (installer / "Cargo.lock").write_text(
        '[[package]]\nname = "agent-bootstrap"\nversion = "0.0.0"\n'
        '[[package]]\nname = "dependency"\nversion = "2.3.4"\nsource = "registry+https://example.invalid"\n'
    )
    (root / "nix").mkdir()
    (root / "nix/agent.nix").write_text('{\n  version ? "0.0.0",\n}: version\n')


def test_stamping_synchronizes_project_metadata_and_preserves_dependency_records(tmp_path):
    _tree(tmp_path)
    before_python = tomllib.loads((tmp_path / "uv.lock").read_text())["package"][1]
    before_cargo = tomllib.loads((tmp_path / "apps/bootstrap-installer/src-tauri/Cargo.lock").read_text())["package"][1]
    before_node = json.loads((tmp_path / "apps/desktop/package-lock.json").read_text())["packages"]["node_modules/dependency"]
    stamp(tmp_path, "0.1.0")
    assert tomllib.loads((tmp_path / "pyproject.toml").read_text())["project"]["version"] == "0.1.0"
    assert json.loads((tmp_path / "apps/desktop/package.json").read_text())["version"] == "0.1.0"
    python = tomllib.loads((tmp_path / "uv.lock").read_text())["package"]
    cargo = tomllib.loads((tmp_path / "apps/bootstrap-installer/src-tauri/Cargo.lock").read_text())["package"]
    node = json.loads((tmp_path / "apps/desktop/package-lock.json").read_text())
    assert python[0]["version"] == cargo[0]["version"] == node["version"] == "0.1.0"
    assert node["packages"][""]["version"] == "0.1.0"
    assert python[1] == before_python
    assert cargo[1] == before_cargo
    assert node["packages"]["node_modules/dependency"] == before_node
    validate_bootstrap_version(tmp_path, "0.1.0")
    (tmp_path / "apps/bootstrap-installer/src-tauri/tauri.conf.json").write_text('{"version":"0.0.0"}')
    with pytest.raises(ValueError, match="Tauri config"):
        validate_bootstrap_version(tmp_path, "0.1.0")


def test_build_identity_suffix_does_not_become_the_package_release_version(tmp_path):
    _tree(tmp_path)
    stamp(tmp_path, "0.1.0+canary.20261114T000000Z")
    assert tomllib.loads((tmp_path / "pyproject.toml").read_text())["project"]["version"] == "0.1.0"
    validate_bootstrap_version(tmp_path, "0.1.0")


def test_partial_source_tree_still_stamps_its_local_package_record(tmp_path):
    (tmp_path / "pyproject.toml").write_text('[project]\nname="hermes-agent"\nversion="0.0.0"\n')
    assert stamp(tmp_path, "0.1.0") == [tmp_path / "pyproject.toml"]
    assert tomllib.loads((tmp_path / "pyproject.toml").read_text())["project"]["version"] == "0.1.0"
