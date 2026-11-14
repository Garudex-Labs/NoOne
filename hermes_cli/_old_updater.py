"""Legacy import boundary; implementation lives in agent_cli._old_updater.

Retained for shipped updater/plugin compatibility, sharing the canonical module.
"""
from importlib import import_module
import sys

from agent_cli._old_updater import (
    stop_for_relaunch,
)

_current = import_module('agent_cli._old_updater')
sys.modules[__name__] = _current
