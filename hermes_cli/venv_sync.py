"""Legacy import boundary; implementation lives in agent_cli.venv_sync.

Retained for shipped updater/plugin compatibility, sharing the canonical module.
"""
from importlib import import_module
import sys

from agent_cli.venv_sync import (
    publish_launchers,
)

_current = import_module('agent_cli.venv_sync')
sys.modules[__name__] = _current
