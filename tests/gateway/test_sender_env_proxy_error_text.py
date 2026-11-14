"""A send that fails through an env proxy (``HTTPS_PROXY`` / ``ALL_PROXY``) whose URL holds a secret
returns and logs only ``<ExceptionType> via <scheme://host:port | placeholder>``: requests, httpx,
aiohttp (``trust_env``) and websockets echo the malformed URL into their error text, and the send
result reaches the model, which may repeat it in chat.

Each case drives the real sender with the real transport against an unreachable proxy.
"""

import asyncio
import logging
import re
from types import SimpleNamespace
from urllib.parse import unquote

import pytest

from tests.gateway.test_proxy_error_text_not_logged import PASSWORDS, SHAPES

pytest.importorskip("aiohttp")

ENV_PROXY_VARS = ("HTTPS_PROXY", "HTTP_PROXY", "ALL_PROXY", "https_proxy", "http_proxy", "all_proxy")




def _google_chat(monkeypatch):
    pytest.importorskip("google.auth.transport.requests")
    from plugins.platforms.google_chat import adapter as gc

    monkeypatch.setattr(gc, "service_account", object())
    monkeypatch.setattr(gc, "_load_sa_credentials_from", lambda value: SimpleNamespace(refresh=lambda req: None, token="t"))
    return gc._standalone_send(SimpleNamespace(extra={"service_account_json": "{}"}), "spaces/AAA", "hi")


def _teams(monkeypatch):
    from plugins.platforms.teams import adapter as teams

    extra = {"client_id": "c", "client_secret": "s", "tenant_id": "t1"}
    return teams._standalone_send(SimpleNamespace(extra=extra), "19:abc@thread.v2", "hi")


def _weixin(monkeypatch):
    from plugins.platforms.weixin import adapter as wx

    if not wx.check_weixin_requirements():
        pytest.skip("weixin needs aiohttp + cryptography")
    extra = {"account_id": "acct", "send_chunk_retries": "0"}
    return wx._standalone_send(SimpleNamespace(extra=extra, token="tok"), "wxid_x", "hi")


def _line(monkeypatch):
    from plugins.platforms.line import adapter as line

    return line._standalone_send(SimpleNamespace(extra={"channel_access_token": "tok"}), "U123", "hi")








def _signal(monkeypatch):
    from plugins.platforms.signal import standalone as sig

    return sig.standalone_send(SimpleNamespace(extra={"http_url": "http://127.0.0.1:9", "account": "+15550000000"}),
                               "+15550000001", "hi")




async def _no_sleep(*_args, **_kwargs):
    return None


SENDERS = { "google_chat": _google_chat, "teams": _teams, "weixin": _weixin, "line": _line,
              "signal": _signal, }
CASES = [pytest.param(sender, shape.format(pw=pw), pw, id=f"{sender}|{pw}|{shape.split(':')[0]}")
         for sender in SENDERS for pw in PASSWORDS for shape in SHAPES]


@pytest.mark.parametrize("sender, proxy, password", CASES)
def test_env_proxy_send_failure_never_carries_the_proxy_secret(monkeypatch, caplog, sender, proxy, password):
    for name in ENV_PROXY_VARS:
        monkeypatch.setenv(name, proxy)
    for name in ("NO_PROXY", "no_proxy"):
        monkeypatch.delenv(name, raising=False)
    with caplog.at_level(logging.DEBUG):
        result = asyncio.run(asyncio.wait_for(SENDERS[sender](monkeypatch), 60))
    error = str(result.get("error") or "")
    # Hermes' own lines: httpcore's DEBUG trace prints ``socket_options=None`` (matches ``socks5``).
    logs = "\n".join(r.getMessage() for r in caplog.records if r.name.split(".")[0] in ("plugins", "gateway", "tools"))
    assert error, result
    # The exception type, on the proxy-error path (Signal's result after retries names only the batch).
    assert re.search(r"\b[A-Z]\w+ via ", error + "\n" + logs), (result, logs[-2000:])
    for text in (error, logs):
        pieces = {password[i:j] for i in range(len(password)) for j in range(i + 3, len(password) + 1)
                  if len(password[i:j].replace(" ", "")) >= 3}
        leaked = sorted(p for p in pieces if p in text or p in unquote(text))
        assert not leaked, (leaked, text[-2000:])


_SECRET = "http://bob:qzxqzxqzx@127.0.0.1:1"
_CLEAN = "http://127.0.0.1:2"
# Each sender's own API hosts: NO_PROXY naming them means the request went direct.
_TARGET_HOSTS = ("127.0.0.1,localhost,.weixin.qq.com,.line.me,"
                 ".googleapis.com,.botframework.com,.trafficmanager.net,.microsoftonline.com")
# Variables that disagree: the library may read the secret one whichever Hermes would have picked.
# A NO_PROXY naming the targets: httpx still parses every proxy variable when the client is built.
DISAGREEING = {"https_clean_http_secret": {"HTTPS_PROXY": _CLEAN, "HTTP_PROXY": _SECRET},
               "upper_clean_lower_secret": {"HTTPS_PROXY": _CLEAN, "HTTP_PROXY": _CLEAN,
                                            "https_proxy": _SECRET, "http_proxy": _SECRET},
               "secret_no_proxy_targets": {"HTTPS_PROXY": _SECRET, "HTTP_PROXY": _SECRET, "NO_PROXY": _TARGET_HOSTS}}
