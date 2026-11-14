"""Interpreter selectors must not bypass gateway protection through launcher names."""

import pytest

from cron.lifecycle_guard import contains_gateway_lifecycle_command


@pytest.mark.parametrize("selector", ["python.*hermes", "python.*noone", "python.*noone.*", "python.*/venv/bin/hermes"])
def test_supported_launcher_selectors_cannot_stop_the_gateway(selector):
    assert contains_gateway_lifecycle_command(f"pkill -f '{selector}'")


@pytest.mark.parametrize("selector", ["python.*my_hermes_bot.py", "python.*noone-helper.py", "python.*hermes-polis/run.sh"])
def test_unrelated_script_selectors_remain_available(selector):
    assert not contains_gateway_lifecycle_command(f"pkill -f '{selector}'")
