"""Application display identity; installation and protocol names are not branding.

The packaged JSON is shared with JavaScript and build tools. Configuration is
resolved at the call site, never held in process-global state across profiles.
"""

import json
import unicodedata
from collections.abc import Mapping
from contextvars import ContextVar
from pathlib import Path

DEFAULT_APP_NAME: str = json.loads(
    (Path(__file__).parent / "data" / "application_identity.json").read_text(encoding="utf-8-sig")
)["default_name"]
_resolving_name: ContextVar[bool] = ContextVar("resolving_application_name", default=False)


def normalize_app_name(value: object) -> str:
    """A display name is single-line text, not terminal control or markup."""
    if not isinstance(value, str):
        return DEFAULT_APP_NAME
    name = value.strip()
    if not name or len(name) > 128 or any(
        unicodedata.category(char) in {"Cc", "Cs"} or char in "\u2028\u2029"
        for char in name
    ):
        return DEFAULT_APP_NAME
    return name


def get_app_name(config: Mapping | None = None, *, home: str | Path | None = None) -> str:
    """Resolve the owning profile, or reuse an already-loaded startup snapshot."""
    if config is None:
        if home is not None:
            from agent_scope import current_scope
            scope = current_scope()
            if scope is None or scope.is_local:
                from agent.runtime_scope import bind_profile_scope
                with bind_profile_scope(home, hydrate_secrets=False):
                    return get_app_name()
        # Configuration diagnostics may themselves display the application name.
        # Keep a torn config or a failed boot import from recursively breaking them.
        if _resolving_name.get():
            return DEFAULT_APP_NAME
        token = _resolving_name.set(True)
        try:
            from agent_cli.config_effective import load_user_config_effective
            config = load_user_config_effective()
        except Exception:  # health: allow BLE001 -- cosmetic identity must not break startup/config diagnostics
            return DEFAULT_APP_NAME
        finally:
            _resolving_name.reset(token)
    display = config.get("display")
    return normalize_app_name(display.get("app_name") if isinstance(display, Mapping) else None)


def app_text(
    template: str, config: Mapping | None = None, *, markup: bool = False,
    percent_format: bool = False, argparse_text: bool = False,
) -> str:
    """Expand only an explicitly authored identity placeholder, once.

    User text, URLs and technical identifiers are never searched or rewritten.
    Other formatting placeholders (including braces in a custom name) survive.
    """
    if "{app_name}" not in template:
        return template
    name = get_app_name(config)
    if markup:
        from rich.markup import escape
        name = escape(name)
    if percent_format or (argparse_text and ("%(prog)" in template or "%(prog)" in name)):
        name = name.replace("%", "%%")
    return template.replace("{app_name}", name)
