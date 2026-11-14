"""Legacy import boundary; implementation lives in agent_cli.config_migrations.

Retained for shipped updater/plugin compatibility, sharing the canonical module.
"""
from importlib import import_module
import sys

from agent_cli.config_migrations import (
    SUPPORT_FLOOR_VERSION,
    run_migrations,
    support_floor_message,
)

_current = import_module('agent_cli.config_migrations')
sys.modules[__name__] = _current
