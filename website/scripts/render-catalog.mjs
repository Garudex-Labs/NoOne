import { build } from 'esbuild';
import { mkdir, writeFile, readFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const website = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const cache = resolve(website, '.cache');
const escapeAttribute = (value) => value.replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
/** Reuse exact server-rendered markup, adding only the original copy feedback. */
export function literalCatalogMarkup(html, copiedMarkup, locale = '') {
  if (locale) html = html.replace(/\bhref="\/docs(\/[^"\s]*)?"/g, (attribute, path = '/') => {
    if (/^\/(?:img|api|oauth|snippets)(?:\/|$)|^\/llms(?:[-./]|$)/.test(path)) return attribute;
    return `href="/docs/${locale}${path}"`;
  });
  return html.replace(/<button\b[^>]*data-docs-copy="[^"]*"[^>]*>/g, (tag) => tag.slice(0, -1) + ` data-docs-copied="${escapeAttribute(copiedMarkup)}">`);
}

export async function catalogRenderer() {
  await mkdir(cache, {recursive: true});
  const config = JSON.parse(await readFile(resolve(website, 'docs/docs.json'), 'utf8'));
  await writeFile(resolve(website, 'src/data/site-footer.json'), JSON.stringify({links: config.footer.links, copyright: config.seo.metatags.copyright}) + '\n');
  const result = await build({
    stdin: {contents: `
      import React from 'react';
      import {renderToStaticMarkup} from 'react-dom/server';
      import PluginPage from './src/components/PluginCatalog/PluginPage';
      import AuthorPage from './src/components/PluginCatalog/AuthorPage';
      import {CopyButtonContents} from './src/components/PluginCatalog/CopyButton';
      export const copiedMarkup = renderToStaticMarkup(<CopyButtonContents copied={true} />);
      export function render(kind, data) { return renderToStaticMarkup(kind === 'PluginPage' ? <PluginPage data={data} /> : <AuthorPage data={data} />); }
    `, resolveDir: website, sourcefile: 'catalog-render.tsx', loader: 'tsx'},
    outfile: resolve(cache, 'catalog-render.mjs'), bundle: true, platform: 'node', format: 'esm', jsx: 'automatic',
    external: ['react', 'react/jsx-runtime', 'react-dom/server'], write: false,
  });
  for (const file of result.outputFiles) await writeFile(file.path, file.contents);
  return import(resolve(cache, 'catalog-render.mjs') + `?version=${Date.now()}`);
}
