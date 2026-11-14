"""Legacy import boundary; implementation lives in agent_cli.update_inventory.

Retained for shipped updater/plugin compatibility, sharing the canonical module.
"""
from importlib import import_module
import sys

from agent_cli.update_inventory import (
    collect_runtime_inventory,
    match_runtime_outcomes,
    print_update_plan,
    record_plan_in_receipt,
    report_unaccounted_runtimes,
)

_current = import_module('agent_cli.update_inventory')
sys.modules[__name__] = _current
