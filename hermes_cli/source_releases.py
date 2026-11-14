"""Legacy import boundary; implementation lives in agent_cli.source_releases.

Retained for shipped updater/plugin compatibility, sharing the canonical module.
"""
from importlib import import_module
import sys

from agent_cli.source_releases import (
    resolve_source_release,
    source_repository,
)

_current = import_module('agent_cli.source_releases')
sys.modules[__name__] = _current
