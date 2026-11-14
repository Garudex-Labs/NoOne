"""The fork release label must not inherit the upstream tag or lose provenance."""
import json
from pathlib import Path
import subprocess

import pytest

from agent_cli import version_info as vi


def _git(root: Path, *args: str) -> str:
    return subprocess.check_output(["git", *args], cwd=root, text=True).strip()


@pytest.fixture
def fork(tmp_path, monkeypatch):
    root = tmp_path / "repo"
    root.mkdir()
    _git(root, "init", "--quiet", "--initial-branch=main")
    _git(root, "config", "user.name", "RAWx18")
    _git(root, "config", "user.email", "rawx18@example.invalid")
    project = root / "pyproject.toml"
    project.write_text('[project]\nname = "hermes-agent"\nversion = "0.23.1"\n')
    _git(root, "add", ".")
    _git(root, "commit", "--quiet", "-m", "upstream release")
    start = _git(root, "rev-parse", "HEAD")
    _git(root, "tag", "v0.23.1")
    project.write_text(
        '[project]\nname = "hermes-agent"\nversion = "0.1.0"\n'
        f'[tool.hermes.release]\nhistory-start = "{start}"\n'
    )
    _git(root, "add", ".")
    _git(root, "commit", "--quiet", "-m", "feat: initial NoOne release")
    current = _git(root, "rev-parse", "HEAD")
    monkeypatch.setattr(vi, "__file__", str(root / "agent_cli" / "version_info.py"))
    monkeypatch.setattr(vi, "project_root_str", lambda: str(root))
    monkeypatch.setattr(vi, "_resolve_stamp_file", lambda: None)
    vi._reset_version_info_cache()
    yield root, start, current
    vi._reset_version_info_cache()


def test_public_release_does_not_inherit_higher_upstream_tags(fork):
    root, _, current = fork
    (root / "README.md").write_text("uncommitted local work")
    _git(root, "add", "README.md")
    info = vi.get_version_info()
    assert info.base_version == info.derived_version == info.display_version == "0.1.0"
    assert info.commit == current
    assert info.branch == "main"
    assert info.distance == 1
    assert info.dirty


def test_stale_stamp_cannot_override_this_code_release(fork, monkeypatch):
    root, start, _ = fork
    stamp = root / "install-stamp.json"
    stamp.write_text(json.dumps({
        "commit": start, "baseVersion": "0.23.1", "displayVersion": "0.23.1+12",
        "distance": 12, "source": "ci", "updateMechanism": "external",
    }))
    monkeypatch.setattr(vi, "_resolve_stamp_file", lambda: stamp)
    info = vi.get_version_info()
    assert info.display_version == info.base_version == "0.1.0"
    assert info.commit == start
    assert info.distance == 12


def test_archive_release_is_known_without_fabricating_git_provenance(fork, monkeypatch):
    monkeypatch.setattr(vi, "_resolve_repo_dir", lambda: None)
    info = vi.get_version_info()
    assert info.base_version == info.display_version == "0.1.0"
    assert info.commit is None
    assert info.source == "unknown"


def test_inherited_receipts_do_not_spend_new_versions(fork):
    root, _, current = fork
    # The history boundary itself may carry an old release, so the tag's
    # code metadata, not just its ancestry, identifies this project's series.
    old = _git(root, "rev-parse", "HEAD~1")
    assert not vi.is_project_release_commit(old, root)
    assert vi.is_project_release_commit(current, root)


def test_default_build_stamp_uses_plain_project_release(fork, monkeypatch):
    from scripts import write_install_stamp as writer

    root, _, current = fork
    monkeypatch.setattr(writer, "_REPO_ROOT", root)
    stamp = writer.build_stamp(update_mechanism="external", commit=current, distance=7, dirty=True)
    assert stamp["baseVersion"] == stamp["displayVersion"] == stamp["releaseVersion"] == "0.1.0"
    assert stamp["commit"] == current
    assert stamp["distance"] == 7
    assert stamp["dirty"]


