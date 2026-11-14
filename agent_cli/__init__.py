"""Hermes CLI - Unified command-line interface for Hermes Agent."""

import sys

__release_date__ = "2026.11.14"
# Declared for type checkers and the old-updater surface audit; served lazily by __getattr__.
__version__: str


def __getattr__(name: str) -> str:
    """Expose the canonical package version without loading the runtime or Git.

    Older updaters import this before the new environment exists, so this seam
    stays stdlib-only and does not import the Python-3.11+ TOML reader.
    """
    if name != "__version__":
        raise AttributeError(f"module {__name__!r} has no attribute {name!r}")
    import re
    from pathlib import Path

    project = Path(__file__).resolve().parents[1] / "pyproject.toml"
    if project.is_file():
        text = project.read_text(encoding="utf-8-sig")
        section = re.search(r"(?ms)^\[project\]\s*\n(.*?)(?=^\[|\Z)", text)
        match = re.search(r"(?m)^version\s*=\s*['\"]([^'\"]+)['\"]", section.group(1)) if section else None
        if match:
            return match.group(1)
    import json
    from importlib.metadata import distributions

    root = project.parent
    stamp = root / "install-stamp.json"
    if stamp.is_file():
        try:
            data = json.loads(stamp.read_text(encoding="utf-8-sig"))
        except (OSError, ValueError):
            return "0.0.0"
        if isinstance(data, dict):
            return str(data.get("releaseVersion") or data.get("baseVersion") or "0.0.0")
        return "0.0.0"
    for package in distributions(path=[str(root)]):
        if package.metadata.get("Name", "").lower().replace("_", "-") == "hermes-agent":
            return package.version
    # The old updater imports this while a pre-PM checkout is incomplete.
    return "0.0.0"


def _ensure_utf8() -> bool:
    """Force UTF-8 stdout/stderr to prevent UnicodeEncodeError crashes; True when a stream was repaired.

    The CLI prints box-drawing characters and the ☤ glyph in the setup wizard, doctor, and status
    banners; under a non-UTF-8 codec that raises before the command can even start (e.g.
    `noone setup` on a fresh Pi).
    """
    repaired = False
    for stream_name in ("stdout", "stderr"):
        stream = getattr(sys, stream_name, None)
        if stream is None:
            continue
        try:
            if (getattr(stream, "encoding", "") or "").lower().replace("-", "") == "utf8":
                continue
            # Preferred: reconfigure in place, preserving object identity so code already holding
            # a reference to the old sys.stdout benefits from the repair too.
            reconfigure = getattr(stream, "reconfigure", None)
            if callable(reconfigure):
                reconfigure(encoding="utf-8", errors="replace")
            else:
                # No reconfigure(): reopen the fd as UTF-8 (closefd=False keeps the original fd open).
                new_stream = open(stream.fileno(), "w", encoding="utf-8", errors="replace",  # windows-footgun: ok (stdout re-open for write, not a read)
                                  buffering=1, closefd=False)
                setattr(sys, stream_name, new_stream)
            repaired = True
        except (AttributeError, OSError, ValueError):
            pass
    return repaired


# Import repairs only this process's streams. Gateway, compute host, and test code import this
# package as a library; rewriting their os.environ would leak into every child they spawn, so the
# child-process UTF-8 hint is applied by the CLI entry point (agent_cli.main.main) instead.
_stdio_repaired = _ensure_utf8()
