"""Legacy import boundary; implementation lives in agent_cli.backup.

Retained for shipped updater/plugin compatibility, sharing the canonical module.
"""
from importlib import import_module
import sys

from agent_cli.backup import (
    _foreign_db_holder_pids,
    _quick_snapshot_root,
    _sibling_profile_homes,
    create_pre_update_snapshots_all_profiles,
    create_quick_snapshot,
    restore_config_model_settings_all_profiles,
    restore_config_model_settings_if_rewritten,
    restore_cron_jobs_all_profiles,
    restore_cron_jobs_if_emptied,
    verify_sqlite_integrity,
)

_current = import_module('agent_cli.backup')
sys.modules[__name__] = _current
