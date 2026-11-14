import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, readFile, writeFile, rm } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { stageResources } from '../stage-resources.mjs';

test('resource-only publication preserves shared endpoints without pretending full HTML is deployed', async () => {
  const root = await mkdtemp(join(tmpdir(), 'docs-resources-'));
  const source = join(root, 'source');
  const output = join(root, 'pages');
  try {
    await mkdir(source);
    for (const directory of ['api', 'oauth', 'img']) {
      await mkdir(join(source, directory));
      await writeFile(join(source, directory, 'preserved.bin'), Buffer.from([0, 255, 123, 125]));
    }
    for (const file of ['llms.txt', 'llms-full.txt']) await writeFile(join(source, file), 'retained feed');
    await mkdir(join(source, 'zh-Hans'));
    await writeFile(join(source, 'zh-Hans', 'retained.md'), '# Complete content remains in the source artifact\n');
    const report = await stageResources(source, output);
    assert.equal(report.fullHtmlDocumentationPublished, false);
    for (const directory of ['api', 'oauth', 'img']) {
      assert.deepEqual(await readFile(join(output, 'docs', directory, 'preserved.bin')), await readFile(join(source, directory, 'preserved.bin')));
    }
    for (const file of ['llms.txt', 'llms-full.txt']) {
      assert.equal(await readFile(join(output, file), 'utf8'), 'retained feed');
      assert.equal(await readFile(join(output, 'docs', file), 'utf8'), 'retained feed');
    }
    assert.equal((await readFile(join(output, '.nojekyll'))).length, 0);
    assert.match(await readFile(join(output, 'index.html'), 'utf8'), /not the full HTML documentation site/);
    assert.equal(await readFile(join(source, 'zh-Hans/retained.md'), 'utf8'), '# Complete content remains in the source artifact\n');
    await assert.rejects(stageResources(source, output), /overwrite/);
    await assert.rejects(stageResources(source, join(source, 'publish')), /outside/);
  } finally { await rm(root, {recursive: true, force: true}); }
});
