"""Legacy import boundary; implementation lives in agent_state.

Retained for shipped updater/plugin compatibility, sharing the canonical module.
"""
from importlib import import_module
import sys

_current = import_module('agent_state')
sys.modules[__name__] = _current
