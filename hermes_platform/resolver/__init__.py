"""Legacy import boundary for shipped updaters and published plugin imports.

Primary implementation: agent_platform.resolver. Do not add behavior here.
"""
from importlib import import_module

from agent_platform.resolver import locate_command

_current = import_module('agent_platform.resolver')


def __getattr__(name):
    return getattr(_current, name)
