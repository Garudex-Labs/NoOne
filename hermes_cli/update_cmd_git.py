"""Legacy import boundary; implementation lives in agent_cli.update_cmd_git.

Retained for shipped updater/plugin compatibility, sharing the canonical module.
"""
from importlib import import_module
import sys

from agent_cli.update_cmd_git import (
    _git_run,
)

_current = import_module('agent_cli.update_cmd_git')
sys.modules[__name__] = _current
