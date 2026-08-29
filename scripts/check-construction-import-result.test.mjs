import assert from 'node:assert/strict'
import test from 'node:test'

import { verifyImportedFiles } from '../lib/construction/import-result.mjs'

test('fails when an imported file hash differs from its manifest', () => {
  assert.throws(
    () =>
      verifyImportedFiles(
        [{ path: 'app/page.tsx', sha256: '0'.repeat(64) }],
        () => 'f'.repeat(64),
      ),
    /IMPORTED_HASH_MISMATCH:app\/page\.tsx/,
  )
})

test('accepts imported files whose hashes all match the manifest', () => {
  assert.equal(
    verifyImportedFiles(
      [
        { path: 'app/page.tsx', sha256: 'a'.repeat(64) },
        { path: 'components/ui.tsx', sha256: 'b'.repeat(64) },
      ],
      (entryPath) =>
        entryPath === 'app/page.tsx' ? 'a'.repeat(64) : 'b'.repeat(64),
    ),
    true,
  )
})
