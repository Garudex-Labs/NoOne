"""Legacy import boundary; implementation lives in agent_cli.setup.

Retained for shipped updater/plugin compatibility, sharing the canonical module.
"""
from importlib import import_module
import sys

from agent_cli.setup import (
    prompt,
    prompt_choice,
    prompt_yes_no,
)

_current = import_module('agent_cli.setup')
sys.modules[__name__] = _current
