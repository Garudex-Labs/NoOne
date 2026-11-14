"""Shared chat startup steps for the CLI and hosted web services."""

import os
import contextlib

def _bypass_chat_launch(args) -> bool:
    """Bypass profile customizations for an explicit isolated launch."""
    return bool(getattr(args, "safe_mode", False) or getattr(args, "ignore_user_config", False))


def _pin_kanban_board_env() -> None:
    """Pin the active kanban board into ``HERMES_KANBAN_BOARD`` so in-process tools and shelled-out
    ``noone kanban`` calls agree even if a concurrent ``boards switch`` flips the file mid-turn.

    Without this, in-process tools (``kanban_*``) and shelled-out CLI calls (``noone kanban …``) resolve
    the board on different paths: the env-pin if set, otherwise the global ``<root>/kanban/current`` file. A
    concurrent ``noone kanban boards switch`` from another session can flip the file mid-turn, so the same
    chat sees its tool calls hit board A while its shell calls hit board B (#20074). Pinning at chat boot
    mirrors what the dispatcher already does for spawned workers.
    """
    if os.environ.get("HERMES_KANBAN_BOARD"):
        return
    with contextlib.suppress(Exception):
        from agent_cli.kanban_db import get_current_board
        os.environ["HERMES_KANBAN_BOARD"] = get_current_board()


def _sync_bundled_skills_quietly() -> None:
    """Seed ``~/.hermes/skills/`` with the bundled library (idempotent, milliseconds when synced).
    Failures are swallowed: skills are an enhancement, not a hard dependency."""
    with contextlib.suppress(Exception):
        from tools.skills_sync import sync_skills
        sync_skills(quiet=True)
