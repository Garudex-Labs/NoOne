"""Legacy import boundary; implementation lives in agent_cli.steward.

Retained for shipped updater/plugin compatibility, sharing the canonical module.
"""
from importlib import import_module
import sys

from agent_cli.steward import (
    STEWARD_DESKTOP,
    read_install_stamp,
)

_current = import_module('agent_cli.steward')
sys.modules[__name__] = _current
