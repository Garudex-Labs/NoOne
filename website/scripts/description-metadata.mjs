/** Recover source text from metadata encoded for the native MDX header parser. */
export function decodeSourceDescription(value) {
  const match = /^\{JSON\.parse\(("[\s\S]*")\)\}$/.exec(value);
  if (!match) return undefined;
  try {
    const encoded = JSON.parse(match[1]);
    if (!/^"(?:\\u[0-9a-f]{4})*"$/i.test(encoded)) return undefined;
    return JSON.parse(encoded);
  } catch {
    return undefined;
  }
}

export function observeSourceDescriptions(document, Observer) {
  const restored = new WeakMap();
  function restore() {
    for (const meta of document.head.querySelectorAll('meta[name="description"], meta[property="og:description"], meta[name="twitter:description"]')) {
      if (restored.get(meta) === meta.content) continue;
      const original = decodeSourceDescription(meta.content);
      if (original === undefined) continue;
      restored.set(meta, original);
      meta.content = original;
    }
  }
  restore();
  const observer = new Observer(restore);
  observer.observe(document.head, {subtree: true, childList: true, attributes: true, attributeFilter: ['content']});
  return observer;
}
