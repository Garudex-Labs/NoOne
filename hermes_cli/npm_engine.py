"""Legacy import boundary; implementation lives in agent_cli.npm_engine.

Retained for shipped updater/plugin compatibility, sharing the canonical module.
"""
from importlib import import_module
import sys

from agent_cli.npm_engine import (
    maybe_repair_npm_engine,
)

_current = import_module('agent_cli.npm_engine')
sys.modules[__name__] = _current
