"""Legacy import boundary; implementation lives in agent_cli.update_cmd_maint.

Retained for shipped updater/plugin compatibility, sharing the canonical module.
"""
from importlib import import_module
import sys

from agent_cli.update_cmd_maint import (
    _prepare_updated_checkout,
    _print_bundled_skills_sync_report,
    _print_verified_update_completion,
    _refresh_dashboard_after_update,
    _sweep_bytecode_after_update,
    _update_complete_message,
)

_current = import_module('agent_cli.update_cmd_maint')
sys.modules[__name__] = _current
