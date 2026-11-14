---
title: "Signal"
description: "Set up the agent as a Signal messenger bot via signal-cli daemon"
---

# Signal Setup {#signal-setup}

{{app-name}} connects to Signal through the [signal-cli](https://github.com/AsamK/signal-cli) daemon running in HTTP mode. The adapter streams messages in real-time via SSE (Server-Sent Events) and sends responses via JSON-RPC.

Signal is the most privacy-focused mainstream messenger — end-to-end encrypted by default, open-source protocol, minimal metadata collection. This makes it ideal for security-sensitive agent workflows.

<Info>

<div className="doc-callout-title">

No New Python Dependencies

</div>

The Signal adapter uses `httpx` (already a core {{app-name}} dependency) for all communication. No additional Python packages are required. You just need signal-cli installed externally.

</Info>

---

## Prerequisites {#prerequisites}

- **signal-cli** — Java-based Signal client ([GitHub](https://github.com/AsamK/signal-cli))
- **Java 17+** runtime — required by signal-cli
- **A phone number** with Signal installed (for linking as a secondary device)

### Installing signal-cli {#installing-signal-cli}

```bash
# macOS
brew install signal-cli

# Linux (download latest release)
VERSION=$(curl -Ls -o /dev/null -w %{url_effective} \
  https://github.com/AsamK/signal-cli/releases/latest | sed 's/^.*\/v//')
curl -L -O "https://github.com/AsamK/signal-cli/releases/download/v${VERSION}/signal-cli-${VERSION}.tar.gz"
sudo tar xf "signal-cli-${VERSION}.tar.gz" -C /opt
sudo ln -sf "/opt/signal-cli-${VERSION}/bin/signal-cli" /usr/local/bin/
```

<Warning>

<div className="doc-callout-title">

CAUTION

</div>

signal-cli is **not** in apt or snap repositories. The Linux install above downloads directly from [GitHub releases](https://github.com/AsamK/signal-cli/releases).

</Warning>

---

## Step 1: Link Your Signal Account {#step-1-link-your-signal-account}

Signal-cli works as a **linked device** — like WhatsApp Web, but for Signal. Your phone stays the primary device.

```bash
# Generate a linking URI (displays a QR code or link)
signal-cli link -n "HermesAgent"
```

1. Open **Signal** on your phone
2. Go to **Settings → Linked Devices**
3. Tap **Link New Device**
4. Scan the QR code or enter the URI

---

## Step 2: Start the signal-cli Daemon {#step-2-start-the-signal-cli-daemon}

```bash
# Replace +1234567890 with your Signal phone number (E.164 format)
signal-cli --account +1234567890 daemon --http 127.0.0.1:8080
```

<Tip>

<div className="doc-callout-title">

TIP

</div>

Keep this running in the background. You can use `systemd`, `tmux`, `screen`, or run it as a service.

</Tip>

Verify it's running:

```bash
curl http://127.0.0.1:8080/api/v1/check
# Should return: {"versions":{"signal-cli":...}}
```

---

## Step 3: Configure {{app-name}} {#step-3-configure-hermes}

The easiest way:

```bash
noone gateway setup
```

Select **Signal** from the platform menu. The wizard will:

1. Check if signal-cli is installed
2. Prompt for the HTTP URL (default: `http://127.0.0.1:8080`)
3. Test connectivity to the daemon
4. Ask for your account phone number
5. Configure allowed users and access policies

### Manual Configuration {#manual-configuration}

Add to `~/.hermes/.env`:

```bash
# Required
SIGNAL_HTTP_URL=http://127.0.0.1:8080
SIGNAL_ACCOUNT=+1234567890

# Security (recommended)
SIGNAL_ALLOWED_USERS=+1234567890,+0987654321    # Comma-separated E.164 numbers or UUIDs

# Optional
SIGNAL_GROUP_ALLOWED_USERS=groupId1,groupId2     # Enable groups (omit to disable, * for all)
SIGNAL_HOME_CHANNEL=+1234567890                  # Default delivery target for cron jobs
```

Then start the gateway:

```bash
noone gateway              # Foreground
noone gateway install      # Install as a user service
sudo noone gateway install --system   # Linux only: boot-time system service
```

---

## Access Control {#access-control}

### DM Access {#dm-access}

DM access follows the same pattern as all other {{app-name}} platforms:

1. **`SIGNAL_ALLOWED_USERS` set** → only those users can message
2. **No allowlist set** → unknown users get a DM pairing code (approve via `hermes pairing approve signal CODE`)
3. **`SIGNAL_ALLOW_ALL_USERS=true`** → anyone can message (use with caution)

### Group Access {#group-access}

Group access is controlled by the `SIGNAL_GROUP_ALLOWED_USERS` env var:

| Configuration | Behavior |
|---------------|----------|
| Not set (default) | All group messages are ignored. The bot only responds to DMs. |
| Set with group IDs | Only listed groups are monitored (e.g., `groupId1,groupId2`). |
| Set to `*` | The bot responds in any group it's a member of. |

---

## Features {#features}

### Attachments {#attachments}

The adapter supports sending and receiving media in both directions.

**Incoming** (user → agent):

- **Images** — PNG, JPEG, GIF, WebP (auto-detected via magic bytes)
- **Audio** — MP3, OGG, WAV, M4A (voice messages transcribed if Whisper is configured)
- **Documents** — PDF, ZIP, and other file types

**Outgoing** (agent → user):

The agent can send media files via `MEDIA:` tags in responses. The following delivery methods are supported:

- **Images** — `send_multiple_images` and `send_image_file` send PNG, JPEG, GIF, WebP as native Signal attachments
- **Voice** — `send_voice` sends audio files (OGG, MP3, WAV, M4A, AAC) as attachments
- **Video** — `send_video` sends MP4 video files
- **Documents** — `send_document` sends any file type (PDF, ZIP, etc.)

All outgoing media goes through Signal's standard attachment API. Unlike some platforms, Signal does not distinguish between voice messages and file attachments at the protocol level.

Attachment size limit: **100 MB** (both directions).
<Warning>

<div className="doc-callout-title">

WARNING

</div>

**Signal servers will rate-limit attachment uploads**, the adapter uses a scheduler for multiple image sending that batches images in groups of 32 and throttles uploads to match the Signal server policy.

</Warning>

### Native Formatting, Reply Quotes, and Reactions {#native-formatting-reply-quotes-and-reactions}

Signal messages render with **native formatting** instead of literal markdown characters. The adapter converts markdown (`**bold**`, `*italic*`, `` `code` ``, `~~strike~~`, `||spoiler||`, headings) into Signal `bodyRanges` so the text shows up with real styling on the recipient's client rather than as visible `**` / `` ` `` characters.

**Reply quotes.** When {{app-name}} replies to a specific message, it now posts a native reply that quotes the original — same UI affordance Signal users see when they use "Reply" themselves. This is automatic for replies generated in response to an inbound message.

**Reactions.** The agent can react to messages via the standard reaction API; reactions surface in Signal as emoji reactions on the referenced message rather than as extra text.

None of this requires additional config — it ships on by default in recent signal-cli builds. If your `signal-cli` version is too old, {{app-name}} falls back to plaintext delivery and logs a one-time warning.

### Long Messages {#long-messages}

Signal caps a single message at **8,000 characters**. {{app-name}} splits longer responses into numbered chunks (`(1/3)`, `(2/3)`, …) automatically instead of truncating them. This applies to every delivery path — live conversation replies, cron job deliveries, `noone send`, and MCP `send_message` calls — and native formatting (bold, italic, code, spoilers) is preserved across chunk boundaries.

### Typing Indicators {#typing-indicators}

The bot sends typing indicators while processing messages, refreshing every 8 seconds.

### Tool Progress Display {#tool-progress-display}

Signal does not support editing already-sent messages. {{app-name}} therefore suppresses gateway tool-progress bubbles on Signal, even when `/verbose` is enabled and saves a non-`off` mode for the platform.

You can still see tool activity in the CLI, and final Signal replies can include normal assistant output. If you need live per-tool progress in chat, use a messaging platform with message editing support.

### Phone Number Redaction {#phone-number-redaction}

All phone numbers are automatically redacted in logs:
- `+15551234567` → `+155****4567`
- This applies to both {{app-name}} gateway logs and the global redaction system

### Note to Self (Single-Number Setup) {#note-to-self-single-number-setup}

If you run signal-cli as a **linked secondary device** on your own phone number (rather than a separate bot number), you can interact with {{app-name}} through Signal's "Note to Self" feature.

Just send a message to yourself from your phone — signal-cli picks it up and {{app-name}} responds in the same conversation.

**How it works:**
- "Note to Self" messages arrive as `syncMessage.sentMessage` envelopes
- The adapter detects when these are addressed to the bot's own account and processes them as regular inbound messages
- Echo-back protection (sent-timestamp tracking) prevents infinite loops — the bot's own replies are filtered out automatically

**No extra configuration needed.** This works automatically as long as `SIGNAL_ACCOUNT` matches your phone number.

### Health Monitoring {#health-monitoring}

The adapter monitors the SSE connection and automatically reconnects if:
- The connection drops (with exponential backoff: 2s → 60s)
- No activity is detected for 120 seconds (pings signal-cli to verify)

---

## Troubleshooting {#troubleshooting}

| Problem | Solution |
|---------|----------|
| **"Cannot reach signal-cli"** during setup | Ensure signal-cli daemon is running: `signal-cli --account +YOUR_NUMBER daemon --http 127.0.0.1:8080` |
| **Messages not received** | Check that `SIGNAL_ALLOWED_USERS` includes the sender's number in E.164 format (with `+` prefix) |
| **"signal-cli not found on PATH"** | Install signal-cli and ensure it's in your PATH, or use Docker |
| **Connection keeps dropping** | Check signal-cli logs for errors. Ensure Java 17+ is installed. |
| **Group messages ignored** | Configure `SIGNAL_GROUP_ALLOWED_USERS` with specific group IDs, or `*` to allow all groups. |
| **Bot responds to no one** | Configure `SIGNAL_ALLOWED_USERS`, use DM pairing, or explicitly allow all users through gateway policy if you want broader access. |
| **Duplicate messages** | Ensure only one signal-cli instance is listening on your phone number |

---

## Security {#security}

<Warning>

<div className="doc-callout-title">

WARNING

</div>

**Always configure access controls.** The bot has terminal access by default. Without `SIGNAL_ALLOWED_USERS` or DM pairing, the gateway denies all incoming messages as a safety measure.

</Warning>

- Phone numbers are redacted in all log output
- Use DM pairing or explicit allowlists for safe onboarding of new users
- Keep groups disabled unless you specifically need group support, or allowlist only the groups you trust
- Signal's end-to-end encryption protects message content in transit
- The signal-cli session data in `~/.local/share/signal-cli/` contains account credentials — protect it like a password

---

## Environment Variables Reference {#environment-variables-reference}

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `SIGNAL_HTTP_URL` | Yes | — | signal-cli HTTP endpoint |
| `SIGNAL_ACCOUNT` | Yes | — | Bot phone number (E.164) |
| `SIGNAL_ALLOWED_USERS` | No | — | Comma-separated phone numbers/UUIDs |
| `SIGNAL_GROUP_ALLOWED_USERS` | No | — | Group IDs to monitor, or `*` for all (omit to disable groups) |
| `SIGNAL_ALLOW_ALL_USERS` | No | `false` | Allow any user to interact (skip allowlist) |
| `SIGNAL_HOME_CHANNEL` | No | — | Default delivery target for cron jobs |
