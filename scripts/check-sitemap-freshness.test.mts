import assert from 'node:assert/strict'
import {test} from 'node:test'

import {getRouteLastModified} from '../lib/sitemap-freshness.ts'

test('sitemap freshness advances only routes whose public content changed', () => {
  assert.equal(getRouteLastModified('/about/').toISOString(), '2026-09-13T00:00:00.000Z')
  assert.equal(getRouteLastModified('/soccer-jersey-supplier-australia/').toISOString(), '2026-09-13T00:00:00.000Z')
  assert.equal(getRouteLastModified('/privacy-policy/').toISOString(), '2026-11-16T00:00:00.000Z')
  assert.equal(getRouteLastModified('/solutions/').toISOString(), '2026-11-16T00:00:00.000Z')
  assert.equal(getRouteLastModified('/shipping-after-sales/').toISOString(), '2026-11-15T00:00:00.000Z')
  assert.equal(getRouteLastModified('/certificates-testing/').toISOString(), '2026-11-15T00:00:00.000Z')
  assert.equal(getRouteLastModified('/oem-odm/').toISOString(), '2026-11-15T00:00:00.000Z')
  assert.equal(getRouteLastModified('/blog/').toISOString(), '2026-11-15T00:00:00.000Z')
  assert.equal(getRouteLastModified('/products/rugby-uniforms/').toISOString(), '2026-11-16T00:00:00.000Z')
  assert.equal(getRouteLastModified('/basketball-positions-explained/').toISOString(), '2026-11-16T00:00:00.000Z')
  assert.equal(getRouteLastModified('/products/hoodies-jackets/').toISOString(), '2026-11-16T00:00:00.000Z')
})

test('a newer CMS timestamp remains the source of truth', () => {
  assert.equal(
    getRouteLastModified('/guides/example/', new Date('2026-09-15T08:30:00.000Z')).toISOString(),
    '2026-09-15T08:30:00.000Z',
  )
})
