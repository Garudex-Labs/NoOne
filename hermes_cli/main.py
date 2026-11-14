"""Legacy import boundary; implementation lives in agent_cli.main.

Retained for shipped updater/plugin compatibility, sharing the canonical module.
"""
from importlib import import_module
import sys

from agent_cli.main import (
    PROJECT_ROOT,
    ShimQuarantineError,
    _BYTECODE_FINGERPRINT_FILE,
    _UPDATE_REEXEC_ENV,
    _desktop_dist_exists,
    _desktop_packaged_executable,
    _desktop_stamp_path,
    _detect_broken_lazy_refresh_imports,
    _detect_venv_python_processes,
    _expected_windows_pe_machines,
    _hermes_exe_shims,
    _insert_python_pin,
    _interpreter_scripts_dir,
    _is_termux_startup_environment,
    _is_windows,
    _load_installable_optional_extras,
    _parse_pe_machine,
    _quarantine_running_hermes_exe,
    _read_git_revision_fingerprint,
    _repair_broken_lazy_refresh_imports,
    _resolve_install_target_python,
    _resolve_node_runtime_npm,
    _restore_quarantined_exes,
    _run_install_with_heartbeat,
    _run_npm_install_deterministic,
    _run_package_only_install,
    _run_quarantined_install,
    _run_with_idle_timeout,
    _self,
    _update_marker_path,
    _venv_scripts_dir,
    _verify_console_scripts_installed,
    _verify_core_dependencies_installed,
    _web_ui_build_needed,
    _windows_native_machine,
    _windows_shim_in_process_chain,
    _write_web_ui_build_stamp,
)

_current = import_module('agent_cli.main')
sys.modules[__name__] = _current

if __name__ == "__main__":
    _current.main()
