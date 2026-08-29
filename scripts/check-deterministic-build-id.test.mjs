import assert from 'node:assert/strict'
import {mkdtempSync, mkdirSync, writeFileSync} from 'node:fs'
import {tmpdir} from 'node:os'
import {join} from 'node:path'
import test from 'node:test'

import {buildDeterministicBuildId} from '../lib/release/build-id.mjs'

test('returns the same build id regardless of input path order', () => {
  const root = mkdtempSync(join(tmpdir(), 'poxiol-build-id-'))
  mkdirSync(join(root, 'app'))
  writeFileSync(join(root, 'app', 'page.tsx'), 'export default 1')
  writeFileSync(join(root, 'package.json'), '{"name":"poxiol"}')

  const first = buildDeterministicBuildId({root, paths: ['app', 'package.json']})
  const second = buildDeterministicBuildId({root, paths: ['package.json', 'app']})

  assert.equal(first, second)
  assert.match(first, /^poxiol-[0-9a-f]{24}$/)
})

test('changes the build id when a governed source byte changes', () => {
  const root = mkdtempSync(join(tmpdir(), 'poxiol-build-id-'))
  mkdirSync(join(root, 'content'))
  const path = join(root, 'content', 'policy.json')
  writeFileSync(path, '{"status":"pending"}')
  const before = buildDeterministicBuildId({root, paths: ['content']})
  writeFileSync(path, '{"status":"approved"}')
  const after = buildDeterministicBuildId({root, paths: ['content']})

  assert.notEqual(after, before)
})
