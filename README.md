# NoOne

Garudex Labs · Maintainer: RAWx18 · Contact: rawx18.dev@gmail.com

<p align="center">
  <img src="assets/banner.png" alt="The Agent" width="100%">
</p>
<p align="center">
  <a href="https://github.com/Garudex-Labs/NoOne/tree/main/website/docs"><img src="https://img.shields.io/badge/Docs-NoOne-FFD700?style=for-the-badge" alt="Documentation"></a>
  <a href="https://github.com/Garudex-Labs/NoOne/blob/main/LICENSE"><img src="https://img.shields.io/badge/License-Apache--2.0%20%2B%20MIT-green?style=for-the-badge" alt="License: Apache-2.0 and inherited MIT"></a>
</p>

**The self-improving AI agent.** It's the only agent with a built-in learning loop — it creates skills from experience, improves them during use, nudges itself to persist knowledge, searches its own past conversations, and builds a deepening model of who you are across sessions. Run it on a $5 VPS, a GPU cluster, or serverless infrastructure that costs nearly nothing when idle. It's not tied to your laptop — talk to it from Telegram while it works on a cloud VM.

OpenRouter, OpenAI, your own endpoint, and [many others](https://github.com/Garudex-Labs/NoOne/blob/main/website/docs/integrations/providers.md). Switch with `noone model` — no code changes, no lock-in.

<table>
<tr><td><b>A real terminal interface</b></td><td>Interactive CLI with multiline editing, slash-command autocomplete, conversation history, interrupt-and-redirect, and streaming tool output.</td></tr>
<tr><td><b>Lives where you do</b></td><td>Telegram, Discord, Slack, WhatsApp, Signal, and CLI — all from a single gateway process. Voice memo transcription, cross-platform conversation continuity.</td></tr>
<tr><td><b>A closed learning loop</b></td><td>Agent-curated memory with periodic nudges. Autonomous skill creation after complex tasks. Skills self-improve during use. FTS5 session search with LLM summarization for cross-session recall. <a href="https://github.com/plastic-labs/honcho">Honcho</a> dialectic user modeling. Compatible with the <a href="https://agentskills.io">agentskills.io</a> open standard.</td></tr>
<tr><td><b>Scheduled automations</b></td><td>Built-in cron scheduler with delivery to any platform. Daily reports, nightly backups, weekly audits — all in natural language, running unattended.</td></tr>
<tr><td><b>Delegates and parallelizes</b></td><td>Spawn isolated subagents for parallel workstreams. In Desktop, choose their provider, model, and limits under Settings → Model → Subagents, then Apply the complete route. Write Python scripts that call tools via RPC, collapsing multi-step pipelines into zero-context-cost turns.</td></tr>
<tr><td><b>Runs anywhere, not just your laptop</b></td><td>Six built-in terminal backends — local, Docker, SSH, Modal, Daytona, and Vercel Sandbox — plus plugin backends such as Singularity/Apptainer. Daytona and Modal offer serverless persistence — your agent's environment hibernates when idle and wakes on demand, costing nearly nothing between sessions. Run it on a $5 VPS or a GPU cluster.</td></tr>
<tr><td><b>Research-ready</b></td><td>Batch trajectory generation, trajectory compression for training the next generation of tool-calling models.</td></tr>
</table>

---

## Quick Install

### Linux, macOS, WSL2

```bash
curl -fsSL https://raw.githubusercontent.com/Garudex-Labs/NoOne/main/scripts/install.sh | bash
```

### Windows (native, PowerShell)

> **Heads up:** Native Windows runs the agent without WSL — CLI, gateway, CLI, and tools all work natively. If you'd rather use WSL2, the Linux/macOS one-liner above works there too. Found a bug? Please [file issues](https://github.com/Garudex-Labs/NoOne/issues).

Run this in PowerShell:

```powershell
iex (irm https://raw.githubusercontent.com/Garudex-Labs/NoOne/main/scripts/install.ps1)
```

The source installer delegates Python 3.14, Node.js, npm, pnpm, ripgrep, FFmpeg,
and Python dependencies to PM. If Git is absent, it stages the verified Git
for Windows archive in the agent' tool store. It does not replace your system Git.
See [installation methods](https://github.com/Garudex-Labs/NoOne/blob/main/website/docs/getting-started/installation.md)
for the separate MSIX/App Installer package and its update ownership.

> **Android / Termux:** A signed APT repository is available for aarch64 devices, with a `stable` channel (tagged releases) and a prerelease `canary` channel. The package includes Python, Node.js, and the CLI. Use the [Termux guide](https://github.com/Garudex-Labs/NoOne/blob/main/website/docs/getting-started/termux.md), not the desktop/server installer script.
>
> **Windows:** Native Windows is fully supported — the PowerShell one-liner above installs everything. If you'd rather use WSL2, the Linux command works there too. Native Windows install lives under `%LOCALAPPDATA%\hermes`; WSL2 installs under `~/.hermes` as on Linux.

After installation:

```bash
source ~/.bashrc    # reload shell (or: source ~/.zshrc)
noone              # start chatting!
```

### Troubleshooting

#### Windows Defender or antivirus flags `uv.exe` as malware

If your antivirus (Bitdefender, Windows Defender, etc.) quarantines `uv.exe` from the the agent `bin` folder (`%LOCALAPPDATA%\hermes\bin\uv.exe`), this is a **false positive**. The file is Astral's `uv` — the Rust Python package manager the agent bundles to manage its Python environment. ML-based antivirus engines commonly flag unsigned Rust binaries that download and install packages.

**To verify your copy is authentic:**

```powershell
# Install GitHub CLI if needed
winget install --id GitHub.cli

# Login to GitHub
gh auth login

# Run verification
$uv = "$env:LOCALAPPDATA\hermes\bin\uv.exe"
$ver = (& $uv --version).Split(' ')[1]
[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
$zip = "$env:TEMP\uv.zip"
Invoke-WebRequest "https://github.com/astral-sh/uv/releases/download/$ver/uv-x86_64-pc-windows-msvc.zip" -OutFile $zip -UseBasicParsing
gh attestation verify $zip --repo astral-sh/uv
Expand-Archive $zip "$env:TEMP\uv_x" -Force
(Get-FileHash "$env:TEMP\uv_x\uv.exe").Hash -eq (Get-FileHash $uv).Hash
```

If attestation says "Verification succeeded" and the last line prints `True`, you're good.

**To whitelist the agent:**
- **Windows Defender:** Run PowerShell as Admin → `Add-MpPreference -ExclusionPath "$env:LOCALAPPDATA\hermes\bin"`
- **Bitdefender:** Add an exception in the Bitdefender console (Protection > Antivirus > Settings > Manage Exceptions)
- Whitelist the **folder**, not the file hash — the agent updates `uv` and the hash changes every version

For more context, see the upstream Astral reports: [astral-sh/uv#13553](https://github.com/astral-sh/uv/issues/13553), [astral-sh/uv#15011](https://github.com/astral-sh/uv/issues/15011), [astral-sh/uv#10079](https://github.com/astral-sh/uv/issues/10079).

---

## Getting Started

```bash
noone              # Interactive CLI — start a conversation
noone model        # Choose your LLM provider and model
noone tools        # Configure which tools are enabled
noone config set   # Set individual config values
noone config get   # Print individual config values
noone gateway      # Start the messaging gateway (Telegram, Discord, etc.)
noone setup        # Run the full setup wizard (configures everything at once)
noone update       # Update to the latest version
noone doctor       # Diagnose any issues
```

📖 **[Full documentation →](https://github.com/Garudex-Labs/NoOne/tree/main/website/docs)**

---

## Skip the API-key collection — Nous Portal

the agent works with whatever provider you want — that's not changing. But if you'd rather not collect five separate API keys for the model, web search, image generation, TTS, and a cloud browser, **[Nous Portal](https://portal.nousresearch.com)** covers all of them under one subscription:

- **300+ models** — pick any of them with `/model <name>`
- **Tool Gateway** — web search, image generation (FAL), text-to-speech (OpenAI), cloud browser (Browser Use), all routed through your sub. No extra accounts.

One command from a fresh install:

```bash
noone setup --portal
```

That logs you in via OAuth, sets Nous as your provider, and turns on the Tool Gateway. Check what's wired up any time with `noone portal info`. Full details on the [Tool Gateway docs page](https://github.com/Garudex-Labs/NoOne/blob/main/website/docs/user-guide/features/tool-gateway.md).

You can still bring your own keys per-tool whenever you want — the gateway is per-backend, not all-or-nothing.

---

## CLI vs Messaging Quick Reference

the agent has two entry points: start the terminal UI with `hermes`, or run the gateway and talk to it from Telegram, Discord, Slack, WhatsApp, Signal, or Email. Once you're in a conversation, many slash commands are shared across both interfaces.

| Action                         | CLI                                           | Messaging platforms                                                              |
| ------------------------------ | --------------------------------------------- | -------------------------------------------------------------------------------- |
| Start chatting                 | `hermes`                                      | Run `noone gateway setup` + `noone gateway start`, then send the bot a message |
| Start fresh conversation       | `/new` or `/reset`                            | `/new` or `/reset`                                                               |
| Change model                   | `/model [provider:model]`                     | `/model [provider:model]`                                                        |
| Set a personality              | `/personality [name]`                         | `/personality [name]`                                                            |
| Retry or undo the last turn    | `/retry`, `/undo`                             | `/retry`, `/undo`                                                                |
| Compress context / check usage | `/compress`, `/usage`, `/insights [--days N]` | `/compress`, `/usage`, `/insights [days]`                                        |
| Browse skills                  | `/skills` or `/<skill-name>`                  | `/<skill-name>`                                                                  |
| Interrupt current work         | `Ctrl+C` or send a new message                | `/stop` or send a new message                                                    |
| Platform-specific status       | `/platforms`                                  | `/status`, `/sethome`                                                            |

For the full command lists, see the [CLI guide](https://github.com/Garudex-Labs/NoOne/blob/main/website/docs/user-guide/cli.md) and the [Messaging Gateway guide](https://github.com/Garudex-Labs/NoOne/blob/main/website/docs/user-guide/messaging/index.md).

---

## Documentation

All documentation lives at **[repository documentation](https://github.com/Garudex-Labs/NoOne/tree/main/website/docs)**:

| Section                                                                                             | What's Covered                                             |
| --------------------------------------------------------------------------------------------------- | ---------------------------------------------------------- |
| [Quickstart](https://github.com/Garudex-Labs/NoOne/blob/main/website/docs/getting-started/quickstart.md)                 | Install → setup → first conversation in 2 minutes          |
| [CLI Usage](https://github.com/Garudex-Labs/NoOne/blob/main/website/docs/user-guide/cli.md)                              | Commands, keybindings, personalities, sessions             |
| [Configuration](https://github.com/Garudex-Labs/NoOne/blob/main/website/docs/user-guide/configuration.md)                | Config file, providers, models, all options                |
| [Messaging Gateway](https://github.com/Garudex-Labs/NoOne/blob/main/website/docs/user-guide/messaging/index.md)                | Telegram, Discord, Slack, WhatsApp, Signal, Home Assistant |
| [Security](https://github.com/Garudex-Labs/NoOne/blob/main/website/docs/user-guide/security.md)                          | Command approval, DM pairing, container isolation          |
| [Tools & Toolsets](https://github.com/Garudex-Labs/NoOne/blob/main/website/docs/user-guide/features/tools.md)            | 40+ tools, toolset system, terminal backends               |
| [Skills System](https://github.com/Garudex-Labs/NoOne/blob/main/website/docs/user-guide/features/skills.md)              | Procedural memory, Skills Hub, creating skills             |
| [Memory](https://github.com/Garudex-Labs/NoOne/blob/main/website/docs/user-guide/features/memory.md)                     | Persistent memory, user profiles, best practices           |
| [MCP Integration](https://github.com/Garudex-Labs/NoOne/blob/main/website/docs/user-guide/features/mcp.md)               | Connect any MCP server for extended capabilities           |
| [Cron Scheduling](https://github.com/Garudex-Labs/NoOne/blob/main/website/docs/user-guide/features/cron.md)              | Scheduled tasks with platform delivery                     |
| [Context Files](https://github.com/Garudex-Labs/NoOne/blob/main/website/docs/user-guide/features/context-files.md)       | Project context that shapes every conversation             |
| [Architecture](https://github.com/Garudex-Labs/NoOne/blob/main/website/docs/developer-guide/architecture.md)             | Project structure, agent loop, key classes                 |
| [Contributing](https://github.com/Garudex-Labs/NoOne/blob/main/website/docs/developer-guide/contributing.md)             | Development setup, PR process, code style                  |
| [CLI Reference](https://github.com/Garudex-Labs/NoOne/blob/main/website/docs/reference/cli-commands.md)                  | All commands and flags                                     |
| [Environment Variables](https://github.com/Garudex-Labs/NoOne/blob/main/website/docs/reference/environment-variables.md) | Complete env var reference                                 |

---

## Migrating from OpenClaw or another agent

If you're coming from OpenClaw, Claude Code, Codex CLI or Cursor, the agent can import your settings, memories and skills (and, for OpenClaw, API keys when you ask for them).

**During setup:** `noone setup` asks whether to import from another agent, pre-selects the ones it finds (`~/.openclaw`, `~/.claude`, `~/.codex`, `~/.cursor`), installs the official `agent-importers` plugin and runs the import with a preview first.

**Anytime after install:**

```bash
noone plugins install agent-importers          # once per profile
noone import-agent openclaw                    # interactive migration (full preset)
noone import-agent openclaw --dry-run          # preview what would be migrated
noone import-agent openclaw --migrate-secrets  # also bring allowlisted API keys
noone import-agent claude-code                 # or codex / cursor
```

What gets imported from OpenClaw:

- **SOUL.md** — persona file
- **Memories** — MEMORY.md and USER.md entries
- **Skills** — user-created skills → `~/.hermes/skills/openclaw-imports/`
- **Command allowlist** — approval patterns
- **Messaging settings** — platform configs, allowed users, working directory
- **API keys** — allowlisted secrets (Telegram, OpenRouter, OpenAI, Anthropic, ElevenLabs), only with `--migrate-secrets`
- **TTS assets** — workspace audio files
- **Workspace instructions** — AGENTS.md (with `--workspace-target`)

`noone claw migrate` still works as the older spelling. See the [OpenClaw migration guide](https://github.com/Garudex-Labs/NoOne/blob/main/website/docs/guides/migrate-from-openclaw.md) and [Import from Other Agents](https://github.com/Garudex-Labs/NoOne/blob/main/website/docs/user-guide/import-from-other-agents.md).

---

## Contributing

We welcome contributions! See the [Contributing Guide](https://github.com/Garudex-Labs/NoOne/blob/main/website/docs/developer-guide/contributing.md) for development setup, code style, and PR process.

Start with the [PM developer workflow](website/docs/reference/package-management.md#developer-workflow)
for activation, daily use, dependency changes, and leaving the environment.
[Development Setup](CONTRIBUTING.md#development-setup) covers the separate test environment and verification commands.

---

## Community

- 📚 [Skills Hub](https://agentskills.io)
- 🐛 [Issues](https://github.com/Garudex-Labs/NoOne/issues)

---

## License

Apache 2.0 — see [LICENSE](LICENSE).

Maintained by **RAWx18** — [rawx18.dev@gmail.com](mailto:rawx18.dev@gmail.com).
