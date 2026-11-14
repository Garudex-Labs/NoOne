"""Hindi typed approvals keep the English shortcuts and resolve in the owning profile."""

from agent.i18n import reset_language_cache
from gateway.run_busy import approval_input_words


def test_hindi_approval_words_keep_english_and_native_replies(tmp_path, monkeypatch):
    monkeypatch.setenv("HERMES_HOME", str(tmp_path))
    monkeypatch.delenv("HERMES_LANGUAGE", raising=False)
    (tmp_path / "config.yaml").write_text("display:\n  language: hi\n", encoding="utf-8")
    reset_language_cache()
    try:
        assert {"yes", "approve", "हाँ", "हां", "मंज़ूर"} <= set(approval_input_words("approve"))
        assert {"no", "deny", "नहीं", "रद्द"} <= set(approval_input_words("deny"))
        assert {"always", "हमेशा मंज़ूर"} <= set(approval_input_words("confirm_always"))
        assert {"session", "इस सत्र के लिए मंज़ूर"} <= set(approval_input_words("session"))
    finally:
        reset_language_cache()
