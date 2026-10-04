import assert from 'node:assert/strict'
import test from 'node:test'
import {appendGoogleAdsAttribution, sanitizeGoogleAdsAttribution} from '../lib/google-ads-attribution.ts'

test('keeps only bounded Google Ads provenance and canonical same-origin paths', () => {
  const url = new URL('https://www.poxiol.com/sample-order/?gclid=AbC_123456789-xy.z&utm_source=google&utm_medium=cpc&utm_campaign=us-team-uniforms&utm_term=basketball%20uniforms&utm_content=sample-ad&ignored=private')
  assert.deepEqual(sanitizeGoogleAdsAttribution(url, '/products/basketball-uniforms/'), {
    gclid: 'AbC_123456789-xy.z', utm_source: 'google', utm_medium: 'cpc',
    utm_campaign: 'us-team-uniforms', utm_term: 'basketball uniforms',
    utm_content: 'sample-ad', landing_path: '/sample-order/',
    source_path: '/products/basketball-uniforms/',
  })
})

test('discards PII-like, malformed and oversized values rather than copying them', () => {
  const url = new URL('https://www.poxiol.com/sample-order/?gclid=buyer%40example.com&utm_source=%2B1%20555%20123%204567&utm_medium=cpc%3Cscript%3E&utm_campaign=' + 'a'.repeat(101))
  assert.deepEqual(sanitizeGoogleAdsAttribution(url, 'https://evil.example/private'), {
    landing_path: '/sample-order/',
  })
})

test('rejects a non-POXIOL landing URL and suspicious source paths', () => {
  assert.deepEqual(sanitizeGoogleAdsAttribution(new URL('https://evil.example/sample-order/?utm_source=google'), '/contact/'), {})
  assert.deepEqual(sanitizeGoogleAdsAttribution(new URL('https://www.poxiol.com/sample-order/'), '/contact/?email=buyer@example.com'), {landing_path:'/sample-order/'})
})

test('serializes safe operational provenance without storage or analytics availability', () => {
  const body = new FormData()
  appendGoogleAdsAttribution(body, sanitizeGoogleAdsAttribution(new URL('https://www.poxiol.com/sample-order/?gclid=click-123&utm_source=google'), '/'))
  assert.equal(body.get('ads_gclid'), 'click-123')
  assert.equal(body.get('ads_utm_source'), 'google')
  assert.equal(body.get('ads_landing_path'), '/sample-order/')
  assert.equal(body.get('ads_source_path'), '/')
  assert.equal(body.get('email'), null)
})
