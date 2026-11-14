// @noone/shared is what a third-party client builds against: it must typecheck on its own, and no
// code from another workspace may enter its program, directly or through a transitive import.
// The canonical display-identity JSON is the sole external data asset allowed.
import { execFileSync } from 'node:child_process'
import { createRequire } from 'node:module'
import { relative, resolve, sep } from 'node:path'

import { expect, it } from 'vitest'

const root = resolve(import.meta.dirname, '../..')
const tsc = createRequire(import.meta.url).resolve('typescript/bin/tsc')
const identityAsset = resolve(root, '../../agent_cli/data/application_identity.json')

it.each(['tsconfig.json', 'tsconfig.node.json'])('%s typechecks alone with only the canonical identity asset outside apps/shared and node_modules', project => {
  const run = (...args: string[]) =>
    execFileSync(process.execPath, [tsc, '-p', resolve(root, project), ...args], { encoding: 'utf8' })

  run('--noEmit')

  const foreign = run('--listFilesOnly')
    .split('\n')
    .filter(Boolean)
    .filter(file => resolve(file) !== identityAsset)
    .map(file => relative(root, resolve(file)))
    .filter(file => file.startsWith('..') && !file.split(sep).includes('node_modules'))

  expect(foreign).toEqual([])
}, 120_000)
