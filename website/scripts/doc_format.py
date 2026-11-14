"""Mechanical compatibility conversion for documentation generated from Markdown."""

from __future__ import annotations

import re

CALLOUTS = {
    "note": "Note", "tip": "Tip", "info": "Info", "warning": "Warning",
    "caution": "Warning", "danger": "Danger", "important": "Info",
}


def convert_callouts(body: str) -> str:
    """Keep directive bodies and titles unchanged, including nested fenced examples."""
    output: list[str] = []
    stack: list[str] = []
    fence: str | None = None
    for line in body.splitlines(keepends=True):
        marker = re.match(r"^\s*(`{3,}|~{3,})", line)
        if marker:
            token = marker[1]
            if fence and token[0] == fence[0] and len(token) >= len(fence):
                fence = None
            elif fence is None:
                fence = token
            output.append(line)
            continue
        directive = re.match(r"^(\s*):::([a-z]+)(?:\[([^\]]*)\]|\s+(.*?))?\s*$", line)
        if fence is None and directive and directive[2] in CALLOUTS:
            indent, kind, bracket_title, plain_title = directive.groups()
            title = bracket_title if bracket_title is not None else plain_title
            component = CALLOUTS[kind]
            stack.append(component)
            output.append(f"{indent}<{component}>\n\n")
            label = title or kind.upper()
            output.append(f"{indent}<div className=\"doc-callout-title\">\n\n{indent}{label}\n\n{indent}</div>\n\n")
        elif fence is None and re.match(r"^\s*:::\s*$", line) and stack:
            indent = line[:len(line) - len(line.lstrip())]
            output.append(f"\n{indent}</{stack.pop()}>\n")
        else:
            output.append(line)
    if stack:
        raise ValueError("Unclosed documentation callout")
    return "".join(output)


def convert_frontmatter(text: str) -> str:
    """Change framework metadata, never page titles or descriptions."""
    match = re.match(r"\A---\n(.*?)\n---\n", text, re.DOTALL)
    if not match:
        return text
    metadata = match[1]
    metadata = re.sub(r"^sidebar_label:", "sidebarTitle:", metadata, flags=re.MULTILINE)
    metadata = re.sub(r"^(?:sidebar_position|displayed_sidebar|slug):[^\n]*\n?", "", metadata, flags=re.MULTILINE)
    metadata = re.sub(r"^hide_table_of_contents:\s*true", "mode: wide", metadata, flags=re.MULTILINE)
    metadata = re.sub(r"^hide_title:\s*true", "mode: frame", metadata, flags=re.MULTILINE)
    # A page with both flags needs a single mode.
    lines = metadata.splitlines()
    if "mode: frame" in lines:
        lines = [line for line in lines if line != "mode: wide"]
    return "---\n" + "\n".join(lines) + "\n---\n" + text[match.end():]


def convert_document(text: str) -> str:
    return convert_comments(convert_callouts(convert_frontmatter(text)))


def convert_comments(text: str) -> str:
    """Change HTML comment delimiters without touching executable examples."""
    segments: list[str] = []
    prose: list[str] = []
    fence: str | None = None

    def flush() -> None:
        value = "".join(prose)
        inline: list[str] = []

        def protect(match: re.Match) -> str:
            inline.append(match[0])
            return f"\x00INLINE{len(inline) - 1}\x00"

        value = re.sub(r"(`+)(?!`)([\s\S]*?)(?<!`)\1(?!`)", protect, value)
        value = re.sub(r"<!--(.*?)-->", r"{/*\1*/}", value, flags=re.DOTALL)
        for index, original in enumerate(inline):
            value = value.replace(f"\x00INLINE{index}\x00", original)
        segments.append(value)
        prose.clear()

    for line in text.splitlines(keepends=True):
        marker = re.match(r"^\s*(`{3,}|~{3,})", line)
        if marker:
            token = marker[1]
            if fence and token[0] == fence[0] and len(token) >= len(fence):
                fence = None
                segments.append(line)
            elif fence is None:
                flush()
                fence = token
                segments.append(line)
            else:
                segments.append(line)
        elif fence:
            segments.append(line)
        else:
            prose.append(line)
    flush()
    return "".join(segments)
