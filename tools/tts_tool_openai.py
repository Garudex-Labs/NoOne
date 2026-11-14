"""OpenAI-compatible TTS backends for ``tools.tts_tool``: OpenAI and DeepInfra.

Also owns the managed-gateway (Nous portal ``openai-audio`` proxy) route selection that
decides where the OpenAI client points. Seams defined on the origin module (``_load_tts_config``,
``_import_openai_client``, ``_resolve_provider_key``, ``_generate_openai_tts``) are resolved
through :func:`_origin` at call time.
"""

from __future__ import annotations

import logging
import uuid
from typing import Any, Dict, Optional
from urllib.parse import urljoin

from tools.tool_backend_helpers import read_selection, resolve_openai_audio_api_key, selection_error
from tools.tts_tool_delivery import _origin, _section
from tools.tts_tool_providers import _tts_response_format_from_path

logger = logging.getLogger("tools.tts_tool")

DEFAULT_OPENAI_MODEL = "gpt-4o-mini-tts"
# Speech models the managed Nous audio gateway serves (it bills a model only when NAS has a priced
# rule for it, so anything else fails closed). Others are coerced to DEFAULT_OPENAI_MODEL.
DEFAULT_OPENAI_VOICE = "alloy"
DEFAULT_OPENAI_BASE_URL = "https://api.openai.com/v1"
# DeepInfra base URL is resolved via agent_cli.models.deepinfra_base_url (shared).
DEFAULT_DEEPINFRA_TTS_VOICE = "default"




def _resolve_openai_audio_client_config() -> tuple[str, str]:
    """Resolve locally configured or independent OpenAI-compatible TTS credentials."""
    config = _section(_origin()._load_tts_config(), "openai")
    selected = read_selection("tts")
    base_url = config.get("base_url") or DEFAULT_OPENAI_BASE_URL
    api_key = config.get("api_key") or resolve_openai_audio_api_key()
    if not api_key:
        from tools.transcription_cloud import _is_local_or_private_url
        if config.get("base_url") and _is_local_or_private_url(base_url):
            api_key = "not-needed"
    if not api_key:
        raise ValueError(selection_error("tts", selected or "openai", "set tts.openai.api_key, VOICE_TOOLS_OPENAI_KEY, or OPENAI_API_KEY, or configure a local OpenAI-compatible endpoint"))
    return api_key, base_url


def _has_openai_audio_backend() -> bool:
    """Return True when the selected OpenAI audio route is usable."""
    try:
        _resolve_openai_audio_client_config()
        return True
    except ValueError:
        return False


def _openai_extra_body(oai_config: dict[str, Any]) -> dict[str, Any]:
    """Optional ``tts.openai`` fields OpenAI-compatible servers read from the JSON body: ``language``
    (sent as ``lang_code``) and ``consent_attestation`` (cloned voices). Unset keys are omitted so
    the official API and strict servers never see unknown fields."""
    extra_body: dict[str, Any] = {}
    if oai_config.get("language"):
        extra_body["lang_code"] = oai_config["language"]
    if oai_config.get("consent_attestation"):
        extra_body["consent_attestation"] = oai_config["consent_attestation"]
    return extra_body


def _is_response_format_rejection(exc: Exception) -> bool:
    """True when a speech.create() error is a backend rejecting response_format.

    Several self-hosted OpenAI-compatible speech servers (Speaches/Kokoro,
    etc.) implement only ``mp3``/``wav``/``flac``/``pcm`` and 4xx a request for
    ``response_format="opus"`` outright — ``{"type": "literal_error", "loc":
    ["body", "response_format"], ...}`` with HTTP 400/422 — before any audio
    bytes exist. The post-synthesis ``_repair_ogg_container`` hook only helps
    backends that *ignore* the parameter and write playable bytes; a rejection
    never reaches it. This predicate is intentionally narrow so unrelated
    4xx errors still propagate.
    """
    status = getattr(exc, "status_code", None)
    if status not in (400, 422):
        return False
    return "response_format" in str(exc)


