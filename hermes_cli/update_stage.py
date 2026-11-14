"""Legacy import boundary; implementation lives in agent_cli.update_stage.

Retained for shipped updater/plugin compatibility, sharing the canonical module.
"""
from importlib import import_module
import sys

from agent_cli.update_stage import (
    publish_stage,
)

_current = import_module('agent_cli.update_stage')
sys.modules[__name__] = _current
