import {readFileSync} from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const read = (relative) => readFileSync(path.join(root, relative), 'utf8')

const core = read('lib/analytics/core.ts')
const provider = read('components/analytics/AnalyticsProvider.tsx')
const client = read('lib/analytics/client.ts')
const server = read('lib/analytics/server.ts')
const layout = read('app/layout.tsx')
const contact = read('components/forms/ContactForm.tsx')
const procurement = read('components/forms/ProcurementContactForm.tsx')

for (const eventName of [
  'page_view',
  'form_start',
  'form_submit',
  'generate_lead',
  'sample_form_start',
  'sample_application_submitted',
  'whatsapp_click',
  'email_click',
  'free_mockup_click',
  'get_quote_click',
  'file_select',
  'file_upload',
  'form_step_view',
  'form_step_complete',
  'form_validation_error',
  'alibaba_click',
  'product_view',
  'product_category_view',
  'case_study_view',
  'guide_view',
  'qualify_lead',
  'close_convert_lead',
]) {
  if (!core.includes(`'${eventName}'`) && !client.includes(`'${eventName}'`) && !provider.includes(`'${eventName}'`)) {
    throw new Error(`Analytics implementation is missing ${eventName}`)
  }
}

if (!layout.includes('<AnalyticsProvider')) throw new Error('Root layout does not load AnalyticsProvider')
if (!server.includes('shouldEnableAnalytics')) throw new Error('Server config does not enforce environment gates')
if (!core.includes('send_page_view: false')) throw new Error('GA4 config must disable automatic duplicate page_view')
if (!provider.includes('analyticsTrafficTypeFromUrl')) throw new Error('GA4 provider must classify governed internal-test links before loading the tag')
if (!provider.includes('buildAnalyticsTagConfig')) throw new Error('GA4 provider must apply the governed traffic type at config scope')
if (!provider.includes('runtimeReady && permission')) throw new Error('GA4 provider must resolve traffic type before loading the tag')
if (!provider.includes('classifyOutboundLink')) throw new Error('Outbound link tracking is not centralized')
if (!provider.includes('normalizeCtaLocation')) throw new Error('CTA locations are not constrained to the governed enum')
if (provider.includes('anchor.dataset.analyticsLocation || pathname')) throw new Error('A pathname must never masquerade as CTA location')
if (!contact.includes('trackFormStart') || !contact.includes('trackLead')) {
  throw new Error('Contact form lifecycle tracking is incomplete')
}
for (const forbidden of ['fullName:', 'email:', 'phone:', 'company:', 'message:', 'file_name:']) {
  if (client.includes(forbidden)) throw new Error(`Client analytics payload exposes ${forbidden}`)
}
for (const helper of ['trackFormStepView', 'trackFormStepComplete', 'trackFormValidationError']) {
  if (!client.includes(`function ${helper}`)) throw new Error(`Client analytics is missing ${helper}`)
}
for (const helper of ['trackSampleFormStart', 'trackSampleApplicationSubmitted']) {
  if (!client.includes(`function ${helper}`)) throw new Error(`Client analytics is missing ${helper}`)
  if (!procurement.includes(helper)) throw new Error(`Sample form lifecycle is missing ${helper}`)
}
if (client.includes('trackQualifiedSampleLead') || procurement.includes('qualified_sample_lead')) {
  throw new Error('The public browser must not expose a qualified sample lead event')
}
if (!procurement.includes("if(intent==='sample')trackSampleFormStart")) {
  throw new Error('Sample form start must be conditional and tied to first buyer interaction')
}
if (!procurement.includes("if(intent==='sample')trackSampleApplicationSubmitted")) {
  throw new Error('Sample application submitted must run only after a confirmed sample response')
}

console.log('analytics integration contract passed')
