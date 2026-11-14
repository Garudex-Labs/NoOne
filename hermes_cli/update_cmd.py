"""Legacy import boundary; implementation lives in agent_cli.update_cmd.

Retained for shipped updater/plugin compatibility, sharing the canonical module.
"""
from importlib import import_module
import sys

from agent_cli.update_cmd import (
    _UPDATE_CRITICAL_MODULES,
    _abort_recovery_is_complete,
    _add_upstream_remote,
    _branch_head_suffix,
    _capture_head_sha,
    _check_and_apply_config_migration,
    _cmd_update_check,
    _cmd_update_impl,
    _complete_source_update,
    _count_commits_between,
    _critical_module_import_failures,
    _current_checkout_sha,
    _desktop_owns_gateway_lifecycle,
    _ensure_uv_for_termux,
    _ensure_venv_pip,
    _finish_dashboard_update_cleanup,
    _gateway_prompt,
    _gateway_recovery_partition,
    _git_run,
    _git_untracked_paths,
    _has_upstream_remote,
    _locate_real_git,
    _m,
    _mark_skip_upstream_prompt,
    _migrate_sibling_profile_configs,
    _no_prompt_git_kwargs,
    _path_uid,
    _pip_install_prefix,
    _post_update_sqlite_runtime_status,
    _print_bundled_skills_sync_report,
    _print_curator_first_run_notice,
    _print_curator_recent_run_notice,
    _print_update_summary,
    _read_project_version,
    _rebuild_desktop_after_update,
    _record_update_step,
    _recover_gateway_restart_after_abort,
    _refuse_gateway_ancestor_tree_kill,
    _refuse_update_for_contended_shims,
    _reload_config_modules,
    _reload_process_scan_modules,
    _restore_windows_gateway_service,
    _restored_python_paths,
    _run_config_check_fresh,
    _run_migrate_config_fresh,
    _run_pending_fleet_restart,
    _shim_quarantine_error_type,
    _should_skip_upstream_prompt,
    _start_windows_gateway_service,
    _stop_windows_gateway_service,
    _surviving_pre_update_serve_runtimes,
    _sweep_bytecode_after_update,
    _update_complete_message,
    _update_node_dependencies,
    _validate_critical_modules_import,
    _validate_python_files_syntax,
    _verify_and_restore_state_dbs_post_update,
    _warn_stale_serve_runtimes,
    _write_gateway_update_exit_code,
    _write_lazy_refresh_incomplete_marker,
    _write_update_incomplete_marker,
    get_default_agent_root as get_default_hermes_root,
    get_agent_home as get_hermes_home,
)

_current = import_module('agent_cli.update_cmd')
sys.modules[__name__] = _current

_current.get_hermes_home = get_hermes_home

_current.get_default_hermes_root = get_default_hermes_root
