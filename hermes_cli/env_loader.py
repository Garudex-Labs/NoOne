"""Legacy import boundary; implementation lives in agent_cli.env_loader.

Retained for shipped updater/plugin compatibility, sharing the canonical module.
"""
from importlib import import_module
import sys

from agent_cli.env_loader import (
    hydrate_profile_secret_sources,
)

_current = import_module('agent_cli.env_loader')
sys.modules[__name__] = _current
