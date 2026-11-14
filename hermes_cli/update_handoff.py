"""Legacy import boundary; implementation lives in agent_cli.update_handoff.

Retained for shipped updater/plugin compatibility, sharing the canonical module.
"""
from importlib import import_module
import sys

from agent_cli.update_handoff import (
    POST_SWAP_ENV,
    continue_update_in_fresh_interpreter,
    is_post_swap_child,
    post_swap_child_env,
    post_swap_command,
    post_swap_python,
    read_handoff,
    write_handoff,
)

_current = import_module('agent_cli.update_handoff')
sys.modules[__name__] = _current
