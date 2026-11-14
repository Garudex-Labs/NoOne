"""Legacy import boundary; implementation lives in agent_cli.fs_utils.

Retained for shipped updater/plugin compatibility, sharing the canonical module.
"""
from importlib import import_module
import sys

from agent_cli.fs_utils import (
    rmtree_force,
)

_current = import_module('agent_cli.fs_utils')
sys.modules[__name__] = _current
