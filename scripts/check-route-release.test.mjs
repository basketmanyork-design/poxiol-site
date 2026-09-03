import assert from 'node:assert/strict'
import test from 'node:test'

import * as routeRelease from '../lib/release/route-release.mjs'

const {compareRoutes, shouldRequireExactManifest, withheldLegalRoutes} = routeRelease

test('treats LF and CRLF route manifests as equivalent JSON', () => {
  assert.equal(
    typeof routeRelease.manifestsEquivalent,
    'function',
    'route-release must expose a line-ending-safe manifest comparison',
  )
  const lf = '{\n  "version": 1\n}\n'
  const crlf = lf.replaceAll('\n', '\r\n')
  assert.equal(routeRelease.manifestsEquivalent(lf, crlf), true)
  assert.equal(routeRelease.manifestsEquivalent(lf, '{"version":2}'), false)
})

test('hashes UTF-8 text identically across LF and CRLF checkouts', () => {
  assert.equal(
    typeof routeRelease.sha256CanonicalText,
    'function',
    'route-release must expose a cross-platform text hash',
  )
  const lf = '/\n/products/\n'
  const crlf = lf.replaceAll('\n', '\r\n')
  assert.equal(routeRelease.sha256CanonicalText(lf), routeRelease.sha256CanonicalText(crlf))
})

test('accepts a canonical manifest and reports exact stale source fields', () => {
  assert.equal(
    typeof routeRelease.assertRouteReleaseManifestCurrent,
    'function',
    'route-release must expose the production stale-manifest contract',
  )
  const canonical = JSON.stringify({
    version: 1,
    source: {
      candidateSitemapSha256: 'candidate-a',
      candidateCount: 2,
      renderedCount: 3,
    },
    routes: {ADDED: []},
  })

  assert.doesNotThrow(() => routeRelease.assertRouteReleaseManifestCurrent(canonical, canonical))
  assert.throws(
    () => routeRelease.assertRouteReleaseManifestCurrent(
      canonical,
      JSON.stringify({
        version: 1,
        source: {
          candidateSitemapSha256: 'candidate-a',
          candidateCount: 3,
          renderedCount: 4,
        },
        routes: {ADDED: []},
      }),
    ),
    /ROUTE_RELEASE_MANIFEST_STALE:source\.candidateCount,source\.renderedCount/,
  )
})

test('detects a changed candidate sitemap hash even when route counts are unchanged', () => {
  const current = JSON.stringify({version: 1, source: {candidateSitemapSha256: 'candidate-a', candidateCount: 2}})
  const expected = JSON.stringify({version: 1, source: {candidateSitemapSha256: 'candidate-b', candidateCount: 2}})
  assert.throws(
    () => routeRelease.assertRouteReleaseManifestCurrent(current, expected),
    /ROUTE_RELEASE_MANIFEST_STALE:source\.candidateSitemapSha256/,
  )
})

test('does not let an unreviewed added route silently enter production', () => {
  const current = JSON.stringify({version: 1, source: {candidateCount: 1}, routes: {ADDED: []}})
  const expected = JSON.stringify({
    version: 1,
    source: {candidateCount: 2},
    routes: {ADDED: ['/unreviewed-route/']},
  })
  assert.throws(
    () => routeRelease.assertRouteReleaseManifestCurrent(current, expected),
    /source\.candidateCount.*routes\.ADDED/,
  )
})

test('requires canonical Published Sanity metadata before a route manifest can be written', () => {
  assert.equal(
    typeof routeRelease.assertCanonicalRouteReleaseEnvironment,
    'function',
    'route-release must expose the canonical generation environment contract',
  )
  const canonical = {NEXT_PUBLIC_CONTENT_SOURCE: 'sanity', CMS_LEGACY_LIST_MODE: 'strict'}
  assert.doesNotThrow(() => routeRelease.assertCanonicalRouteReleaseEnvironment(canonical))
  assert.throws(
    () => routeRelease.assertCanonicalRouteReleaseEnvironment({...canonical, NEXT_PUBLIC_CONTENT_SOURCE: 'legacy'}),
    /ROUTE_RELEASE_NON_CANONICAL_ENVIRONMENT:NEXT_PUBLIC_CONTENT_SOURCE/,
  )
  assert.throws(
    () => routeRelease.assertCanonicalRouteReleaseEnvironment({...canonical, CMS_LEGACY_LIST_MODE: 'merge'}),
    /ROUTE_RELEASE_NON_CANONICAL_ENVIRONMENT:CMS_LEGACY_LIST_MODE/,
  )
})

test('withholds legal routes unless the governed approval record is complete', () => {
  const legalRoutes = ['/privacy-policy/', '/terms/']
  const approved = {status: 'APPROVED', approvedAt: '2026-08-30', approvedBy: 'POXIOL legal representative'}
  assert.deepEqual(withheldLegalRoutes(approved, legalRoutes), [])
  assert.deepEqual(withheldLegalRoutes({...approved, approvedBy: null}, legalRoutes), legalRoutes)
  assert.deepEqual(withheldLegalRoutes({...approved, status: 'PENDING_OWNER_LEGAL_APPROVAL'}, legalRoutes), legalRoutes)
})

test('rejects an unexplained public URL removal', () => {
  assert.throws(
    () => compareRoutes({publicUrls: ['/old/'], candidateUrls: [], redirects: [], gone: []}),
    /UNEXPLAINED_ROUTE_REMOVAL:\/old\//,
  )
})

test('accepts a pending legal route withheld from discovery but still rendered', () => {
  const result = compareRoutes({
    publicUrls: [],
    candidateUrls: [],
    renderedUrls: ['/privacy-policy/'],
    withheldLegal: ['/privacy-policy/'],
    redirects: [],
    gone: [],
  })

  assert.equal(result.withheldLegal.length, 1)
})

test('rejects a redirect whose destination is not rendered', () => {
  assert.throws(
    () => compareRoutes({
      publicUrls: ['/old/'],
      candidateUrls: ['/current/'],
      redirects: [{source: '/old/', destination: '/missing/', status: 301}],
      gone: [],
    }),
    /REDIRECT_DESTINATION_NOT_RENDERED:\/old\/->\/missing\//,
  )
})

test('allows safe route-manifest drift only on a Cloudflare preview branch', () => {
  assert.equal(shouldRequireExactManifest({CF_PAGES: '1', CF_PAGES_BRANCH: 'codex/construction-completion'}), false)
  assert.equal(shouldRequireExactManifest({CF_PAGES: '1', CF_PAGES_BRANCH: 'main'}), true)
  assert.equal(shouldRequireExactManifest({CF_PAGES: '1'}), true)
  assert.equal(shouldRequireExactManifest({}), true)
})

test('allows safe route-manifest drift for the explicit legacy compatibility build', () => {
  assert.equal(shouldRequireExactManifest({NEXT_PUBLIC_CONTENT_SOURCE: 'legacy'}), false)
  assert.equal(shouldRequireExactManifest({NEXT_PUBLIC_CONTENT_SOURCE: 'sanity'}), true)
  assert.equal(shouldRequireExactManifest({
    CF_PAGES: '1',
    CF_PAGES_BRANCH: 'main',
    NEXT_PUBLIC_CONTENT_SOURCE: 'legacy',
  }), true)
})
