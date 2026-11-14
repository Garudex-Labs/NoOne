"""Legacy import boundary; implementation lives in agent_cli.plugins_ledger.

Retained for shipped updater/plugin compatibility, sharing the canonical module.
"""
from importlib import import_module
import sys

from agent_cli.plugins_ledger import (
    PluginRegistration,
    _hook_source_of,
)

_current = import_module('agent_cli.plugins_ledger')
sys.modules[__name__] = _current
