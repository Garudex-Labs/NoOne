"""``hermes security`` subcommand parser."""

from __future__ import annotations
from agent_cli.application_identity import app_text
from typing import Callable

from agent_cli.subcommands._shared import add_json_flag


def build_security_parser(subparsers, *, cmd_security: Callable) -> None:
    """Attach the ``security`` subcommand to ``subparsers``."""
    security_parser = subparsers.add_parser(
        "security", help="Supply-chain audit (OSV.dev) for venv, plugins, and MCP servers",
        description=app_text("On-demand vulnerability scan against OSV.dev. Covers the {app_name} "
            "venv (installed PyPI dists), Python deps declared by plugins under "
            "~/.hermes/plugins/, and pinned npx/uvx MCP servers in config.yaml. "
            "Does NOT scan globally-installed packages or editor/browser extensions.", argparse_text=True))
    security_subparsers = security_parser.add_subparsers(
        dest="security_command", metavar="<subcommand>")

    audit_parser = security_subparsers.add_parser(
        "audit", help="Run a one-shot supply-chain audit",
        description="Query OSV.dev for known vulnerabilities in installed components.")
    add_json_flag(audit_parser, "Emit machine-readable JSON instead of human-readable text")
    audit_parser.add_argument(
        "--fail-on", default="critical", choices=["low", "moderate", "high", "critical"],
        help="Exit non-zero when any finding meets this severity (default: critical)")
    audit_parser.add_argument(
        "--skip-venv", action="store_true", help=app_text("Skip scanning the {app_name} Python venv", percent_format=True))
    audit_parser.add_argument(
        "--skip-plugins", action="store_true", help="Skip scanning plugin requirements files")
    audit_parser.add_argument(
        "--skip-mcp", action="store_true", help="Skip scanning pinned MCP servers in config.yaml")
    audit_parser.set_defaults(func=cmd_security)
    security_parser.set_defaults(func=cmd_security)
