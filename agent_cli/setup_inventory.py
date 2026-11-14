"""Local provider-readiness inventory shared by setup and graphical clients."""
from __future__ import annotations

from dataclasses import asdict, dataclass, field
import threading
import time
import sys

from agent_constants import agent_home_key, get_agent_home, profile_name_for_home


SETUP_READY_WAIT_SECONDS = 8.0
SETUP_READY_EVENT = "setup.ready"


@dataclass(frozen=True)
class SetupRecord:
    provider_configured: bool
    inference_provider: str
    error: str = ""
    finished_at: float = field(default_factory=time.time)

    def as_payload(self) -> dict:
        return asdict(self)


_lock = threading.Lock()
_records: dict[str, SetupRecord] = {}
_events: dict[str, threading.Event] = {}


def provider_configured(*, strict_profile_scope: bool = False) -> bool:
    from agent_cli.main import _has_any_provider_configured
    from agent_cli.auth import AuthError, resolve_provider

    configured = bool(_has_any_provider_configured(strict_profile_scope=strict_profile_scope))
    if configured or strict_profile_scope or profile_name_for_home(get_agent_home()) not in (None, "default"):
        return configured
    # The independent default-profile AWS chain may use a host IAM role without an API key.
    try:
        return resolve_provider("auto") == "bedrock"
    except AuthError:
        return False


def current_record() -> SetupRecord | None:
    with _lock:
        return _records.get(agent_home_key())


def wait_for_record(timeout: float = SETUP_READY_WAIT_SECONDS) -> SetupRecord | None:
    with _lock:
        event = _events.get(agent_home_key())
    if event is not None:
        event.wait(timeout)
    return current_record()


def refresh_record(*, announce: bool = True) -> SetupRecord:
    """Inventory configured credentials; never create an account or start inference."""
    from agent_cli.auth import AuthError, resolve_provider

    configured = provider_configured()
    provider = ""
    error = ""
    if configured:
        try:
            provider = resolve_provider("auto")
        except AuthError as exc:
            configured = False
            error = str(exc)
    record = SetupRecord(configured, provider, error)
    with _lock:
        key = agent_home_key()
        _records[key] = record
        event = _events.get(key)
    if event is not None:
        event.set()
    if announce:
        server = sys.modules.get("agent_backend.server")
        broadcast = getattr(server, "_broadcast_global_event", None)
        if broadcast is not None:
            broadcast(SETUP_READY_EVENT, record.as_payload())
    return record


def start_background_inventory() -> threading.Thread | None:
    with _lock:
        key = agent_home_key()
        if key in _events:
            return None
        event = _events[key] = threading.Event()
    from agent.memory_provider import spawn_context_thread

    def inventory() -> None:
        try:
            refresh_record()
        finally:
            event.set()

    thread = spawn_context_thread(inventory, name="setup-inventory")
    thread.start()
    return thread
