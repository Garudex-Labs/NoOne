"""Legacy import boundary; implementation lives in agent_cli.process_identity.

Retained for shipped updater/plugin compatibility, sharing the canonical module.
"""
from importlib import import_module
import sys

from agent_cli.process_identity import (
    ledger_entries,
    spawner_is_dead,
)

_current = import_module('agent_cli.process_identity')
sys.modules[__name__] = _current
