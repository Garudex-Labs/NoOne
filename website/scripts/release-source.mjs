import { stat, mkdir, mkdtemp, rename, rm, readdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, join, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
import { mirrorDocumentation } from './stage-docs.mjs';

/** A complete prepared content directory, not a hosted deployment or static export. */
export async function releaseSource(source, destination) {
  source = resolve(source);
  destination = resolve(destination);
  if (destination === source || destination.startsWith(source + sep) || source.startsWith(destination + sep)) {
    throw new Error('Source release must be outside the documentation source tree');
  }
  try { await stat(destination); throw new Error('Refusing to overwrite an existing source release'); }
  catch (error) { if (error.code !== 'ENOENT') throw error; }
  const config = JSON.parse(await readFile(join(source, 'docs.json'), 'utf8'));
  await mkdir(dirname(destination), {recursive: true});
  const work = await mkdtemp(join(dirname(destination), '.docs-source-'));
  try {
    await mirrorDocumentation(source, work, config.variables);
    const files = [];
    async function inventory(directory, prefix = '') {
      for (const entry of (await readdir(directory, {withFileTypes: true})).sort((a, b) => a.name.localeCompare(b.name))) {
        const relative = prefix + entry.name;
        if (entry.isDirectory()) await inventory(join(directory, entry.name), relative + '/');
        else {
          const bytes = await readFile(join(directory, entry.name));
          files.push({path: relative, bytes: bytes.length, sha256: createHash('sha256').update(bytes).digest('hex')});
        }
      }
    }
    await inventory(work);
    await rename(work, destination);
    return {kind: 'prepared-mintlify-source', deploymentReady: false, files: files.length,
      bytes: files.reduce((sum, file) => sum + file.bytes, 0), inventory: files};
  } finally { await rm(work, {recursive: true, force: true}); }
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const website = resolve(dirname(fileURLToPath(import.meta.url)), '..');
  const destination = process.argv[2]
    ? resolve(process.env.INIT_CWD || process.cwd(), process.argv[2])
    : join(website, 'build/source');
  const report = await releaseSource(join(website, 'docs'), destination);
  await writeFile(destination + '-report.json', JSON.stringify(report, null, 2) + '\n');
  console.log(`Prepared ${report.files} files (${report.bytes} bytes) at ${destination}; hosting approval and integration are still required.`);
}
