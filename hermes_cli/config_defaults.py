"""Legacy import boundary; implementation lives in agent_cli.config_defaults.

Retained for shipped updater/plugin compatibility, sharing the canonical module.
"""
from importlib import import_module
import sys

from agent_cli.config_defaults import (
    DEFAULT_CONFIG,
    OPTIONAL_ENV_VARS,
)

_current = import_module('agent_cli.config_defaults')
sys.modules[__name__] = _current
