"""``hermes console`` subcommand parser."""

from __future__ import annotations
from agent_cli.application_identity import app_text
from typing import Callable


def build_console_parser(subparsers, *, cmd_console: Callable) -> None:
    """Attach the safe Hermes Console REPL subcommand."""
    console_parser = subparsers.add_parser(
        "console", help=app_text("Open the safe {app_name} command console", percent_format=True),
        description=app_text("Open a curated {app_name} command REPL. This is not a raw shell and "
            "does not expose the full {app_name} CLI.", argparse_text=True))
    console_parser.set_defaults(func=cmd_console)
