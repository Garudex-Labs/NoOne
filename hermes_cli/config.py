"""Legacy import boundary; implementation lives in agent_cli.config.

Retained for shipped updater/plugin compatibility, sharing the canonical module.
"""
from importlib import import_module
import sys

from agent_cli.config import (
    TERMINAL_CONFIG_ENV_MAP,
    _EXTRA_ENV_KEYS,
    _ensure_default_soul_md,
    _greedy_literal_match,
    _parse_env_value,
    _secure_dir,
    _set_nested,
    _split_key_path,
    _terminal_env_value,
    _write_user_config,
    check_config_version,
    detect_install_method,
    fast_safe_load,
    format_docker_update_message,
    format_unsupported_install_warning,
    get_config_path,
    get_env_path,
    get_agent_home as get_hermes_home,
    get_managed_system,
    get_missing_config_fields,
    get_missing_env_vars,
    is_managed,
    is_nix_install_method,
    is_unsupported_install_method,
    is_uv_tool_install,
    load_config,
    managed_error,
    migrate_config,
    read_user_config_raw,
    recommended_update_command,
    recommended_update_command_for_method,
    require_readable_config_before_write,
    save_config,
)

_current = import_module('agent_cli.config')
sys.modules[__name__] = _current

_current.get_hermes_home = get_hermes_home
