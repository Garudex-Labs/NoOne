import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, readFile, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { syncApplicationIdentity } from '../application-identity.mjs';

test('site identity refresh derives default/nav while preserving unrelated catalog and links', async () => {
  const root = await mkdtemp(join(tmpdir(), 'site-identity-'));
  const identityPath = join(root, 'identity.json');
  const configPath = join(root, 'docs.json');
  const group = (page) => ({group: 'Using stale name', pages: [page, 'catalog/new-author']});
  const original = {name: 'Old', variables: {'other': 'kept'},
    navigation: {languages: [{groups: [group('user-guide/cli')]}, {groups: [group('zh-Hans/user-guide/cli')]}]},
    footer: {links: [{items: [{label: 'Download', href: 'https://example.org/release'}]}]}};
  try {
    await writeFile(configPath, JSON.stringify(original));
    for (const name of ['Star Atlas', '星 Nova']) {
      await writeFile(identityPath, JSON.stringify({default_name: name}));
      await syncApplicationIdentity({identityPath, configPath});
      const config = JSON.parse(await readFile(configPath, 'utf8'));
      assert.equal(config.name, name);
      assert.deepEqual(config.variables, {'other': 'kept', 'app-name': name});
      assert.deepEqual(config.footer, original.footer);
      for (const language of config.navigation.languages) {
        assert.equal(language.groups[0].group, `Using ${name}`);
        assert.equal(language.groups[0].pages[1], 'catalog/new-author');
      }
      const before = await readFile(configPath, 'utf8');
      await syncApplicationIdentity({identityPath, configPath});
      assert.equal(await readFile(configPath, 'utf8'), before);
    }
  } finally { await rm(root, {recursive: true, force: true}); }
});
