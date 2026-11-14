"""Legacy import boundary; implementation lives in agent_cli.auth_oauth_pkce_plugin.

Retained for shipped updater/plugin compatibility, sharing the canonical module.
"""
from importlib import import_module
import sys

_current = import_module('agent_cli.auth_oauth_pkce_plugin')
sys.modules[__name__] = _current
