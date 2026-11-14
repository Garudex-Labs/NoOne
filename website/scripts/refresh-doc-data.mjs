import { spawnSync } from 'node:child_process';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const website = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const repo = resolve(website, '..');
// Refresh local-source derivatives explicitly; never crawl an external catalog
// or rewrite author-written/per-skill pages as a side effect of a preview.
for (const script of ['extract-automation-blueprints.py', 'generate-llms-txt.py']) {
  const result = spawnSync(resolve(repo, 'scripts/agent-python'), [resolve(website, 'scripts', script)], {cwd: repo, stdio: 'inherit'});
  if (result.error) throw result.error;
  if (result.status !== 0) process.exit(result.status ?? 1);
}
