import assert from 'node:assert/strict'
import fs from 'node:fs'

const contact = fs.readFileSync('components/forms/ContactForm.tsx', 'utf8')
const freeMockup = fs.readFileSync('components/forms/FreeMockupForm.tsx', 'utf8')
const leadPipeline = fs.readFileSync('lib/v8/leads.ts', 'utf8')
const analyticsClient = fs.readFileSync('lib/analytics/client.ts', 'utf8')
const analyticsCore = fs.readFileSync('lib/analytics/core.ts', 'utf8')

assert.equal((contact.match(/type="file"/g) || []).length, 3, 'ContactForm must retain exactly three file inputs')
for (const attachment of ['logo_file', 'reference_design_file', 'size_chart_tech_pack_file']) {
  assert.ok(contact.includes(`name="${attachment}"`), `Missing ContactForm file input: ${attachment}`)
  assert.ok(leadPipeline.includes(attachment), `Missing Formspree attachment mapping: ${attachment}`)
}

for (const contract of [
  'new FormData()',
  'NEXT_PUBLIC_FORMSPREE_CONTACT_ENDPOINT',
  'trackFileUpload',
  'trackFormSubmit',
  'trackLead',
  'router.push',
  'errorMessage',
  'whatsappHref',
  'publicEmail',
]) {
  assert.ok(contact.includes(contract) || leadPipeline.includes(contract), `ContactForm pipeline contract missing: ${contract}`)
}

for (const contract of [
  'NEXT_PUBLIC_FORMSPREE_FREE_MOCKUP_ENDPOINT',
  'WHATSAPP_HREF',
  'trackFormStart',
  'trackFormSubmit',
  'trackLead',
  'submitted',
  'errorMessage',
]) {
  assert.ok(freeMockup.includes(contract), `FreeMockupForm contract missing: ${contract}`)
}

for (const utmField of ['utm_source', 'utm_medium', 'utm_campaign']) {
  assert.ok(analyticsClient.includes(utmField) || analyticsCore.includes(utmField), `UTM contract missing: ${utmField}`)
}

console.log('public inquiry integrity contracts passed')
