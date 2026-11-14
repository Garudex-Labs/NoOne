"""Tests for the standalone Mattermost sender."""

import asyncio
import os
from types import SimpleNamespace
from unittest.mock import AsyncMock, MagicMock, patch

# ``_send_mattermost`` moved into the mattermost plugin
# (``plugins/platforms/mattermost/adapter.py::_standalone_send``).  Keep a
# thin ``(token, extra, chat_id, message)``-shaped wrapper so existing test
# bodies continue to work without rewriting every signature.
from plugins.platforms.mattermost.adapter import (
    _standalone_send as _mattermost_standalone_send,
)


async def _send_mattermost(token, extra, chat_id, message):
    """Pre-migration ``(token, extra, chat_id, message)`` shim around the
    plugin's ``_standalone_send(pconfig, chat_id, message)``.
    """
    pconfig = SimpleNamespace(token=token, extra=extra or {})
    return await _mattermost_standalone_send(pconfig, chat_id, message)


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------


def _make_aiohttp_resp(status, json_data=None, text_data=None):
    """Build a minimal async-context-manager mock for an aiohttp response."""
    resp = AsyncMock()
    resp.status = status
    resp.json = AsyncMock(return_value=json_data or {})
    resp.text = AsyncMock(return_value=text_data or "")
    return resp


def _make_aiohttp_session(resp):
    """Wrap a response mock in a session mock that supports async-with for post/put."""
    request_ctx = MagicMock()
    request_ctx.__aenter__ = AsyncMock(return_value=resp)
    request_ctx.__aexit__ = AsyncMock(return_value=False)

    session = MagicMock()
    session.post = MagicMock(return_value=request_ctx)
    session.put = MagicMock(return_value=request_ctx)

    session_ctx = MagicMock()
    session_ctx.__aenter__ = AsyncMock(return_value=session)
    session_ctx.__aexit__ = AsyncMock(return_value=False)
    return session_ctx, session


# ---------------------------------------------------------------------------
# _send_mattermost
# ---------------------------------------------------------------------------


class TestSendMattermost:
    def test_success(self):
        resp = _make_aiohttp_resp(201, json_data={"id": "post123"})
        session_ctx, session = _make_aiohttp_session(resp)

        with patch("aiohttp.ClientSession", return_value=session_ctx), \
             patch.dict(os.environ, {"MATTERMOST_URL": "", "MATTERMOST_TOKEN": ""}, clear=False):
            extra = {"url": "https://mm.example.com"}
            result = asyncio.run(_send_mattermost("tok-abc", extra, "channel1", "hello"))

        assert result == {"success": True, "platform": "mattermost", "chat_id": "channel1", "message_id": "post123"}
        session.post.assert_called_once()
        call_kwargs = session.post.call_args
        assert call_kwargs[0][0] == "https://mm.example.com/api/v4/posts"
        assert call_kwargs[1]["headers"]["Authorization"] == "Bearer tok-abc"
        assert call_kwargs[1]["json"] == {"channel_id": "channel1", "message": "hello"}


    def test_env_var_fallback(self):
        resp = _make_aiohttp_resp(200, json_data={"id": "p99"})
        session_ctx, session = _make_aiohttp_session(resp)

        with patch("aiohttp.ClientSession", return_value=session_ctx), \
             patch.dict(os.environ, {"MATTERMOST_URL": "https://mm.env.com", "MATTERMOST_TOKEN": "env-tok"}, clear=False):
            result = asyncio.run(_send_mattermost("", {}, "ch", "hi"))

        assert result["success"] is True
        call_kwargs = session.post.call_args
        assert "https://mm.env.com" in call_kwargs[0][0]
        assert call_kwargs[1]["headers"]["Authorization"] == "Bearer env-tok"
