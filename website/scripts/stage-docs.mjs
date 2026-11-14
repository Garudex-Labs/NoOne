import { mkdir, readdir, readFile, writeFile, rm, stat } from 'node:fs/promises';
import { dirname, join, resolve, sep } from 'node:path';
import { replaceVariables } from '@mintlify/common';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import remarkFrontmatter from 'remark-frontmatter';
import yaml from 'js-yaml';

const parser = unified().use(remarkParse).use(remarkGfm).use(remarkFrontmatter);
export function literalPageMetadata(content) {
  const match = /^---\n([\s\S]*?)\n---\n/.exec(content);
  if (!match) return content;
  const metadata = yaml.load(match[1]);
  const description = metadata?.description;
  // Source descriptions were plain SEO text. The native header parses MDX,
  // so commands, email addresses and prices must remain literal, not markup.
  if (typeof description !== 'string' || !/[<>{}$`]/.test(description)) return content;
  // Keep the SEO markdown stripper from removing placeholders or email addresses
  // inside the literal. JSON decoding recovers every original UTF-16 code unit.
  let encoded = '';
  for (let index = 0; index < description.length; index++) encoded += `\\u${description.charCodeAt(index).toString(16).padStart(4, '0')}`;
  const literal = JSON.stringify(`"${encoded}"`);
  metadata.description = `<span>{JSON.parse(${literal})}</span>`;
  return `---\n${yaml.dump(metadata, {lineWidth: -1, noRefs: true})}---\n${content.slice(match[0].length)}`;
}
function resolvePage(content, variables) {
  if (!/\{\{\s*[\w.-]+\s*\}\}/.test(content)) return content;
  const examples = [];
  function visit(node) {
    if (node.type === 'code' || node.type === 'inlineCode') examples.push(node);
    else for (const child of node.children || []) visit(child);
  }
  visit(parser.parse(content));
  const protectedContent = [];
  for (const node of examples.sort((a, b) => b.position.start.offset - a.position.start.offset)) {
    const position = node.position;
    const marker = `\u0000DOCUMENTATION_EXAMPLE_${protectedContent.length}\u0000`;
    const original = content.slice(position.start.offset, position.end.offset);
    // Multiline spans containing native variable delimiters confuse the MDX
    // preparser. A literal JSX code value preserves Markdown's displayed value.
    const literal = node.type === 'inlineCode' && original.includes('\n') && original.includes('{{')
      ? `<code>{${JSON.stringify(node.value)}}</code>` : original;
    protectedContent.push([marker, literal]);
    content = content.slice(0, position.start.offset) + marker + content.slice(position.end.offset);
  }
  content = replaceVariables(content, variables);
  for (const [marker, original] of protectedContent) content = content.replace(marker, () => original);
  return content;
}

/** Resolve native variables before the pinned CLI preparser sees page expressions. */
export async function mirrorDocumentation(source, destination, variables, relative = '') {
  const input = resolve(source, relative);
  if (input !== source && !input.startsWith(`${source}${sep}`)) throw new Error('Invalid documentation source path');
  const output = join(destination, relative);
  let info;
  try { info = await stat(input); }
  catch (error) {
    if (error.code !== 'ENOENT') throw error;
    await rm(output, {recursive: true, force: true});
    return;
  }
  if (info.isDirectory()) {
    await mkdir(output, {recursive: true});
    for (const entry of await readdir(input)) await mirrorDocumentation(source, destination, variables, join(relative, entry));
    return;
  }
  let content = await readFile(input);
  if (/\.mdx?$/.test(input)) content = Buffer.from(literalPageMetadata(resolvePage(content.toString('utf8'), variables)));
  else if (/\.(jsx|tsx)$/.test(input)) content = Buffer.from(replaceVariables(content.toString('utf8'), variables));
  let previous;
  try { previous = await readFile(output); }
  catch (error) { if (error.code !== 'ENOENT') throw error; }
  if (!previous?.equals(content)) {
    await mkdir(dirname(output), {recursive: true});
    await writeFile(output, content);
  }
}
