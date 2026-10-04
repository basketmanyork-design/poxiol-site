import assert from 'node:assert/strict'
import {test} from 'node:test'

import {createProcurementFormData, type ProcurementFields} from '../lib/procurement-inquiry.ts'
import {
  SAMPLE_ORGANIZATION_TYPES,
  sampleQualificationOutcome,
  validateSampleQualification,
  type SampleQualificationFields,
} from '../lib/v8/sample-qualification.ts'

const validClubRequest: SampleQualificationFields = {
  organizationName: 'Northside Youth Club',
  organizationType: 'Club',
  organizationUrl: 'https://northside.example/teams',
  deliveryCountry: 'US',
  deliveryState: 'California',
  deliveryCity: 'San Diego',
  internationalShippingConsent: true,
  businessUseConfirmation: true,
  quantity: '1',
  artworkProvided: false,
}

test('a one-piece club sample request proceeds to manual review without a quantity minimum or artwork requirement', () => {
  assert.deepEqual(validateSampleQualification(validClubRequest), {})
  assert.equal(sampleQualificationOutcome(validClubRequest), 'REVIEW_REQUIRED')
})

test('organization identity and supported organization type are required', () => {
  assert.deepEqual(validateSampleQualification({...validClubRequest, organizationName: '', organizationType: ''}), {
    company: 'Enter your organization name.',
    organizationType: 'Choose your organization type.',
  })
  assert.deepEqual(SAMPLE_ORGANIZATION_TYPES, ['Team', 'School', 'Club', 'League', 'Sports Brand', 'Distributor', 'Reseller', 'Other Business'])
})

test('personal single-piece use never becomes qualified in the public form', () => {
  const fields = {...validClubRequest, businessUseConfirmation: false}
  assert.deepEqual(validateSampleQualification(fields), {
    businessUseConfirmation: 'Confirm this sample is for an organization or business use, not a personal single-piece retail order.',
  })
  assert.equal(sampleQualificationOutcome(fields), 'INCOMPLETE')
})

test('the applicant must accept international shipping charges', () => {
  assert.deepEqual(validateSampleQualification({...validClubRequest, internationalShippingConsent: false}), {
    internationalShippingConsent: 'Confirm that international shipping charges apply to the applicant.',
  })
})

test('organization URL accepts only bounded HTTP or HTTPS URLs', () => {
  for (const organizationUrl of ['', 'northside.example', 'mailto:buyer@example.com', 'javascript:alert(1)']) {
    assert.deepEqual(validateSampleQualification({...validClubRequest, organizationUrl}), {
      organizationUrl: 'Enter a valid organization website or public profile URL beginning with http:// or https://.',
    })
  }
})

test('United States delivery requires both state and city', () => {
  assert.deepEqual(validateSampleQualification({...validClubRequest, deliveryState: '', deliveryCity: ''}), {
    deliveryState: 'Enter the delivery state or region.',
    deliveryCity: 'Enter the delivery city.',
  })
})

test('non-US delivery accepts a bounded region and city', () => {
  assert.deepEqual(validateSampleQualification({
    ...validClubRequest,
    deliveryCountry: 'CA',
    deliveryState: 'Ontario',
    deliveryCity: 'Toronto',
    quantity: '1',
  }), {})
})

test('sample serialization emits review-required fields without inventing qualification or requiring artwork', () => {
  const fields: ProcurementFields = {
    fullName: 'Buyer Name',
    buyerRole: 'Team / School / Club',
    company: validClubRequest.organizationName,
    email: 'buyer@example.com',
    whatsapp: '',
    products: [{product: 'Basketball Uniforms', quantity: '1', unit: 'sets'}],
    requiredDeliveryDate: '2099-01-01',
    deliveryCountry: validClubRequest.deliveryCountry,
    deliveryPostalCode: '92101',
    postalNotApplicable: false,
    additionalDetails: '',
    organizationType: validClubRequest.organizationType,
    organizationUrl: validClubRequest.organizationUrl,
    deliveryState: validClubRequest.deliveryState,
    deliveryCity: validClubRequest.deliveryCity,
    internationalShippingConsent: true,
    businessUseConfirmation: true,
  }
  const data = createProcurementFormData(fields, {
    intent: 'sample',
    sourcePage: '/sample-order/',
    formType: 'Sample Request Conversion',
    submissionKey: 'sample-test-key',
  })

  assert.deepEqual(Object.fromEntries([
    'organization_type',
    'organization_url',
    'delivery_state',
    'delivery_city',
    'international_shipping_consent',
    'business_use_confirmation',
    'sample_qualification_status',
  ].map((key) => [key, data.get(key)])), {
    organization_type: 'Club',
    organization_url: 'https://northside.example/teams',
    delivery_state: 'California',
    delivery_city: 'San Diego',
    international_shipping_consent: 'accepted',
    business_use_confirmation: 'confirmed',
    sample_qualification_status: 'REVIEW_REQUIRED',
  })
  assert.equal(data.has('project_file_1'), false)
  assert.deepEqual(JSON.parse(String(data.get('products'))), [{product: 'Basketball Uniforms', quantity: 1, unit: 'sets'}])

  const quoteData = createProcurementFormData(fields, {
    intent: 'quote',
    sourcePage: '/get-quote/',
    formType: 'Get Quote Conversion',
    submissionKey: 'quote-test-key',
  })
  assert.equal(quoteData.has('organization_type'), false)
  assert.equal(quoteData.has('sample_qualification_status'), false)
})
