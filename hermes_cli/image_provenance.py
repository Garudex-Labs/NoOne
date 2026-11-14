"""Legacy import boundary; implementation lives in agent_cli.image_provenance.

Retained for shipped updater/plugin compatibility, sharing the canonical module.
"""
from importlib import import_module
import sys

from agent_cli.image_provenance import (
    read_image_provenance,
)

_current = import_module('agent_cli.image_provenance')
sys.modules[__name__] = _current
