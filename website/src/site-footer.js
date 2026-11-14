import { observeSourceDescriptions } from '../scripts/description-metadata.mjs';

// Preserve the source site's footer attribution; the shell has no copyright setting.
const attribution = "Built by Garudex Labs · MIT License · 2026";
function syncTheme() {
  document.documentElement.dataset.theme = document.documentElement.classList.contains("dark") ? "dark" : "light";
}
function ensureAttribution() {
  const footer = document.querySelector("footer");
  if (!footer || footer.querySelector("[data-docs-attribution]")) return;
  const text = document.createElement("p");
  text.dataset.docsAttribution = "";
  text.textContent = attribution;
  footer.append(text);
}
// Native custom-layout pages are omitted from the sidebar even when explicitly
// listed. Retain the source sidebar's two catalog links in their original order.
function ensureCatalogLinks() {
  for (const story of document.querySelectorAll('#sidebar a[href$="/user-stories"], #sidebar-content a[href$="/user-stories"]')) {
    const row = story.closest('li');
    if (!row) continue;
    const base = story.getAttribute('href').slice(0, -'user-stories'.length);
    let previous = row;
    for (const [route, label] of [['skills', 'Browse Skills'], ['plugins', 'Browse Plugins']]) {
      const href = base + route;
      const existing = row.parentElement.querySelector(`a[href="${href}"]`);
      if (existing) { previous = existing.closest('li') || previous; continue; }
      const item = row.cloneNode(true);
      item.removeAttribute('id');
      item.removeAttribute('data-active-nav-item');
      item.dataset.title = label;
      const link = item.querySelector('a');
      link.href = href;
      link.removeAttribute('aria-current');
      link.querySelector('span').textContent = label;
      previous.after(item);
      previous = item;
    }
  }
}
function syncShell() { ensureAttribution(); ensureCatalogLinks(); }
syncShell();
syncTheme();
new MutationObserver(syncTheme).observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
new MutationObserver(syncShell).observe(document.body, { childList: true, subtree: true });

// Server-rendered catalog views retain the same copy feedback as React cards.
const copyMarkup = new WeakMap();
const copyTimers = new WeakMap();
document.addEventListener('click', (event) => {
  if (!(event.target instanceof Element)) return;
  const button = event.target.closest('button[data-docs-copy][data-docs-copied]');
  if (!button || !navigator.clipboard) return;
  event.stopPropagation();
  const original = copyMarkup.get(button) || button.innerHTML;
  copyMarkup.set(button, original);
  navigator.clipboard.writeText(button.dataset.docsCopy).then(() => {
    button.innerHTML = button.dataset.docsCopied;
    clearTimeout(copyTimers.get(button));
    copyTimers.set(button, setTimeout(() => { button.innerHTML = original; }, 1500));
  }, () => {});
});

// Restore source SEO text after the shell strips markup from literal descriptions.
observeSourceDescriptions(document, MutationObserver);
