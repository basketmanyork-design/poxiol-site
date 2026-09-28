import type {ValidationSection} from './analytics/core.ts'

export const PROCUREMENT_FORM_STEPS = [
  {id: 'products', title: 'Products'},
  {id: 'delivery', title: 'Delivery'},
  {id: 'contact', title: 'Contact'},
] as const

export type ProcurementFormStep = (typeof PROCUREMENT_FORM_STEPS)[number]['id']

const fixedKeys: Record<ProcurementFormStep, ReadonlySet<string>> = {
  products: new Set(['products', 'additionalDetails', 'file']),
  delivery: new Set(['requiredDeliveryDate', 'deliveryCountry', 'deliveryPostalCode']),
  contact: new Set(['fullName', 'contact', 'email', 'whatsapp']),
}

function stepForError(key: string): ProcurementFormStep | undefined {
  if (/^(?:product|quantity|unit)-\d+$/.test(key) || fixedKeys.products.has(key)) return 'products'
  if (fixedKeys.delivery.has(key)) return 'delivery'
  if (fixedKeys.contact.has(key)) return 'contact'
  return undefined
}

export function errorsForProcurementStep(errors: Record<string, string>, step: ProcurementFormStep) {
  return Object.fromEntries(Object.entries(errors).filter(([key]) => stepForError(key) === step))
}

export function firstValidationSection(errors: Record<string, string>): ValidationSection {
  const firstKey = Object.keys(errors)[0]
  if (!firstKey) return 'form'
  if (firstKey === 'file') return 'file'
  return stepForError(firstKey) || 'form'
}
