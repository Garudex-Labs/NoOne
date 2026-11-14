"""Legacy import boundary; implementation lives in agent_cli.runtime_paths.

Retained for shipped updater/plugin compatibility, sharing the canonical module.
"""
from importlib import import_module
import sys

from agent_cli.runtime_paths import (
    activation_environment,
    dependency_home_root,
    install_state_dir,
    runtime_facts_path,
    selected_venv,
    site_packages,
    store_root,
)

_current = import_module('agent_cli.runtime_paths')
sys.modules[__name__] = _current
