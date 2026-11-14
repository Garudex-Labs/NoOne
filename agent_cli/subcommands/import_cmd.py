"""``noone import`` subcommand parser."""

from __future__ import annotations
from agent_cli.application_identity import app_text
from typing import Callable


def build_import_cmd_parser(subparsers, *, cmd_import: Callable) -> None:
    """Attach the ``import`` subcommand to ``subparsers``."""
    import_parser = subparsers.add_parser(
        "import", help=app_text("Restore a {app_name} backup from a zip file", percent_format=True),
        description=app_text("Extract a previously created {app_name} backup into your "
        "{app_name} home directory, restoring configuration, skills, "
        "sessions, and data", argparse_text=True))
    import_parser.add_argument("zipfile", help="Path to the backup zip file")
    import_parser.add_argument(
        "--force", "-f", action="store_true", help="Overwrite existing files without confirmation")
    import_parser.set_defaults(func=cmd_import)
