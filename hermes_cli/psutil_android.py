"""Legacy import boundary; implementation lives in agent_cli.psutil_android.

Retained for shipped updater/plugin compatibility, sharing the canonical module.
"""
from importlib import import_module
import sys

from agent_cli.psutil_android import (
    PSUTIL_URL,
    prepare_patched_psutil_sdist,
)

_current = import_module('agent_cli.psutil_android')
sys.modules[__name__] = _current
