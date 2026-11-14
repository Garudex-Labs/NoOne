"""Legacy import boundary; implementation lives in agent_cli.build_info.

Retained for shipped updater/plugin compatibility, sharing the canonical module.
"""
from importlib import import_module
import sys

from agent_cli.build_info import (
    get_code_identity,
)

_current = import_module('agent_cli.build_info')
sys.modules[__name__] = _current
