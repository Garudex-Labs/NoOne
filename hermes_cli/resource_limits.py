"""Legacy import boundary; implementation lives in agent_cli.resource_limits.

Retained for shipped updater/plugin compatibility, sharing the canonical module.
"""
from importlib import import_module
import sys

_current = import_module('agent_cli.resource_limits')
sys.modules[__name__] = _current
