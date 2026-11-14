"""Identity normalization preserves executable changes and one-to-one ratchet ownership."""

from scripts.code_health.gitio import Change
from scripts.code_health.identity_names import canonical_python, pair_moves


def test_identifier_normalization_does_not_change_literals_or_control_flow():
    source = 'def f():\n    if enabled:\n        return get_hermes_home(), "get_hermes_home", "Hermes Agent"\n'
    result = canonical_python(source)
    assert 'return get_agent_home(), "get_hermes_home", "Hermes Agent"' in result
    assert result.count("\n") == source.count("\n")
    assert "if enabled:" in result
    assert canonical_python(result) == result


def test_retained_alias_does_not_duplicate_the_original_baseline():
    changes = [Change("M", "hermes_state.py", "hermes_state.py"), Change("A", None, "agent_state.py")]
    assert pair_moves(changes) == [Change("R", "hermes_state.py", "agent_state.py"), Change("A", None, "hermes_state.py")]
