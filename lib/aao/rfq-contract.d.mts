export type RfqValue = {
  schemaVersion: string
  submissionPolicy: 'human_review_required'
  fullName: string
  email: string
  phone: string
  country: string
  buyerType: string
  sport: string
  productType: string
  quantity: number
  quantityUnit: 'piece' | 'set'
  targetDeliveryDate: string
  teamOrBrandName: string
  colors: string
  customization: string[]
  notes: string
  manualReviewAccepted: true
}

export type RfqValidationResult =
  | {ok: true; value: RfqValue}
  | {ok: false; errors: Record<string, string>}

export function normalizeRfq(input: Record<string, unknown>): RfqValue
export function validateRfq(
  input: Record<string, unknown>,
  now?: Date,
): RfqValidationResult
export function toRfqFormData(value: RfqValue): FormData
