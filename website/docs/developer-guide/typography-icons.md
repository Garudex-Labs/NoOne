# Typography and icons

NoOne uses Inter Variable for graphical UI, labels and headings, and JetBrains Mono for code, logs and embedded terminals. Fonts are locally packaged in `agent_cli/data/ui` under their accompanying licenses; normal rendering requires no font CDN. Actual provider logos and user-authored imagery remain identity assets.

`typography.json` defines the shared families, weights (400/500/600/700) and role sizes (12/14/16/20/24/32 px). Regenerate its CSS with `node scripts/build/ui-assets.mjs`. Graphical frontends import `@noone/ui/fonts.css`; theme defaults use `@noone/ui/typography`. Keep spacing, window zoom, chat text scale and terminal metrics independent of these defaults. Explicit accessibility/custom font choices and non-Latin/emoji fallbacks remain supported.

Use static named exports and `iconSize` from `@noone/ui/icons` for generic controls. Dynamic persisted/menu/tool names use `AppIcon` or `getAppIcon` from `@noone/ui/app-icon`; both render the same Tabler outline family. Buttons retain ownership of their icon size and hit area. Decorative SVGs are hidden from assistive technology; icon-only controls still require accessible labels. Keep loading/state distinctions and reduced-motion behavior.

Python login/export pages embed the same trusted assets through `agent_cli.visual_assets`; the exported HTML stays self-contained. The update handoff embeds its required UI face during asset generation. The native torn-bundle recovery page intentionally uses system fonts because packaged assets may be missing. External terminal emulators and messaging clients choose their own fonts; retain width-safe CLI symbols and user skin overrides rather than trying to force SVGs or install fonts there.

The published plugin SDK's `Codicon` export is retained for compatibility, but now renders shared SVGs; internal components use `AppIcon`. No Codicon font payload remains in the app. Never patch guest artifact/preview content or third-party plugin visuals to enforce the host's typography.
