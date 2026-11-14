---
title: Application display identity
description: Configure the application's display name without changing installation or runtime identifiers.
---

# Application display identity {#application-display-identity}

The default display name is **{{app-name}}**. Its only authored definition is
`agent_cli/data/application_identity.json`, shared by Python, the frontends,
and build tooling.

Use the existing configuration mechanism to supply a custom name:

```yaml
display:
  app_name: "My Personal Agent"
```

Alternatively, run `noone config set display.app_name "My Personal Agent"`.
Missing, blank, or invalid values fall back to the application default. Names
are single-line Unicode text, at most 128 characters. No separate naming
Settings page is provided yet.

The setting is cosmetic. It does not rename the `hermes` command, `HERMES_*`
variables, configuration/data directories, profiles, URI schemes, signed
package identities, executable names, or update feeds. Existing configurations
remain valid. Trained wake-word phrases and external service names are also
unchanged.

Runtime surfaces read the owning profile's configuration. A conversation's
stock prompt resolves the name when constructed and remains frozen; changing
the display name does not rewrite existing conversations or custom personas.
Stock SOUL text is rendered in memory without modifying the user's file.

Website metadata and installed OS metadata use build-time presentation. They
require a rebuild to change, rather than tracking each user's local settings
live. Standalone Markdown uses neutral terminology where dynamic rendering
is unavailable. Historical upstream attribution is separate from product
presentation and is retained.
