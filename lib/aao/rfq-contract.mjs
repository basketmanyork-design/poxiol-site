import {catalog} from './catalog.mjs'

const allowedIds = (items) => new Set(items.map(({id}) => id))
const buyerTypes = allowedIds(catalog.buyerTypes)
const sports = allowedIds(catalog.sports)
const products = allowedIds(catalog.products)
const customizationOptions = allowedIds(catalog.customization)
const quantityUnits = new Set(['piece', 'set'])

const text = (value) => typeof value === 'string' ? value.trim() : ''

function normalizeCustomization(value) {
  if (!Array.isArray(value)) return []
  return [...new Set(value.map(text).filter(Boolean))]
}

export function normalizeRfq(input) {
  return {
    schemaVersion: catalog.contractVersion,
    submissionPolicy: 'human_review_required',
    fullName: text(input.fullName),
    email: text(input.email).toLowerCase(),
    phone: text(input.phone),
    country: text(input.country).toUpperCase(),
    buyerType: text(input.buyerType),
    sport: text(input.sport),
    productType: text(input.productType),
    quantity: Number(text(input.quantity)),
    quantityUnit: text(input.quantityUnit),
    targetDeliveryDate: text(input.targetDeliveryDate),
    teamOrBrandName: text(input.teamOrBrandName),
    colors: text(input.colors),
    customization: normalizeCustomization(input.customization),
    notes: text(input.notes),
    manualReviewAccepted: input.manualReviewAccepted === true,
  }
}

export function validateRfq(input, now = new Date()) {
  const value = normalizeRfq(input)
  const errors = {}

  if (!value.fullName) errors.fullName = 'Enter your full name.'
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.email)) {
    errors.email = 'Enter a valid email address.'
  }
  if (!/^[A-Z]{2}$/.test(value.country)) {
    errors.country = 'Use a two-letter ISO country code.'
  }
  if (!buyerTypes.has(value.buyerType)) {
    errors.buyerType = 'Select a supported buyer type.'
  }
  if (!sports.has(value.sport)) {
    errors.sport = 'Select a supported sport.'
  }
  if (!products.has(value.productType)) {
    errors.productType = 'Select a supported product type.'
  }
  if (!Number.isInteger(value.quantity) || value.quantity < 1) {
    errors.quantity = 'Quantity must be a positive whole number.'
  }
  if (!quantityUnits.has(value.quantityUnit)) {
    errors.quantityUnit = 'Select piece or set.'
  }
  if (
    value.targetDeliveryDate
    && (
      !/^\d{4}-\d{2}-\d{2}$/.test(value.targetDeliveryDate)
      || value.targetDeliveryDate < now.toISOString().slice(0, 10)
    )
  ) {
    errors.targetDeliveryDate = 'Target delivery date cannot be in the past.'
  }
  if (value.customization.some((id) => !customizationOptions.has(id))) {
    errors.customization = 'Select only supported customization options.'
  }
  if (!value.manualReviewAccepted) {
    errors.manualReviewAccepted = 'Accept the human-review policy before submitting.'
  }

  return Object.keys(errors).length
    ? {ok: false, errors}
    : {ok: true, value}
}

export function toRfqFormData(value) {
  const formData = new FormData()
  formData.set('formType', `Structured RFQ v${value.schemaVersion}`)
  formData.set('humanReviewRequired', 'true')

  for (const [key, fieldValue] of Object.entries(value)) {
    if (key === 'customization') {
      formData.set(key, fieldValue.join(', '))
    } else {
      formData.set(key, String(fieldValue))
    }
  }

  formData.set('rfqPayload', JSON.stringify(value))
  return formData
}
