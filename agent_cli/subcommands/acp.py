"""``hermes acp`` subcommand parser."""

from __future__ import annotations
from agent_cli.application_identity import app_text
from typing import Callable

from agent_cli.subcommands._shared import add_accept_hooks_flag


def build_acp_parser(subparsers, *, cmd_acp: Callable) -> None:
    """Attach the ``acp`` subcommand to ``subparsers``."""
    acp_parser = subparsers.add_parser(
        "acp", help=app_text("Run {app_name} as an ACP (Agent Client Protocol) server", percent_format=True),
        description=app_text("Start {app_name} in ACP mode for editor integration (VS Code, Zed, JetBrains)", argparse_text=True),
    )
    add_accept_hooks_flag(acp_parser)
    acp_parser.add_argument(
        "--version", action="store_true", dest="acp_version",
        help=app_text("Print {app_name} ACP version and exit", percent_format=True))
    acp_parser.add_argument(
        "--check", action="store_true",
        help="Verify ACP dependencies and adapter imports, then exit")
    acp_parser.add_argument(
        "--setup", action="store_true",
        help=app_text("Run interactive {app_name} provider/model setup for ACP terminal auth", percent_format=True))
    acp_parser.add_argument(
        "--setup-browser", action="store_true",
        help="Install PM's pinned Chromium for browser_exec (idempotent).")
    acp_parser.add_argument(
        "--yes", "-y", action="store_true", dest="assume_yes",
        help="Accept all prompts (used by --setup-browser to skip the "
             "~400 MB Chromium download confirmation).")
    acp_parser.set_defaults(func=cmd_acp)
