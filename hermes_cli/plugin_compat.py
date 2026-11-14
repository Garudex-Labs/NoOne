"""Legacy import boundary; implementation lives in agent_cli.plugin_compat.

Retained for shipped updater/plugin compatibility, sharing the canonical module.
"""
from importlib import import_module
import sys

from agent_cli.plugin_compat import (
    compat_report,
    removal_in_effect,
    summary_lines,
)

_current = import_module('agent_cli.plugin_compat')
sys.modules[__name__] = _current
