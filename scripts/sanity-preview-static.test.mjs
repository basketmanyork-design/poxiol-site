import test from 'node:test'
import assert from 'node:assert/strict'
import {resolveSanityRequestPolicy} from '../lib/sanity/requestPolicy.ts'

test('Production Sanity stays published, CDN-backed and force-cached without a token', () => {
  assert.deepEqual(resolveSanityRequestPolicy('sanity', {}), {
    perspective: 'published',
    useCdn: true,
    cache: 'force-cache',
  })
})

test('Preview stays Draft-authenticated but uses a static-export-compatible build cache key', () => {
  assert.deepEqual(
    resolveSanityRequestPolicy('sanity-preview', {
      token: 'server-only-test-token',
      previewBuildId: 'preview-build-123',
    }),
    {
      perspective: 'drafts',
      useCdn: false,
      cache: 'force-cache',
      token: 'server-only-test-token',
      requestTag: 'preview-build-123',
    },
  )
})

test('Preview converts deployment URLs into valid Sanity request tags', () => {
  const policy = resolveSanityRequestPolicy('sanity-preview', {
    token: 'server-only-test-token',
    previewBuildId: 'https://5721f703.poxiol-site.pages.dev',
  })
  assert.equal(policy?.requestTag, 'https-5721f703-poxiol-site-pages-dev')
  assert.match(policy?.requestTag || '', /^[a-z0-9_-]+$/)
})
test('Preview refuses to query without its server-only token and legacy never queries', () => {
  assert.equal(resolveSanityRequestPolicy('sanity-preview', {}), null)
  assert.equal(resolveSanityRequestPolicy('legacy', {token: 'ignored'}), null)
})
