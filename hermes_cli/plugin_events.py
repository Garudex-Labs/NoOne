"""Legacy import boundary; implementation lives in agent_cli.plugin_events.

Retained for shipped updater/plugin compatibility, sharing the canonical module.
"""
from importlib import import_module
import sys

_current = import_module('agent_cli.plugin_events')
sys.modules[__name__] = _current
