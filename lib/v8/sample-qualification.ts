export const SAMPLE_ORGANIZATION_TYPES = [
  'Team',
  'School',
  'Club',
  'League',
  'Sports Brand',
  'Distributor',
  'Reseller',
  'Other Business',
] as const

export type SampleOrganizationType = (typeof SAMPLE_ORGANIZATION_TYPES)[number]

export type SampleQualificationFields = {
  organizationName: string
  organizationType: SampleOrganizationType | ''
  organizationUrl: string
  deliveryCountry: string
  deliveryState: string
  deliveryCity: string
  internationalShippingConsent: boolean
  businessUseConfirmation: boolean
  quantity: string
  artworkProvided?: boolean
}

function validOrganizationUrl(value: string): boolean {
  const trimmed = value.trim()
  if (!trimmed || trimmed.length > 500) return false
  try {
    const url = new URL(trimmed)
    return ['http:', 'https:'].includes(url.protocol) && Boolean(url.hostname) && !url.username && !url.password
  } catch {
    return false
  }
}

export function validateSampleQualification(fields: SampleQualificationFields): Record<string, string> {
  const errors: Record<string, string> = {}
  const organizationName = fields.organizationName.trim()
  if (!organizationName || organizationName.length > 120) errors.company = 'Enter your organization name.'
  if (!SAMPLE_ORGANIZATION_TYPES.includes(fields.organizationType as SampleOrganizationType)) errors.organizationType = 'Choose your organization type.'
  if (!validOrganizationUrl(fields.organizationUrl)) errors.organizationUrl = 'Enter a valid organization website or public profile URL beginning with http:// or https://.'
  const deliveryState = fields.deliveryState.trim()
  const deliveryCity = fields.deliveryCity.trim()
  if (!deliveryState || deliveryState.length > 120) errors.deliveryState = 'Enter the delivery state or region.'
  if (!deliveryCity || deliveryCity.length > 120) errors.deliveryCity = 'Enter the delivery city.'
  if (!fields.internationalShippingConsent) errors.internationalShippingConsent = 'Confirm that international shipping charges apply to the applicant.'
  if (!fields.businessUseConfirmation) errors.businessUseConfirmation = 'Confirm this sample is for an organization or business use, not a personal single-piece retail order.'
  return errors
}

export function sampleQualificationOutcome(fields: SampleQualificationFields): 'REVIEW_REQUIRED' | 'INCOMPLETE' {
  return Object.keys(validateSampleQualification(fields)).length === 0 ? 'REVIEW_REQUIRED' : 'INCOMPLETE'
}
