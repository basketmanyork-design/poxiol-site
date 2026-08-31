import assert from 'node:assert/strict'
import test from 'node:test'
import {collectPermanentRedirectSources} from '../lib/cms/migration-route-governance.mjs'

const normalizeRoute = (route) => route === '/'
  ? '/'
  : `/${route.replace(/^\/+|\/+$/g, '')}/`

test('only permanent redirect types suppress migration content routes', () => {
  const candidates = [
    {type: 'redirectRule', route: '/permanent-301', fields: {redirectType: 301}},
    {type: 'redirectRule', route: '/temporary-302', fields: {redirectType: 302}},
    {type: 'redirectRule', route: '/permanent-308', fields: {redirectType: 308}},
    {type: 'redirectRule', route: '/rewrite-200', fields: {redirectType: 200}},
  ]

  assert.deepEqual(
    [...collectPermanentRedirectSources(candidates, normalizeRoute)].sort(),
    ['/permanent-301/', '/permanent-308/'],
  )
})
