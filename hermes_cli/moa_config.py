"""Legacy import boundary; implementation lives in agent_cli.moa_config.

Retained for shipped updater/plugin compatibility, sharing the canonical module.
"""
from importlib import import_module
import sys

from agent_cli.moa_config import (
    apply_user_moa_presets,
)

_current = import_module('agent_cli.moa_config')
sys.modules[__name__] = _current
