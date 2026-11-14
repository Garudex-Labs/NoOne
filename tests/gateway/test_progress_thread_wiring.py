"""Progress wiring remains available independently of native Slack task cards."""

from types import SimpleNamespace

import pytest

from gateway.config import Platform, PlatformConfig
from gateway.run import GatewayRunner
from gateway.session import SessionSource


@pytest.mark.parametrize(
    "platform,thread_id,prospective_thread_id,native_cards,expected_reply",
    [
        (Platform.TELEGRAM, None, None, False, None),
        (Platform.DISCORD, None, None, False, None),
        (Platform.SLACK, None, None, False, None),
        (Platform.MATTERMOST, None, None, False, None),
        (Platform.WEIXIN, None, None, False, None),
        (Platform.SLACK, None, None, True, None),
        (Platform.MATTERMOST, "thread-1", None, False, "message-1"),
        (Platform.DISCORD, None, "prospective-1", False, "message-1"),
    ],
)
def test_progress_thread_wiring_without_native_card_dependency(
    platform, thread_id, prospective_thread_id, native_cards, expected_reply,
):
    runner = object.__new__(GatewayRunner)
    adapter = SimpleNamespace(config=PlatformConfig(extra={"reply_in_thread": True}))
    runner._delivery_adapter_for = lambda source: adapter
    source = SessionSource(
        platform=platform,
        chat_id="chat-1",
        chat_type="group",
        user_id="user-1",
        thread_id=thread_id,
        prospective_thread_id=prospective_thread_id,
        delivered_via_upstream_relay=prospective_thread_id is not None,
    )

    _metadata, reply_to, status_metadata = runner._run_agent_progress_threading(
        source, "message-1", native_cards,
    )

    assert reply_to == expected_reply
    if thread_id:
        assert status_metadata["thread_id"] == thread_id
    if prospective_thread_id:
        assert status_metadata["reply_to_message_id"] == "message-1"
