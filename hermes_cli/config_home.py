"""Legacy import boundary; implementation lives in agent_cli.config_home.

Retained for shipped updater/plugin compatibility, sharing the canonical module.
"""
from importlib import import_module
import sys

from agent_cli.config_home import (
    initialize_home,
)

_current = import_module('agent_cli.config_home')
sys.modules[__name__] = _current
