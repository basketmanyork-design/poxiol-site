import assert from 'node:assert/strict'
import {
  BUYER_ROLE_OPTIONS,
  PROJECT_QUANTITY_OPTIONS,
  classifyLead,
  createProjectSubmissionFormData,
  requireContactFormEndpoint,
  validateProjectAttachment,
} from '../lib/v8/leads.ts'

assert.deepEqual(BUYER_ROLE_OPTIONS, [
  'Team Manager',
  'School Representative',
  'Sports Club',
  'Sports Brand',
  'Distributor',
])

assert.deepEqual(PROJECT_QUANTITY_OPTIONS.map((option) => option.value), [
  'research',
  '1-9',
  '10-49',
  '50-99',
  '100-299',
  '300+',
])

assert.equal(classifyLead({
  buyerRole: 'Sports Club',
  quantity: '50-99',
  deadline: '2026-10-01',
  assetCount: 1,
  requirements: 'Basketball jerseys and shorts with player names.',
}), 'HIGH')

assert.equal(classifyLead({
  buyerRole: 'Sports Brand',
  quantity: '300+',
  deadline: '2026-11-15',
  assetCount: 2,
  requirements: 'Private label teamwear collection.',
}), 'HIGH')

assert.equal(classifyLead({
  buyerRole: 'School Representative',
  quantity: '10-49',
  deadline: '2026-09-01',
  assetCount: 0,
  requirements: 'Need pricing for the school basketball program.',
}), 'MEDIUM')

assert.equal(classifyLead({
  buyerRole: 'Sports Club',
  quantity: '50-99',
  deadline: '2026-10-01',
  assetCount: 0,
  requirements: 'Need a confirmed quote before club approval.',
}), 'MEDIUM', 'A clear 50+ inquiry without an uploaded asset must not be marked HIGH.')

assert.equal(classifyLead({
  buyerRole: 'Team Manager',
  quantity: '10-49',
  deadline: '',
  assetCount: 0,
  requirements: 'Need a quote for basketball uniforms.',
}), 'LOW', 'A project without a clear timeline must remain LOW.')

for (const input of [
  {buyerRole: 'Team Manager', quantity: 'research', deadline: '', assetCount: 0, requirements: ''},
  {buyerRole: 'Sports Club', quantity: '10-49', deadline: '', assetCount: 0, requirements: ''},
  {buyerRole: 'Sports Brand', quantity: '50-99', deadline: 'not-a-date', assetCount: 1, requirements: ''},
]) {
  assert.equal(classifyLead(input), 'LOW')
}

const logo = new File(['logo'], 'team-logo.png', {type: 'image/png'})
const reference = new File(['reference'], 'uniform-reference.jpg', {type: 'image/jpeg'})
const formData = createProjectSubmissionFormData({
  intent: 'quote',
  formType: 'Get Quote Conversion',
  sourcePage: 'https://www.poxiol.com/get-quote/',
  fields: {
    buyerRole: 'Sports Club',
    sport: 'Basketball',
    quantity: '50-99',
    deadline: '2026-10-01',
    customizationRequirements: 'Names, numbers and club colors.',
    fullName: 'Test Buyer',
    company: 'Test Club',
    country: 'United States',
    whatsapp: '+1 555 0100',
    email: 'buyer@example.com',
    selectedStyle: '',
  },
  attachments: {
    logo_file: logo,
    reference_design_file: reference,
    size_chart_tech_pack_file: null,
  },
})

assert.equal(formData.get('leadPriority'), 'HIGH')
assert.equal(formData.get('intent'), 'quote')
assert.equal(formData.get('buyerRole'), 'Sports Club')
assert.equal((formData.get('logo_file') as File).name, 'team-logo.png')
assert.equal((formData.get('reference_design_file') as File).name, 'uniform-reference.jpg')
assert.equal(formData.has('size_chart_tech_pack_file'), false, 'Unselected optional attachments must not be submitted.')

assert.equal(requireContactFormEndpoint('https://formspree.io/f/example'), 'https://formspree.io/f/example')
assert.throws(() => requireContactFormEndpoint(undefined), /Form endpoint is not configured/)
assert.equal(validateProjectAttachment(new File(['small'], 'small.png')), null)
assert.match(validateProjectAttachment(new File([new Uint8Array(10 * 1024 * 1024 + 1)], 'large.png')) || '', /larger than 10 MB/)

console.log('POXIOL V8 lead qualification checks passed.')
