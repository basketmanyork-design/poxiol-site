import assert from 'node:assert/strict'
import {
  buildUtmUrl,
  classifyOutboundLink,
  normalizeUtmValue,
  sanitizeEventParams,
  shouldEnableAnalytics,
} from '../lib/analytics/core.ts'

assert.equal(normalizeUtmValue('  LinkedIn Campaign  '), 'linkedin-campaign')
assert.equal(normalizeUtmValue('customer@example.com'), '')

const params = sanitizeEventParams({
  page_path: '/contact/',
  form_type: 'contact',
  utm_source: 'linkedin',
  email: 'customer@example.com',
  full_name: 'Private Person',
  company: 'Private Company',
  file_name: 'private-logo.ai',
})
assert.deepEqual(params, {
  page_path: '/contact/',
  form_type: 'contact',
  utm_source: 'linkedin',
})

assert.equal(classifyOutboundLink('mailto:sales@example.com'), 'email_click')
assert.equal(classifyOutboundLink('https://wa.me/861234567890'), 'whatsapp_click')
assert.equal(classifyOutboundLink('https://example.alibaba.com/store'), 'alibaba_click')
assert.equal(classifyOutboundLink('/products/'), null)

assert.equal(shouldEnableAnalytics({
  analyticsEnabled: true,
  ga4Enabled: true,
  measurementId: 'G-ABC123',
  nodeEnv: 'production',
  contentSource: 'sanity',
  cloudflarePages: '1',
  cloudflareBranch: 'main',
}), true)

for (const override of [
  {measurementId: ''},
  {nodeEnv: 'development'},
  {contentSource: 'sanity-preview'},
  {cloudflarePages: undefined},
  {cloudflareBranch: 'preview-branch'},
  {analyticsEnabled: false},
  {ga4Enabled: false},
]) {
  assert.equal(shouldEnableAnalytics({
    analyticsEnabled: true,
    ga4Enabled: true,
    measurementId: 'G-ABC123',
    nodeEnv: 'production',
    contentSource: 'sanity',
    cloudflarePages: '1',
    cloudflareBranch: 'main',
    ...override,
  }), false)
}

assert.equal(
  buildUtmUrl({
    destination: 'https://www.poxiol.com/products/',
    source: 'LinkedIn',
    medium: 'Organic Social',
    campaign: 'Teamwear Launch',
    content: 'Hero CTA',
  }),
  'https://www.poxiol.com/products/?utm_source=linkedin&utm_medium=organic-social&utm_campaign=teamwear-launch&utm_content=hero-cta',
)

console.log('analytics core tests passed')
