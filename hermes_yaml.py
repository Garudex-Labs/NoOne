"""Legacy import boundary; implementation lives in agent_yaml.

Retained for shipped updater/plugin compatibility, sharing the canonical module.
"""
from importlib import import_module
import sys

from agent_yaml import (
    safe_dump,
    safe_load,
)

_current = import_module('agent_yaml')
sys.modules[__name__] = _current
