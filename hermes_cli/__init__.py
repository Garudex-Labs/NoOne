"""Legacy import boundary for shipped updaters and published plugin imports.

Primary implementation: agent_cli. Do not add behavior here.
"""
from importlib import import_module

_current = import_module('agent_cli')
__version__ = _current.__version__


def __getattr__(name):
    return getattr(_current, name)
