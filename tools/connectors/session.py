"""Stable local session identity for connection operations across compression."""


def operation_session_key(session_id: str | None) -> str:
    from gateway.session_context import get_session_env

    return get_session_env("HERMES_SESSION_KEY", "") or str(session_id or "")
