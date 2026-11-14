"""Compare identity-only moves under their canonical names without waiving any debt."""
from __future__ import annotations

import io
import json
from pathlib import Path
import tokenize

_DATA = Path(__file__).with_name("identity_moves.json")
_DATA_VALUE = json.loads(_DATA.read_text(encoding="utf-8-sig"))
_MOVES = {old: new for group in _DATA_VALUE.values()
          for old, new in group.items()}


def canonical_path(path: str) -> str:
    """Declared filesystem moves, not substring guesses or a new baseline allowance."""
    parts = _DATA_VALUE["path_components"]
    return "/".join(parts.get(part, part) for part in path.split("/"))


def pair_moves(changes):
    """Unstaged renames still compare with their original file, including retained shims."""
    from scripts.code_health.gitio import Change

    added = {c.new: c for c in changes if c.old is None and c.new}
    replaced = set()
    result = []
    for change in changes:
        moved = canonical_path(change.old) if change.old else None
        if moved != change.old and moved in added:
            result.append(Change("R", change.old, moved))
            replaced.add(moved)
            if change.new:
                result.append(Change("A", None, change.new))
        else:
            result.append(change)
    return [c for c in result if c.old is not None or c.new not in replaced]


def canonical_python(text: str) -> str:
    """Normalize only identifier tokens; literals, operators, branches and line counts survive."""
    tokens = tokenize.generate_tokens(io.StringIO(text).readline)
    try:
        normalized = [token._replace(string=_MOVES.get(token.string, token.string))
                      if token.type == tokenize.NAME else token for token in tokens]
    except (tokenize.TokenError, IndentationError):
        return text  # The ordinary measurer reports malformed source.
    return tokenize.untokenize(normalized)
