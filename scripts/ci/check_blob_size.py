#!/usr/bin/env python3
"""Fail when a change adds a large binary, or a large new file, to the repository.

Every blob a merge adds stays in every clone forever, so a screenshot, a test database or an
archive committed by mistake costs every contributor and every CI checkout from then on, even
after a later commit deletes it. This summer main received a 2 MB PR screenshot, a 2 MB
``default.tar.gz``, a 4 MB background JPEG, SQLite files a test wrote into the checkout, and a
1 MB fuzz-corpus JSON at the repo root.

Judged per changed path, base -> head:

* a binary file (git's own detection: ``--numstat`` prints ``-  -``) whose new content is over
  ``MAX_BYTES``, whether added, modified or renamed with edits;
* a newly added text file over ``MAX_BYTES``. Edits to existing text files are not judged here:
  the code-health FILE_LINES ratchet already caps their growth, and the repo has legitimate
  generated or vendored text files over the limit (``uv.lock``, lockfiles, the OpenRPC contract).

Content the base tree already holds (a pure rename, a copy, a revert to a tracked version) adds no
bytes to the pack and is never judged. Paths listed in
``.github/blob-size-allowlist.txt`` (exact paths, one per line) are exempt; that file is
CODEOWNERS-reviewed, so every exception gets a core review.

    python scripts/ci/check_blob_size.py                    # working tree vs merge-base with origin/main
    python scripts/ci/check_blob_size.py --base HEAD^1      # CI: the PR merge commit vs main
    python scripts/ci/check_blob_size.py --base A --head B  # any two revisions

Exit codes: 0 = nothing over the limit, 1 = at least one offender, 2 = git or usage error.
"""

from __future__ import annotations

import argparse
import os
import shutil
import subprocess
import sys
import tempfile
from collections.abc import Collection
from dataclasses import dataclass
from pathlib import Path

MAX_BYTES = 500 * 1024
ALLOWLIST = ".github/blob-size-allowlist.txt"
_GITLINK = "160000"
_ZERO_SHA = "0" * 40
# git's own heuristic (xdiff buffer_is_binary): a NUL byte in the first 8000 bytes.
_SNIFF_BYTES = 8000


class GitError(RuntimeError):
    pass


@dataclass(frozen=True)
class Change:
    status: str  # A (added or copied), M, R (renamed), T (type change)
    path: str
    old_path: str | None
    blob: str | None  # head blob sha; None for a working-tree file not yet hashed


@dataclass(frozen=True)
class Offender:
    path: str
    size: int
    kind: str  # "binary" or "new file"
    status: str


def _git(repo: Path, *args: str, check: bool = True) -> str:
    proc = subprocess.run(["git", *args], cwd=repo, capture_output=True, text=True, encoding="utf-8",
                          errors="surrogateescape", stdin=subprocess.DEVNULL, timeout=300, check=False)
    if check and proc.returncode != 0:
        raise GitError(f"git {' '.join(args)}: {proc.stderr.strip()}")
    return proc.stdout


def default_base(repo: Path, head: str | None) -> str:
    """Merge-base of the judged commit (HEAD for a tree or the working tree) with origin/main."""
    tip = "HEAD"
    if head and _git(repo, "rev-parse", "--verify", "--quiet", f"{head}^{{commit}}", check=False).strip():
        tip = head
    for ref in ("origin/main", "main"):
        out = _git(repo, "merge-base", tip, ref, check=False).strip()
        if out:
            return out
    raise GitError("no merge-base with origin/main or main; pass --base")


def _parse_raw(out: str) -> list[Change]:
    """``git diff --raw -z -M -C`` records -> changes that introduce content at a path."""
    fields = out.split("\0")
    changes: list[Change] = []
    i = 0
    while i < len(fields) and fields[i].startswith(":"):
        meta = fields[i][1:].split()
        new_mode, new_sha, status = meta[1], meta[3], meta[4]
        code = status[0]
        if code in "RC":
            old_path, path = fields[i + 1], fields[i + 2]
            i += 3
        else:
            old_path, path = None, fields[i + 1]
            i += 2
        if code in "DU" or new_mode == _GITLINK:
            continue
        blob = None if new_sha == _ZERO_SHA else new_sha
        changes.append(Change("A" if code == "C" else code, path, old_path, blob))
    return changes


