"""Legacy import boundary for shipped updaters and published plugin imports.

Primary implementation: agent_platform. Do not add behavior here.
"""
from importlib import import_module

_current = import_module('agent_platform')


def __getattr__(name):
    return getattr(_current, name)
