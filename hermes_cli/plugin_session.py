"""Legacy import boundary; implementation lives in agent_cli.plugin_session.

Retained for shipped updater/plugin compatibility, sharing the canonical module.
"""
from importlib import import_module
import sys

from agent_cli.plugin_session import (
    session_client,
)

_current = import_module('agent_cli.plugin_session')
sys.modules[__name__] = _current
