import { readdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkFrontmatter from "remark-frontmatter";
import GithubSlugger from "github-slugger";
import { toString } from "mdast-util-to-string";

const docs = resolve(dirname(fileURLToPath(import.meta.url)), "../docs");
const parser = unified().use(remarkParse).use(remarkGfm).use(remarkFrontmatter);
const generatedOnly = process.argv.includes("--generated");

async function files(directory) {
  const result = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = resolve(directory, entry.name);
    if (entry.isDirectory()) {
      const generatedCatalog = entry.name === 'plugins' && (directory === docs || directory === resolve(docs, 'zh-Hans'));
      if (!['api', 'snippets', 'img'].includes(entry.name) && !generatedCatalog) result.push(...await files(path));
    } else if (/\.mdx?$/.test(entry.name)) result.push(path);
  }
  return result;
}

export function pinAnchors(content, variables = {}) {
  const tree = parser.parse(content);
  const slugger = new GithubSlugger();
  const reserved = new Set(Array.from(content.matchAll(/\{#([^}]+)\}/g), (match) => match[1]));
  const edits = [];
  function visit(node, quoted = false) {
    if (node.type === "heading") {
      const raw = content.slice(node.position.start.offset, node.position.end.offset);
      if (!/\{#[^}]+\}\s*$/.test(raw)) {
        const commentId = /\{\/\*\s*#([^\s*]+)[\s\S]*?\*\/\}\s*$/.exec(raw)?.[1];
        const text = toString(node.children.filter((child) => !["html", "jsx"].includes(child.type)))
          .replace(/\{\/\*[\s\S]*?\*\/\}/g, "").trim();
        const rendered = text.replace(/\{\{([^}]+)\}\}/g, (match, key) => variables[key] ?? match);
        let id = commentId || slugger.slug(rendered);
        if (!commentId) {
          while (reserved.has(id)) id = slugger.slug(rendered);
        }
        reserved.add(id);
        if (id && !quoted) {
          const replacement = /^\s*#{1,6}\s/.test(raw)
            ? `${raw} {#${id}}`
            : `${"#".repeat(node.depth)} ${raw.replace(/\n\s*[=-]+\s*$/, "")} {#${id}}`;
          edits.push({ start: node.position.start.offset, end: node.position.end.offset, replacement });
        }
      }
    }
    for (const child of node.children || []) visit(child, quoted || node.type === "blockquote");
  }
  visit(tree);
  let output = content;
  for (const edit of edits.sort((a, b) => b.start - a.start)) output = output.slice(0, edit.start) + edit.replacement + output.slice(edit.end);
  return { content: output, pinned: edits.length };
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const variables = JSON.parse(await readFile(resolve(docs, "docs.json"), "utf8")).variables || {};
  let pinned = 0;
  for (const file of await files(docs)) {
    if (generatedOnly && !/\/user-guide\/skills\/(?:bundled|optional)\/|\/(?:optional-)?skills-catalog\.md$/.test(file)) continue;
    const original = await readFile(file, "utf8");
    const result = pinAnchors(original, variables);
    if (result.content !== original) await writeFile(file, result.content);
    pinned += result.pinned;
  }
  console.log(`Preserved ${pinned} original heading anchors`);
}
