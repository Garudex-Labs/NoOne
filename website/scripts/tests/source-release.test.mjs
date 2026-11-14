import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, writeFile, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { releaseSource } from '../release-source.mjs';

test('source release includes every locale, catalog, feed and resource with literal examples intact', async () => {
  const root = await mkdtemp(join(tmpdir(), 'docs-source-release-'));
  const source = join(root, 'source');
  const target = join(root, 'release');
  await mkdir(source);
  const content = '# {{app-name}}\n\n`{{app-name}}`\n\n```text\n{{app-name}}\n```\n';
  const resources = ['zh-Hans/guide.md', 'plugins/example.mdx', 'api/catalog.json', 'oauth/client-metadata.json', 'img/example.bin', 'snippets/example.jsx', 'llms.txt'];
  try {
    await writeFile(join(source, 'docs.json'), JSON.stringify({variables: {'app-name': 'Star Atlas'}}));
    for (const path of resources) {
      await mkdir(join(source, path, '..'), {recursive: true});
      await writeFile(join(source, path), /\.mdx?$/.test(path) ? content : 'retained bytes');
    }
    const result = await releaseSource(source, target);
    assert.equal(result.deploymentReady, false);
    assert.equal(result.files, resources.length + 1);
    assert.deepEqual(new Set(result.inventory.map((file) => file.path)), new Set(['docs.json', ...resources]));
    for (const path of resources) {
      assert.equal(await readFile(join(target, path), 'utf8'), /\.mdx?$/.test(path) ? content.replace('# {{app-name}}', '# Star Atlas') : 'retained bytes');
    }
    await assert.rejects(releaseSource(source, target), /overwrite/);
    await assert.rejects(releaseSource(source, join(source, 'release')), /outside/);
    assert.equal(await readFile(join(source, 'zh-Hans/guide.md'), 'utf8'), content);
  } finally { await rm(root, {recursive: true, force: true}); }
});
