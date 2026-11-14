"""Legacy import boundary; implementation lives in agent_cli._install_repair.

Retained for shipped updater/plugin compatibility, sharing the canonical module.
"""
from importlib import import_module
import sys

from agent_cli._install_repair import (
    _sync_windows_cli_launchers,
    migrate_windows_bin_path,
)

_current = import_module('agent_cli._install_repair')
sys.modules[__name__] = _current
