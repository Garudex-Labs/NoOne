"""Legacy import boundary; implementation lives in agent_cli.config_backups.

Retained for shipped updater/plugin compatibility, sharing the canonical module.
"""
from importlib import import_module
import sys

from agent_cli.config_backups import (
    backup_config,
    load_newest_good_backup,
)

_current = import_module('agent_cli.config_backups')
sys.modules[__name__] = _current
