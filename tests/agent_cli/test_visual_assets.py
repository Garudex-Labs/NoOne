"""Offline presentation contracts use the real packaged font/SVG assets."""
import base64
import re

from agent_cli.session_export_html import generate_html_export
from agent_cli.visual_assets import inline_typography_css, ui_icon_svg


def test_font_faces_are_embedded_without_external_stylesheet_dependencies():
    css = inline_typography_css()
    faces = re.findall(r"data:font/woff2;base64,([^']+)", css)
    assert len(faces) == 5
    assert all(base64.b64decode(face).startswith(b"wOF2") for face in faces)
    assert "src: url('https://" not in css
    assert "src: url('http://" not in css
    assert "Liberation Mono" in css


def test_single_file_export_and_icons_keep_local_rendering_contract():
    document = generate_html_export({"title": "Offline session", "messages": []})
    assert "data:font/woff2;base64," in document
    assert "fonts.googleapis.com" not in document
    assert "fonts.gstatic.com" not in document
    assert "script-src 'nonce-" in document
    glyph = ui_icon_svg("search", 20)
    assert 'width="20"' in glyph and 'height="20"' in glyph
    assert 'aria-hidden="true"' in glyph
