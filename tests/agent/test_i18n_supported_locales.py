"""The shipped language choices and Hindi resolution are a user-facing contract."""

from __future__ import annotations

import pytest

from agent import i18n, i18n_layers


@pytest.fixture(autouse=True)
def clean_language_layers(tmp_path, monkeypatch):
    monkeypatch.setenv("HERMES_HOME", str(tmp_path))
    monkeypatch.delenv("HERMES_LANGUAGE", raising=False)
    i18n_layers._reset_registry_for_tests()
    i18n.reset_language_cache()
    yield
    i18n_layers._reset_registry_for_tests()
    i18n.reset_language_cache()


def test_shipped_language_picker_has_exact_requested_choices():
    options = {option["id"]: option for option in i18n.language_options()}
    assert set(options) == {"en", "ar", "fr", "de", "ja", "ko", "hi", "es", "zh"}
    assert options["hi"]["endonym"] == "हिन्दी"
    assert options["hi"]["rtl"] is False
    assert options["hi"]["surfaces"] == ["core"]
    assert options["ar"]["rtl"] is True


@pytest.mark.parametrize("value", ["hi", "Hindi", "हिन्दी", "हिंदी", "hi-IN", "hi_IN"])
def test_hindi_name_and_regional_tags_resolve_to_hindi(value):
    assert i18n.resolve_language_id(value) == "hi"
    assert i18n.t("approval.allowed_once", lang=value) == "      ✓ एक बार अनुमति दी गई"


@pytest.mark.parametrize("value", [
    "ga", "af", "hu", "uk", "zh-hant", "tr", "pt", "ru", "it",
    "ru-RU", "it-IT", "pt-BR", "zh-TW", "zh-HK", "zh-hant-TW",
])
def test_retired_stock_locales_are_not_valid_choices_and_fall_back(value):
    assert i18n.resolve_language_id(value) is None
    assert i18n.t("approval.allowed_once", lang=value) == i18n.t("approval.allowed_once", lang="en")


def test_hindi_named_formatters_preserve_runtime_values():
    text = i18n.t("approval.timeout", lang="hi", waited="WINDOW", suggested=120)
    assert "WINDOW" in text
    assert "noone config set approvals.timeout 120" in text
    assert any("\u0900" <= char <= "\u097f" for char in text)
    assert text != i18n.t("approval.timeout", lang="en", waited="WINDOW", suggested=120)


def test_external_language_packs_remain_explicitly_supported():
    i18n_layers.register_pack("eo", "core", {"approval.allowed_once": "Permesita"}, source="plugin:esperanto")
    assert i18n.resolve_language_id("eo") == "eo"
    assert i18n.t("approval.allowed_once", lang="eo") == "Permesita"


@pytest.mark.parametrize("value", ["zh", "zh-CN", "zh-Hans", "zh-Hans-CN", "zh-Hans-SG", "zh_SG"])
def test_retained_simplified_chinese_aliases_keep_their_script(value):
    assert i18n.resolve_language_id(value) == "zh"
