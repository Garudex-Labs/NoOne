"""Legacy import boundary; implementation lives in agent_cli.gateway_migrate.

Retained for shipped updater/plugin compatibility, sharing the canonical module.
"""
from importlib import import_module
import sys

from agent_cli.gateway_migrate import (
    maybe_auto_migrate_after_update,
)

_current = import_module('agent_cli.gateway_migrate')
sys.modules[__name__] = _current
