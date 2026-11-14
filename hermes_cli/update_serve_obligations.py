"""Legacy import boundary; implementation lives in agent_cli.update_serve_obligations.

Retained for shipped updater/plugin compatibility, sharing the canonical module.
"""
from importlib import import_module
import sys

from agent_cli.update_serve_obligations import (
    defer_manual_serve,
    retain_receipt_manual_serves,
    warn_pending_manual_serves,
)

_current = import_module('agent_cli.update_serve_obligations')
sys.modules[__name__] = _current
