import { build } from "esbuild";
import { mkdir, readFile, writeFile, rm, cp } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const website = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const snippets = resolve(website, "docs/snippets");
const entries = {
  "doc-link": 'export { DocLink, docUrl, PageHead } from "./src/components/DocLink";',
  "user-stories": 'export { default as UserStoriesCollage } from "./src/components/UserStoriesCollage";',
  "automation-blueprints": 'export { default as AutomationBlueprintsCatalog } from "./src/components/AutomationBlueprintsCatalog";',
  skills: 'export { default as SkillsHub } from "./src/pages/skills";',
  plugins: 'export { default as PluginsHub } from "./src/pages/plugins";',
  "plugin-detail": 'export { default as PluginPage } from "./src/components/PluginCatalog/PluginPage";',
  "author-detail": 'export { default as AuthorPage } from "./src/components/PluginCatalog/AuthorPage";',
};

await mkdir(snippets, { recursive: true });
const config = JSON.parse(await readFile(resolve(website, "docs/docs.json"), "utf8"));
await writeFile(resolve(website, "src/data/site-footer.json"), JSON.stringify({
  links: config.footer.links, copyright: config.seo.metatags.copyright,
}) + "\n");
const visual = resolve(website, '../agent_cli/data/ui');
await cp(resolve(visual, 'fonts'), resolve(website, 'docs/fonts'), { recursive: true });
for (const notice of ['Inter-OFL.txt', 'JetBrainsMono-OFL.txt']) {
  await cp(resolve(visual, notice), resolve(website, 'docs/fonts', notice));
}
const fontCss = (await readFile(resolve(visual, 'typography.css'), 'utf8')).replaceAll("./fonts/", "/fonts/");
const styles = [fontCss, await readFile(resolve(website, "src/css/custom.css"), "utf8")];
for (const [name, contents] of Object.entries(entries)) {
  const result = await build({
    stdin: { contents, resolveDir: website, sourcefile: `${name}.tsx`, loader: "tsx" },
    outfile: resolve(snippets, `${name}.jsx`),
    bundle: true,
    jsx: "preserve",
    format: "esm",
    write: false,
    minifyWhitespace: true,
    // Hooks are supplied by the page runtime. Bundling shared helpers and JSON
    // here avoids unsupported npm/JSON imports in published components.
    plugins: [{
      name: "page-hooks",
      setup(builder) {
        builder.onLoad({ filter: /\.tsx?$/ }, async ({ path }) => ({
          contents: (await readFile(path, "utf8")).replace(
            /^import\s+(?:React(?:,\s*\{[^}]*\})?|\{[^}]*\})\s+from\s+["']react["'];?\s*$/gm, "",
          ),
          loader: path.endsWith(".tsx") ? "tsx" : "ts",
        }));
      },
    }],
  });
  for (const file of result.outputFiles) {
    if (file.path.endsWith(".css")) styles.push(file.text);
    else if (["plugin-detail", "author-detail"].includes(name)) await rm(file.path, {force: true});
    else await writeFile(file.path, file.text);
  }
}
await writeFile(resolve(website, "docs/style.css"), styles.join("\n"));
await build({entryPoints: [resolve(website, 'src/site-footer.js')], outfile: resolve(website, 'docs/footer.js'), bundle: true, format: 'iife', minifyWhitespace: true});
console.log(`Prepared ${Object.keys(entries).length} page components and their styles`);