def _openai_speech_create_with_format_fallback(client, create_kwargs: dict[str, Any]):
    """Call ``audio.speech.create``; on an *opus* rejection, retry mp3.

    Native opus is always requested first (from a ``.ogg`` target), so backends
    that support it are unaffected. When the backend rejects opus, we retry
    exactly once as ``mp3`` — a format the OpenAI speech API contract
    guarantees — and let the downstream ``_repair_ogg_container`` step transcode
    those mp3 bytes into a real Ogg/Opus container. The retry carries a fresh
    idempotency key because it is a distinct request.

    The fallback is deliberately limited to ``opus``: ``_repair_ogg_container``
    only rewrites ``.ogg`` outputs, so retrying a rejected ``wav``/``flac``/
    ``pcm`` request as mp3 would leave mp3 bytes mislabeled under the requested
    extension. Those rejections propagate unchanged (#73470 review).
    """
    try:
        return client.audio.speech.create(**create_kwargs)
    except Exception as exc:
        requested = create_kwargs.get("response_format")
        if requested != "opus" or not _is_response_format_rejection(exc):
            raise
        logger.warning(
            "TTS backend rejected response_format=%r — retrying as 'mp3' "
            "(the .ogg container is rebuilt post-synthesis).",
            requested,
        )
        retry_kwargs = dict(create_kwargs, response_format="mp3")
        retry_kwargs["extra_headers"] = {"x-idempotency-key": str(uuid.uuid4())}
        return client.audio.speech.create(**retry_kwargs)


def _generate_openai_tts(
    text: str, output_path: str, tts_config: dict[str, Any], *, api_key: Optional[str] = None,
    base_url: Optional[str] = None, model: Optional[str] = None, voice: Optional[str] = None,
    speed: Optional[float] = None, instructions: Optional[str] = None) -> str:
    """Generate audio via the OpenAI ``audio.speech.create`` SDK shape.

    Explicit kwargs let OpenAI-compatible backends (DeepInfra) supply credentials/model/voice
    and skip the managed-gateway resolution; otherwise the OpenAI auth chain and ``tts.openai``
    (speed falling back to ``tts.speed``) apply. ``instructions`` is forwarded only when truthy
    so ``tts-1`` and strict OpenAI-compatible servers that reject unknown kwargs are unaffected."""
    fallback_base: Optional[str] = None
    if api_key is None:
        api_key, fallback_base = _resolve_openai_audio_client_config()
    oai_config = _section(tts_config, "openai")
    if model is None:
        model = oai_config.get("model", DEFAULT_OPENAI_MODEL)
    if voice is None:
        voice = oai_config.get("voice", DEFAULT_OPENAI_VOICE)
    config_base_url = oai_config.get("base_url")
    if base_url is None:  # config override beats the auth-chain fallback; explicit arg wins
        base_url = config_base_url or fallback_base or DEFAULT_OPENAI_BASE_URL
    if speed is None:
        speed_default = tts_config.get("speed", 1.0) if isinstance(tts_config, dict) else 1.0
        speed = float(oai_config.get("speed", speed_default))
    # The managed gateway only serves MANAGED_OPENAI_TTS_MODELS; coerce any other model
    # unless the user redirected base_url to their own endpoint.
    create_kwargs: dict[str, Any] = {
        "model": model, "voice": voice, "input": text,
        "response_format": _tts_response_format_from_path(output_path),
        "extra_headers": {"x-idempotency-key": str(uuid.uuid4())}}
    if speed != 1.0:
        create_kwargs["speed"] = max(0.25, min(4.0, speed))
    if instructions:
        create_kwargs["instructions"] = instructions
    if extra_body := _openai_extra_body(oai_config):
        create_kwargs["extra_body"] = extra_body
    client = _origin()._import_openai_client()(api_key=api_key, base_url=base_url)
    try:
        _openai_speech_create_with_format_fallback(client, create_kwargs).stream_to_file(output_path)
        return output_path
    finally:
        close = getattr(client, "close", None)
        if callable(close):
            close()


def _generate_deepinfra_tts(text: str, output_path: str, tts_config: dict[str, Any]) -> str:
    """Resolve DeepInfra credentials/model (live ``agent_cli.models`` catalog, no hardcoded ids), then
    delegate to the OpenAI-compatible handler."""
    api_key = _origin()._resolve_provider_key("DEEPINFRA_API_KEY", "deepinfra")
    if not api_key:
        raise ValueError("DEEPINFRA_API_KEY not set. Run `noone setup` to configure, or set the env var directly.")
    di_config = _section(tts_config, "deepinfra")
    from agent_cli.models import deepinfra_base_url, deepinfra_model_ids
    model = di_config.get("model")
    if not isinstance(model, str) or not model.strip():
        candidates = deepinfra_model_ids("tts")
        if not candidates:
            raise ValueError(
                "No DeepInfra TTS model available. Pin one in config.yaml "
                "under tts.deepinfra.model, or check connectivity to "
                "api.deepinfra.com so the live catalog can be fetched.")
        model = candidates[0]
    return _origin()._generate_openai_tts(
        text, output_path, tts_config, api_key=api_key, base_url=deepinfra_base_url(di_config),
        model=model, voice=di_config.get("voice", DEFAULT_DEEPINFRA_TTS_VOICE),
        speed=float(di_config.get("speed", tts_config.get("speed", 1.0))))
