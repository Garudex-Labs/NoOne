"""Legacy import boundary; implementation lives in agent_cli.gateway.

Retained for shipped updater/plugin compatibility, sharing the canonical module.
"""
from importlib import import_module
import sys

from agent_cli.gateway import (
    GATEWAY_FATAL_CONFIG_EXIT_CODE,
    GATEWAY_LOOP_WEDGED,
    GATEWAY_RESTART_WATCHER_TIMEOUT_S,
    PROJECT_ROOT,
    _SYSTEM_UNIT_DIR,
    _capture_gateway_argv,
    _ensure_user_systemd_env,
    _escalate_wedged_gateway,
    _find_legacy_hermes_units,
    _get_restart_drain_timeout,
    _get_service_pids,
    _graceful_restart_via_sigusr1,
    _is_pid_ancestor_of_current_process,
    _launchctl_bootstrap,
    _launchd_kickstart,
    _launchd_service_registered,
    _locate_launchd_gateway_service,
    _prepare_profile_gateway_update_restart,
    _profile_arg,
    _profile_suffix,
    _request_gateway_self_restart,
    _wait_for_gateway_exit,
    _wait_for_launchd_service_pid,
    find_gateway_pids,
    find_profile_gateway_processes,
    find_windows_gateway_services,
    get_launchd_label,
    get_launchd_plist_path,
    get_python_path,
    has_legacy_hermes_units,
    is_macos,
    is_windows,
    kill_gateway_processes,
    launch_detached_gateway_restart_by_cmdline,
    launch_detached_profile_gateway_restart,
    launchd_gateway_labels_for_install,
    launchd_restart,
    legacy_launchd_labels_for_install,
    probe_gateway_loop_liveness,
    refresh_systemd_unit_if_needed,
    supports_systemd_services,
    user_systemd_unit_dir,
    wait_for_launchd_gateway_supervision,
)

_current = import_module('agent_cli.gateway')
sys.modules[__name__] = _current
