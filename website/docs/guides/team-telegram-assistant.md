---
title: "Tutorial: Team Telegram Assistant"
description: "Step-by-step guide to setting up a Telegram bot that your whole team can use for code help, research, system admin, and more"
---

# Set Up a Team Telegram Assistant {#set-up-a-team-telegram-assistant}

This tutorial walks you through setting up a Telegram bot powered by {{app-name}} that multiple team members can use. By the end, your team will have a shared AI assistant they can message for help with code, research, system administration, and anything else — secured with per-user authorization.

## What We're Building {#what-were-building}

A Telegram bot that:

- **Any authorized team member** can DM for help — code reviews, research, shell commands, debugging
- **Runs on your server** with full tool access — terminal, file editing, web search, code execution
- **Per-user sessions** — each person gets their own conversation context
- **Secure by default** — only approved users can interact, with two authorization methods
- **Scheduled tasks** — daily standups, health checks, and reminders delivered to a team channel

---

## Prerequisites {#prerequisites}

Before starting, make sure you have:

- **{{app-name}} installed** on a server or VPS (not your laptop — the bot needs to stay running). Follow the [installation guide](../getting-started/installation.md) if you haven't yet.
- **A Telegram account** for yourself (the bot owner)
- **An LLM provider configured** — at minimum, an API key for OpenAI, Anthropic, or another supported provider in `~/.hermes/.env`

<Tip>

<div className="doc-callout-title">

TIP

</div>

A $5/month VPS is plenty for running the gateway. {{app-name}} itself is lightweight — the LLM API calls are what cost money, and those happen remotely.

</Tip>

---

## Step 1: Create a Telegram Bot {#step-1-create-a-telegram-bot}

Every Telegram bot starts with **@BotFather** — Telegram's official bot for creating bots.

