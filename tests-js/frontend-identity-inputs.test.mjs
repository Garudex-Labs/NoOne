import { execFileSync } from 'node:child_process'
import { copyFileSync, mkdirSync, mkdtempSync, readFileSync, rmSync, symlinkSync, writeFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import { tmpdir } from 'node:os'
import { dirname, join, resolve } from 'node:path'
import { pathToFileURL } from 'node:url'
import { afterEach, expect, test } from 'vitest'
import { mirrorWebappInputs } from '../apps/desktop/scripts/build-webapp.mjs'
import { buildInputs, productCurrent, recordProduct } from '../scripts/build/freshness.mjs'
import { buildWebapp } from '../scripts/build/webapp.mjs'

const repo = resolve(import.meta.dirname, '..')
const require = createRequire(import.meta.url)
const temporary = []
afterEach(() => { for (const dir of temporary.splice(0)) rmSync(dir, { recursive: true, force: true }) })

function fixture() {
  const dir = mkdtempSync(join(tmpdir(), 'frontend-identity-'))
  temporary.push(dir)
  return dir
}

function put(root, name, content) {
  mkdirSync(dirname(join(root, name)), { recursive: true })
  writeFileSync(join(root, name), content)
}

test.each(['web', 'webapp', 'desktop'])('%s receipts invalidate on identity-only changes or missing identity inputs', product => {
  const source = fixture()
  const out = fixture()
  const asset = 'agent_cli/data/application_identity.json'
  const helper = 'scripts/build/application-identity.mjs'
  put(source, asset, JSON.stringify({ default_name: 'Build identity 星' }))
  put(source, helper, 'export const defaultAppName = "Build identity 星"\n')
  put(out, 'index.html', '<html></html>')
  const current = () => productCurrent({ source, product, out })
  const record = () => recordProduct({ source, product, out, inputs: buildInputs(source, product) })
  record()
  expect(current()).toBe(true)
  for (const name of [asset, helper]) {
    const before = readFileSync(join(source, name))
    writeFileSync(join(source, name), Buffer.concat([before, Buffer.from('\n')]))
    expect(current(), `changed ${name}`).toBe(false)
    record()
    rmSync(join(source, name))
    expect(current(), `missing ${name}`).toBe(false)
    writeFileSync(join(source, name), before)
    record()
  }
})

test('a fresh Webapp mirror compiles the canonical identity and HTML helper and refuses an identity-stale mirror', async () => {
  const source = fixture()
  const workspace = fixture()
  const out = join(fixture(), 'product')
  for (const name of [
    'agent_cli/data/application_identity.json',
    'scripts/build/application-identity.mjs',
    'scripts/build/application-identity.d.mts',
    'apps/shared/src/application-identity.ts',
  ]) {
    mkdirSync(dirname(join(source, name)), { recursive: true })
    copyFileSync(join(repo, name), join(source, name))
  }
  put(source, 'package.json', '{"private":true,"type":"module"}')
  put(source, 'apps/desktop/package.json', '{"type":"module"}')
  put(source, 'apps/shared/package.json', '{"type":"module"}')
  put(source, 'apps/desktop/vite.config.ts', [
    'import { applicationIdentityHtml } from "../../scripts/build/application-identity.mjs"',
    'export default { plugins: [applicationIdentityHtml()] }',
  ].join('\n'))
  put(source, 'apps/desktop/index.html', '<html><head><title>__APP_NAME__</title></head><body><script type="module" src="/src/main.ts"></script></body></html>')
  put(source, 'apps/desktop/src/main.ts', 'import { DEFAULT_APP_NAME } from "../../shared/src/application-identity"; document.body.textContent = DEFAULT_APP_NAME;')
  const name = JSON.parse(readFileSync(join(source, 'agent_cli/data/application_identity.json'), 'utf8')).default_name
  for (const [dependency, resolver] of [
    ['vite', require],
    ['nanostores', createRequire(join(repo, 'apps/shared/package.json'))],
  ]) {
    const target = dirname(resolver.resolve(`${dependency}/package.json`))
    const link = join(workspace, 'node_modules', dependency)
    mkdirSync(dirname(link), { recursive: true })
    symlinkSync(target, link, 'junction')
  }
  mirrorWebappInputs(source, workspace)
  await buildWebapp({ source, workspace, out })
  expect(readFileSync(join(out, 'index.html'), 'utf8')).toContain(`<title>${name}</title>`)
  const manifest = JSON.parse(readFileSync(join(out, 'renderer-manifest.json'), 'utf8'))
  const entry = Object.values(manifest).find(chunk => chunk.isEntry).file
  const rendered = execFileSync(process.execPath, ['--input-type=module', '-e', [
    'globalThis.document = { body: {}, createElement: () => ({ relList: { supports: () => true } }) };',
    `await import(${JSON.stringify(pathToFileURL(join(out, entry)).href)});`,
    'console.log(document.body.textContent);',
  ].join('\n')], { encoding: 'utf8' })
  expect(rendered.trim()).toBe(name)
  expect(productCurrent({ source, product: 'webapp', out })).toBe(true)
  put(source, 'agent_cli/data/application_identity.json', JSON.stringify({ default_name: `${name} updated` }))
  expect(productCurrent({ source, product: 'webapp', out })).toBe(false)
  await expect(buildWebapp({ source, workspace, out })).rejects.toThrow(/does not match/)
  mirrorWebappInputs(source, workspace)
  await buildWebapp({ source, workspace, out })
  expect(readFileSync(join(out, 'index.html'), 'utf8')).toContain(`<title>${name} updated</title>`)
  expect(productCurrent({ source, product: 'webapp', out })).toBe(true)
}, 60_000)
