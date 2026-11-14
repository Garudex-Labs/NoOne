"""Targets for locally configured and catalog-installed MCP servers."""
from typing import Any

MCP_ACTIONS = ("install", "enable", "authorize")


def normalize_targets(raw: Any) -> tuple[list[str], str | None]:
    if isinstance(raw, (str, dict)):
        raw = [raw]
    if not isinstance(raw, list) or not raw:
        return [], "Provide the MCP server name(s) in 'connectors'."
    names = []
    for item in raw:
        if isinstance(item, dict):
            if set(item) - {"name", "mcp"} or item.get("mcp", True) is not True:
                return [], "A target is a local MCP server name or {name, mcp: true}; transport and credentials come from its configuration."
            item = item.get("name")
        if not isinstance(item, str) or not item.strip():
            return [], "Every target needs a non-empty MCP server name."
        name = item.strip().lower()
        if name not in names:
            names.append(name)
    return names, None
