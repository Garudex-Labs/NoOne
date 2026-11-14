import { spawn } from "node:child_process";
import { cp, mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir, homedir } from "node:os";
import { watch } from "node:fs";
import { dirname, resolve, join } from "node:path";
import { fileURLToPath } from "node:url";
import { mirrorDocumentation } from "./stage-docs.mjs";

const website = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const source = resolve(website, "docs");
const args = process.argv.slice(2);
// Pin the independently downloaded renderer as well as the CLI package.
if (["dev", "validate", "export"].includes(args[0])) args.push("--client-version", "0.0.4133");
let stage;
let cwd = source;
let variables;
const preview = args[0] === "dev";
const watchers = [];
let pending = Promise.resolve();
if (["validate", "broken-links", "dev", "export"].includes(args[0])) {
  // Both the static checker and native preparser parse pages before resolving
  // variables. Use resolved copies for every command, never rewriting sources.
  stage = await mkdtemp(join(tmpdir(), "docs-work-"));
  variables = JSON.parse(await readFile(join(source, "docs.json"), "utf8")).variables;
  await mirrorDocumentation(source, stage, variables);
  cwd = stage;
}
const options = process.env.NODE_OPTIONS || "";
const child = spawn(process.execPath, [
  "--no-deprecation", resolve(website, "node_modules/@mintlify/cli/bin/start.js"), ...args,
], {
  cwd,
  stdio: preview ? ["inherit", "pipe", "inherit"] : "inherit",
  env: { ...process.env, MINTLIFY_TELEMETRY_DISABLED: "1", NODE_OPTIONS: options.includes("--max-old-space-size") ? options : `${options} --max-old-space-size=8192` },
});
if (preview) {
  watchers.push(watch(source, {recursive: true}, (_event, filename) => {
    if (!filename) return;
    pending = pending.then(async () => {
      if (filename === "docs.json") {
        variables = JSON.parse(await readFile(join(source, "docs.json"), "utf8")).variables;
        await mirrorDocumentation(source, stage, variables);
      } else await mirrorDocumentation(source, stage, variables, filename.toString());
    }).catch((error) => { console.error(error); child.kill("SIGTERM"); });
  }));
  let installed = false;
  let output = "";
  child.stdout.on("data", (data) => {
    process.stdout.write(data);
    output = (output + data.toString()).slice(-4096);
    const port = /http:\/\/localhost:(\d+)/.exec(output)?.[1];
    if (!port || installed) return;
    installed = true;
    // The pinned native preview's static middleware serves added public files.
    // JSON feeds are otherwise mistaken for OpenAPI inputs and never copied.
    const destination = join(homedir(), ".mintlify/previews", port, "mint/apps/client/public");
    for (const directory of ["api", "oauth"]) {
      let pending = Promise.resolve();
      const publish = () => {
        pending = pending.then(() => cp(join(source, directory), join(destination, directory), { recursive: true }))
          .catch((error) => { console.error(error); child.kill("SIGTERM"); });
      };
      publish();
      watchers.push(watch(join(source, directory), { recursive: true }, publish));
    }
  });
}
let finished = false;
async function finish(code) {
  if (finished) return;
  finished = true;
  for (const watcher of watchers) watcher.close();
  await pending;
  if (stage) await rm(stage, { recursive: true, force: true });
  process.exit(code ?? 1);
}
child.on("error", (error) => { console.error(error); void finish(1); });
child.on("exit", (code, signal) => {
  if (signal) console.error(`Documentation command terminated by ${signal}`);
  void finish(code);
});
for (const signal of ["SIGINT", "SIGTERM"]) process.on(signal, () => child.kill(signal));
