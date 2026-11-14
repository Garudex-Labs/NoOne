"""Legacy import boundary; implementation lives in agent_cli.update_receipt.

Retained for shipped updater/plugin compatibility, sharing the canonical module.
"""
from importlib import import_module
import sys

from agent_cli.update_receipt import (
    COMMAND_BOUNDARY_STOP_REASON,
    _profile_homes,
    _socket_identity,
    begin_update_receipt,
    collect_fleet_versions,
    finalize_update_receipt,
    print_fleet_version_matrix,
    read_latest_receipt,
    record_gateway_restart,
    record_step,
)

_current = import_module('agent_cli.update_receipt')
sys.modules[__name__] = _current