1. **Open Telegram** and search for `@BotFather`, or go to [t.me/BotFather](https://t.me/BotFather)

2. **Send `/newbot`** — BotFather will ask you two things:
   - **Display name** — what users see (e.g., `Team Hermes Assistant`)
   - **Username** — must end in `bot` (e.g., `myteam_hermes_bot`)

3. **Copy the bot token** — BotFather replies with something like:
   ```
   Use this token to access the HTTP API:
   7123456789:AAH1bGciOiJSUzI1NiIsInR5cCI6Ikp...
   ```
   Save this token — you'll need it in the next step.

4. **Set a description** (optional but recommended):
   ```
   /setdescription
   ```
   Choose your bot, then enter something like:
   ```
   Team AI assistant powered by NoOne. DM me for help with code, research, debugging, and more.
   ```

5. **Set bot commands** (optional — gives users a command menu):
   ```
   /setcommands
   ```
   Choose your bot, then paste:
   ```
   new - Start a fresh conversation
   model - Show or change the AI model
   status - Show session info
   help - Show available commands
   stop - Stop the current task
   ```

<Warning>

<div className="doc-callout-title">

WARNING

</div>

Keep your bot token secret. Anyone with the token can control the bot. If it leaks, use `/revoke` in BotFather to generate a new one.

</Warning>

---

## Step 2: Configure the Gateway {#step-2-configure-the-gateway}

You have two options: the interactive setup wizard (recommended) or manual configuration.

### Option A: Interactive Setup (Recommended) {#option-a-interactive-setup-recommended}

```bash
noone gateway setup
```

This walks you through everything with arrow-key selection. Pick **Telegram**, paste your bot token, and enter your user ID when prompted.

### Option B: Manual Configuration {#option-b-manual-configuration}

Add these lines to `~/.hermes/.env`:

```bash
# Telegram bot token from BotFather
TELEGRAM_BOT_TOKEN=7123456789:AAH1bGciOiJSUzI1NiIsInR5cCI6Ikp...

# Your Telegram user ID (numeric)
TELEGRAM_ALLOWED_USERS=123456789
```

### Finding Your User ID {#finding-your-user-id}

Your Telegram user ID is a numeric value (not your username). To find it:

1. Message [@userinfobot](https://t.me/userinfobot) on Telegram
2. It instantly replies with your numeric user ID
3. Copy that number into `TELEGRAM_ALLOWED_USERS`

<Info>

<div className="doc-callout-title">

INFO

</div>

Telegram user IDs are permanent numbers like `123456789`. They're different from your `@username`, which can change. Always use the numeric ID for allowlists.

</Info>

---

## Step 3: Start the Gateway {#step-3-start-the-gateway}

### Quick Test {#quick-test}

Run the gateway in the foreground first to make sure everything works:

```bash
noone gateway
```

You should see output like:

```
[Gateway] Starting Hermes Gateway...
[Gateway] Telegram adapter connected
[Gateway] Cron scheduler started (tick every 60s)
```

Open Telegram, find your bot, and send it a message. If it replies, you're in business. Press `Ctrl+C` to stop.

### Production: Install as a Service {#production-install-as-a-service}

For a persistent deployment that survives reboots:

```bash
noone gateway install
sudo noone gateway install --system   # Linux only: boot-time system service
```

This creates a background service: a user-level **systemd** service on Linux by default, a **launchd** service on macOS, or a boot-time Linux system service if you pass `--system`.

```bash
# Linux — manage the default user service
noone gateway start
noone gateway stop
noone gateway status

# View live logs
journalctl --user -u hermes-gateway -f

# Keep running after SSH logout
sudo loginctl enable-linger $USER

# Linux servers — explicit system-service commands
sudo noone gateway start --system
sudo noone gateway status --system
journalctl -u hermes-gateway -f
```

```bash
# macOS — manage the service
noone gateway start
noone gateway stop
tail -f ~/.hermes/logs/gateway.log
```

<Tip>

<div className="doc-callout-title">

macOS PATH

</div>

The launchd plist captures your shell PATH at install time so gateway subprocesses can find tools like Node.js and ffmpeg. If you install new tools later, re-run `noone gateway install` to update the plist.

</Tip>

### Verify It's Running {#verify-its-running}

```bash
noone gateway status
```

Then send a test message to your bot on Telegram. You should get a response within a few seconds.

---

## Step 4: Set Up Team Access {#step-4-set-up-team-access}

Now let's give your teammates access. There are two approaches.

### Approach A: Static Allowlist {#approach-a-static-allowlist}

Collect each team member's Telegram user ID (have them message [@userinfobot](https://t.me/userinfobot)) and add them as a comma-separated list:

```bash
# In ~/.hermes/.env
TELEGRAM_ALLOWED_USERS=123456789,987654321,555555555
```

Restart the gateway after changes:

```bash
noone gateway stop && noone gateway start
```

### Approach B: DM Pairing (Recommended for Teams) {#approach-b-dm-pairing-recommended-for-teams}

DM pairing is more flexible — you don't need to collect user IDs upfront. Here's how it works:

1. **Teammate DMs the bot** — since they're not on the allowlist, the bot replies with a one-time pairing code:
   ```
   🔐 Pairing code: XKGH5N7P
   Send this code to the bot owner for approval.
   ```

2. **Teammate sends you the code** (via any channel — Slack, email, in person)

3. **You approve it** on the server:
   ```bash
   hermes pairing approve telegram XKGH5N7P
   ```

4. **They're in** — the bot immediately starts responding to their messages

**Managing paired users:**

```bash
# See all pending and approved users
hermes pairing list

# Revoke someone's access
hermes pairing revoke telegram 987654321

# Clear expired pending codes
hermes pairing clear-pending
```

<Tip>

<div className="doc-callout-title">

TIP

</div>

DM pairing is ideal for teams because you don't need to restart the gateway when adding new users. Approvals take effect immediately.

</Tip>

### Security Considerations {#security-considerations}

- **Never set `GATEWAY_ALLOW_ALL_USERS=true`** on a bot with terminal access — anyone who finds your bot could run commands on your server
- Pairing codes expire after **1 hour** and use cryptographic randomness
- Rate limiting prevents brute-force attacks: 1 request per user per 10 minutes, max 3 pending codes per platform
- After 5 failed approval attempts, the platform enters a 1-hour lockout
- All pairing data is stored with `chmod 0600` permissions

---

## Step 5: Configure the Bot {#step-5-configure-the-bot}

### Set a Home Channel {#set-a-home-channel}

A **home channel** is where the bot delivers cron job results and proactive messages. Without one, scheduled tasks have nowhere to send output.

**Option 1:** Use the `/sethome` command in any Telegram group or chat where the bot is a member.

**Option 2:** Set it manually in `~/.hermes/.env`:

```bash
TELEGRAM_HOME_CHANNEL=-1001234567890
TELEGRAM_HOME_CHANNEL_NAME="Team Updates"
```

To find a channel ID, add [@userinfobot](https://t.me/userinfobot) to the group — it will report the group's chat ID.

### Configure Tool Progress Display {#configure-tool-progress-display}

Control how much detail the bot shows when using tools. In `~/.hermes/config.yaml`:

```yaml
display:
  tool_progress: new    # off | new | all | verbose
```

| Mode | What You See |
|------|-------------|
| `off` | Clean responses only — no tool activity |
| `new` | Brief status for each new tool call (recommended for messaging) |
| `all` | Every tool call with details |
| `verbose` | Full tool output including command results |

Users can also change this per-session with the `/verbose` command in chat.

### Set Up a Personality with SOUL.md {#set-up-a-personality-with-soulmd}

Customize how the bot communicates by editing `~/.hermes/SOUL.md`:

For a full guide, see [Use SOUL.md with {{app-name}}](./use-soul-with-hermes.md).

```markdown
# Soul
You are a helpful team assistant. Be concise and technical.
Use code blocks for any code. Skip pleasantries — the team
values directness. When debugging, always ask for error logs
before guessing at solutions.
```

### Add Project Context {#add-project-context}

If your team works on specific projects, create context files so the bot knows your stack:

```markdown
<!-- ~/.hermes/AGENTS.md -->
# Team Context
- We use Python 3.12 with FastAPI and SQLAlchemy
- Frontend is React with TypeScript
- CI/CD runs on GitHub Actions
- Production deploys to AWS ECS
- Always suggest writing tests for new code
```

<Info>

<div className="doc-callout-title">

INFO

</div>

Context files are injected into every session's system prompt. Keep them concise — every character counts against your token budget.

</Info>

---

## Step 6: Set Up Scheduled Tasks {#step-6-set-up-scheduled-tasks}

With the gateway running, you can schedule recurring tasks that deliver results to your team channel.

### Daily Standup Summary {#daily-standup-summary}

Message the bot on Telegram:

```
Every weekday at 9am, check the GitHub repository at
github.com/myorg/myproject for:
1. Pull requests opened/merged in the last 24 hours
2. Issues created or closed
3. Any CI/CD failures on the main branch
Format as a brief standup-style summary.
```

The agent creates a cron job automatically and delivers results to the chat where you asked (or the home channel).

### Server Health Check {#server-health-check}

```
Every 6 hours, check disk usage with 'df -h', memory with 'free -h',
and Docker container status with 'docker ps'. Report anything unusual —
partitions above 80%, containers that have restarted, or high memory usage.
```

### Managing Scheduled Tasks {#managing-scheduled-tasks}

```bash
# From the CLI
noone cron list          # View all scheduled jobs
noone cron status        # Check if scheduler is running

# From Telegram chat
/cron list                # View jobs
/cron remove <job_id>     # Remove a job
```

<Warning>

<div className="doc-callout-title">

WARNING

</div>

Cron job prompts run in completely fresh sessions with no memory of prior conversations. Make sure each prompt contains **all** the context the agent needs — file paths, URLs, server addresses, and clear instructions.

</Warning>

---

## Production Tips {#production-tips}

### Use Docker for Safety {#use-docker-for-safety}

On a shared team bot, use Docker as the terminal backend so agent commands run in a container instead of on your host:

```bash
# In ~/.hermes/.env
TERMINAL_ENV=docker
TERMINAL_DOCKER_IMAGE=nousresearch/hermes-sandbox:desktop
```

Or in `~/.hermes/config.yaml`:

```yaml
terminal:
  backend: docker
  container_cpu: 1
  container_memory: 5120
  container_persistent: true
```

This way, even if someone asks the bot to run something destructive, your host system is protected.

### Monitor the Gateway {#monitor-the-gateway}

```bash
# Check if the gateway is running
noone gateway status

# Watch live logs (Linux)
journalctl --user -u hermes-gateway -f

# Watch live logs (macOS)
tail -f ~/.hermes/logs/gateway.log
```

### Keep {{app-name}} Updated {#keep-hermes-updated}

From Telegram, send `/update` to the bot — it will pull the latest version and restart. Or from the server:

```bash
noone update
noone gateway stop && noone gateway start
```

### Log Locations {#log-locations}

| What | Location |
|------|----------|
| Gateway logs | `journalctl --user -u hermes-gateway` (Linux) or `~/.hermes/logs/gateway.log` (macOS) |
| Cron job output | `~/.hermes/cron/output/{job_id}/{timestamp}.md` |
| Cron job definitions | `~/.hermes/cron/jobs.json` |
| Pairing data | `~/.hermes/pairing/` |
| Session history | `~/.hermes/sessions/` |

---

## Going Further {#going-further}

You've got a working team Telegram assistant. Here are some next steps:

- **[Security Guide](../user-guide/security.md)** — deep dive into authorization, container isolation, and command approval
- **[Messaging Gateway](../user-guide/messaging/index.md)** — full reference for gateway architecture, session management, and chat commands
- **[Telegram Setup](../user-guide/messaging/telegram.md)** — platform-specific details including voice messages and TTS
- **[Scheduled Tasks](../user-guide/features/cron.md)** — advanced cron scheduling with delivery options and cron expressions
- **[Context Files](../user-guide/features/context-files.md)** — AGENTS.md, SOUL.md, and .cursorrules for project knowledge
- **[Personality](../user-guide/features/personality.md)** — built-in personality presets and custom persona definitions
- **Add more platforms** — the same gateway can simultaneously run [Discord](../user-guide/messaging/discord.md), [Slack](../user-guide/messaging/slack.md), and [WhatsApp](../user-guide/messaging/whatsapp.md)

---

*Questions or issues? Open an issue on GitHub — contributions are welcome.*
