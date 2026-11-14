(function () {
  "use strict";
  // hermes-achievements dashboard plugin
  // Originally authored by @PCinkusz — https://github.com/PCinkusz/hermes-achievements (MIT).
  // Bundled into hermes-agent. Upstream repo remains the staging ground for new
  // badges and UI iteration; the in-progress scan banner below is a small addition
  // layered on top of the original dist bundle.
  const SDK = window.__HERMES_PLUGIN_SDK__;
  if (!SDK || !window.__HERMES_PLUGINS__) return;

  const React = SDK.React;
  const hooks = SDK.hooks;
  const C = SDK.components;
  const cn = SDK.utils.cn;
  // useI18n is a hook so each component that needs translations calls it
  // locally (see AchievementsPage, AchievementCard, ShareDialog, LoadingPage).
  // Older host dashboards may not expose useI18n yet; fall back to a no-op
  // shim that returns en values so the bundle still renders against an older
  // host SDK.  English fallback strings live alongside each call site.
  const useI18n = SDK.useI18n || function () { return { t: { achievements: null }, locale: "en" }; };

  // Resolve a translation by dotted path (e.g. "card.share_text"); fall back to
  // the English string passed in.  Used inside components after they call
  // useI18n() so they can still render against an older host SDK that doesn't
  // expose the achievements namespace yet.
  function tx(t, path, fallback, vars) {
    let node = t && t.achievements;
    if (node) {
      const parts = path.split(".");
      for (let i = 0; i < parts.length; i++) {
        if (node && typeof node === "object" && parts[i] in node) {
          node = node[parts[i]];
        } else { node = null; break; }
      }
    }
    let str = (typeof node === "string") ? node : fallback;
    if (vars) {
      for (const k in vars) {
        str = str.replace(new RegExp("\\{" + k + "\\}", "g"), vars[k]);
      }
    }
    return str;
  }

  const TABLER = {"flame": "<path d=\"M12 10.941c2.333 -3.308 .167 -7.823 -1 -8.941c0 3.395 -2.235 5.299 -3.667 6.706c-1.43 1.408 -2.333 3.294 -2.333 5.588c0 3.704 3.134 6.706 7 6.706c3.866 0 7 -3.002 7 -6.706c0 -1.712 -1.232 -4.403 -2.333 -5.588c-2.084 3.353 -3.257 3.353 -4.667 2.235\" />", "avalanche": "<path d=\"M3 20h18l-6.921 -14.612a2.3 2.3 0 0 0 -4.158 0l-6.921 14.612\" />\n  <path d=\"M7.5 11l2 2.5l2.5 -2.5l2 3l2.5 -2\" />", "nodes": "<path d=\"M3 17a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2v2a2 2 0 0 1 -2 2h-2a2 2 0 0 1 -2 -2l0 -2\" />\n  <path d=\"M15 17a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2v2a2 2 0 0 1 -2 2h-2a2 2 0 0 1 -2 -2l0 -2\" />\n  <path d=\"M9 5a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2v2a2 2 0 0 1 -2 2h-2a2 2 0 0 1 -2 -2l0 -2\" />\n  <path d=\"M6 15v-1a2 2 0 0 1 2 -2h8a2 2 0 0 1 2 2v1\" />\n  <path d=\"M12 9l0 3\" />", "rocket": "<path d=\"M4 13a8 8 0 0 1 7 7a6 6 0 0 0 3 -5a9 9 0 0 0 6 -8a3 3 0 0 0 -3 -3a9 9 0 0 0 -8 6a6 6 0 0 0 -5 3\" />\n  <path d=\"M7 14a6 6 0 0 0 -3 6a6 6 0 0 0 6 -3\" />\n  <path d=\"M14 9a1 1 0 1 0 2 0a1 1 0 1 0 -2 0\" />", "branch": "<path d=\"M5 18a2 2 0 1 0 4 0a2 2 0 1 0 -4 0\" />\n  <path d=\"M5 6a2 2 0 1 0 4 0a2 2 0 1 0 -4 0\" />\n  <path d=\"M15 6a2 2 0 1 0 4 0a2 2 0 1 0 -4 0\" />\n  <path d=\"M7 8l0 8\" />\n  <path d=\"M9 18h6a2 2 0 0 0 2 -2v-5\" />\n  <path d=\"M14 14l3 -3l3 3\" />", "daemon": "<path d=\"M20 11a8.1 8.1 0 0 0 -15.5 -2m-.5 -4v4h4\" />\n  <path d=\"M4 13a8.1 8.1 0 0 0 15.5 2m.5 4v-4h-4\" />", "clock": "<path d=\"M3 12a9 9 0 1 0 18 0a9 9 0 0 0 -18 0\" />\n  <path d=\"M12 7v5l3 3\" />", "warning": "<path d=\"M12 9v4\" />\n  <path d=\"M10.363 3.591l-8.106 13.534a1.914 1.914 0 0 0 1.636 2.871h16.214a1.914 1.914 0 0 0 1.636 -2.87l-8.106 -13.536a1.914 1.914 0 0 0 -3.274 0\" />\n  <path d=\"M12 16h.01\" />", "wine": "<path d=\"M8 21l8 0\" />\n  <path d=\"M12 15l0 6\" />\n  <path d=\"M17 3l1 7c0 3.012 -2.686 5 -6 5s-6 -1.988 -6 -5l1 -7h10\" />\n  <path d=\"M6 10a5 5 0 0 1 6 0a5 5 0 0 0 6 0\" />", "scroll": "<path d=\"M17 20h-11a3 3 0 0 1 0 -6h11a3 3 0 0 0 0 6h1a3 3 0 0 0 3 -3v-11a2 2 0 0 0 -2 -2h-10a2 2 0 0 0 -2 2v8\" />", "plug": "<path d=\"M9.785 6l8.215 8.215l-2.054 2.054a5.81 5.81 0 1 1 -8.215 -8.215l2.054 -2.054\" />\n  <path d=\"M4 20l3.5 -3.5\" />\n  <path d=\"M15 4l-3.5 3.5\" />\n  <path d=\"M20 9l-3.5 3.5\" />", "lock": "<path d=\"M5 13a2 2 0 0 1 2 -2h10a2 2 0 0 1 2 2v6a2 2 0 0 1 -2 2h-10a2 2 0 0 1 -2 -2v-6\" />\n  <path d=\"M11 16a1 1 0 1 0 2 0a1 1 0 0 0 -2 0\" />\n  <path d=\"M8 11v-4a4 4 0 1 1 8 0v4\" />", "package_skull": "<path d=\"M12 3l8 4.5l0 9l-8 4.5l-8 -4.5l0 -9l8 -4.5\" />\n  <path d=\"M12 12l8 -4.5\" />\n  <path d=\"M12 12l0 9\" />\n  <path d=\"M12 12l-8 -4.5\" />\n  <path d=\"M16 5.25l-8 4.5\" />", "restart": "<path d=\"M20 11a8.1 8.1 0 0 0 -15.5 -2m-.5 -4v4h4\" />\n  <path d=\"M4 13a8.1 8.1 0 0 0 15.5 2m.5 4v-4h-4\" />", "key": "<path d=\"M16.555 3.843l3.602 3.602a2.877 2.877 0 0 1 0 4.069l-2.643 2.643a2.877 2.877 0 0 1 -4.069 0l-.301 -.301l-6.558 6.558a2 2 0 0 1 -1.239 .578l-.175 .008h-1.172a1 1 0 0 1 -.993 -.883l-.007 -.117v-1.172a2 2 0 0 1 .467 -1.284l.119 -.13l.414 -.414h2v-2h2v-2l2.144 -2.144l-.301 -.301a2.877 2.877 0 0 1 0 -4.069l2.643 -2.643a2.877 2.877 0 0 1 4.069 0\" />\n  <path d=\"M15 9h.01\" />", "colon": "<path d=\"M7 4a2 2 0 0 0 -2 2v3a2 3 0 0 1 -2 3a2 3 0 0 1 2 3v3a2 2 0 0 0 2 2\" />\n  <path d=\"M17 4a2 2 0 0 1 2 2v3a2 3 0 0 0 2 3a2 3 0 0 0 -2 3v3a2 2 0 0 1 -2 2\" />", "container": "<path d=\"M20 4v.01\" />\n  <path d=\"M20 20v.01\" />\n  <path d=\"M20 16v.01\" />\n  <path d=\"M20 12v.01\" />\n  <path d=\"M20 8v.01\" />\n  <path d=\"M8 5a1 1 0 0 1 1 -1h6a1 1 0 0 1 1 1v14a1 1 0 0 1 -1 1h-6a1 1 0 0 1 -1 -1l0 -14\" />\n  <path d=\"M4 4v.01\" />\n  <path d=\"M4 20v.01\" />\n  <path d=\"M4 16v.01\" />\n  <path d=\"M4 12v.01\" />\n  <path d=\"M4 8v.01\" />", "melting_clock": "<path d=\"M3 12a9 9 0 1 0 18 0a9 9 0 0 0 -18 0\" />\n  <path d=\"M12 7v5l3 3\" />", "pencil": "<path d=\"M4 20h4l10.5 -10.5a2.828 2.828 0 1 0 -4 -4l-10.5 10.5v4\" />\n  <path d=\"M13.5 6.5l4 4\" />", "blueprint": "<path d=\"M5 4h14a1 1 0 0 1 1 1v5a1 1 0 0 1 -1 1h-7a1 1 0 0 0 -1 1v7a1 1 0 0 1 -1 1h-5a1 1 0 0 1 -1 -1v-14a1 1 0 0 1 1 -1\" />\n  <path d=\"M4 8l2 0\" />\n  <path d=\"M4 12l3 0\" />\n  <path d=\"M4 16l2 0\" />\n  <path d=\"M8 4l0 2\" />\n  <path d=\"M12 4l0 3\" />\n  <path d=\"M16 4l0 2\" />", "pixel": "<path d=\"M4 5a1 1 0 1 0 2 0a1 1 0 1 0 -2 0\" />\n  <path d=\"M11 5a1 1 0 1 0 2 0a1 1 0 1 0 -2 0\" />\n  <path d=\"M18 5a1 1 0 1 0 2 0a1 1 0 1 0 -2 0\" />\n  <path d=\"M4 12a1 1 0 1 0 2 0a1 1 0 1 0 -2 0\" />\n  <path d=\"M11 12a1 1 0 1 0 2 0a1 1 0 1 0 -2 0\" />\n  <path d=\"M18 12a1 1 0 1 0 2 0a1 1 0 1 0 -2 0\" />\n  <path d=\"M4 19a1 1 0 1 0 2 0a1 1 0 1 0 -2 0\" />\n  <path d=\"M11 19a1 1 0 1 0 2 0a1 1 0 1 0 -2 0\" />\n  <path d=\"M18 19a1 1 0 1 0 2 0a1 1 0 1 0 -2 0\" />", "ship": "<path d=\"M2 20a2.4 2.4 0 0 0 2 1a2.4 2.4 0 0 0 2 -1a2.4 2.4 0 0 1 2 -1a2.4 2.4 0 0 1 2 1a2.4 2.4 0 0 0 2 1a2.4 2.4 0 0 0 2 -1a2.4 2.4 0 0 1 2 -1a2.4 2.4 0 0 1 2 1a2.4 2.4 0 0 0 2 1a2.4 2.4 0 0 0 2 -1\" />\n  <path d=\"M4 18l-1 -5h18l-2 4\" />\n  <path d=\"M5 13v-6h8l4 6\" />\n  <path d=\"M7 7v-4h-1\" />", "spark_cursor": "<path d=\"M7.904 17.563a1.2 1.2 0 0 0 2.228 .308l2.09 -3.093l4.907 4.907a1.067 1.067 0 0 0 1.509 0l1.047 -1.047a1.067 1.067 0 0 0 0 -1.509l-4.907 -4.907l3.113 -2.09a1.2 1.2 0 0 0 -.309 -2.228l-13.582 -3.904l3.904 13.563\" />", "needle": "<path d=\"M3 21c-.667 -.667 3.262 -6.236 11.785 -16.709a3.5 3.5 0 1 1 5.078 4.791c-10.575 8.612 -16.196 12.585 -16.863 11.918\" />\n  <path d=\"M17.5 6.5l-1 1\" />", "hammer_scroll": "<path d=\"M11.414 10l-7.383 7.418a2.091 2.091 0 0 0 0 2.967a2.11 2.11 0 0 0 2.976 0l7.407 -7.385\" />\n  <path d=\"M18.121 15.293l2.586 -2.586a1 1 0 0 0 0 -1.414l-7.586 -7.586a1 1 0 0 0 -1.414 0l-2.586 2.586a1 1 0 0 0 0 1.414l7.586 7.586a1 1 0 0 0 1.414 0\" />", "anvil": "<path d=\"M11.414 10l-7.383 7.418a2.091 2.091 0 0 0 0 2.967a2.11 2.11 0 0 0 2.976 0l7.407 -7.385\" />\n  <path d=\"M18.121 15.293l2.586 -2.586a1 1 0 0 0 0 -1.414l-7.586 -7.586a1 1 0 0 0 -1.414 0l-2.586 2.586a1 1 0 0 0 0 1.414l7.586 7.586a1 1 0 0 0 1.414 0\" />", "crystal": "<path d=\"M6 5h12l3 5l-8.5 9.5a.7 .7 0 0 1 -1 0l-8.5 -9.5l3 -5\" />\n  <path d=\"M10 12l-2 -2.2l.6 -1\" />", "palace": "<path d=\"M3 21l18 0\" />\n  <path d=\"M3 10l18 0\" />\n  <path d=\"M5 6l7 -3l7 3\" />\n  <path d=\"M4 10l0 11\" />\n  <path d=\"M20 10l0 11\" />\n  <path d=\"M8 14l0 3\" />\n  <path d=\"M12 14l0 3\" />\n  <path d=\"M16 14l0 3\" />", "dragon": "<path d=\"M10.706 8.849l-5.706 -3.301l-2 6.452l3.5 -1.973l.5 2.973l3.555 -1.385\" />\n  <path d=\"M15 9c0 3.5 4 3 4 7c0 3 -3 5 -5.5 5s-6 -.5 -6.5 -5c2 2 6.592 3.043 7.5 1c1.094 -2.461 -4 -3.459 -4 -6.5c0 -2.062 .5 -2.5 1.8 -3.2\" />\n  <path d=\"M18 6a3 3 270 1 0 -3 3h5l1 -3h-3\" />\n  <path d=\"M15 3h-8l5 3\" />", "antenna": "<path d=\"M20 4v8\" />\n  <path d=\"M16 4.5v7\" />\n  <path d=\"M12 5v16\" />\n  <path d=\"M8 5.5v5\" />\n  <path d=\"M4 6v4\" />\n  <path d=\"M20 8h-16\" />", "puzzle": "<path d=\"M4 7h3a1 1 0 0 0 1 -1v-1a2 2 0 0 1 4 0v1a1 1 0 0 0 1 1h3a1 1 0 0 1 1 1v3a1 1 0 0 0 1 1h1a2 2 0 0 1 0 4h-1a1 1 0 0 0 -1 1v3a1 1 0 0 1 -1 1h-3a1 1 0 0 1 -1 -1v-1a2 2 0 0 0 -4 0v1a1 1 0 0 1 -1 1h-3a1 1 0 0 1 -1 -1v-3a1 1 0 0 1 1 -1h1a2 2 0 0 0 0 -4h-1a1 1 0 0 1 -1 -1v-3a1 1 0 0 1 1 -1\" />", "rewind": "<path d=\"M21 5v14l-8 -7l8 -7\" />\n  <path d=\"M10 5v14l-8 -7l8 -7\" />", "spiral": "<path d=\"M10 12.057a1.9 1.9 0 0 0 .614 .743c1.06 .713 2.472 .112 3.043 -.919c.839 -1.513 -.022 -3.368 -1.525 -4.08c-2 -.95 -4.371 .154 -5.24 2.086c-1.095 2.432 .29 5.248 2.71 6.246c2.931 1.208 6.283 -.418 7.438 -3.255c1.36 -3.343 -.557 -7.134 -3.896 -8.41c-3.855 -1.474 -8.2 .68 -9.636 4.422c-1.63 4.253 .823 9.024 5.082 10.576c4.778 1.74 10.118 -.941 11.833 -5.59a9.354 9.354 0 0 0 .577 -2.813\" />", "quote": "<path d=\"M10 11h-4a1 1 0 0 1 -1 -1v-3a1 1 0 0 1 1 -1h3a1 1 0 0 1 1 1v6c0 2.667 -1.333 4.333 -4 5\" />\n  <path d=\"M19 11h-4a1 1 0 0 1 -1 -1v-3a1 1 0 0 1 1 -1h3a1 1 0 0 1 1 1v6c0 2.667 -1.333 4.333 -4 5\" />", "compass": "<path d=\"M8 16l2 -6l6 -2l-2 6l-6 2\" />\n  <path d=\"M3 12a9 9 0 1 0 18 0a9 9 0 1 0 -18 0\" />\n  <path d=\"M12 3l0 2\" />\n  <path d=\"M12 19l0 2\" />\n  <path d=\"M3 12l2 0\" />\n  <path d=\"M19 12l2 0\" />", "browser": "<path d=\"M4 8h16\" />\n  <path d=\"M4 6a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2l0 -12\" />\n  <path d=\"M8 4v4\" />", "terminal": "<path d=\"M8 9l3 3l-3 3\" />\n  <path d=\"M13 15l3 0\" />\n  <path d=\"M3 6a2 2 0 0 1 2 -2h14a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2l0 -12\" />", "wand": "<path d=\"M6 21l15 -15l-3 -3l-15 15l3 3\" />\n  <path d=\"M15 6l3 3\" />\n  <path d=\"M9 3a2 2 0 0 0 2 2a2 2 0 0 0 -2 2a2 2 0 0 0 -2 -2a2 2 0 0 0 2 -2\" />\n  <path d=\"M19 13a2 2 0 0 0 2 2a2 2 0 0 0 -2 2a2 2 0 0 0 -2 -2a2 2 0 0 0 2 -2\" />", "folder": "<path d=\"M5 4h4l3 3h7a2 2 0 0 1 2 2v8a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2v-11a2 2 0 0 1 2 -2\" />", "eye": "<path d=\"M10 12a2 2 0 1 0 4 0a2 2 0 0 0 -4 0\" />\n  <path d=\"M21 12c-2.4 4 -5.4 6 -9 6c-3.6 0 -6.6 -2 -9 -6c2.4 -4 5.4 -6 9 -6c3.6 0 6.6 2 9 6\" />", "wave": "<path d=\"M21 12h-2c-.894 0 -1.662 -.857 -1.761 -2c-.296 -3.45 -.749 -6 -2.749 -6s-2.5 3.582 -2.5 8s-.5 8 -2.5 8s-2.452 -2.547 -2.749 -6c-.1 -1.147 -.867 -2 -1.763 -2h-2\" />", "swap": "<path d=\"M7 10h14l-4 -4\" />\n  <path d=\"M17 14h-14l4 4\" />", "router": "<path d=\"M3 15a2 2 0 0 1 2 -2h14a2 2 0 0 1 2 2v4a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2l0 -4\" />\n  <path d=\"M17 17l0 .01\" />\n  <path d=\"M13 17l0 .01\" />\n  <path d=\"M15 13l0 -2\" />\n  <path d=\"M11.75 8.75a4 4 0 0 1 6.5 0\" />\n  <path d=\"M8.5 6.5a8 8 0 0 1 13 0\" />", "codex": "<path d=\"M7 8l-4 4l4 4\" />\n  <path d=\"M17 8l4 4l-4 4\" />\n  <path d=\"M14 4l-4 16\" />", "prism": "<path d=\"M12 9v13\" />\n  <path d=\"M19 17.17l-5.98 4.485a1.7 1.7 0 0 1 -2.04 0l-5.98 -4.485a2.5 2.5 0 0 1 -1 -2v-11.17a1 1 0 0 1 1 -1h14a1 1 0 0 1 1 1v11.17a2.5 2.5 0 0 1 -1 2\" />\n  <path d=\"M4.3 3.3l6.655 5.186a1.7 1.7 0 0 0 2.09 0l6.655 -5.186\" />", "marathon": "<path d=\"M11.007 5a2 2 0 1 0 4 0a2 2 0 1 0 -4 0\" />\n  <path d=\"M4 17l5 1l.75 -1.5\" />\n  <path d=\"M15 21v-4l-4 -3l1 -6\" />\n  <path d=\"M7 12v-3l5 -1l3 3l3 1\" />", "calendar": "<path d=\"M4 7a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2v-12\" />\n  <path d=\"M16 3v4\" />\n  <path d=\"M8 3v4\" />\n  <path d=\"M4 11h16\" />\n  <path d=\"M11 15h1\" />\n  <path d=\"M12 15v3\" />", "moon": "<path d=\"M12 3c.132 0 .263 0 .393 0a7.5 7.5 0 0 0 7.92 12.446a9 9 0 1 1 -8.313 -12.454l0 .008\" />", "cache": "<path d=\"M4 6a8 3 0 1 0 16 0a8 3 0 1 0 -16 0\" />\n  <path d=\"M4 6v6a8 3 0 0 0 16 0v-6\" />\n  <path d=\"M4 12v6a8 3 0 0 0 16 0v-6\" />", "secret": "<path d=\"M5 13a2 2 0 0 1 2 -2h10a2 2 0 0 1 2 2v6a2 2 0 0 1 -2 2h-10a2 2 0 0 1 -2 -2v-6\" />\n  <path d=\"M11 16a1 1 0 1 0 2 0a1 1 0 0 0 -2 0\" />\n  <path d=\"M8 11v-4a4 4 0 1 1 8 0v4\" />"};

  const tierClass = function (tier) {
    return tier ? "ha-tier-" + tier.toLowerCase() : "ha-tier-pending";
  };

  function api(path, options) {
    // Delegate to the host SDK's fetchJSON so auth is handled correctly in
    // BOTH dashboard modes: loopback (X-Hermes-Session-Token header) and
    // gated OAuth (hermes_session_at cookie via credentials:'include').
    // Hand-rolling fetch + reading window.__HERMES_SESSION_TOKEN__ directly
    // 401s in gated mode (the token isn't injected there). fetchJSON throws
    // Error("<status>: <body>") on non-2xx — the call sites' .catch() relies
    // on that to surface errors, so we let it propagate (don't swallow).
    const url = "/api/plugins/hermes-achievements" + path;
    return SDK.fetchJSON(url, options);
  }

  function AchievementIcon({ icon }) {
    const svg = TABLER[icon] || TABLER.secret;
    const ref = React.useRef(null);
    React.useEffect(function () {
      if (!ref.current) return;
      const el = ref.current;
      while (el.firstChild) el.removeChild(el.firstChild);
      try {
        const doc = new DOMParser().parseFromString(
          "<svg xmlns=\"http://www.w3.org/2000/svg\">" + svg + "</svg>",
          "image/svg+xml"
        );
        if (!doc.querySelector("parsererror")) {
          Array.from(doc.documentElement.childNodes).forEach(function (n) {
            el.appendChild(document.importNode(n, true));
          });
        }
      } catch (_) {}
    }, [svg]);
    return React.createElement("svg", {
      ref: ref,
      className: "ha-lucide",
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: 2,
      strokeLinecap: "round",
      strokeLinejoin: "round",
      "aria-hidden": "true",
    });
  }

  const TIER_HEX = {
    "Copper": "#b87333",
    "Silver": "#c0c7d2",
    "Gold": "#f2c94c",
    "Diamond": "#67e8f9",
    "Olympian": "#c084fc",
  };

  function tierHex(tier) {
    return TIER_HEX[tier] || "#67e8f9";
  }

  // Render a TABLER icon path fragment into a standalone SVG string with an
  // explicit stroke color so it can be rasterized onto a <canvas> via Image.
  // The normal render path uses stroke="currentColor" which browsers honor in
  // DOM but NOT when the SVG is drawn to a canvas from a data URL.
  function iconSvgForCanvas(iconKey, strokeColor) {
    const paths = TABLER[iconKey] || TABLER.secret;
    return "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" fill=\"none\" " +
      "stroke=\"" + strokeColor + "\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\">" +
      paths + "</svg>";
  }

  function loadSvgImage(svgString) {
    return new Promise(function (resolve, reject) {
      const blob = new Blob([svgString], { type: "image/svg+xml;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const img = new Image();
      img.onload = function () { URL.revokeObjectURL(url); resolve(img); };
      img.onerror = function (e) { URL.revokeObjectURL(url); reject(e); };
      img.src = url;
    });
  }

  function wrapText(ctx, text, maxWidth) {
    const words = String(text || "").split(/\s+/).filter(Boolean);
    const lines = [];
    let current = "";
    for (let i = 0; i < words.length; i++) {
      const candidate = current ? current + " " + words[i] : words[i];
      if (ctx.measureText(candidate).width <= maxWidth) {
        current = candidate;
      } else {
        if (current) lines.push(current);
        current = words[i];
      }
    }
    if (current) lines.push(current);
    return lines;
  }

  // Build a 1200x630 share card PNG for a single achievement. Returns a Blob.
  // Pure client-side render via Canvas2D — no external deps, no network.
  async function buildShareImage(achievement) {
    const W = 1200;
    const H = 630;
    const canvas = document.createElement("canvas");
    canvas.width = W;
    canvas.height = H;
    const ctx = canvas.getContext("2d");

    const tier = achievement.tier || achievement.next_tier || "Copper";
    const color = tierHex(tier);

    // Background: dark charcoal with a tier-tinted radial highlight on the
    // top-left, echoing the card visual language.
    ctx.fillStyle = "#0b0d11";
    ctx.fillRect(0, 0, W, H);
    const bgGrad = ctx.createRadialGradient(260, 220, 60, 260, 220, 820);
    bgGrad.addColorStop(0, color + "33");
    bgGrad.addColorStop(0.55, color + "0a");
    bgGrad.addColorStop(1, "#0b0d1100");
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, W, H);

    // Outer border
    ctx.strokeStyle = color + "66";
    ctx.lineWidth = 2;
    ctx.strokeRect(1, 1, W - 2, H - 2);

    // Icon block — 380x380 on the left
    try {
      const svg = iconSvgForCanvas(achievement.icon || "secret", color);
      const iconImg = await loadSvgImage(svg);
      const ix = 90;
      const iy = 125;
      const isize = 380;
      // Icon glow
      ctx.save();
      ctx.shadowColor = color;
      ctx.shadowBlur = 40;
      ctx.drawImage(iconImg, ix, iy, isize, isize);
      ctx.restore();
    } catch (_) {
      // Icon render failure is non-fatal; card still useful without it.
    }

    // Right column text layout
    const rx = 520;
    const rMaxWidth = W - rx - 70;

    // Category label (kicker)
    ctx.fillStyle = "#8b95a8";
    ctx.font = "600 22px 'JetBrains Mono', ui-monospace, 'SF Mono', Menlo, monospace";
    ctx.textBaseline = "top";
    ctx.fillText((achievement.category || "").toUpperCase(), rx, 112);

    // Achievement name — wrap to 2 lines if needed
    ctx.fillStyle = "#ffffff";
    ctx.font = "780 68px 'Inter', system-ui, -apple-system, 'Segoe UI', sans-serif";
    const nameLines = wrapText(ctx, achievement.name || "Achievement", rMaxWidth).slice(0, 2);
    let cursorY = 150;
    for (let i = 0; i < nameLines.length; i++) {
      ctx.fillText(nameLines[i], rx, cursorY);
      cursorY += 76;
    }

    // Tier badge pill
    const badgeLabel = tier.toUpperCase() + " TIER";
    ctx.font = "700 22px 'JetBrains Mono', ui-monospace, 'SF Mono', Menlo, monospace";
    const badgeWidth = ctx.measureText(badgeLabel).width + 32;
    const badgeX = rx;
    const badgeY = cursorY + 14;
    const badgeH = 40;
    ctx.fillStyle = color + "1f";
    ctx.strokeStyle = color;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.rect(badgeX, badgeY, badgeWidth, badgeH);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = color;
    ctx.textBaseline = "middle";
    ctx.fillText(badgeLabel, badgeX + 16, badgeY + badgeH / 2 + 1);
    ctx.textBaseline = "top";

    // Description — wrap up to 3 lines
    ctx.fillStyle = "#c3cad6";
    ctx.font = "400 26px 'Inter', system-ui, -apple-system, 'Segoe UI', sans-serif";
    const descLines = wrapText(ctx, achievement.description || "", rMaxWidth).slice(0, 3);
    let descY = badgeY + badgeH + 28;
    for (let i = 0; i < descLines.length; i++) {
      ctx.fillText(descLines[i], rx, descY);
      descY += 34;
    }

    // Progress / stat line (if meaningful)
    const progressValue = achievement.progress;
    const threshold = achievement.next_threshold;
    let statLine = null;
    if (progressValue && threshold) {
      statLine = progressValue.toLocaleString() + " / " + threshold.toLocaleString();
    } else if (progressValue) {
      statLine = progressValue.toLocaleString();
    }
    if (statLine) {
      ctx.fillStyle = color;
      ctx.font = "700 28px 'JetBrains Mono', ui-monospace, 'SF Mono', Menlo, monospace";
      ctx.fillText(statLine, rx, descY + 14);
    }

    // Footer watermark
    ctx.fillStyle = "#8b95a8";
    ctx.font = "600 20px 'JetBrains Mono', ui-monospace, 'SF Mono', Menlo, monospace";
    ctx.textBaseline = "bottom";
    ctx.fillText("HERMES AGENT  ·  hermes-agent.nousresearch.com", 70, H - 40);

    // "UNLOCKED" stamp upper-right
    ctx.textBaseline = "top";
    ctx.fillStyle = color;
    ctx.font = "800 24px 'JetBrains Mono', ui-monospace, 'SF Mono', Menlo, monospace";
    const stamp = "◆ UNLOCKED";
    const stampW = ctx.measureText(stamp).width;
    ctx.fillText(stamp, W - 70 - stampW, 70);

    return await new Promise(function (resolve, reject) {
      canvas.toBlob(function (blob) {
        if (blob) resolve(blob); else reject(new Error("canvas.toBlob returned null"));
      }, "image/png");
    });
  }

  function ShareDialog({ achievement, onClose }) {
    const { t } = useI18n();
    const [status, setStatus] = hooks.useState("rendering"); // rendering | ready | copied | error
    const [errorMsg, setErrorMsg] = hooks.useState(null);
    const [previewUrl, setPreviewUrl] = hooks.useState(null);
    const blobRef = React.useRef(null);

    hooks.useEffect(function () {
      let cancelled = false;
      let createdUrl = null;
      buildShareImage(achievement).then(function (blob) {
        if (cancelled) return;
        blobRef.current = blob;
        createdUrl = URL.createObjectURL(blob);
        setPreviewUrl(createdUrl);
        setStatus("ready");
      }).catch(function (err) {
        if (cancelled) return;
        setErrorMsg(String(err && err.message || err));
        setStatus("error");
      });
      return function () {
        cancelled = true;
        if (createdUrl) URL.revokeObjectURL(createdUrl);
      };
    }, [achievement.id]);

    function download() {
      if (!blobRef.current) return;
      const url = URL.createObjectURL(blobRef.current);
      const a = document.createElement("a");
      a.href = url;
      a.download = "hermes-achievement-" + (achievement.id || "badge") + ".png";
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
    }

    async function copyToClipboard() {
      if (!blobRef.current) return;
      try {
        if (!navigator.clipboard || !window.ClipboardItem) {
          throw new Error(tx(t, "share.clipboard_unsupported", "Clipboard image copy not supported in this browser — use Download instead."));
        }
        await navigator.clipboard.write([
          new window.ClipboardItem({ "image/png": blobRef.current }),
        ]);
        setStatus("copied");
        setTimeout(function () { setStatus("ready"); }, 1800);
      } catch (err) {
        setErrorMsg(String(err && err.message || err));
        setStatus("error");
      }
    }

    // Build the pre-filled tweet text. Keep it short so X doesn't truncate
    // when the user hasn't attached the PNG yet — they'll copy-image and
    // paste in the same flow.
    function tweetText() {
      const tierPart = achievement.tier ? (achievement.tier + " tier ") : "";
      const tmpl = tx(t, "share.tweet_text", "Just unlocked {tier_part}\"{name}\" in Hermes Agent ☤", {
        tier_part: tierPart,
        name: achievement.name,
      });
      return tmpl + "\n\n@NousResearch · https://github.com/Garudex-Labs/NoOne/tree/main/website/docs";
    }

    function shareOnX() {
      const url = "https://x.com/intent/post?text=" + encodeURIComponent(tweetText());
      window.open(url, "_blank", "noopener,noreferrer");
    }

    return React.createElement("div", {
      className: "ha-share-backdrop",
      onClick: function (e) { if (e.target === e.currentTarget) onClose(); },
    },
      React.createElement("div", { className: "ha-share-dialog", role: "dialog", "aria-label": tx(t, "share.dialog_label", "Share achievement") },
        React.createElement("div", { className: "ha-share-head" },
          React.createElement("strong", null, tx(t, "share.header", "Share: {name}", { name: achievement.name })),
          React.createElement("button", { className: "ha-share-close", onClick: onClose, "aria-label": tx(t, "share.close", "Close") }, "×")
        ),
        React.createElement("div", { className: "ha-share-preview" },
          status === "rendering" && React.createElement("div", { className: "ha-share-placeholder" }, tx(t, "share.rendering", "Rendering…")),
          previewUrl && React.createElement("img", { src: previewUrl, alt: tx(t, "share.card_alt", "{name} share card", { name: achievement.name }) })
        ),
        status === "error" && React.createElement("div", { className: "ha-share-error" }, errorMsg || tx(t, "share.error_generic", "Something went wrong.")),
        React.createElement("div", { className: "ha-share-actions" },
          React.createElement("button", {
            className: "ha-share-btn ha-share-btn-primary",
            onClick: shareOnX,
            title: tx(t, "share.x_title", "Opens X with a pre-filled post"),
          }, tx(t, "share.x_button", "Share on X")),
          React.createElement("button", {
            className: "ha-share-btn",
            onClick: copyToClipboard,
            disabled: status !== "ready" && status !== "copied",
            title: tx(t, "share.copy_title", "Copy the image to paste into your post"),
          }, status === "copied" ? tx(t, "share.copied", "Copied ✓") : tx(t, "share.copy_button", "Copy image")),
          React.createElement("button", {
            className: "ha-share-btn",
            onClick: download,
            disabled: status !== "ready" && status !== "copied",
          }, tx(t, "share.download_button", "Download PNG"))
        ),
        React.createElement("p", { className: "ha-share-hint" },
          tx(t, "share.hint", "Share on X opens a pre-filled post in a new tab. Click Copy image first if you want the 1200×630 badge attached — X lets you paste it right into the tweet composer. Download PNG saves the file for use anywhere.")
        )
      )
    );
  }

  function StatCard(props) {
    return React.createElement(C.Card, { className: "ha-stat" },
      React.createElement(C.CardContent, { className: "ha-stat-content" },
        React.createElement("div", { className: "ha-stat-label" }, props.label),
        React.createElement("div", { className: "ha-stat-value" }, props.value),
        props.hint && React.createElement("div", { className: "ha-stat-hint" }, props.hint)
      )
    );
  }

  function TierLegend() {
    return React.createElement("div", { className: "ha-tier-legend" },
      ["Copper", "Silver", "Gold", "Diamond", "Olympian"].map(function (tier, index, arr) {
        return React.createElement(React.Fragment, { key: tier },
          React.createElement("span", { className: "ha-tier-step ha-tier-" + tier.toLowerCase() },
            React.createElement("i", null),
            tier
          ),
          index < arr.length - 1 && React.createElement("span", { className: "ha-tier-arrow" }, "→")
        );
      })
    );
  }


  function LoadingSkeletonCard(props) {
    return React.createElement(C.Card, { className: "ha-card ha-skeleton-card ha-tier-pending" },
      React.createElement(C.CardContent, { className: "ha-card-content" },
        React.createElement("div", { className: "ha-card-head" },
          React.createElement("div", { className: "ha-skeleton ha-skeleton-icon" }),
          React.createElement("div", { className: "ha-skeleton-stack" },
            React.createElement("div", { className: "ha-skeleton ha-skeleton-title" }),
            React.createElement("div", { className: "ha-skeleton ha-skeleton-meta" })
          ),
          React.createElement("div", { className: "ha-badges" },
            React.createElement("div", { className: "ha-skeleton ha-skeleton-badge" }),
            React.createElement("div", { className: "ha-skeleton ha-skeleton-badge ha-skeleton-badge-short" })
          )
        ),
        React.createElement("div", { className: "ha-skeleton ha-skeleton-line" }),
        React.createElement("div", { className: "ha-skeleton ha-skeleton-line ha-skeleton-line-short" }),
        React.createElement("div", { className: "ha-skeleton ha-skeleton-criteria" }),
        React.createElement("div", { className: "ha-evidence-slot" }, React.createElement("div", { className: "ha-skeleton ha-skeleton-evidence" })),
        React.createElement("div", { className: "ha-progress-row" },
          React.createElement("div", { className: "ha-skeleton ha-skeleton-progress" }),
          React.createElement("div", { className: "ha-skeleton ha-skeleton-progress-text" })
        )
      )
    );
  }

  function LoadingPage() {
    const { t } = useI18n();
    return React.createElement("div", { className: "ha-page ha-page-loading" },
      React.createElement("section", { className: "ha-hero ha-loading-hero" },
        React.createElement("div", null,
          React.createElement("div", { className: "ha-kicker" }, tx(t, "hero.kicker", "Agentic Gamerscore")),
          React.createElement("h1", null, tx(t, "hero.title", "Hermes Achievements")),
          React.createElement("p", null, tx(t, "hero.scan_subtitle", "Scanning Hermes session history. First scan can take 5–10 seconds on large histories."))
        ),
        React.createElement("div", { className: "ha-scan-status", role: "status", "aria-live": "polite" },
          React.createElement("span", { className: "ha-scan-pulse", "aria-hidden": "true" }),
          React.createElement("div", null,
            React.createElement("strong", null, tx(t, "scan.building_headline", "Building achievement profile…")),
            React.createElement("p", null, tx(t, "scan.building_detail", "Reading sessions, tool calls, model metadata, and unlock state."))
          )
        )
      ),
      React.createElement("div", { className: "ha-stats" },
        [
          { key: "stats.unlocked", fallback: "Unlocked" },
          { key: "stats.discovered", fallback: "Discovered" },
          { key: "stats.secrets", fallback: "Secrets" },
          { key: "stats.highest_tier", fallback: "Highest tier" },
          { key: "stats.latest", fallback: "Latest" },
        ].map(function (entry) {
          const label = tx(t, entry.key, entry.fallback);
          return React.createElement(C.Card, { key: entry.key, className: "ha-stat ha-skeleton-stat" },
            React.createElement(C.CardContent, { className: "ha-stat-content" },
              React.createElement("div", { className: "ha-stat-label" }, label),
              React.createElement("div", { className: "ha-skeleton ha-skeleton-stat-value" }),
              React.createElement("div", { className: "ha-skeleton ha-skeleton-stat-hint" })
            )
          );
        })
      ),
      React.createElement("section", { className: "ha-guide ha-loading-guide" },
        React.createElement("div", null,
          React.createElement("strong", null, tx(t, "guide.scan_status_header", "Scan status")),
          React.createElement("p", null, tx(t, "guide.scan_status_body", "Hermes is scanning local history once, then cards will appear automatically. Nothing is stuck if this takes a few seconds."))
        ),
        React.createElement("div", null,
          React.createElement("strong", null, tx(t, "guide.what_scanned_header", "What is scanned")),
          React.createElement("p", null, tx(t, "guide.what_scanned_body", "Sessions, tool calls, model metadata, errors, achievements, and local unlock state."))
        )
      ),
      React.createElement("section", { className: "ha-grid" }, [0, 1, 2, 3, 4, 5].map(function (i) {
        return React.createElement(LoadingSkeletonCard, { key: i });
      }))
    );
  }


  function AchievementCard({ achievement }) {
    const { t } = useI18n();
    const unlocked = achievement.unlocked;
    const progress = achievement.progress || 0;
    const pct = achievement.progress_pct || (unlocked ? 100 : 0);
    const state = achievement.state || (unlocked ? "unlocked" : "discovered");
    const stateLabel = state === "unlocked"
      ? tx(t, "state.unlocked", "Unlocked")
      : (state === "secret" ? tx(t, "state.secret", "Secret") : tx(t, "state.discovered", "Discovered"));
    const targetTier = achievement.next_tier || achievement.tier;
    let tierLabel;
    if (achievement.tier) {
      tierLabel = achievement.tier;
    } else if (targetTier) {
      tierLabel = tx(t, "tier.target", "Target {tier}", { tier: targetTier });
    } else if (state === "secret") {
      tierLabel = tx(t, "tier.hidden", "Hidden");
    } else if (unlocked) {
      tierLabel = tx(t, "tier.complete", "Complete");
    } else {
      tierLabel = tx(t, "tier.objective", "Objective");
    }
    const progressText = state === "secret"
      ? tx(t, "progress.hidden", "hidden")
      : (progress + (achievement.next_threshold ? " / " + achievement.next_threshold : ""));
    const [shareOpen, setShareOpen] = hooks.useState(false);
    return React.createElement(C.Card, { className: cn("ha-card", "ha-state-" + state, tierClass(achievement.tier || achievement.next_tier)) },
      React.createElement(C.CardContent, { className: "ha-card-content" },
        React.createElement("div", { className: "ha-card-head" },
          React.createElement("div", { className: "ha-icon" }, React.createElement(AchievementIcon, { icon: achievement.icon || "secret" })),
          React.createElement("div", { className: "ha-card-title-wrap" },
            React.createElement("div", { className: "ha-card-title" }, achievement.name),
            React.createElement("div", { className: "ha-card-category" }, achievement.category)
          ),
          React.createElement("div", { className: "ha-badges" },
            React.createElement("span", { className: "ha-state-badge" }, stateLabel),
            React.createElement("span", { className: "ha-tier-badge" }, tierLabel),
            state === "unlocked" && React.createElement("button", {
              className: "ha-share-trigger",
              onClick: function () { setShareOpen(true); },
              title: tx(t, "card.share_title", "Share this achievement"),
              "aria-label": tx(t, "card.share_label", "Share {name}", { name: achievement.name }),
            }, tx(t, "card.share_text", "Share"))
          )
        ),
        React.createElement("p", { className: "ha-description" }, achievement.description),
        achievement.criteria && React.createElement("details", { className: "ha-criteria" },
          React.createElement("summary", null, state === "secret"
            ? tx(t, "card.how_to_reveal", "How to reveal")
            : tx(t, "card.what_counts", "What counts")),
          React.createElement("p", null, achievement.criteria)
        ),
        React.createElement("div", { className: "ha-evidence-slot" },
          achievement.evidence ? React.createElement("div", { className: "ha-evidence" },
            React.createElement("span", { className: "ha-evidence-label" }, tx(t, "card.evidence_label", "Evidence")),
            React.createElement("span", { className: "ha-evidence-title" }, achievement.evidence.title || achievement.evidence.session_id || tx(t, "card.evidence_session_fallback", "session"))
          ) : React.createElement("div", { className: "ha-evidence ha-evidence-empty", "aria-hidden": "true" }, tx(t, "card.no_evidence", "No evidence yet"))
        ),
        React.createElement("div", { className: "ha-progress-row" },
          React.createElement("div", { className: "ha-progress-track" },
            React.createElement("div", { className: "ha-progress-fill", style: { width: Math.max(state === "secret" ? 0 : 3, Math.min(100, pct)) + "%" } })
          ),
          React.createElement("span", { className: "ha-progress-text" }, progressText)
        )
      ),
      shareOpen && React.createElement(ShareDialog, {
        achievement: achievement,
        onClose: function () { setShareOpen(false); },
      })
    );
  }

  function AchievementsPage() {
    const { t } = useI18n();
    const [data, setData] = hooks.useState(null);
    const [loading, setLoading] = hooks.useState(true);
    const [error, setError] = hooks.useState(null);
    const [category, setCategory] = hooks.useState("All");
    const [visibility, setVisibility] = hooks.useState("all");

    function load() {
      setLoading(true);
      api("/achievements")
        .then(function (payload) { setData(payload); setError((payload && payload.error) || null); })
        .catch(function (err) { setError(String(err)); })
        .finally(function () { setLoading(false); });
    }
    // refresh() re-fetches without flipping the loading state — used by the
    // auto-poller during an in-progress background scan so the page updates
    // with growing unlock counts instead of flashing the loading skeleton.
    function refresh() {
      api("/achievements")
        .then(function (payload) { setData(payload); setError((payload && payload.error) || null); })
        .catch(function (err) { setError(String(err)); });
    }
    hooks.useEffect(load, []);

    // Auto-poll while the backend is still scanning. scan_meta.mode is
    // "pending" on the very first request (no cache yet) and "in_progress"
    // while the background thread is publishing partial snapshots. Once it
    // flips to "full" or "incremental" the scan is done and we stop polling.
    const scanMode = (data && data.scan_meta && data.scan_meta.mode) || null;
    const scanInFlight = scanMode === "pending" || scanMode === "in_progress";
    hooks.useEffect(function () {
      if (!scanInFlight) return undefined;
      const id = setInterval(refresh, 4000);
      return function () { clearInterval(id); };
    }, [scanInFlight]);

    const achievements = (data && data.achievements) || [];
    const categories = ["All"].concat(Array.from(new Set(achievements.map(function (a) { return a.category; }))));
    const visible = achievements.filter(function (a) {
      if (category !== "All" && a.category !== category) return false;
      if (visibility === "unlocked" && a.state !== "unlocked") return false;
      if (visibility === "discovered" && a.state !== "discovered") return false;
      if (visibility === "secret" && a.state !== "secret") return false;
      return true;
    });
    const unlocked = achievements.filter(function (a) { return a.state === "unlocked"; });
    const discovered = achievements.filter(function (a) { return a.state === "discovered"; });
    const secret = achievements.filter(function (a) { return a.state === "secret"; });
    const latest = unlocked.slice().sort(function (a, b) { return (b.unlocked_at || 0) - (a.unlocked_at || 0); }).slice(0, 5);
    const highest = ["Olympian", "Diamond", "Gold", "Silver", "Copper"].find(function (tier) { return unlocked.some(function (a) { return a.tier === tier; }); }) || tx(t, "stats.none_yet", "None yet");

    // Build the in-progress scan banner once so the JSX below stays readable.
    // Shows nothing when the scan is idle. When a scan is running it renders
    // a pulsing status row with "X / Y sessions · Z%" and a filling bar, so
    // the user gets continuous visual feedback during long cold scans on
    // large session databases (can take several minutes on 8000+ sessions).
    let scanBanner = null;
    if (scanInFlight) {
      const meta = (data && data.scan_meta) || {};
      const scanned = Number(meta.sessions_scanned_so_far || meta.sessions_total || 0);
      const total = Number(meta.sessions_expected_total || 0);
      const pct = total > 0 ? Math.max(0, Math.min(100, Math.floor((scanned / total) * 100))) : 0;
      const headline = scanMode === "pending"
        ? tx(t, "scan.starting_headline", "Starting achievement scan…")
        : tx(t, "scan.building_headline", "Building achievement profile…");
      const detail = total > 0
        ? tx(t, "scan.progress_detail", "Scanned {scanned} of {total} sessions · {pct}%. Badges unlock as more history streams in.", {
            scanned: scanned.toLocaleString(),
            total: total.toLocaleString(),
            pct: String(pct),
          })
        : tx(t, "scan.idle_detail", "Reading sessions, tool calls, model metadata, and unlock state. Badges appear here as they unlock.");
      scanBanner = React.createElement("section", { className: "ha-scan-banner", role: "status", "aria-live": "polite" },
        React.createElement("div", { className: "ha-scan-banner-head" },
          React.createElement("span", { className: "ha-scan-pulse", "aria-hidden": "true" }),
          React.createElement("div", { className: "ha-scan-banner-text" },
            React.createElement("strong", null, headline),
            React.createElement("p", null, detail)
          )
        ),
        total > 0 && React.createElement("div", { className: "ha-scan-progress-track", role: "progressbar", "aria-valuemin": 0, "aria-valuemax": 100, "aria-valuenow": pct },
          React.createElement("div", { className: "ha-scan-progress-fill", style: { width: pct + "%" } })
        )
      );
    }

    if (loading) {
      return React.createElement(LoadingPage, null);
    }

    // Translate the "All" category pill but keep the underlying state ("All")
    // as the canonical key the API matches against.
    const allCategoryLabel = tx(t, "filters.all_categories", "All");
    const visibilityLabels = {
      all: tx(t, "filters.visibility_all", "all"),
      unlocked: tx(t, "filters.visibility_unlocked", "unlocked"),
      discovered: tx(t, "filters.visibility_discovered", "discovered"),
      secret: tx(t, "filters.visibility_secret", "secret"),
    };

    return React.createElement("div", { className: "ha-page" },
      React.createElement("section", { className: "ha-hero" },
        React.createElement("div", null,
          React.createElement("div", { className: "ha-kicker" }, tx(t, "hero.kicker", "Agentic Gamerscore")),
          React.createElement("h1", null, tx(t, "hero.title", "Hermes Achievements")),
          React.createElement("p", null, tx(t, "hero.subtitle", "Collectible Hermes badges earned from real session history. Known unfinished achievements are shown as Discovered; Secret achievements stay hidden until the first matching behavior appears."))
        ),
        React.createElement(C.Button, { onClick: load, className: "ha-refresh" }, tx(t, "actions.rescan", "Rescan"))
      ),
      scanBanner,
      error && React.createElement(C.Card, { className: "ha-error" }, React.createElement(C.CardContent, null, String(error))),
      React.createElement("div", { className: "ha-stats" },
        React.createElement(StatCard, { label: tx(t, "stats.unlocked", "Unlocked"), value: (data ? data.unlocked_count : 0) + " / " + (data ? data.total_count : 0), hint: tx(t, "stats.unlocked_hint", "earned badges") }),
        React.createElement(StatCard, { label: tx(t, "stats.discovered", "Discovered"), value: discovered.length, hint: tx(t, "stats.discovered_hint", "known, not earned yet") }),
        React.createElement(StatCard, { label: tx(t, "stats.secrets", "Secrets"), value: secret.length, hint: tx(t, "stats.secrets_hint", "hidden until first signal") }),
        React.createElement(StatCard, { label: tx(t, "stats.highest_tier", "Highest tier"), value: highest, hint: tx(t, "stats.highest_tier_hint", "Copper → Silver → Gold → Diamond → Olympian") }),
        React.createElement(StatCard, { label: tx(t, "stats.latest", "Latest"), value: latest[0] ? latest[0].name : tx(t, "stats.none_yet", "None yet"), hint: latest[0] ? latest[0].category : tx(t, "stats.latest_hint_empty", "run Hermes more") })
      ),
      React.createElement("section", { className: "ha-guide" },
        React.createElement("div", null,
          React.createElement("strong", null, tx(t, "guide.tiers_header", "Tiers")),
          React.createElement(TierLegend, null)
        ),
        React.createElement("div", null,
          React.createElement("strong", null, tx(t, "guide.secret_header", "Secret achievements")),
          React.createElement("p", null, tx(t, "guide.secret_body", "Secrets hide their exact trigger. Once Hermes sees a related signal, the card becomes Discovered and shows its requirement."))
        )
      ),
      React.createElement("div", { className: "ha-toolbar" },
        React.createElement("div", { className: "ha-pills" }, categories.map(function (cat) {
          // Render the localized "All" pill but keep the underlying value
          // unchanged so the filter logic still compares against "All".
          const pillLabel = cat === "All" ? allCategoryLabel : cat;
          return React.createElement("button", { key: cat, onClick: function () { setCategory(cat); }, className: cat === category ? "active" : "" }, pillLabel);
        })),
        React.createElement("div", { className: "ha-pills" }, ["all", "unlocked", "discovered", "secret"].map(function (v) {
          return React.createElement("button", { key: v, onClick: function () { setVisibility(v); }, className: v === visibility ? "active" : "" }, visibilityLabels[v] || v);
        }))
      ),
      latest.length > 0 && React.createElement("section", { className: "ha-latest" },
        React.createElement("h2", null, tx(t, "latest.header", "Recent unlocks")),
        React.createElement("div", { className: "ha-latest-row" }, latest.map(function (a) {
          return React.createElement("div", { key: a.id, className: cn("ha-chip", tierClass(a.tier)) },
            React.createElement("span", { className: "ha-chip-icon" }, React.createElement(AchievementIcon, { icon: a.icon || "secret" })),
            a.name
          );
        }))
      ),
      visibility === "secret" && visible.length === 0 && React.createElement(C.Card, { className: "ha-secret-empty" },
        React.createElement(C.CardContent, { className: "ha-secret-empty-content" },
          React.createElement("strong", null, tx(t, "empty.no_secrets_header", "No hidden secrets left in this scan.")),
          React.createElement("p", null, tx(t, "empty.no_secrets_body", "Clue: secrets usually start from unusual failure or power-user patterns — port conflicts, permission walls, missing env vars, YAML mistakes, Docker collisions, rollback/checkpoint use, cache hits, or tiny fixes after lots of red text."))
        )
      ),
      React.createElement("section", { className: "ha-grid" }, visible.map(function (a) {
        return React.createElement(AchievementCard, { key: a.id, achievement: a });
      }))
    );
  }

  window.__HERMES_PLUGINS__.register("hermes-achievements", AchievementsPage);
})();
