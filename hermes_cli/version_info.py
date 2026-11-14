"""Legacy import boundary; implementation lives in agent_cli.version_info.

Retained for shipped updater/plugin compatibility, sharing the canonical module.
"""
from importlib import import_module
import sys

from agent_cli.version_info import (
    get_code_identity,
    read_checkout_sha,
)

_current = import_module('agent_cli.version_info')
sys.modules[__name__] = _current
