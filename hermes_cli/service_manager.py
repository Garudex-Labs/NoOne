"""Legacy import boundary; implementation lives in agent_cli.service_manager.

Retained for shipped updater/plugin compatibility, sharing the canonical module.
"""
from importlib import import_module
import sys

from agent_cli.service_manager import (
    detect_service_manager,
)

_current = import_module('agent_cli.service_manager')
sys.modules[__name__] = _current