def test_legacy_runtime_constraints_are_not_lowered_with_release_number(fork):
    from agent_cli.plugins_manifest import requires_hermes_error, running_hermes_version

    assert vi.get_version_info().base_version == "0.1.0"
    assert running_hermes_version() == "0.23.1"
    assert requires_hermes_error({"requires_hermes": ">=0.23.1"}) is None
    assert requires_hermes_error({"requires_hermes": ">=9.0.0"}) is not None


def test_initial_changelog_excludes_upstream_commits(fork):
    from scripts.releases.entrypoint import _changelog
    from scripts.releases.versioning import SEED, derive_next_version

    root, _, current = fork
    notes = _changelog(root, "example/noone", commit=current, tag="rc.1-v0.1.0", version=SEED,
                       published=(SEED, None), no_changelog=False)
    assert "initial noone release" in notes.casefold()
    assert "upstream release" not in notes.casefold()
    assert derive_next_version(published=None, bump="major") == "0.1.0"
    assert derive_next_version(published="0.1.0", bump="patch") == "0.1.1"
    with pytest.raises(ValueError, match="unknown bump"):
        derive_next_version(published=None, bump="invalid")


def test_lower_initial_release_is_admitted_only_across_history_boundary(fork):
    from scripts.releases.channels import _source_version_increases

    _, start, current = fork
    previous = {"version": "0.23.1", "commit": start}
    request = {"version": "0.1.0", "commit": current}
    assert _source_version_increases(request, previous, "stable-release")
    assert not _source_version_increases(previous, request, "stable-release")
    assert not _source_version_increases(request, request, "stable-release")


def test_unknown_previous_epoch_cannot_permit_a_source_downgrade(fork):
    from scripts.releases.channels import _source_version_increases

    root, _, current = fork
    unknown = "e" * 40
    assert vi.project_release_membership(unknown, root) is None
    assert not _source_version_increases(
        {"version": "0.1.0", "commit": current},
        {"version": "0.1.1", "commit": unknown}, "stable-release",
    )


def test_previous_git_timeout_cannot_permit_a_source_downgrade(fork, monkeypatch):
    from scripts.releases.channels import _source_version_increases

    _, _, current = fork
    previous = "e" * 40
    run = vi.subprocess.run

    def timeout_previous(arguments, **kwargs):
        if arguments[:2] == ["git", "show"] and arguments[2].startswith(previous):
            raise subprocess.TimeoutExpired(arguments, 3)
        return run(arguments, **kwargs)

    monkeypatch.setattr(vi.subprocess, "run", timeout_previous)
    assert not _source_version_increases(
        {"version": "0.1.0", "commit": current},
        {"version": "0.1.1", "commit": previous}, "stable-release",
    )


def test_shallow_local_metadata_uses_remote_ancestry_verification(fork, monkeypatch):
    from types import SimpleNamespace
    from agent_cli import source_releases, source_check

    root, _, current = fork
    data = _git(root, "show", f"{current}:pyproject.toml")
    monkeypatch.setattr(source_releases, "_probe", lambda *args: SimpleNamespace(returncode=0, stdout=data))
    monkeypatch.setattr(vi, "project_release_membership", lambda *args: None)
    comparisons = []

    def compare(start, commit, repository):
        comparisons.append((start, commit, repository))
        return {"status": "ahead"}

    monkeypatch.setattr(source_check, "_github_compare", compare)
    source_releases._assert_project_source(current, "example/noone", ["git"], root, "0.1.0")
    assert len(comparisons) == 1
    monkeypatch.setattr(source_check, "_github_compare", lambda *args: None)
    with pytest.raises(ValueError, match="ancestry could not be verified"):
        source_releases._assert_project_source(current, "example/noone", ["git"], root, "0.1.0")


def test_workflow_claim_version_must_match_committed_metadata(fork):
    from scripts.releases.stable import admit_claim

    root, _, current = fork
    assert admit_claim("rc.1-v0.1.0", current, on_main=lambda _: True, root=root)["version"] == "0.1.0"
    with pytest.raises(ValueError, match="differs from committed"):
        admit_claim("rc.1-v0.2.0", current, on_main=lambda _: True, root=root)
