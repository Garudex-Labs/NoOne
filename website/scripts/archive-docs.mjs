import { cp, mkdir, readdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import yaml from 'js-yaml';
import { replaceVariables } from '@mintlify/common';

const escape = (value) => value.replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
export function redirectHtml(redirect) {
  const destination = /^(?:https?:)?\/\//.test(redirect.destination) ? redirect.destination : `/docs${redirect.destination}`;
  const canonical = new URL(destination, 'https://github.com/Garudex-Labs/NoOne/tree/main/website/docs').href;
  return `<!doctype html><html><head><meta charset="utf-8"><meta http-equiv="refresh" content="0;url=${escape(destination)}"><link rel="canonical" href="${escape(canonical)}"></head><body><script>location.replace(${JSON.stringify(destination).replaceAll('<', '\\u003c')}+location.search+location.hash)</script><a href="${escape(destination)}">${escape(destination)}</a></body></html>`;
}

export async function pageMetadata(source, variables, prefix = '') {
  const result = {};
  for (const entry of await readdir(source, {withFileTypes: true})) {
    const path = join(source, entry.name);
    if (entry.isDirectory()) {
      if (!['api', 'img', 'oauth', 'snippets'].includes(entry.name)) Object.assign(result, await pageMetadata(path, variables, `${prefix}${entry.name}/`));
    } else if (/\.mdx?$/.test(entry.name)) {
      const original = await readFile(path, 'utf8');
      const match = /^---\n([\s\S]*?)\n---\n/.exec(original);
      if (!match) continue;
      const attributes = yaml.load(match[1]);
      const values = {};
      for (const key of ['description', 'og:description', 'twitter:description']) {
        if (typeof attributes?.[key] === 'string') values[key] = replaceVariables(attributes[key], variables);
      }
      result[`${prefix}${entry.name.replace(/\.mdx?$/, '')}`] = values;
    }
  }
  return result;
}

export function restoreMetadata(content, metadata, rsc = false) {
  const descriptions = {
    description: metadata.description,
    'og:description': metadata['og:description'] || metadata.description,
    'twitter:description': metadata['twitter:description'] || metadata['og:description'] || metadata.description,
  };
  if (rsc) return content.replace(/"(?:name|property)":"(description|og:description|twitter:description)","content":"(?:[^"\\]|\\.)*"/g,
    (tag, key) => descriptions[key] === undefined ? tag : tag.replace(/"content":"(?:[^"\\]|\\.)*"/, () => `"content":${JSON.stringify(descriptions[key])}`));
  content = content.replace(/<script\b([^>]*)>(self\.__next_f\.push\((\[[\s\S]*?\])\);?)<\/script>/g, (tag, attributes, script, encoded) => {
    const payload = JSON.parse(encoded);
    if (typeof payload[1] !== 'string') return tag;
    const restored = restoreMetadata(payload[1], metadata, true);
    if (restored === payload[1]) return tag;
    payload[1] = restored;
    return `<script${attributes}>self.__next_f.push(${JSON.stringify(payload).replaceAll('<', '\\u003c')});</script>`;
  });
  return content.replace(/<meta\b[^>]*\b(?:name|property)="(description|og:description|twitter:description)"[^>]*>/g,
    (tag, key) => descriptions[key] === undefined ? tag : tag.replace(/\bcontent="[^"]*"/, () => `content="${escape(descriptions[key])}"`));
}

/** Prepare the existing /docs deployment without loading the entire site into RAM. */
export async function prepareDeployment(root, source, config, metadata = {}) {
  const docs = join(root, 'docs');
  async function titles(directory, prefix = '') {
    for (const entry of await readdir(directory, {withFileTypes: true})) {
      const path = join(directory, entry.name);
      if (entry.isDirectory()) await titles(path, `${prefix}${entry.name}/`);
      else if (entry.name === 'index.html' || entry.name === 'index.txt') {
        const meta = metadata[prefix.replace(/\/$/, '') || 'index'];
        if (!meta) continue;
        const original = await readFile(path, 'utf8');
        let content = restoreMetadata(original, meta, entry.name === 'index.txt');
        if (meta.title && entry.name === 'index.html') content = content.replace(/<title>[\s\S]*?<\/title>/, () => `<title>${escape(meta.title.replaceAll('{{app-name}}', () => config.name))}</title>`);
        if (content !== original) await writeFile(path, content);
      }
    }
  }
  await titles(docs);
  // JSON feeds and OAuth metadata are misclassified as OpenAPI inputs by the
  // native static-file collector. They also serve application clients.
  for (const directory of ['api', 'oauth', 'img']) await cp(join(source, directory), join(docs, directory), {recursive: true});
  for (const name of ['llms.txt', 'llms-full.txt']) await cp(join(source, name), join(docs, name));
  for (const redirect of config.redirects || []) {
    const directory = join(docs, redirect.source);
    await mkdir(directory, {recursive: true});
    await writeFile(join(directory, 'index.html'), redirectHtml(redirect));
  }
  await writeFile(join(root, '.nojekyll'), '');
}
