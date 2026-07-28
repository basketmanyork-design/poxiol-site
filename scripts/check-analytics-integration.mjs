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
const mockup = read('components/forms/FreeMockupForm.tsx')

for (const eventName of [
  'page_view',
  'form_start',
  'form_submit',
  'generate_lead',
  'whatsapp_click',
  'email_click',
  'free_mockup_click',
  'get_quote_click',
  'file_upload',
  'alibaba_click',
  'product_view',
  'product_category_view',
  'case_study_view',
  'guide_view',
]) {
  if (!core.includes(`'${eventName}'`) && !client.includes(`'${eventName}'`) && !provider.includes(`'${eventName}'`)) {
    throw new Error(`Analytics implementation is missing ${eventName}`)
  }
}

if (!layout.includes('<AnalyticsProvider')) throw new Error('Root layout does not load AnalyticsProvider')
if (!server.includes('shouldEnableAnalytics')) throw new Error('Server config does not enforce environment gates')
if (!provider.includes('send_page_view: false')) throw new Error('GA4 config must disable automatic duplicate page_view')
if (!provider.includes('classifyOutboundLink')) throw new Error('Outbound link tracking is not centralized')
if (!contact.includes('trackFormStart') || !contact.includes('trackLead')) {
  throw new Error('Contact form lifecycle tracking is incomplete')
}
if (!mockup.includes('trackFormStart') || !mockup.includes('trackLead')) {
  throw new Error('Free Mockup form lifecycle tracking is incomplete')
}

for (const forbidden of ['fullName:', 'email:', 'phone:', 'company:', 'message:', 'file_name:']) {
  if (client.includes(forbidden)) throw new Error(`Client analytics payload exposes ${forbidden}`)
}

console.log('analytics integration contract passed')
