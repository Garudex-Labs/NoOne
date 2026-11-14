"""Legacy import boundary; implementation lives in agent_cli.plugins_cmd.

Retained for shipped updater/plugin compatibility, sharing the canonical module.
"""
from importlib import import_module
import sys

from agent_cli.plugins_cmd import (
    PluginOperationError,
    _check_manifest_version,
    _fail,
    _get_enabled_set,
    _install_plugin_core,
    _read_manifest_for_install,
    _save_enabled_set,
)

_current = import_module('agent_cli.plugins_cmd')
sys.modules[__name__] = _current
