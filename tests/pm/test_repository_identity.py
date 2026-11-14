"""Legacy plugin declarations must bind core extras to the canonical checkout."""

import tomllib

from pm.plugin_declarations import read_python_declaration
from pm.workspace import _workspace_member, core_requirement_error


def test_generated_buildable_member_normalizes_legacy_core_extra(tmp_path):
    plugin = tmp_path / "plugin"
    plugin.mkdir()
    (plugin / "pyproject.toml").write_text(
        '[build-system]\nrequires = []\nbuild-backend = "setuptools.build_meta"\n'
        '[project]\nname = "sample-plugin"\nversion = "1.0"\n'
        '[project.optional-dependencies]\nruntime = ["hermes-agent[cron]>=0.22"]\n',
        encoding="utf-8",
    )
    output = tmp_path / "workspace"
    output.mkdir()
    member = _workspace_member(plugin, output, identity=plugin, extras=["runtime"])
    data = tomllib.loads((member / "pyproject.toml").read_text(encoding="utf-8-sig"))
    assert data["project"]["optional-dependencies"]["runtime"] == ["noone[cron]>=0.22"]
    # The user's original declaration is neither rewritten nor replaced.
    assert "hermes-agent[cron]" in (plugin / "pyproject.toml").read_text(encoding="utf-8-sig")


def test_canonical_requirement_is_validated_before_core_filtering(tmp_path):
    (tmp_path / "pyproject.toml").write_text(
        '[project]\nname = "sample-plugin"\nversion = "1.0"\ndependencies = ["noone>=999"]\n',
        encoding="utf-8",
    )
    declaration = read_python_declaration(tmp_path)
    assert "noone>=999" not in declaration.install_requirements
    assert "noone>=999" in core_requirement_error(declaration, ())
