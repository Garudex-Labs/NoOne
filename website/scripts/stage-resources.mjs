import { cp, mkdir, stat, writeFile } from 'node:fs/promises';
import { join, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

/** Pages publishes shared resources only; the complete content is a separate source artifact. */
export async function stageResources(source, destination) {
  source = resolve(source);
  destination = resolve(destination);
  if (destination === source || destination.startsWith(source + sep) || source.startsWith(destination + sep)) {
    throw new Error('Resource publication must be outside the prepared source tree');
  }
  try { await stat(destination); throw new Error('Refusing to overwrite existing resource publication'); }
  catch (error) { if (error.code !== 'ENOENT') throw error; }
  const docs = join(destination, 'docs');
  await mkdir(docs, {recursive: true});
  for (const directory of ['api', 'oauth', 'img']) {
    await cp(join(source, directory), join(docs, directory), {recursive: true});
  }
  for (const file of ['llms.txt', 'llms-full.txt']) {
    await cp(join(source, file), join(docs, file));
    await cp(join(source, file), join(destination, file));
  }
  const report = {kind: 'shared-documentation-resources', fullHtmlDocumentationPublished: false,
    completeContent: 'prepared-docs-source artifact', paths: ['/docs/api/', '/docs/oauth/', '/docs/img/', '/docs/llms.txt', '/docs/llms-full.txt', '/llms.txt', '/llms-full.txt']};
  await writeFile(join(docs, 'publication.json'), JSON.stringify(report, null, 2) + '\n');
  await writeFile(join(destination, '.nojekyll'), '');
  const notice = '<!doctype html><html lang="en"><head><meta charset="utf-8"><title>NoOne shared documentation resources</title></head><body><h1>Shared documentation resources</h1><p>This endpoint publishes API, OAuth, image and LLM feeds. It is not the full HTML documentation site.</p><p>The complete native-validated documentation content is provided as the prepared-docs-source workflow artifact. A full documentation host remains a separate requirement.</p><p><a href="https://github.com/Garudex-Labs/NoOne/tree/main/website/docs">Read the maintained documentation source</a></p></body></html>\n';
  await writeFile(join(destination, 'index.html'), notice);
  await writeFile(join(docs, 'index.html'), notice);
  return report;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  if (!process.argv[2] || !process.argv[3]) throw new Error('Usage: stage-resources.mjs PREPARED_SOURCE OUTPUT');
  const report = await stageResources(process.argv[2], process.argv[3]);
  console.log(JSON.stringify(report));
}