def _binary_paths(repo: Path, base: str, head: str | None) -> set[str]:
    args = ["diff", "--numstat", "-z", "-M", "-C", "-l0", base] + ([head] if head else [])
    fields = _git(repo, *args).split("\0")
    paths: set[str] = set()
    i = 0
    while i < len(fields) and fields[i]:
        added, deleted, path = fields[i].split("\t", 2)
        if path:  # plain record: "<a>\t<d>\t<path>"
            i += 1
        else:  # rename/copy record: "<a>\t<d>\t" then old and new path as their own fields
            path = fields[i + 2]
            i += 3
        if added == "-" and deleted == "-":
            paths.add(path)
    return paths


def _tree_blobs(repo: Path, rev: str) -> set[str]:
    out = _git(repo, "ls-tree", "-r", "-z", "--full-tree", rev)  # "<mode> <type> <sha>\t<path>"
    return {entry.split("\t", 1)[0].split()[2] for entry in out.split("\0") if entry}


def _untracked(repo: Path) -> list[str]:
    out = _git(repo, "ls-files", "--others", "--exclude-standard", "-z")
    return [p for p in out.split("\0") if p]


def _sniff_binary(path: Path) -> bool:
    with path.open("rb") as fh:
        return b"\0" in fh.read(_SNIFF_BYTES)


def _sizes(repo: Path, blobs: list[str]) -> dict[str, int]:
    if not blobs:
        return {}
    proc = subprocess.run(["git", "cat-file", "--batch-check=%(objectname) %(objectsize)"], cwd=repo,
                          input="\n".join(blobs) + "\n", capture_output=True, text=True,
                          encoding="utf-8", timeout=300, check=False)
    if proc.returncode != 0:
        raise GitError(f"git cat-file --batch-check: {proc.stderr.strip()}")
    sizes: dict[str, int] = {}
    for line in proc.stdout.splitlines():
        parts = line.split()
        if len(parts) == 2 and parts[1].isdigit():
            sizes[parts[0]] = int(parts[1])
    return sizes


def _hash_file(repo: Path, rel: str) -> str:
    """The blob sha ``git add`` would store for a working-tree file (clean filters applied)."""
    return _git(repo, "hash-object", "--", rel).strip()


def _working_blob(repo: Path, rel: str) -> tuple[str, int]:
    """Git-cleaned identity and size without writing the repository's objects/index."""
    with tempfile.TemporaryDirectory(prefix="blob-size-clean-") as temporary:
        env = dict(os.environ, GIT_OBJECT_DIRECTORY=temporary)
        hashed = subprocess.run(["git", "hash-object", "-w", "--", rel], cwd=repo,
                                env=env, capture_output=True, text=True, timeout=300,
                                stdin=subprocess.DEVNULL, check=False)
        if hashed.returncode:
            raise GitError(hashed.stderr.strip())
        blob = hashed.stdout.strip()
        sized = subprocess.run(["git", "cat-file", "-s", blob], cwd=repo, env=env,
                               capture_output=True, text=True, timeout=300,
                               stdin=subprocess.DEVNULL, check=False)
        if sized.returncode:
            raise GitError(sized.stderr.strip())
        return blob, int(sized.stdout.strip())


def _deleted_files(repo: Path, base: str) -> dict[str, str]:
    """Base blobs whose regular tracked paths are absent from the working tree."""
    fields = _git(repo, "diff", "--raw", "-z", "--no-abbrev", "--no-renames",
                  "--diff-filter=D", base).split("\0")
    return {path: meta.split()[2] for meta, path in zip(fields[::2], fields[1::2])
            if meta.split()[0] in {":100644", ":100755"}}


def _similar_size(left: int, right: int) -> bool:
    # Git's default -M threshold cannot match blobs whose sizes differ by more than 2x.
    return min(left, right) * 2 >= max(left, right)


def _working_sizes(repo: Path, paths: Collection[str]) -> dict[str, int]:
    return {path: (repo / path).stat().st_size for path in paths
            if path and (repo / path).is_file() and not (repo / path).is_symlink()}


def _binary_attributes(repo: Path, paths: Collection[str]) -> set[str]:
    """Explicit binary diff attributes also apply to untracked paths."""
    if not paths:
        return set()
    fields = _git(repo, "check-attr", "-z", "diff", "--", *paths).split("\0")
    drivers: dict[str, bool] = {}
    binary = set()
    for path, _, value in zip(fields[::3], fields[1::3], fields[2::3]):
        if value not in {"set", "unset", "unspecified"} and value not in drivers:
            drivers[value] = _git(repo, "config", "--type=bool", "--get", f"diff.{value}.binary",
                                  check=False).strip() == "true"
        if value == "unset" or drivers.get(value, False):
            binary.add(path)
    return binary


