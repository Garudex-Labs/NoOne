"""Legacy import boundary; implementation lives in agent_cli.sqlite_safe_read.

Retained for shipped updater/plugin compatibility, sharing the canonical module.
"""
from importlib import import_module
import sys

from agent_cli.sqlite_safe_read import (
    LiveConnectionError,
    has_live_connection,
    offline_file_access,
    read_header_bytes_preopen,
)

_current = import_module('agent_cli.sqlite_safe_read')
sys.modules[__name__] = _current
