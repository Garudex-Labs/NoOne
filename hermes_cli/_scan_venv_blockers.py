"""Legacy import boundary; implementation lives in agent_cli._scan_venv_blockers.

Retained for shipped updater/plugin compatibility, sharing the canonical module.
"""
from importlib import import_module
import sys

from agent_cli._scan_venv_blockers import (
    _is_pausable_gateway,
)

_current = import_module('agent_cli._scan_venv_blockers')
sys.modules[__name__] = _current
