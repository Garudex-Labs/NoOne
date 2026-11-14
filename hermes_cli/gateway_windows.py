"""Legacy import boundary; implementation lives in agent_cli.gateway_windows.

Retained for shipped updater/plugin compatibility, sharing the canonical module.
"""
from importlib import import_module
import sys

from agent_cli.gateway_windows import (
    _consume_start_attestation,
    _live_gateway_pids,
    _report_gateway_start,
    _spawn_detached,
    _wait_for_gateway_ready,
    _write_start_attestation,
    _write_task_script,
    attested_death_generation,
    get_task_name,
    is_installed,
    is_task_registered,
    reconcile_autostart_launchers,
    reconcile_scheduled_task,
)

_current = import_module('agent_cli.gateway_windows')
sys.modules[__name__] = _current
