import assert from 'node:assert/strict'
import {readFileSync} from 'node:fs'
import {createRequire} from 'node:module'
import test from 'node:test'
import vm from 'node:vm'
import ts from 'typescript'
import * as analyticsCore from '../lib/analytics/core.ts'
import {
  buildAttributionFromUrl,
  createLeadEventContext,
  normalizeCtaLocation,
  sanitizeEventParams,
  shouldEnableAnalytics,
} from '../lib/analytics/core.ts'

const require = createRequire(import.meta.url)
const compiledClient = ts.transpileModule(readFileSync('lib/analytics/client.ts', 'utf8'), {
  compilerOptions: {module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022},
}).outputText

function loadAnalyticsClient(window: Record<string, unknown>) {
  const exports: Record<string, (...args: never[]) => unknown> = {}
  vm.runInNewContext(compiledClient, {
    exports,
    window,
    URL,
    require(name: string) {
      if (name === './core') return analyticsCore
      return require(name)
    },
  })
  return exports
}

const expectedLeadForms = [
  ['free_mockup_form', 'free_mockup'],
  ['factory_quote_form', 'factory_quote'],
  ['production_sample_form', 'production_sample'],
  ['general_inquiry_form', 'general_inquiry'],
  ['homepage_project_inquiry', 'free_mockup'],
] as const

test('stable form ids produce fixed lead types while retaining legacy form type', () => {
  for (const [formId, leadType] of expectedLeadForms) {
    assert.deepEqual(createLeadEventContext(formId, 'Legacy display label'), {
      lead_type: leadType,
      form_id: formId,
      form_type: 'Legacy display label',
    })
  }
})

test('analytics sanitizer permits governance keys and still removes private fields', () => {
  assert.deepEqual(sanitizeEventParams({
    lead_type: 'factory_quote',
    form_id: 'factory_quote_form',
    form_type: 'Get Quote Conversion',
    file_name: 'private-logo.ai',
    email: 'buyer@example.com',
    phone: '+1 555 123 4567',
  }), {
    lead_type: 'factory_quote',
    form_id: 'factory_quote_form',
    form_type: 'Get Quote Conversion',
  })
})

test('landing attribution keeps pathname and approved UTM keys only', () => {
  assert.deepEqual(
    buildAttributionFromUrl('https://www.poxiol.com/get-quote/?utm_source=linkedin&utm_medium=paid&utm_campaign=fall&utm_content=hero&email=buyer%40example.com&token=secret&gclid=private'),
    {
      utm_source: 'linkedin',
      utm_medium: 'paid',
      utm_campaign: 'fall',
      utm_content: 'hero',
      landing_page: '/get-quote/',
    },
  )
})

test('CTA location accepts governed locations and never treats a pathname as a location', () => {
  for (const location of ['header', 'hero', 'product_section', 'factory_section', 'case_study', 'form_recovery', 'sticky_mobile', 'footer']) {
    assert.equal(normalizeCtaLocation(location), location)
  }
  assert.equal(normalizeCtaLocation('/products/basketball-uniforms/'), undefined)
  assert.equal(normalizeCtaLocation(''), undefined)
})

test('one accepted callback emits each conversion event exactly once with stable keys', () => {
  const calls: unknown[][] = []
  const storage = {getItem: () => null, setItem() {}, removeItem() {}}
  const client = loadAnalyticsClient({
    __poxiolAnalyticsEnabled: true,
    gtag: (...args: unknown[]) => calls.push(args),
    location: {pathname: '/get-quote/', origin: 'https://www.poxiol.com'},
    localStorage: storage,
    sessionStorage: storage,
  })
  const context = createLeadEventContext('factory_quote_form', 'Get Quote Conversion')
  const submissionId = 'governance-test-submission'

  client.trackFormSubmit(context, submissionId)
  client.trackLead(context, submissionId)
  client.trackFileUpload(context, submissionId)
  client.trackFormSubmit(context, submissionId)
  client.trackLead(context, submissionId)
  client.trackFileUpload(context, submissionId)

  assert.deepEqual(calls.map(call => call[1]), ['form_submit', 'generate_lead', 'file_upload'])
  for (const call of calls) {
    assert.deepEqual(call[2], {
      lead_type: 'factory_quote',
      form_id: 'factory_quote_form',
      form_type: 'Get Quote Conversion',
      page_path: '/get-quote/',
    })
  }
})

test('file selection is distinct from successful attachment upload', () => {
  const calls: unknown[][] = []
  const storage = {getItem: () => null, setItem() {}, removeItem() {}}
  const client = loadAnalyticsClient({
    __poxiolAnalyticsEnabled: true,
    gtag: (...args: unknown[]) => calls.push(args),
    location: {pathname: '/free-mockup/', origin: 'https://www.poxiol.com'},
    localStorage: storage,
    sessionStorage: storage,
  })
  client.trackFileSelect(createLeadEventContext('free_mockup_form', 'Free Mockup Conversion'))
  assert.deepEqual(calls.map(call => call[1]), ['file_select'])
})

test('legacy stored landing pages are reduced to pathname before any event is sent', () => {
  const calls: unknown[][] = []
  const storage = {
    getItem: () => JSON.stringify({landing_page: '/free-mockup/?email=buyer%40example.com&token=secret', utm_source: 'linkedin'}),
    setItem() {},
    removeItem() {},
  }
  const client = loadAnalyticsClient({
    __poxiolAnalyticsEnabled: true,
    gtag: (...args: unknown[]) => calls.push(args),
    location: {pathname: '/free-mockup/', origin: 'https://www.poxiol.com'},
    localStorage: storage,
    sessionStorage: storage,
  })
  client.trackLead(createLeadEventContext('free_mockup_form', 'Free Mockup Conversion'), 'legacy-attribution')
  assert.deepEqual(calls[0]?.[2], {
    landing_page: '/free-mockup/',
    utm_source: 'linkedin',
    lead_type: 'free_mockup',
    form_id: 'free_mockup_form',
    form_type: 'Free Mockup Conversion',
    page_path: '/free-mockup/',
  })
})

test('capturing attribution rewrites legacy first-touch storage without arbitrary query data', () => {
  const values = new Map<string, string>([[
    'poxiol.analytics.first-touch',
    JSON.stringify({landing_page: '/get-quote/?email=buyer%40example.com&token=secret', utm_source: 'linkedin'}),
  ]])
  const storage = {
    getItem: (key: string) => values.get(key) ?? null,
    setItem: (key: string, value: string) => values.set(key, value),
    removeItem: (key: string) => values.delete(key),
  }
  const client = loadAnalyticsClient({
    location: {href: 'https://www.poxiol.com/get-quote/?utm_source=linkedin&token=new-secret'},
    localStorage: storage,
    sessionStorage: storage,
  })
  client.captureAttribution()
  assert.deepEqual(JSON.parse(values.get('poxiol.analytics.first-touch') || '{}'), {
    utm_source: 'linkedin',
    landing_page: '/get-quote/',
  })
})

test('development and preview contexts cannot load the production measurement id', () => {
  const productionId = 'G-W5YLNQ39X1'
  const base = {
    analyticsEnabled: true,
    ga4Enabled: true,
    measurementId: productionId,
    nodeEnv: 'production',
    contentSource: 'sanity',
    cloudflarePages: '1',
    cloudflareBranch: 'main',
  }
  assert.equal(shouldEnableAnalytics({...base, nodeEnv: 'development'}), false)
  assert.equal(shouldEnableAnalytics({...base, contentSource: 'sanity-preview'}), false)
  assert.equal(shouldEnableAnalytics({...base, cloudflareBranch: 'preview-branch'}), false)
})
