# NoOne presentation assets

`typography.json` is the family/size/weight contract. Run `node scripts/build/ui-assets.mjs` after editing it to regenerate `typography.css`. Frontends import it through `@noone/ui`; Python pages embed the same packaged faces with `visual_assets.inline_typography_css`. Documentation copies these assets during its existing component build.

- Inter Variable normal/italic: Inter v4.1, source commit `e3a3d4c57d5ecc01453a575621882a384c1995a3`, SIL OFL 1.1 (`Inter-OFL.txt`).
- JetBrains Mono: existing NoOne normal/bold/italic WOFF2 assets consolidated here; font license retained in `JetBrainsMono-OFL.txt` (font license is not the upstream Apache source-code license).
- Tabler static outline SVGs: v3.49.0, source commit `bbed884d15354b5cebf2493371f20dc2d5e83eaf`, MIT (`Tabler-MIT.txt`). React consumers use the same pinned package release. `icons.json` contains these exact SVGs for non-React/standalone consumers; it is not the full vendor icon library.

Fallbacks retain international scripts, emoji and monospace metrics. User-selected families, UI zoom and chat/terminal size preferences remain separate from the default system. Actual brand marks are not replaced with generic glyphs.
