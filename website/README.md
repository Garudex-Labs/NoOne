# Documentation

The site uses the pinned Mintlify CLI in `package.json`. The renderer is pinned independently in `scripts/docs-cli.mjs`, with telemetry disabled. Its project root is
`website/docs/`; `docs.json` defines both languages, navigation, appearance and redirects.
Product wording, examples and branding are not changed by the platform migration.

## Install and preview

From the repository root, activate the project toolchain with `source ./activate`, then:

```bash
just docs-install
npm start --prefix website
```

The preview runs locally. It prepares catalog data and supported page components, but
does not regenerate author-written documentation, per-skill source pages, or existing data snapshots.
Hosted search needs account authentication; exported sites have a local search index.

## Authoring

Keep relative Markdown links, including anchors, so references still resolve on GitHub:
`[Profiles](../user-guide/profiles.md)` and
`[Bundles](../user-guide/features/skills.md#skill-bundles)`.
Use the supported `Note`, `Tip`, `Info`, `Warning` and `Danger` components for callouts.
Keep `{#anchor}` on cross-linked headings, including translated headings.

English pages retain their existing paths. Chinese pages live in `docs/zh-Hans/`;
untranslated pages have English fallback copies at their existing localized routes.
Interactive components are authored under `src/` and bundled into named JSX snippets
by `scripts/build-components.mjs`; edit the sources, not the generated snippets.

## Generate and validate

```bash
just docs-generate          # explicitly refresh the per-skill pages and navigation
just docs-generate-data     # refresh local blueprint and agent-index data
npm test --prefix website
just docs-check-links
npm run typecheck --prefix website
npm run build --prefix website
npm run check:links --prefix website
```

Preview, validation and export use resolved temporary copies to work around the pinned CLI’s variable-parser limitation; source files retain their supported variable syntax. The preview mirrors source edits and publishes the shared JSON feeds locally.

Do not use automatic content fixes: removing duplicate headings or rewriting examples
is outside the migration's content-preservation scope.

`scripts/migration-ledger.json` records source-to-target locations and category metadata.
The original inventory contains 700 pages. Separately approved integration removal
(plan 022) and TUI removal (plan 025) delete their dedicated pages; do not recreate
them during migration or count them as accidentally lost content. Identity changes
are owned by plans 017/024, not this migration. Final content parity against the
remaining source is not yet certified. The immutable source snapshots, comparison
results and known unavailable pinned READMEs are recorded with execution plan 020.

## Static deployment

```bash
npm run export --prefix website
```

The pinned native renderer creates `website/build/docs.zip` for the `/docs` subpath;
the ZIP writer streams files to avoid loading the entire site into memory. It retains
client-facing catalog feeds, OAuth metadata, legacy redirects, both locales, and the
root-level `llms.txt` and `llms-full.txt` aliases.

The complete export currently exceeds the existing Pages hosting size limit. Publishing
requires a hosting decision; do not remove pages or relax deployment checks to make it fit.
Managed publishing uses `website/docs/` as the documentation project root.
No documentation account, production publication or domain changes are performed locally.

CI runs the same validation commands. Diagram checks still use `ascii-guard` through
`just docs-lint-diagrams`.
