"""Legacy import boundary; implementation lives in agent_cli.update_cmd_drain_report.

Retained for shipped updater/plugin compatibility, sharing the canonical module.
"""
from importlib import import_module
import sys

from agent_cli.update_cmd_drain_report import (
    drain_progress_reporter,
)

_current = import_module('agent_cli.update_cmd_drain_report')
sys.modules[__name__] = _current
