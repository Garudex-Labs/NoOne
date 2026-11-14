---
title: "ACP Host Integration"
description: "Use the agent inside ACP-compatible editors and collaboration platforms"
---

# ACP Host Integration {#acp-host-integration}

Python dependency commands on this page use a
[PM-prepared source checkout](../../reference/package-management.md#developer-workflow).
After a dependency change, reactivate the checkout and restart {{app-name}}.

{{app-name}} can run as an ACP server, letting ACP-compatible hosts talk to
{{app-name}} over stdio. Editors can render:

- chat messages
- tool activity
- file diffs
- terminal commands
- approval prompts
- streamed thinking / response chunks

Other hosts can use the same protocol to route collaboration events into
{{app-name}}. ACP is a good fit when you want {{app-name}} to keep its existing identity,
provider setup, memory, skills, and tools while another application owns the
conversation transport.

## What {{app-name}} exposes in ACP mode {#what-hermes-exposes-in-acp-mode}

{{app-name}} runs with a curated `hermes-acp` toolset designed for editor workflows. It includes:

- file tools: `read_file`, `write_file`, `patch`, `search_files`
- terminal tools: `terminal`, `process`
- web/browser tools
- memory, todo, session search
- skills
- execute_code and delegate_task
- vision

It intentionally excludes things that do not fit typical editor UX, such as messaging delivery and cronjob management.

The toolset resolves the same way as on the messaging gateway for the same
platform config. That includes the extras the gateway adds on top of the
list, such as enabled plugin toolsets, so ACP sessions get those too.
`platform_toolsets.acp` replaces the `hermes-acp` default, and
`agent.disabled_toolsets` removes toolsets from every ACP session. MCP
servers from `mcp_servers` follow the same rules too. By default ACP gets
every enabled server. If you list server names in `platform_toolsets.acp`,
only those servers are included, and `no_mcp` drops them all. `noone tools`
has no ACP entry, so edit `config.yaml` directly:

```yaml
platform_toolsets:
  acp: [file, web, skills, github]   # only the github MCP server
agent:
  disabled_toolsets: [code_execution]
```

MCP servers that the editor sends with `session/new` are separate. The
client asks for them per session, and they are always added.

## Editor-provided MCP servers {#editor-provided-mcp-servers}

On gateways advertising `acp-session-mcp-v1`, editor `mcpServers` belong to the
canonical session, not the ACP viewer process. The gateway uses separate registry
namespaces even when two editors supply the same server name. Closing an editor
does not cancel another session's MCP execution.

Discovery is eager and bounded before the first model turn. The selected tool
schemas remain frozen for the conversation; server tool-list changes require a
new session. MCP transports are released after each execution, without stopping
sibling sessions or the shared MCP loop.

The gateway keeps the editor transport specification (including command arguments,
environment values and HTTP headers) only in memory. Durable session policy holds
a fingerprint and the selected schemas, not a copy of those credentials. After a
gateway restart, the editor must supply the same `mcpServers` on load/resume.
Missing credentials refuse execution; a changed specification or secret refuses
reattachment rather than silently changing the session. Start a new session when
changing the server configuration. Commands and paths run on the gateway host.

## Installation {#installation}

Install {{app-name}} normally, then add the ACP extra from the install checkout:

```bash
cd ~/.hermes/hermes-agent && python -c "import pm; pm.sync_venv(['acp'], explicit=True)"
```

This installs the `agent-client-protocol` dependency and enables:

- `hermes acp`
- `hermes-acp`
- `python -m acp_adapter`

## Launching the ACP server {#launching-the-acp-server}

Any of the following starts {{app-name}} in ACP mode:

```bash
hermes acp
```

```bash
hermes-acp
```

```bash
python -m acp_adapter
```

{{app-name}} logs to stderr so stdout remains reserved for ACP JSON-RPC traffic.

For non-interactive checks:

```bash
hermes acp --version
hermes acp --check
```

### Browser tools (optional) {#browser-tools-optional}

Browser tools (`browser_exec` and the CDP tools `browser_cdp`,
`browser_dialog`, `browser_vault`) need a local Chromium, which isn't part of
the Python wheel. Install it with:

```bash
hermes acp --setup-browser           # interactive (prompts before ~400 MB download)
hermes acp --setup-browser --yes     # accept the download non-interactively
```

This is the standalone command. The terminal-auth flow (`hermes acp --setup`) also offers the browser bootstrap as a follow-up question after model selection, so most users never need to run `--setup-browser` directly.

What it does:

- Installs {{app-name}}' pinned Chromium (the `chromium` package) through the package manager; no Node.js or npm involved
- {{app-name}} launches that Chromium itself when `browser_exec` first needs a browser

The bootstrap is idempotent — re-running it is fast and skips work that's already done.

## Host setup {#host-setup}

### VS Code {#vs-code}

Install the [ACP Client](https://marketplace.visualstudio.com/items?itemName=formulahendry.acp-client) extension.

To connect:

1. Open the ACP Client panel from the Activity Bar.
2. Select **{{app-name}}** from the built-in agent list.
3. Connect and start chatting.

If you want to define {{app-name}} manually, add it through VS Code settings under `acp.agents`:

```json
{
  "acp.agents": {
    "NoOne": {
      "command": "hermes",
      "args": ["acp"]
    }
  }
}
```

### Zed {#zed}

Configure {{app-name}} as a custom agent server in Zed settings:

1. Open the Agent Panel.
2. Add a custom agent server with the following configuration:

```json
{
  "agent_servers": {
    "hermes-agent": {
      "type": "custom",
      "command": "hermes",
      "args": ["acp"]
    }
  }
}
```

3. Start a new {{app-name}} external-agent thread.

Prerequisites:

- Configure {{app-name}} provider credentials first with `noone model`, or set them in `~/.hermes/.env` / `~/.hermes/config.yaml`.

### JetBrains {#jetbrains}

Use an ACP-compatible plugin and point it at `hermes acp` or `hermes-acp`.

## Configuration and credentials {#configuration-and-credentials}

ACP mode uses the same {{app-name}} configuration as the CLI:

- `~/.hermes/.env`
- `~/.hermes/config.yaml`
- `~/.hermes/skills/`
- `~/.hermes/state.db`

Provider resolution uses {{app-name}}' normal runtime resolver, so ACP inherits the currently configured provider and credentials. {{app-name}} also advertises a terminal auth method (`--setup`) for first-run ACP clients; this opens {{app-name}}' interactive model/provider setup.

### Service-tier picker {#service-tier-picker}

ACP clients that render `configOptions` can select **Service tier** for a supported
model route: **Normal**, **Fast**, **Auto**, **Cold**, and **Ultrafast** when its
model and account eligibility checks permit it. The gateway supplies the choices
and validates each selection; unsupported routes do not show the picker.

The selection applies to that session's next turn, not to every {{app-name}} session,
and does not write `config.yaml`. Reloading the editor preserves the selection
while the same gateway session remains alive. Changes from another attached
client update the ACP picker as well. See [the `/fast` reference](../../reference/slash-commands.md)
for the bounded Auto and Cold modes.

## Host integration {#host-integration}

Older ACP hosts may still set this variable on the {{app-name}} subprocess they
spawn. It is not user configuration — do not set it by hand in `.env` or
`config.yaml`.

| Variable | Value | Effect |
|----------|-------|--------|
| `HERMES_ACP_SKIP_CONFIGURED_MCP` | `1` | **No effect.** {{app-name}} no longer reads it. `hermes acp` / `hermes-acp` runs as a viewer of the gateway daemon and never starts the `config.yaml` MCP servers itself, so there is no ACP-side startup to skip. |

The ACP process does no MCP discovery. The gateway daemon starts the
`mcp_servers` from its own profile's `config.yaml` once at gateway boot, and ACP
sessions get those servers through the `platform_toolsets.acp` rules
[above](#what-hermes-exposes-in-acp-mode). Setting the variable on the ACP
subprocess or on the gateway does not change that. Use `platform_toolsets.acp`
or `no_mcp` to keep configured servers out of ACP sessions.

The editor's `session/new` `mcpServers` are passed to the gateway and attached
to that canonical session (see
[Editor-provided MCP servers](#editor-provided-mcp-servers)), whether or not
the variable is set.

## Session behavior {#session-behavior}

ACP sessions are tracked by the ACP adapter's in-memory session manager while the server is running.

Each session stores:

- session ID
- working directory
- selected model
- current conversation history
- cancel event

Conversations are persisted to {{app-name}}' session database and can be listed, loaded,
resumed, or forked after the ACP server restarts. Opening a new session without a
prompt keeps it in memory only: model-discovery probes do not create empty history
rows. A nonempty fork is persisted immediately, and existing session metadata can
still be updated even when its current history is empty.

Existing empty rows from older versions are not automatically deleted. An open ACP
row does not prove its client has disconnected. After closing the relevant editor
sessions, inspect unwanted rows with `noone sessions show <id>` and remove only
confirmed unwanted sessions with `noone sessions delete <id>`.

## Working directory behavior {#working-directory-behavior}

ACP sessions bind the editor's cwd to the {{app-name}} task ID so file and terminal tools run relative to the editor workspace, not the server process cwd.

## Approvals {#approvals}

Dangerous terminal commands can be routed back to the editor as approval prompts. ACP approval options are simpler than the CLI flow:

- allow once
- allow always
- deny

Whether you actually see a prompt is up to the host. A host is free to answer the
request programmatically instead of showing it to you, in which case these
options exist on the wire but never reach a human. A headless ACP host may do this, so
treat that path as unattended execution regardless of your `approvals` setting.

On timeout or error, the approval bridge denies the request. The wait is
`approvals.timeout` from `config.yaml` (default 300 s), the same knob the CLI and
gateway prompts use — raise it if your editor keeps approval cards open longer.

### Session-scoped edit auto-approval {#session-scoped-edit-auto-approval}

ACP exposes a third tier between *allow once* and *allow always*: **Allow for session**. Picking it from the editor's permission prompt records the approval inside the current ACP session only — every subsequent matching command in that session goes through without prompting, but a new ACP session (or restarting the editor) resets the slate and re-prompts the first time.

| Option | Editor label | Scope | Persisted across restarts |
|---|---|---|---|
| `allow_once` | Allow once | This one tool call | No |
| `allow_session` | Allow for session | All matching calls in this ACP session | No — cleared when the session ends |
| `allow_always` | Allow always | All future sessions | Yes (written to the {{app-name}} permanent allowlist) |
| `deny` | Deny | This one tool call | No |

`allow_session` is the right default for an editor workflow where you trust an agent for the duration of a task but don't want to grant a long-lived allowlist entry. The safety trade-off is straightforward: the broader the scope, the less the editor will interrupt you, and the more damage a misbehaving agent (or prompt injection) can do before you notice. Start with `allow_once` for unfamiliar commands; promote to `allow_session` once you've seen the agent run the same pattern correctly a few times; reserve `allow_always` for truly idempotent commands you trust forever (e.g. `git status`).

The ACP bridge maps these options onto {{app-name}}' internal approval semantics — `allow_always` writes a permanent allowlist entry the same way the CLI does, while `allow_session` only affects the in-process approval cache for the current ACP session.

## Troubleshooting {#troubleshooting}

### ACP agent does not appear in the editor {#acp-agent-does-not-appear-in-the-editor}

Check:

- For manual/local development, verify the host command points to `hermes acp`.
- {{app-name}} is installed and on your PATH.
- The ACP extra is installed (`cd ~/.hermes/hermes-agent && python -c "import pm; pm.sync_venv(['acp'], explicit=True)"`).

### ACP starts but immediately errors {#acp-starts-but-immediately-errors}

Try these checks:

```bash
hermes acp --version
hermes acp --check
noone doctor
noone status
```

### Missing credentials {#missing-credentials}

ACP mode uses {{app-name}}' existing provider setup. Configure credentials with:

```bash
noone model
```

or by editing `~/.hermes/.env`. The terminal auth flow (`hermes acp --setup`) can also trigger the interactive provider/model setup.

## See also {#see-also}

- [ACP Internals](../../developer-guide/acp-internals.md)
- [Provider Runtime Resolution](../../developer-guide/provider-runtime.md)
- [Tools Runtime](../../developer-guide/tools-runtime.md)
