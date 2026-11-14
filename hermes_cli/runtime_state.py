"""Legacy import boundary; implementation lives in agent_cli.runtime_state.

Retained for shipped updater/plugin compatibility, sharing the canonical module.
"""
from importlib import import_module
import sys

from agent_cli.runtime_state import (
    _atomic_bytes,
    _bytes,
    _digest,
    _lock,
    collect_generations,
    finish_publication,
    recover_publication,
    runtime_lock,
)

_current = import_module('agent_cli.runtime_state')
sys.modules[__name__] = _current
