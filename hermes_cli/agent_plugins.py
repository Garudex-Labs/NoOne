"""Legacy import boundary; implementation lives in agent_cli.agent_plugins.

Retained for shipped updater/plugin compatibility, sharing the canonical module.
"""
from importlib import import_module
import sys

from agent_cli.agent_plugins import (
    read_agent_plugin_manifest,
)

_current = import_module('agent_cli.agent_plugins')
sys.modules[__name__] = _current
