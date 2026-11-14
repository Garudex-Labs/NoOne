"""Legacy import boundary; implementation lives in agent_cli.mcp_security.

Retained for shipped updater/plugin compatibility, sharing the canonical module.
"""
from importlib import import_module
import sys

_current = import_module('agent_cli.mcp_security')
sys.modules[__name__] = _current
