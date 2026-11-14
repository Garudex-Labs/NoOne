"""Legacy import boundary; implementation lives in agent_cli.main_install_repair.

Retained for shipped updater/plugin compatibility, sharing the canonical module.
"""
from importlib import import_module
import sys

from agent_cli.main_install_repair import (
    _hermes_exe_shims,
    _is_windows,
    _resolve_node_runtime_npm,
)

_current = import_module('agent_cli.main_install_repair')
sys.modules[__name__] = _current