def _untracked_text_renames(repo: Path, base: str, untracked: dict[str, int], limit: int,
                            binary: set[str]) -> set[str]:
    """Ask Git to pair deleted base text with untracked text, without writing an index."""
    targets = {path: size for path, size in untracked.items()
               if size > limit and path not in binary and not _sniff_binary(repo / path)}
    if not targets:
        return set()
    deleted = _deleted_files(repo, base)
    sizes = _sizes(repo, sorted(set(deleted.values())))
    sources = {path: blob for path, blob in deleted.items()
               if any(_similar_size(sizes[blob], size) for size in targets.values())}
    if not sources:
        return set()
    source_binary = _binary_attributes(repo, sources)
    added = _git(repo, "diff", "--name-only", "-z", "--no-renames", "--diff-filter=A", base).split("\0")
    destinations = untracked | _working_sizes(repo, added)
    with tempfile.TemporaryDirectory(prefix="blob-size-renames-") as scratch:
        root = Path(scratch)
        before, after = root / "before", root / "after"
        before.mkdir()
        after.mkdir()
        text_sizes = []
        for path, blob in sources.items():
            if path in source_binary:
                continue
            proc = subprocess.run(["git", "cat-file", "blob", blob], cwd=repo, capture_output=True,
                                  stdin=subprocess.DEVNULL, timeout=300, check=False)
            if proc.returncode != 0:
                raise GitError(f"git cat-file blob {blob}: {proc.stderr.decode(errors='replace').strip()}")
            if b"\0" in proc.stdout[:_SNIFF_BYTES]:
                continue
            file = before / path
            file.parent.mkdir(parents=True, exist_ok=True)
            file.write_bytes(proc.stdout)
            text_sizes.append(sizes[blob])
        if not text_sizes:
            return set()
        for path, size in destinations.items():
            if not any(_similar_size(size, old_size) for old_size in text_sizes):
                continue
            file = after / path
            file.parent.mkdir(parents=True, exist_ok=True)
            shutil.copyfile(repo / path, file)
        proc = subprocess.run(["git", "diff", "--no-index", "--raw", "-z", "--no-abbrev", "-M",
                               "--no-ext-diff", "--no-textconv", "--", str(before.resolve()), str(after.resolve())],
                              cwd=repo, capture_output=True, text=True, encoding="utf-8",
                              errors="surrogateescape", stdin=subprocess.DEVNULL, timeout=300, check=False)
        if proc.returncode not in (0, 1):
            raise GitError(f"git diff --no-index: {proc.stderr.strip()}")
        renamed = {Path(change.path).relative_to(after.resolve()).as_posix() for change in _parse_raw(proc.stdout)
                   if change.status == "R"}
        return renamed.intersection(targets)


def parse_allowlist(text: str) -> set[str]:
    entries = set()
    for line in text.lstrip("\ufeff").splitlines():
        line = line.strip()
        if line and not line.startswith("#"):
            entries.add(line)
    return entries


def read_allowlist(path: Path) -> set[str]:
    if not path.is_file():
        return set()
    return parse_allowlist(path.read_text(encoding="utf-8-sig"))


def allowlist_at(repo: Path, rev: str) -> set[str]:
    """The allowlist as revision ``rev`` holds it (empty when ``rev`` has none)."""
    if not _git(repo, "rev-parse", "--verify", "--quiet", f"{rev}:{ALLOWLIST}", check=False).strip():
        _git(repo, "rev-parse", "--verify", f"{rev}^{{tree}}")  # a bad revision is a usage error
        return set()
    return parse_allowlist(_git(repo, "cat-file", "blob", f"{rev}:{ALLOWLIST}"))


