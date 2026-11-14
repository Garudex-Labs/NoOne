"""Legacy import boundary; implementation lives in agent_cli.plugin_capabilities.

Retained for shipped updater/plugin compatibility, sharing the canonical module.
"""
from importlib import import_module
import sys

from agent_cli.plugin_capabilities import (
    CAPABILITY_REGISTRY,
    declared_set_changed,
    parse_declared_capabilities,
    pending_capabilities,
    record_consent,
)

_current = import_module('agent_cli.plugin_capabilities')
sys.modules[__name__] = _current
