"""Legacy import boundary; implementation lives in agent_cli.plugin_catalog.

Retained for shipped updater/plugin compatibility, sharing the canonical module.
"""
from importlib import import_module
import sys

from agent_cli.plugin_catalog import (
    find_removed,
    load_catalog_live,
)

_current = import_module('agent_cli.plugin_catalog')
sys.modules[__name__] = _current
