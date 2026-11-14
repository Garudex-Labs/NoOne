"""Prevent a non-forward update to code that cannot honor NoOne migration metadata.

The guard is read-only. An initialized store is protected even before its first
admission; no legacy schema importer or predecessor-snapshot search is needed.
"""

from __future__ import annotations

import sqlite3
from collections.abc import Callable, Iterable
from contextlib import closing
from pathlib import Path
from typing import Optional

# A target without migration authority must never mutate a NoOne store.
_RUNTIME_SCHEMA_MARKER = "CREATE TABLE schema_migrations"
# Source locations used by both local git probes and read-only remote probes.
# Literal per-location patterns serve as git pathspecs, fnmatch patterns and Path.glob patterns alike;
# a ``:(glob)**`` pathspec would also match tests/ and is not honoured by ``rev-list --objects``.
STATE_MODULES = ("agent_cli/database_migrations*.py", "agent_cli/data/migrations/0001_base/*.sql")
_LEDGER_PROBE = "SELECT EXISTS(SELECT 1 FROM schema_migrations WHERE component='state')"
_DOCS = "https://github.com/Garudex-Labs/NoOne/blob/main/website/docs/getting-started/updating.md#rolling-back-to-an-older-release"


def _updater_git(git_cmd, root: Path) -> Callable[..., int]:
    import subprocess

    from agent_cli.update_custody import run_git

    def git(*args: str) -> int:
        try:
            return run_git(git_cmd, list(args), cwd=str(root), capture_output=True, timeout=120).returncode
        except (OSError, subprocess.SubprocessError):
            return -1
    return git


def defines_runtime(sources: Iterable[str]) -> bool:
    """Whether the target declares NoOne migration authority; callers may provide source lazily."""
    return any(_RUNTIME_SCHEMA_MARKER in source for source in sources)


def target_predates_runtime(git_cmd, root: Path, target_ref: str, *,
                            git: Optional[Callable[..., int]] = None,
                            remote: Optional[Callable[[str], Optional[bool]]] = None) -> bool:
    """True when ``target_ref`` does not descend from HEAD and none of its ``STATE_MODULES`` files
    defines the runtime ledger. The pathspec keeps a blobless partial clone from fetching the whole
    tree. Any git failure proves nothing (False). ``git`` runs one git command and returns its exit
    code; the update check passes its own read-only probe.

    ``remote`` answers the same question for a target whose commit, tree or schema blobs are missing
    locally (True, False, or None when it cannot tell). The update check passes one because it never
    fetches; the updater stays git-only."""
    git = git or _updater_git(git_cmd, root)
    if git("merge-base", "--is-ancestor", "HEAD", target_ref) == 0:
        return False  # forward update: whatever the target's schema, it was written knowing this one
    # grep can return 1 for unreadable blobs too: establish completeness before trusting no match.
    if git("rev-list", "--objects", "--no-walk", "--sparse", "--missing=error", target_ref, "--", *STATE_MODULES) != 0:
        return remote is not None and remote(target_ref) is True
    # Exit 1 = no match in a complete local schema; 0 = found; anything else is a git error.
    result = git("grep", "-q", "-F", _RUNTIME_SCHEMA_MARKER, target_ref, "--", *STATE_MODULES)
    return result == 1 if result in (0, 1) else remote is not None and remote(target_ref) is True


def _has_initialized_store(db_path: Path) -> bool:
    if not db_path.is_file():
        return False
    from agent_state_holders import read_only_db_uri
    try:
        from agent_cli.sqlite_safe_read import connect_tracked

        with closing(connect_tracked(read_only_db_uri(db_path), uri=True, timeout=5.0, tracking_path=db_path,
                                     connect_fn=sqlite3.connect)) as conn:
            return bool(conn.execute(_LEDGER_PROBE).fetchone()[0])
    except sqlite3.Error:
        return False  # no ledger tables yet, or unreadable: nothing an older release would trip on




def _named_profile(home: Path) -> str:
    """The ``-p`` name that opens ``home`` (``hermes -p acme update`` passes ``profiles/acme``);
    ``""`` for the default root or a custom HERMES_HOME, which bare ``hermes`` opens."""
    from agent_cli.profiles import _PROFILE_ID_RE, _get_profiles_root
    parent = _get_profiles_root().resolve()
    resolved = home.resolve()
    named = resolved.parent == parent and _PROFILE_ID_RE.match(resolved.name) and resolved.name != "default"
    return resolved.name if named else ""


def _initialized_profiles(home: Path | None) -> list[tuple[str, Path]]:
    from agent_cli.backup import _sibling_profile_homes
    from agent_constants import get_agent_home

    home = Path(home or get_agent_home())
    profiles = [(_named_profile(home), home), *_sibling_profile_homes(home)]
    return [(name, h) for name, h in profiles if _has_initialized_store(h / "state.db")]


def would_refuse(root: Path, target_ref: str, home: Path | None = None, *, git: Callable[..., int],
                 remote: Optional[Callable[[str], Optional[bool]]] = None) -> bool:
    """Whether ``noone update`` would refuse ``target_ref`` here: the update check's read-only twin of
    :func:`downgrade_refusal`, so a release the updater refuses is never offered as an update.
    The store scan runs first, so ``remote`` is only consulted when some store has runtime history."""
    return bool(_initialized_profiles(home)) and target_predates_runtime(
        None, root, target_ref, git=git, remote=remote)


def downgrade_refusal(git_cmd, root: Path, target_ref: str, home: Path | None = None) -> str | None:
    """Refuse a target without NoOne's schema guard before it can mutate an initialized store."""
    initialized = _initialized_profiles(home)
    if not initialized or not target_predates_runtime(git_cmd, root, target_ref):
        return None
    stores = "\n".join(f"  {directory / 'state.db'}" for _, directory in initialized)
    return (
        f"Refusing to move this install to {target_ref[:12]}: it lacks the NoOne database foundation.\n"
        f"These initialized stores require supported migration metadata:\n{stores}\n"
        "Downgrading is unsupported. Use a compatible NoOne release or restore a backup compatible with your chosen release."
    )
