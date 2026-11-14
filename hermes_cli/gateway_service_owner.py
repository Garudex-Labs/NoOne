"""Legacy import boundary; implementation lives in agent_cli.gateway_service_owner.

Retained for shipped updater/plugin compatibility, sharing the canonical module.
"""
from importlib import import_module
import sys

from agent_cli.gateway_service_owner import (
    definition_belongs_to_home,
)

_current = import_module('agent_cli.gateway_service_owner')
sys.modules[__name__] = _current
