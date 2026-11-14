"""``noone status`` subcommand parser."""

from __future__ import annotations
from agent_cli.application_identity import app_text
from typing import Callable


def build_status_parser(subparsers, *, cmd_status: Callable) -> None:
    """Attach the ``status`` subcommand to ``subparsers``."""
    status_parser = subparsers.add_parser(
        "status", help="Show status of all components",
        description=app_text("Display status of {app_name} components", argparse_text=True))
    status_parser.add_argument(
        "--full", "--all", dest="full", action="store_true",
        help="Show every section (keys redacted) instead of the one-screen summary")
    status_parser.add_argument(
        "--deep", action="store_true", help="Run deep checks (implies --full; may take longer)")
    status_parser.set_defaults(func=cmd_status)
