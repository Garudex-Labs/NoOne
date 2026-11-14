"""Legacy published submodule; implementation: agent_cli.managed_scope."""
from importlib import import_module
import sys
sys.modules[__name__] = import_module('agent_cli.managed_scope')
