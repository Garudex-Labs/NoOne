"""Legacy installed launcher/service import; implementation: agent_bootstrap."""
from importlib import import_module
import sys
sys.modules[__name__] = import_module('agent_bootstrap')
