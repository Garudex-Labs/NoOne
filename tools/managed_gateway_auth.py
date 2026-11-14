"""First-party gateway bearer trust, ported from connectors-only 43608084f4."""

import logging
from typing import Callable, Optional
from urllib.parse import urlsplit

from tools.managed_tool_gateway import build_vendor_gateway_url

logger = logging.getLogger(__name__)


def managed_gateway_origin() -> str:
    """Origin for on-origin managed vendors and media uploads."""
    return build_vendor_gateway_url("tool")


def connector_gateway_origin() -> str:
    """Separate connector deployment; honors CONNECTOR_GATEWAY_URL."""
    return build_vendor_gateway_url("connector")




def managed_gateway_auth_headers(
    url: object,
    gateway_builder: Optional[Callable[[str], str]] = None,
    token_reader: Optional[Callable[[], Optional[str]]] = None,
) -> dict:
    """Live auth headers for a managed gateway URL, or ``{}`` when not managed.

    Read fresh on every call rather than cached: a Nous access token expires
    within the hour, and a long session would otherwise keep presenting a dead
    bearer. Returns ``{}`` rather than raising when no token is available, so a
    caller can report "sign in" instead of sending an unauthenticated request.
    """
    if not is_managed_nous_gateway_url(url, gateway_builder):
        return {}

    resolved_token_reader = token_reader or read_nous_access_token
    try:
        token = resolved_token_reader()
    except Exception as exc:  # pragma: no cover — defensive
        logger.debug("Managed gateway token read failed for %s: %s", url, exc)
        return {}
    if not isinstance(token, str) or not token.strip():
        return {}

    from tools.managed_gateway_identity import user_agent

    return {"Authorization": f"Bearer {token.strip()}", "User-Agent": user_agent()}
