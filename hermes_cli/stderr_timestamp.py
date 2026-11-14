"""Legacy installed service entry; implementation: agent_cli.stderr_timestamp."""
from importlib import import_module
import sys

_current = import_module("agent_cli.stderr_timestamp")
sys.modules[__name__] = _current

if __name__ == "__main__":
    raise SystemExit(_current.main())
