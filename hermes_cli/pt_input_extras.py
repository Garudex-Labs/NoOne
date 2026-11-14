"""Legacy import boundary; implementation lives in agent_cli.pt_input_extras.

Retained for shipped updater/plugin compatibility, sharing the canonical module.
"""
from importlib import import_module
import sys

from agent_cli.pt_input_extras import (
    install_modify_other_keys_aliases,
)

_current = import_module('agent_cli.pt_input_extras')
sys.modules[__name__] = _current
