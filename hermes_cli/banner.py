"""Legacy import boundary; implementation lives in agent_cli.banner.

Retained for shipped updater/plugin compatibility, sharing the canonical module.
"""
from importlib import import_module
import sys

from agent_cli.banner import (
    _check_via_pypi,
    _github_compare_behind,
    check_via_pypi,
)

_current = import_module('agent_cli.banner')
sys.modules[__name__] = _current
