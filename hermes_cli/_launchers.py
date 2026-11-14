"""Legacy import boundary; implementation lives in agent_cli._launchers.

Retained for shipped updater/plugin compatibility, sharing the canonical module.
"""
from importlib import import_module
import sys

from agent_cli._launchers import (
    ENTRY_POINTS,
    ensure_install_launchers,
    exe_is_venv_bound,
    expose_cli,
    installation_command,
    mint_launcher,
    resolve_store_python,
    runtime_command,
    stage_launcher,
)

_current = import_module('agent_cli._launchers')
sys.modules[__name__] = _current
