"""Legacy import boundary; implementation lives in agent_cli.auth_model_picker.

Retained for shipped updater/plugin compatibility, sharing the canonical module.
"""
from importlib import import_module
import sys

from agent_cli.auth_model_picker import (
    prompt_model_selection,
)

_current = import_module('agent_cli.auth_model_picker')
sys.modules[__name__] = _current
