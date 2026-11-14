"""Legacy import boundary; implementation lives in agent_cli.plugins_updates.

Retained for shipped updater/plugin compatibility, sharing the canonical module.
"""
from importlib import import_module
import sys

from agent_cli.plugins_updates import (
    check_local_provenance,
    default_fetch,
    parse_feed_yml,
)

_current = import_module('agent_cli.plugins_updates')
sys.modules[__name__] = _current
