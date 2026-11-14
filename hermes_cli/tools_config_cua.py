"""Legacy import boundary; implementation lives in agent_cli.tools_config_cua.

Retained for shipped updater/plugin compatibility, sharing the canonical module.
"""
from importlib import import_module
import sys

from agent_cli.tools_config_cua import (
    install_cua_driver,
)

_current = import_module('agent_cli.tools_config_cua')
sys.modules[__name__] = _current
