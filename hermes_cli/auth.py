"""Legacy import boundary; implementation lives in agent_cli.auth.

Retained for shipped updater/plugin compatibility, sharing the canonical module.
"""
from importlib import import_module
import sys

from agent_cli.auth import (
    resolve_external_process_provider_credentials,
)

_current = import_module('agent_cli.auth')
sys.modules[__name__] = _current
