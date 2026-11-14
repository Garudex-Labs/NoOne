"""Legacy import boundary; implementation lives in agent_cli.update_fleet_scope.

Retained for shipped updater/plugin compatibility, sharing the canonical module.
"""
from importlib import import_module
import sys

from agent_cli.update_fleet_scope import (
    announce_skipped_runtime,
    describe_skipped_runtime,
    gateway_pid_home,
    home_in_update_scope,
    launchd_label_foreign_home,
    partition_gateway_pids_by_scope,
    systemd_unit_hermes_home,
)

_current = import_module('agent_cli.update_fleet_scope')
sys.modules[__name__] = _current
