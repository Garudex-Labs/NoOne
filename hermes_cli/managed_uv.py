"""Legacy import boundary; implementation lives in agent_cli.managed_uv.

Retained for shipped updater/plugin compatibility, sharing the canonical module.
"""
from importlib import import_module
import sys

from agent_cli.managed_uv import (
    _reload_agent_constants as _reload_hermes_constants,
    ensure_uv,
    managed_python_env,
    rebuild_venv,
    resolve_uv,
    update_managed_uv,
)

_current = import_module('agent_cli.managed_uv')
sys.modules[__name__] = _current

_current._reload_hermes_constants = _reload_hermes_constants
