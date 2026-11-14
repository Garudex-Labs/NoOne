"""Legacy import boundary; implementation lives in agent_cli.git_credentials.

Retained for shipped updater/plugin compatibility, sharing the canonical module.
"""
from importlib import import_module
import sys

from agent_cli.git_credentials import (
    with_git_auth,
)

_current = import_module('agent_cli.git_credentials')
sys.modules[__name__] = _current
