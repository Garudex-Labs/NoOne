"""Legacy import boundary; implementation lives in agent_constants.

Retained for shipped updater/plugin compatibility, sharing the canonical module.
"""
from importlib import import_module
import sys

from agent_constants import (
    FIRST_PARTY_MODULE_ROOTS,
    _get_platform_default_hermes_home,
    apply_subprocess_home_env,
    assert_named_profile_home_live,
    display_agent_home as display_hermes_home,
    find_node_executable,
    get_default_agent_root as get_default_hermes_root,
    get_agent_home as get_hermes_home,
    get_agent_home_override as get_hermes_home_override,
    get_process_agent_home as get_process_hermes_home,
    get_real_home,
    get_subprocess_home,
    agent_home_key as hermes_home_key,
    hermes_managed_node_tree_present,
    is_container,
    is_wsl,
    iter_agent_node_dirs as iter_hermes_node_dirs,
    profile_name_for_home,
    project_venv_dir,
    reset_agent_home_override as reset_hermes_home_override,
    set_agent_home_override as set_hermes_home_override,
    sudo_invoker_default_home,
    venv_bin_dir,
    venv_python_path,
    with_agent_node_path as with_hermes_node_path,
)

_current = import_module('agent_constants')
sys.modules[__name__] = _current

_current.get_hermes_home = get_hermes_home

_current.get_process_hermes_home = get_process_hermes_home

_current.set_hermes_home_override = set_hermes_home_override

_current.reset_hermes_home_override = reset_hermes_home_override

_current.get_hermes_home_override = get_hermes_home_override

_current.get_default_hermes_root = get_default_hermes_root

_current.display_hermes_home = display_hermes_home

_current.hermes_home_key = hermes_home_key

_current.iter_hermes_node_dirs = iter_hermes_node_dirs

_current.with_hermes_node_path = with_hermes_node_path
