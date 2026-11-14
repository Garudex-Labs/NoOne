"""Resolve HERMES_HOME for standalone skill scripts.

Skill scripts may run outside the Hermes process (system Python, nix env,
CI) where ``agent_constants`` is not importable.  This module provides the
same ``get_agent_home()`` contract without requiring it on ``sys.path``.

When ``agent_constants`` IS available it is used directly so profile
resolution and any future enhancements are picked up automatically.
"""

from __future__ import annotations

import os
from pathlib import Path

try:
    from agent_constants import get_agent_home
except (ModuleNotFoundError, ImportError):

    def get_agent_home() -> Path:
        """Return the Hermes home directory (default: ``~/.hermes``)."""
        val = os.environ.get("HERMES_HOME", "").strip()
        return Path(val) if val else Path.home() / ".hermes"
