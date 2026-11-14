"""Legacy import boundary; implementation lives in agent_cli.auth_constants.

Retained for shipped updater/plugin compatibility, sharing the canonical module.
"""
from importlib import import_module
import sys

from agent_cli.auth_constants import (
    AuthError,
)

_current = import_module('agent_cli.auth_constants')
sys.modules[__name__] = _current