def find_offenders(repo: Path, base: str, head: str | None, limit: int = MAX_BYTES,
                   allowlist: Collection[str] = frozenset()) -> list[Offender]:
    """Changed paths base -> head (None = working tree + untracked files) over ``limit``."""
    args = ["diff", "--raw", "-z", "-M", "-C", "-l0", "--no-abbrev", base] + ([head] if head else [])
    known = _tree_blobs(repo, base)
    changes = [c for c in _parse_raw(_git(repo, *args)) if c.blob not in known and c.path not in allowlist]
    binary = _binary_paths(repo, base, head)
    sizes = _sizes(repo, sorted({c.blob for c in changes if c.blob}))
    offenders: list[Offender] = []
    for change in changes:
        if change.blob is not None:
            size = sizes.get(change.blob, 0)
        else:  # working-tree content git has not hashed (an unstaged edit)
            disk = repo / change.path
            size = disk.stat().st_size if disk.is_file() and not disk.is_symlink() else 0
            if size > limit:
                blob, size = _working_blob(repo, change.path)
                if blob in known:
                    continue
        is_binary = change.path in binary
        if size > limit and (is_binary or change.status == "A"):
            offenders.append(Offender(change.path, size, "binary" if is_binary else "new file", change.status))
    if head is None:
        untracked = _working_sizes(repo, _untracked(repo))
        # Include competing small/exact copies in Git's pairing, not just the
        # oversized candidates (and staged additions in the temporary tree):
        # one deleted source can justify only one rename.
        forced_binary = _binary_attributes(repo, [rel for rel, size in untracked.items() if size > limit])
        renamed = _untracked_text_renames(repo, base, untracked, limit, forced_binary)
        for rel, size in untracked.items():
            if rel in allowlist or rel in renamed:
                continue
            if size <= limit:
                continue
            blob, size = _working_blob(repo, rel)
            if size > limit and blob not in known:  # an untracked copy adds nothing
                kind = "binary" if rel in forced_binary or _sniff_binary(repo / rel) else "new file"
                offenders.append(Offender(rel, size, kind, "A"))
    return sorted(offenders, key=lambda o: (-o.size, o.path))


def _kib(size: int) -> str:
    return f"{size / 1024:,.0f} KiB"


def render(offenders: list[Offender], limit: int) -> list[str]:
    lines = [f"::error file={o.path}::{o.path} is {_kib(o.size)} ({o.kind}); the limit is {_kib(limit)}"
             for o in offenders]
    lines += [
        "",
        f"{len(offenders)} file(s) over the {_kib(limit)} blob limit. Every blob a merge adds stays in",
        "every clone forever, even after a later commit deletes it. Fix one of these ways:",
        "  - screenshots, recordings, PR assets: put them in the PR description, not in git",
        "  - images that must ship: compress them (oxipng -o max / pngquant / jpegoptim / webp)",
        "  - test data or archives: generate them in the test's tmp dir instead of committing them",
        f"  - a file that must ship at this size: add its exact path to {ALLOWLIST}",
        "    (needs a hermes-agent-core review; keep that list short)",
        "Reproduce locally: python scripts/ci/check_blob_size.py",
    ]
    return lines


def summary_table(offenders: list[Offender], limit: int) -> str:
    if not offenders:
        return f"### Blob size\n\nNo added or modified file is over {_kib(limit)}.\n"
    rows = "\n".join(f"| `{o.path}` | {o.kind} | {o.status} | {_kib(o.size)} |" for o in offenders)
    return (f"### Blob size: {len(offenders)} file(s) over {_kib(limit)}\n\n"
            f"| Path | Kind | Status | Size |\n|---|---|---|---|\n{rows}\n\n"
            f"Compress the file, move it out of git, or add its exact path to `{ALLOWLIST}`.\n")


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description=(__doc__ or "").splitlines()[0])
    parser.add_argument("--base", help="base revision (default: merge-base with origin/main)")
    parser.add_argument("--head", help="head revision or tree (default: the working tree)")
    parser.add_argument("--limit", type=int, default=MAX_BYTES, help=f"bytes (default {MAX_BYTES})")
    parser.add_argument("--repo", type=Path, default=Path.cwd())
    args = parser.parse_args(argv)
    repo = args.repo.resolve()
    try:
        base = args.base or default_base(repo, args.head)
        # The judged side's own exceptions: the revision's list, or the working tree's.
        allowlist = allowlist_at(repo, args.head) if args.head else read_allowlist(repo / ALLOWLIST)
        offenders = find_offenders(repo, base, args.head, args.limit, allowlist)
    except GitError as exc:
        print(f"check_blob_size: {exc}", file=sys.stderr)
        return 2
    step_summary = os.environ.get("GITHUB_STEP_SUMMARY")
    if step_summary:
        with open(step_summary, "a", encoding="utf-8") as fh:
            fh.write(summary_table(offenders, args.limit))
    if not offenders:
        print(f"check_blob_size: no added or modified file over {_kib(args.limit)}")
        return 0
    print("\n".join(render(offenders, args.limit)))
    return 1


if __name__ == "__main__":
    sys.exit(main())
