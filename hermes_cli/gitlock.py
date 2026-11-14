"""Legacy import boundary; implementation lives in agent_cli.gitlock.

Retained for shipped updater/plugin compatibility, sharing the canonical module.
"""
from importlib import import_module
import sys

from agent_cli.gitlock import (
    clear_stale_git_locks,
    clear_stale_tmp_packs,
    prune_stale_shallow_grafts,
    repair_broken_shallow_boundaries,
)

_current = import_module('agent_cli.gitlock')
sys.modules[__name__] = _current
