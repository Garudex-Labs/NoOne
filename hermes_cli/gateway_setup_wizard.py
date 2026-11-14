"""Legacy import boundary; implementation lives in agent_cli.gateway_setup_wizard.

Retained for shipped updater/plugin compatibility, sharing the canonical module.
"""
from importlib import import_module
import sys

from agent_cli.gateway_setup_wizard import (
    confirm_reconfigure,
    offer_home_channel,
    print_setup_header,
    prompt_csv,
    save_env_values,
)

_current = import_module('agent_cli.gateway_setup_wizard')
sys.modules[__name__] = _current