BYPASSED = {"no_proxy_star": "*", "no_proxy_targets": _TARGET_HOSTS}


def _send_under(monkeypatch, caplog, sender, env):
    for name in (*ENV_PROXY_VARS, "NO_PROXY", "no_proxy"):
        monkeypatch.delenv(name, raising=False)
    for name, value in env.items():
        monkeypatch.setenv(name, value)
    with caplog.at_level(logging.DEBUG):
        result = asyncio.run(asyncio.wait_for(SENDERS[sender](monkeypatch), 60))
    logs = "\n".join(r.getMessage() for r in caplog.records if r.name.split(".")[0] in ("plugins", "gateway", "tools"))
    return str(result.get("error") or ""), logs


@pytest.mark.parametrize("layout", DISAGREEING)
@pytest.mark.parametrize("sender", SENDERS)
@pytest.mark.parametrize("shape", SHAPES)
def test_a_secret_in_any_proxy_variable_never_reaches_the_send_result(monkeypatch, caplog, sender, layout, shape):
    secret = shape.format(pw="qzxqzxqzx")
    env = {name: secret if value == _SECRET else value for name, value in DISAGREEING[layout].items()}
    error, logs = _send_under(monkeypatch, caplog, sender, env)
    assert error
    for text in (error, logs):
        assert "qzx" not in text and "qzx" not in unquote(text), text[-2000:]


@pytest.mark.parametrize("layout", BYPASSED)
@pytest.mark.parametrize("sender", sorted(set(SENDERS) - {"signal"}))  # Signal's result names only the batch
def test_a_send_that_no_proxy_bypasses_keeps_its_real_error(monkeypatch, caplog, sender, layout):
    error, _ = _send_under(monkeypatch, caplog, sender, {"HTTPS_PROXY": _SECRET, "HTTP_PROXY": _SECRET,
                                                          "NO_PROXY": BYPASSED[layout]})
    assert error and not re.search(r"\b[A-Z]\w+ via ", error), error


@pytest.mark.parametrize("sender", sorted(set(SENDERS) - {"signal"}))  # Signal's result names only the batch
def test_a_bare_secret_free_proxy_keeps_its_real_error(monkeypatch, caplog, sender):
    """``HTTPS_PROXY=host:port`` (no scheme, no secret) is read as ``http://`` by httpx and requests:
    nothing to hide, so the real error stays (#151811)."""
    error, _ = _send_under(monkeypatch, caplog, sender, {"HTTPS_PROXY": "127.0.0.1:2", "HTTP_PROXY": "127.0.0.1:2"})
    assert error and "<unparseable URL redacted>" not in error and not re.search(r"\b[A-Z]\w+ via ", error), error


@pytest.mark.parametrize("no_proxy", [" *", "* ", "*\t"])
@pytest.mark.parametrize("sender", SENDERS)
@pytest.mark.parametrize("shape", SHAPES)
def test_a_padded_star_no_proxy_still_redacts(monkeypatch, caplog, sender, no_proxy, shape):
    # urllib, requests, aiohttp and httplib2 treat only an exact ``*`` as "bypass every host".
    secret = shape.format(pw="qzxqzxqzx")
    error, logs = _send_under(monkeypatch, caplog, sender, {"HTTPS_PROXY": secret, "HTTP_PROXY": secret,
                                                            "NO_PROXY": no_proxy})
    assert error
    for text in (error, logs):
        assert "qzx" not in text and "qzx" not in unquote(text), text[-2000:]






def test_an_oddly_cased_no_proxy_alone_is_not_a_bypass(monkeypatch):
    # httplib2 reads only ``no_proxy`` / ``NO_PROXY``: a ``No_Proxy`` it ignores cannot prove a direct send.
    from gateway.platforms.base_log_safety import env_proxy_for_redaction

    for name in (*ENV_PROXY_VARS, "NO_PROXY", "no_proxy"):
        monkeypatch.delenv(name, raising=False)
    monkeypatch.setenv("HTTPS_PROXY", _SECRET)
    monkeypatch.setenv("No_Proxy", "*")
    assert env_proxy_for_redaction("https://chat.googleapis.com") == _SECRET
    monkeypatch.setenv("NO_PROXY", "*")
    assert env_proxy_for_redaction("https://chat.googleapis.com") is None




@pytest.mark.parametrize("scheme", ["ftp", "socks4"])
@pytest.mark.parametrize("sender", SENDERS)
def test_an_unsupported_scheme_secret_proxy_is_redacted_even_when_no_proxy_names_the_target(monkeypatch, caplog,
                                                                                             sender, scheme):
    # httpx rejects the scheme while building the client, before it reads NO_PROXY, and its
    # ``Unknown scheme for proxy URL`` error keeps the username (only the password is masked).
    secret = f"{scheme}://qzxUser:qzxPass@127.0.0.1:1"
    error, logs = _send_under(monkeypatch, caplog, sender, {"HTTPS_PROXY": secret, "HTTP_PROXY": secret,
                                                            "NO_PROXY": _TARGET_HOSTS})
    assert error
    for text in (error, logs):
        assert "qzx" not in text and "qzx" not in unquote(text), text[-2000:]
