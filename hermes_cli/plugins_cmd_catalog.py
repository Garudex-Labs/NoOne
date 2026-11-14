"""Legacy import boundary; implementation lives in agent_cli.plugins_cmd_catalog.

Retained for shipped updater/plugin compatibility, sharing the canonical module.
"""
from importlib import import_module
import sys

from agent_cli.plugins_cmd_catalog import (
    raise_if_removed,
)

_current = import_module('agent_cli.plugins_cmd_catalog')
sys.modules[__name__] = _current
