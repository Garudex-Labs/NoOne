"""Legacy import boundary; implementation lives in agent_cli.urllib_security.

Retained for shipped updater/plugin compatibility, sharing the canonical module.
"""
from importlib import import_module
import sys

from agent_cli.urllib_security import (
    open_credentialed_url,
    url_origin,
)

_current = import_module('agent_cli.urllib_security')
sys.modules[__name__] = _current
