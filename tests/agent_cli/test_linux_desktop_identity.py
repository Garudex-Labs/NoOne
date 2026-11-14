"""Desktop label rendering is safe even when the helper is staged outside agent_cli."""

import shutil
import subprocess
import sys
from pathlib import Path

import pytest

from agent_cli import linux_desktop_entry
from agent_cli.application_identity import DEFAULT_APP_NAME


def test_desktop_labels_are_literal_and_do_not_change_launch_identity():
    name = '星 [red] "Nova" \\ team'
    text = linux_desktop_entry.render_desktop_entry('/trusted/launcher --desktop', 'icon', app_name=name)
    assert 'Name=星 [red] "Nova" \\\\ team\n' in text
    assert f"StartupWMClass={linux_desktop_entry.APP_ID}\n" in text
    assert 'Exec=/trusted/launcher --desktop\n' in text
    assert 'Icon=icon\n' in text
    assert 'Name=Agent\n' in linux_desktop_entry.render_desktop_entry('launcher', 'icon')


@pytest.mark.parametrize('name', ['', '\n', 'safe\ninjected', 'bad\x00name', 'bad\u2028name', 'x' * 129, 42])
def test_invalid_label_cannot_inject_desktop_fields(name):
    with pytest.raises(ValueError):
        linux_desktop_entry.render_desktop_entry('launcher', 'icon', app_name=name)


def test_staged_helper_and_canonical_json_work_with_stdlib_only(tmp_path):
    shutil.copy2(linux_desktop_entry.__file__, tmp_path / 'linux_desktop_entry.py')
    identity = Path(__file__).resolve().parents[2] / 'agent_cli/data/application_identity.json'
    shutil.copy2(identity, tmp_path / 'identity.json')
    script = """import json,sys
sys.path.insert(0, sys.argv[1])
from linux_desktop_entry import render_desktop_entry
with open(sys.argv[1]+'/identity.json', encoding='utf-8-sig') as source:
    name=json.load(source)['default_name']
print(render_desktop_entry('launcher','icon',app_name=name))
"""
    result = subprocess.run([sys.executable, '-I', '-S', '-c', script, str(tmp_path)],
                            capture_output=True, text=True, check=True, timeout=15)
    assert f'Name={DEFAULT_APP_NAME}\n' in result.stdout
