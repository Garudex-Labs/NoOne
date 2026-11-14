"""Legacy published submodule; implementation: agent_cli.main_dashboard."""
from importlib import import_module
import sys
sys.modules[__name__] = import_module('agent_cli.main_dashboard')
