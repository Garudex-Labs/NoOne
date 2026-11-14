"""Browser Use cloud browser provider — the only backend with dual auth: direct
``BROWSER_USE_API_KEY`` (https://browser-use.com) or the managed Nous tool gateway (bills to a
Nous subscription). Direct first, managed second, unless ``tool_gateway.browser: gateway`` flips
it. Config: ``browser.cloud_provider: "browser-use"``."""

from __future__ import annotations

import logging
import threading
import uuid
from typing import Any, Dict, Optional

import requests

from agent.secret_scope import get_secret
from plugins.browser._common import CloudBrowserProvider

logger = logging.getLogger(__name__)

# Managed-mode create idempotency keys: the gateway answers retried POSTs with 409 "already in
# progress", so the original key is forwarded; cleared on success or terminal failure.

_BASE_URL = "https://api.browser-use.com/api/v3"








class BrowserUseBrowserProvider(CloudBrowserProvider):
    """Browser Use (https://browser-use.com) cloud browser backend."""

    provider_id = "browser-use"
    label = "Browser Use"
    release_method = "patch"
    release_path = "/browsers/{session_id}"
    # Hidden from the picker; stays registered for the Nous gateway path and legacy cloud_provider
    # configs.
    setup_tag = None

    def is_available(self) -> bool:
        return self._get_config_or_none() is not None

    def _get_config_or_none(self) -> Optional[dict[str, Any]]:
        from tools.tool_backend_helpers import read_selection
        read_selection("browser")
        api_key = get_secret("BROWSER_USE_API_KEY")
        return {"api_key": api_key, "base_url": _BASE_URL} if api_key else None

    def _get_config(self) -> dict[str, Any]:
        config = self._get_config_or_none()
        if config is None:
            raise ValueError("Browser Use requires your own BROWSER_USE_API_KEY credential.")
        return config

    def _headers(self, config: dict[str, Any]) -> dict[str, str]:
        return {"Content-Type": "application/json", "X-Browser-Use-API-Key": config["api_key"]}

    def _release_body(self, config: dict[str, Any]) -> dict[str, object]:
        return {"action": "stop"}

    def create_session(self, task_id: str) -> dict[str, object]:
        config = self._get_config()
        response = self._post_create(f"{config['base_url']}/browsers", self._headers(config), {}, wrap_errors=True)
        self._check_created(response)
        data = response.json()
        return {
            "session_name": self._session_name(task_id), "bb_session_id": data["id"],
            "cdp_url": data.get("cdpUrl") or data.get("connectUrl") or "",
            "expires_at": data.get("timeoutAt"), "features": {"browser_use": True},
        }
