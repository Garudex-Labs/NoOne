"""Legacy import boundary; implementation lives in agent_cli.observability.shared_metrics_update.

Retained for shipped updater/plugin compatibility, sharing the canonical module.
"""
from importlib import import_module
import sys

from agent_cli.observability.shared_metrics_update import (
    record_update_receipt,
)

_current = import_module('agent_cli.observability.shared_metrics_update')
sys.modules[__name__] = _current
