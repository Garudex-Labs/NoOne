"""Legacy import boundary; implementation lives in agent_cli.model_catalog.

Retained for shipped updater/plugin compatibility, sharing the canonical module.
"""
from importlib import import_module
import sys

from agent_cli.model_catalog import (
    seed_cache_from_checkout,
)

_current = import_module('agent_cli.model_catalog')
sys.modules[__name__] = _current
