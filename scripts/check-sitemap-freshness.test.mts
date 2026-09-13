import assert from 'node:assert/strict'
import {test} from 'node:test'

import {getRouteLastModified} from '../lib/sitemap-freshness.ts'

test('sitemap freshness advances only routes whose public content changed', () => {
  assert.equal(getRouteLastModified('/about/').toISOString(), '2026-09-13T00:00:00.000Z')
  assert.equal(getRouteLastModified('/soccer-jersey-supplier-australia/').toISOString(), '2026-09-13T00:00:00.000Z')
  assert.equal(getRouteLastModified('/privacy-policy/').toISOString(), '2026-08-29T00:00:00.000Z')
})

test('a newer CMS timestamp remains the source of truth', () => {
  assert.equal(
    getRouteLastModified('/guides/example/', new Date('2026-09-15T08:30:00.000Z')).toISOString(),
    '2026-09-15T08:30:00.000Z',
  )
})
