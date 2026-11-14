---
title: Official Sources & Phishing Safety
description: Verify project resources and distinguish them from third-party providers.
---

# Official Sources & Phishing Safety {#official-domains--phishing-safety}

Use the canonical repository to verify anything that claims to be NoOne. A copied logo, a shortened link, or a familiar name is not proof of ownership.

## Official sources {#official-sources}

Garudex Labs maintains [NoOne](https://github.com/Garudex-Labs/NoOne). The maintainer is RAWx18; private security reports go to `rawx18.dev@gmail.com` as described in the repository's security policy.

| Address | What it is |
|---|---|
| [Source repository](https://github.com/Garudex-Labs/NoOne) | Source, installer scripts, and the Nix flake |
| [Repository documentation](https://github.com/Garudex-Labs/NoOne/tree/main/website/docs) | The maintained documentation source |
| [Releases](https://github.com/Garudex-Labs/NoOne/releases) | Published release assets, when available |
| [Issues](https://github.com/Garudex-Labs/NoOne/issues) | Public bug reports and project questions |

No dedicated NoOne documentation host, download domain, or community account is declared here. Do not treat an upstream service as a NoOne-owned deployment.

## Installing from an official source {#installing-from-an-official-source}

Read the scripts in the repository before running them. Raw files served from `raw.githubusercontent.com/Garudex-Labs/NoOne/...` belong to the same repository.

```bash
# Linux / macOS / WSL2
curl -fsSL https://raw.githubusercontent.com/Garudex-Labs/NoOne/main/scripts/install.sh | bash
```

```powershell
# Windows (native)
iex (irm https://raw.githubusercontent.com/Garudex-Labs/NoOne/main/scripts/install.ps1)
```

See [Installation](./installation.md), [Platform Support](./platform-support.md), [Termux](./termux.md), [Nix & NixOS](./nix-setup.md), and [Docker](../user-guide/docker.md) for the retained installation routes. Verify release availability and signing/update ownership before installing a native package.

## Third-party providers and compatibility {#third-party-providers-and-compatibility}

Nous Research operates `nousresearch.com` and its subdomains. [Nous Portal](https://portal.nousresearch.com/) and `inference-api.nousresearch.com` are third-party sign-in, billing, and inference services used by the optional Nous integration; they are not operated by Garudex Labs. The inherited `hermes-assets.nousresearch.com` Termux repository and signed package identities remain compatibility boundaries, not a claim of NoOne ownership. Verify the publisher and trust requirements in the relevant installation guide.

## Not official {#not-official}

- Unlisted accounts or domains claiming to be NoOne, even if their name or artwork resembles this project. Read the whole hostname: a trusted domain followed by `.example.net` is not that trusted domain.
- Cryptocurrency promotions. No NoOne token is declared by this project.
- Accounts that mass-mention users with shortened links or unsolicited offers of credits, alternate downloads, or partnerships.

## If you receive a suspicious message {#if-you-receive-a-suspicious-message}

1. Do not click shortened links, enter credentials, or connect wallets.
2. Report the account to its platform.
3. Compare the repository owner and full hostname with the sources above.
4. Report public impersonation concerns in [project issues](https://github.com/Garudex-Labs/NoOne/issues); report private security vulnerabilities through the repository's security policy, not a public issue.

NoOne is MIT-licensed and free to self-host. Third-party subscriptions are separate products.
