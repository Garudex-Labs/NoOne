"""The owning profile's resolved skin for a canonical client's readiness.

Main's TUI booted its theme from ``gateway.ready.skin`` (``agent_backend/entry.py`` / ``ws.py``, both
``change_watcher.resolve_skin()``). On the session authority the client publishes its own ready after
``runtime.describe``, so the describe reply carries the same payload, resolved for the profile that
owns this authority (``display.skin`` and ``<home>/skins/*.yaml`` are per profile).
"""
from __future__ import annotations

import logging

logger = logging.getLogger(__name__)


def resolved_skin() -> dict:
    """``resolve_skin()``'s dict for the profile in scope (the dispatcher's ``owner_scope``); ``{}``
    when the skin engine fails, which the client treats as the default theme, as main did."""
    try:
        from agent_cli.config_effective import load_user_config_effective
        from agent_cli.skin_engine import get_active_skin, init_skin_from_config
        from agent_constants import get_agent_home
        from agent_cli.application_identity import app_text, get_app_name
        config = load_user_config_effective(get_agent_home() / "config.yaml")
        init_skin_from_config(config)
        skin = get_active_skin()
        return {
            "name": skin.name, "colors": skin.colors,
            "app_name": get_app_name(config),
            "light_colors": skin.light_colors, "dark_colors": skin.dark_colors,
            "branding": {key: app_text(value, config) for key, value in skin.branding.items()},
            "branding_templates": {key: value for key, value in skin.branding.items()
                                   if isinstance(value, str) and "{app_name}" in value},
            "banner_logo": skin.banner_logo,
            "banner_hero": skin.banner_hero, "tool_prefix": skin.tool_prefix,
            "help_header": (skin.branding or {}).get("help_header", ""),
            "customCSS": skin.custom_css}
    except Exception:  # health: allow BLE001 -- main's resolve_skin: a broken skin boots the default theme
        logger.debug("runtime.describe: skin resolution failed", exc_info=True)
        return {}
