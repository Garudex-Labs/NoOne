"""Legacy import boundary; implementation lives in agent_cli.backup_restore.

Retained for shipped updater/plugin compatibility, sharing the canonical module.
"""
from importlib import import_module
import sys

from agent_cli.backup_restore import (
    _foreign_db_holder_pids,
)

_current = import_module('agent_cli.backup_restore')
sys.modules[__name__] = _current
