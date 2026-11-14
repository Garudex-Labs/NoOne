"""Legacy import boundary; implementation lives in agent_cli.update_cmd_fleet.

Retained for shipped updater/plugin compatibility, sharing the canonical module.
"""
from importlib import import_module
import sys

from agent_cli.update_cmd_fleet import (
    _write_gateway_update_exit_code,
)

_current = import_module('agent_cli.update_cmd_fleet')
sys.modules[__name__] = _current
