"""Legacy import boundary; implementation lives in agent_cli.dashboard_procs.

Retained for shipped updater/plugin compatibility, sharing the canonical module.
"""
from importlib import import_module
import sys

from agent_cli.dashboard_procs import (
    _scan_dashboard_processes,
)

_current = import_module('agent_cli.dashboard_procs')
sys.modules[__name__] = _current
