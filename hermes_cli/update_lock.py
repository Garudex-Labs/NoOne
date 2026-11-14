"""Legacy import boundary; implementation lives in agent_cli.update_lock.

Retained for shipped updater/plugin compatibility, sharing the canonical module.
"""
from importlib import import_module
import sys

from agent_cli.update_lock import (
    UPDATE_EXIT_CONCURRENT,
    UpdateLock,
    describe_holder,
)

_current = import_module('agent_cli.update_lock')
sys.modules[__name__] = _current
