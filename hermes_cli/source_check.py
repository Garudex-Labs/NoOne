"""Legacy import boundary; implementation lives in agent_cli.source_check.

Retained for shipped updater/plugin compatibility, sharing the canonical module.
"""
from importlib import import_module
import sys

from agent_cli.source_check import (
    _github_compare_behind,
    source_git_env,
)

_current = import_module('agent_cli.source_check')
sys.modules[__name__] = _current
