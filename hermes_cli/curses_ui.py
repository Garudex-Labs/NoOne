"""Legacy import boundary; implementation lives in agent_cli.curses_ui.

Retained for shipped updater/plugin compatibility, sharing the canonical module.
"""
from importlib import import_module
import sys

from agent_cli.curses_ui import (
    curses_radiolist,
)

_current = import_module('agent_cli.curses_ui')
sys.modules[__name__] = _current
