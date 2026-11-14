"""Legacy import boundary; implementation lives in agent_cli.plugins.

Retained for shipped updater/plugin compatibility, sharing the canonical module.
"""
from importlib import import_module
import sys

from agent_cli.plugins import (
    PluginContext,
    PluginManifest,
    SHELL_UNSUPPORTED_HOOKS,
    VALID_HOOKS,
    get_plugin_manager,
)

_current = import_module('agent_cli.plugins')
sys.modules[__name__] = _current
