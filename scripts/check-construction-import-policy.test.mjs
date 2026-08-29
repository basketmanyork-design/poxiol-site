import assert from 'node:assert/strict'
import test from 'node:test'

import { validateImportEntry } from '../lib/construction/import-policy.mjs'

for (const rejectedPath of [
  '.env.production',
  'node_modules/x.js',
  'out/index.html',
  '.next/server/app.js',
  '.git/config',
  '.pnpm-store/index.json',
  '../escape.txt',
  '..\\escape.txt',
  '/absolute.txt',
  'C:\\absolute.txt',
]) {
  test(`rejects ${rejectedPath}`, () => {
    assert.throws(
      () =>
        validateImportEntry({
          path: rejectedPath,
          sha256: 'a'.repeat(64),
          bytes: 1,
        }),
      /IMPORT_PATH_REJECTED/,
    )
  })
}

test('rejects a malformed digest', () => {
  assert.throws(
    () =>
      validateImportEntry({
        path: 'app/page.tsx',
        sha256: 'not-a-sha256',
        bytes: 1,
      }),
    /IMPORT_PATH_REJECTED/,
  )
})

test('accepts an application source file', () => {
  assert.equal(
    validateImportEntry({
      path: 'app/page.tsx',
      sha256: 'a'.repeat(64),
      bytes: 1,
    }),
    true,
  )
})
