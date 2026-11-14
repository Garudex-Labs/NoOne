#!/usr/bin/env python3
"""Connection lifecycle tool for managed gateway accounts and local MCP servers.

Disconnecting accounts remains a portal-only user decision.
"""

from typing import Any, Callable, Dict, Optional

from tools.connectors.catalog_tool import MANAGE_CATALOG_SCHEMA, manage_catalog
from tools.connectors.mcp import run_mcp_operation
from tools.connectors.targets import MCP_ACTIONS, normalize_targets
from tools.registry import registry, tool_error


def manage_connections(args: dict[str, Any], *, mcp_backend: Optional[Any] = None,
                       session_id: Optional[str] = None, tool_call_id: Optional[str] = None,
                       connection_callback: Optional[Callable] = None) -> str:
    action = str(args.get("action") or "install").strip().lower()
    if action not in MCP_ACTIONS:
        return tool_error(f"Action must be one of {', '.join(MCP_ACTIONS)} for a local MCP server.")
    names, error = normalize_targets(args.get("connectors"))
    if error:
        return tool_error(error)
    return run_mcp_operation(names, action, backend=mcp_backend,
                             connection_callback=connection_callback, session_id=session_id,
                             tool_call_id=tool_call_id)


MANAGE_CONNECTIONS_SCHEMA = {'name': 'manage_connections',
 'description': 'Install a catalog MCP server, enable a configured server, or authorize its '
                'independent external provider. Transport and credentials come from local '
                "configuration or the catalog. Approval and OAuth use the user's existing "
                'connection card when available. After a skip or timeout, continue without the '
                'server unless the user asks to retry. Use manage_catalog for plugin and skill '
                'installation.',
 'parameters': {'type': 'object',
                'properties': {'action': {'type': 'string',
                                          'enum': ['install', 'enable', 'authorize']},
                               'connectors': {'type': 'array',
                                              'items': {'anyOf': [{'type': 'string'},
                                                                  {'type': 'object',
                                                                   'properties': {'name': {'type': 'string'},
                                                                                  'mcp': {'type': 'boolean',
                                                                                          'const': True}},
                                                                   'required': ['name'],
                                                                   'additionalProperties': False}]}}},
                'required': ['connectors'],
                'additionalProperties': False}}


registry.register(
    name="manage_connections",
    toolset="connections",
    schema=MANAGE_CONNECTIONS_SCHEMA,
    # The portal gate decides schema presence: an account the portal has not enabled for
    # connectors never sees the tool, so the model cannot call it and read the gateway's
    # 404 back to them. The handler runs the same gate so the RPC path (methods_connectors) and
    # a cached schema agree. Read as a module attribute so tests patch
    # ``gateway.config.connectors_available`` at one seam.
    handler=lambda args, **kw: manage_connections(
        args, session_id=kw.get("session_id"), tool_call_id=kw.get("tool_call_id"),
    ),
    emoji="🔗",
)

# Registry dispatch has no card callback, so it answers with the CLI pointer.
registry.register(
    name="manage_catalog",
    toolset="catalog",
    schema=MANAGE_CATALOG_SCHEMA,
    handler=lambda args, **kw: manage_catalog(args, session_id=kw.get("session_id")),
    emoji="🧩",
)
