import {publicClaimValue, type PublicClaimPolicy} from './claim-policy.ts'
import {
  MEASUREMENT_TOLERANCE_REVIEW,
  ORDER_QUANTITY_CONFIRMED,
  SAMPLE_TIMING_CONFIRMED,
  SHIPPING_TIMING_CONFIRMED,
  TIMELINE_CONFIRMED,
} from './public-copy.ts'

export type ProcurementPolicySource = {
  quantityPolicy?: PublicClaimPolicy
  sampleTimingPolicy?: PublicClaimPolicy
  productionTimingPolicy?: PublicClaimPolicy
  mockupTimingPolicy?: PublicClaimPolicy
  shippingTimingPolicy?: PublicClaimPolicy
  measurementTolerancePolicy?: PublicClaimPolicy
}

export function resolveProcurementTruth(source: ProcurementPolicySource = {}) {
  return {
    quantity: publicClaimValue(source.quantityPolicy) || ORDER_QUANTITY_CONFIRMED,
    sampleTiming: publicClaimValue(source.sampleTimingPolicy) || SAMPLE_TIMING_CONFIRMED,
    productionTiming: publicClaimValue(source.productionTimingPolicy) || TIMELINE_CONFIRMED,
    mockupTiming: publicClaimValue(source.mockupTimingPolicy) || TIMELINE_CONFIRMED,
    shippingTiming: publicClaimValue(source.shippingTimingPolicy) || SHIPPING_TIMING_CONFIRMED,
    measurementTolerance: publicClaimValue(source.measurementTolerancePolicy) || MEASUREMENT_TOLERANCE_REVIEW,
  }
}
