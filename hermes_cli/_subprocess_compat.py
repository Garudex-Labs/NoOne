"""Legacy import boundary; implementation lives in agent_cli._subprocess_compat.

Retained for shipped updater/plugin compatibility, sharing the canonical module.
"""
from importlib import import_module
import sys

from agent_cli._subprocess_compat import (
    bounded_probe_run,
    kill_process_tree,
    noninteractive_git_env,
    pid_is_hermes,
    run,
    split_command_line,
    windows_detach_flags_without_breakaway,
    windows_detach_popen_kwargs,
    windows_hide_flags,
)

_current = import_module('agent_cli._subprocess_compat')
sys.modules[__name__] = _current
