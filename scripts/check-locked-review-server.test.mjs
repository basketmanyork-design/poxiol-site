import assert from 'node:assert/strict'
import {mkdtemp, writeFile, mkdir, rm} from 'node:fs/promises'
import {tmpdir} from 'node:os'
import path from 'node:path'
import test from 'node:test'

import {createLockedReviewServer} from '../lib/release/locked-review-server.mjs'

test('serves static HTML with review-only security headers', async () => {
  const root = await mkdtemp(path.join(tmpdir(), 'poxiol-review-'))
  await mkdir(path.join(root, 'contact'))
  await writeFile(path.join(root, 'contact', 'index.html'), '<h1>Contact</h1>')
  const server = createLockedReviewServer({root})
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve))
  try {
    const {port} = server.address()
    const response = await fetch(`http://127.0.0.1:${port}/contact/`)
    assert.equal(response.status, 200)
    assert.equal(await response.text(), '<h1>Contact</h1>')
    assert.equal(response.headers.get('x-robots-tag'), 'noindex, nofollow, noarchive')
    assert.equal(response.headers.get('cache-control'), 'no-store')
    assert.match(response.headers.get('content-security-policy') || '', /connect-src 'self'/)
    assert.match(response.headers.get('content-security-policy') || '', /form-action 'none'/)
  } finally {
    await new Promise((resolve) => server.close(resolve))
    await rm(root, {recursive: true, force: true})
  }
})

test('rejects path traversal and missing files', async () => {
  const root = await mkdtemp(path.join(tmpdir(), 'poxiol-review-'))
  await writeFile(path.join(root, 'index.html'), '<h1>Home</h1>')
  const server = createLockedReviewServer({root})
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve))
  try {
    const {port} = server.address()
    assert.equal((await fetch(`http://127.0.0.1:${port}/missing/`)).status, 404)
    assert.notEqual((await fetch(`http://127.0.0.1:${port}/..%2Fpackage.json`)).status, 200)
  } finally {
    await new Promise((resolve) => server.close(resolve))
    await rm(root, {recursive: true, force: true})
  }
})
