"""Legacy import boundary; implementation lives in agent_cli.update_cmd_fleet_unit_budget.

Retained for shipped updater/plugin compatibility, sharing the canonical module.
"""
from importlib import import_module
import sys

from agent_cli.update_cmd_fleet_unit_budget import (
    UNIT_JOB_STILL_RUNNING,
    run_unit_job,
)

_current = import_module('agent_cli.update_cmd_fleet_unit_budget')
sys.modules[__name__] = _current
