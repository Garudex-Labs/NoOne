from __future__ import annotations

import os
from pathlib import Path
import subprocess
import sys


def test_platform_modules_only_import_stdlib_and_hermes_platform() -> None:
    root = Path(__file__).resolve().parents[2]
    code = """
import sys
before = set(sys.modules)
import agent_platform.host.facts
import agent_platform.host.gpu_adapters
import agent_platform.host.runtime
import agent_platform.host.products
import agent_platform.host.summary
import agent_platform.declaration
import agent_platform.resolver
import agent_platform.resolver.app
import agent_platform.resolver.availability
import agent_platform.resolver.known_dirs
new_top_levels = {name.partition('.')[0] for name in set(sys.modules) - before}
unexpected = sorted(
    name
    for name in new_top_levels
    if name not in sys.stdlib_module_names and not name.startswith('agent_platform')
)
assert not unexpected, unexpected
"""
    env = os.environ.copy()
    env["PYTHONPATH"] = "."

    subprocess.run(
        [sys.executable, "-c", code],
        cwd=root,
        env=env,
        check=True,
    )
