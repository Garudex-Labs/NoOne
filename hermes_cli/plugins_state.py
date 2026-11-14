"""Legacy import boundary; implementation lives in agent_cli.plugins_state.

Retained for shipped updater/plugin compatibility, sharing the canonical module.
"""
from importlib import import_module
import sys

from agent_cli.plugins_state import (
    PluginState,
)

_current = import_module('agent_cli.plugins_state')
sys.modules[__name__] = _current
