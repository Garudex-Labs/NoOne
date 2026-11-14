"""Legacy import boundary; implementation lives in agent_cli.update_channel.

Retained for shipped updater/plugin compatibility, sharing the canonical module.
"""
from importlib import import_module
import sys

from agent_cli.update_channel import (
    CHANNEL_STABLE,
    handle_metadata_args,
    resolve_update_channel,
)

_current = import_module('agent_cli.update_channel')
sys.modules[__name__] = _current
