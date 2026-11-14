"""Legacy import boundary; implementation lives in agent_cli.plugins_transaction.

Retained for shipped updater/plugin compatibility, sharing the canonical module.
"""
from importlib import import_module
import sys

from agent_cli.plugins_transaction import (
    recover_plugin_publication,
    update_plugin,
)

_current = import_module('agent_cli.plugins_transaction')
sys.modules[__name__] = _current
