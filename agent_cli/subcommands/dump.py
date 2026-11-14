"""``hermes dump`` subcommand parser."""

from __future__ import annotations
from agent_cli.application_identity import app_text
from typing import Callable


def build_dump_parser(subparsers, *, cmd_dump: Callable) -> None:
    """Attach the ``dump`` subcommand to ``subparsers``."""
    dump_parser = subparsers.add_parser(
        "dump", help="Dump setup summary for support/debugging",
        description=app_text("Output a compact, plain-text summary of your {app_name} setup "
        "that can be copy-pasted into Discord/GitHub for support context", argparse_text=True))
    dump_parser.add_argument(
        "--show-keys", action="store_true",
        help="Show redacted API key prefixes (first/last 4 chars) instead of just set/not set")
    dump_parser.set_defaults(func=cmd_dump)
