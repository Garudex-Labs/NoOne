"""Generic managed-tool gateway helpers for Nous-hosted vendor passthroughs."""

from __future__ import annotations

import json
import logging
import os
from dataclasses import dataclass
from typing import Callable, Optional

from agent_constants import get_agent_home

logger = logging.getLogger(__name__)

_DEFAULT_TOOL_GATEWAY_DOMAIN = "nousresearch.com"
_DEFAULT_TOOL_GATEWAY_SCHEME = "https"


@dataclass(frozen=True)
class ManagedToolGatewayConfig:
    vendor: str
    gateway_origin: str
    managed_mode: bool


def _clean(value: object) -> Optional[str]:
    """*value* stripped when it is a non-blank string, else None."""
    return value.strip() if isinstance(value, str) and value.strip() else None


def auth_json_path():
    """Return the Hermes auth store path, respecting HERMES_HOME overrides."""
    return get_agent_home() / "auth.json"




def _read_user_token_override() -> Optional[str]:
    """Read the TOOL_GATEWAY_USER_TOKEN override through the secret scope. Scope verdict is authoritative
    when installed (a scoped miss must NOT borrow the process env under multiplex); ``os.environ`` only
    when unscoped. Any non-UnscopedSecretError failure propagates -- a failed scoped read must never
    silently borrow the ambient env."""
    from agent.secret_scope import UnscopedSecretError, get_secret

    try:
        explicit = get_secret("TOOL_GATEWAY_USER_TOKEN")
    except UnscopedSecretError:
        explicit = os.getenv("TOOL_GATEWAY_USER_TOKEN")
    return _clean(explicit)






def _replace_dead_guest_token(dead_state: dict, code: str = "anon_credential_dead") -> Optional[str]:
    from agent_cli.anon_auth import ANON_ACCOUNT_LOCKED, clear_dead_guest, ensure_portal_identity

    clear_dead_guest(code, dead_token=dead_state.get("anon_token"))
    # Same rule as inference: a locked account is retired but never silently replaced.
    if code == ANON_ACCOUNT_LOCKED:
        return None
    try:
        if ensure_portal_identity(explicit=True) is None:
            return None
        return _clean(resolve_nous_access_token(refresh_skew_seconds=_NOUS_ACCESS_TOKEN_REFRESH_SKEW_SECONDS))
    except Exception as exc:
        logger.debug("Nous free tier replacement after a retired credential failed: %s", exc)
        return None


def get_tool_gateway_scheme() -> str:
    """Return configured shared gateway URL scheme."""
    scheme = os.getenv("TOOL_GATEWAY_SCHEME", "").strip().lower() or _DEFAULT_TOOL_GATEWAY_SCHEME
    if scheme not in {"http", "https"}:
        raise ValueError("TOOL_GATEWAY_SCHEME must be 'http' or 'https'")
    return scheme


def build_vendor_gateway_url(vendor: str) -> str:
    """Return the gateway origin for a specific vendor."""
    if explicit_vendor_url := os.getenv(f"{vendor.upper().replace('-', '_')}_GATEWAY_URL", "").strip().rstrip("/"):
        return explicit_vendor_url
    shared_domain = os.getenv("TOOL_GATEWAY_DOMAIN", "").strip().strip("/") or _DEFAULT_TOOL_GATEWAY_DOMAIN
    return f"{get_tool_gateway_scheme()}://{vendor}-gateway.{shared_domain}"


def _vendor_gateway(vendor: str, gateway_builder, token_reader) -> Optional[ManagedToolGatewayConfig]:
    gateway_origin = (gateway_builder or build_vendor_gateway_url)(vendor)
    if not gateway_origin or not nous_user_token:
        return None
    return ManagedToolGatewayConfig(vendor=vendor, gateway_origin=gateway_origin, nous_user_token=nous_user_token, managed_mode=True)


def resolve_managed_tool_gateway(
    vendor: str, gateway_builder: Optional[Callable[[str], str]] = None,
    token_reader: Optional[Callable[[], Optional[str]]] = None) -> Optional[ManagedToolGatewayConfig]:
    """Resolve shared managed-tool gateway config for a vendor (entitled accounts only)."""
    if not managed_nous_tools_enabled():
        return None
    return _vendor_gateway(vendor, gateway_builder, token_reader)


def resolve_free_search_gateway(token_reader: Optional[Callable[[], Optional[str]]] = None) -> Optional[ManagedToolGatewayConfig]:
    """Perplexity ``search_type: "fast"`` is served to every Nous identity with no funding check, the
    anonymous guest tier included, so it needs a token this profile may use (guest-disabled and refresh
    rules live in the reader), not paid entitlement or a registered account. Search only: every other
    vendor route goes through :func:`resolve_managed_tool_gateway`."""
    return _vendor_gateway("perplexity", None, token_reader)


def is_managed_tool_gateway_ready(
    vendor: str, gateway_builder: Optional[Callable[[str], str]] = None,
    token_reader: Optional[Callable[[], Optional[str]]] = None) -> bool:
    """True when a gateway URL and a likely-usable Nous token are present. Defaults to
    :func:`peek_nous_access_token` (no OAuth refresh); callers about to make a real request use
    :func:`resolve_managed_tool_gateway` instead."""
    return resolve_managed_tool_gateway(vendor, gateway_builder=gateway_builder, token_reader=token_reader or peek_nous_access_token) is not None
