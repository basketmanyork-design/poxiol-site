import assert from 'node:assert/strict'
import test from 'node:test'

import {compareRoutes, shouldRequireExactManifest} from '../lib/release/route-release.mjs'

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
