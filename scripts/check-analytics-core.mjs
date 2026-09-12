import assert from 'node:assert/strict'
import {
  analyticsTrafficTypeFromUrl,
  buildAnalyticsTagConfig,
  buildUtmUrl,
  classifyOutboundLink,
  normalizeUtmValue,
  sanitizeEventParams,
  shouldEnableAnalytics,
} from '../lib/analytics/core.ts'

assert.equal(
  analyticsTrafficTypeFromUrl('https://www.poxiol.com/?utm_source=poxiol_team&utm_medium=internal_test'),
  'internal',
)
assert.equal(
  analyticsTrafficTypeFromUrl('https://www.poxiol.com/?utm_source=POXIOL-TEAM&utm_medium=Internal-Test'),
  'internal',
)
assert.equal(
  analyticsTrafficTypeFromUrl('https://www.poxiol.com/?utm_source=poxiol_team&utm_medium=organic'),
  undefined,
)
assert.equal(analyticsTrafficTypeFromUrl('not a url'), undefined)

assert.deepEqual(buildAnalyticsTagConfig(false, undefined), {
  send_page_view: false,
  debug_mode: false,
  allow_google_signals: false,
  allow_ad_personalization_signals: false,
})
assert.deepEqual(buildAnalyticsTagConfig(false, 'internal'), {
  send_page_view: false,
  debug_mode: false,
  allow_google_signals: false,
  allow_ad_personalization_signals: false,
  traffic_type: 'internal',
})

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
