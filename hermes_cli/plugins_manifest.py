"""Legacy import boundary; implementation lives in agent_cli.plugins_manifest.

Retained for shipped updater/plugin compatibility, sharing the canonical module.
"""
from importlib import import_module
import sys

from agent_cli.plugins_manifest import (
    SUPPORTED_MANIFEST_VERSION,
    requires_hermes_error,
)

_current = import_module('agent_cli.plugins_manifest')
sys.modules[__name__] = _current
