"""Legacy import boundary; implementation lives in agent_cli.sizefmt.

Retained for shipped updater/plugin compatibility, sharing the canonical module.
"""
from importlib import import_module
import sys

from agent_cli.sizefmt import (
    format_bytes,
)

_current = import_module('agent_cli.sizefmt')
sys.modules[__name__] = _current
