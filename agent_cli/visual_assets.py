"""Packaged presentation assets for standalone HTML; no frontend build or network required."""
from __future__ import annotations

import base64
import json
import re
from functools import lru_cache
from pathlib import Path

_ASSETS = Path(__file__).parent / "data" / "ui"


@lru_cache(maxsize=1)
def inline_typography_css() -> str:
    """Embed the exact shared faces so exports/login survive offline and reverse proxies."""
    css = (_ASSETS / "typography.css").read_text(encoding="utf-8")

    def embed(match: re.Match[str]) -> str:
        data = base64.b64encode((_ASSETS / "fonts" / match[1]).read_bytes()).decode("ascii")
        return f"url('data:font/woff2;base64,{data}')"

    return re.sub(r"url\('\./fonts/([^/']+)'\)", embed, css)


@lru_cache(maxsize=1)
def _icons() -> dict[str, str]:
    return json.loads((_ASSETS / "icons.json").read_text(encoding="utf-8"))


def ui_icon_svg(name: str, size: int = 16) -> str:
    """Render a trusted named asset; never interpolate caller text into SVG markup."""
    svg = _icons()[name]
    return svg.replace('width="24"', f'width="{int(size)}"').replace('height="24"', f'height="{int(size)}"').replace("<svg", '<svg aria-hidden="true"', 1)
