import {normalizeBuyerFacingClaim} from '../legacy-claim-normalizer.ts'

export type BasketballCategoryPublicCopy = {
  heroTitle?: string
  heroDescription?: string
  introduction?: string
  heroProofPoints?: string[]
  buyerTypes?: string[]
  keyFeatures?: string[]
  coreBenefits?: string[]
}

function normalizeBasketballClaim(value: string): string {
  return normalizeBuyerFacingClaim(value)
    .replace(/\bStart\s+with\s+1\s+Sample\b/gi, 'Sample planning is confirmed for the project')
    .replace(/\b(?:a\s+)?one[- ]set\s+sample\b/gi, 'the confirmed project sample')
}

export function normalizeBasketballCategoryPublicCopy<T extends BasketballCategoryPublicCopy>(category: T): T {
  return {
    ...category,
    heroTitle: category.heroTitle ? normalizeBasketballClaim(category.heroTitle) : category.heroTitle,
    heroDescription: category.heroDescription ? normalizeBasketballClaim(category.heroDescription) : category.heroDescription,
    introduction: category.introduction ? normalizeBasketballClaim(category.introduction) : category.introduction,
    heroProofPoints: category.heroProofPoints?.map(normalizeBasketballClaim),
    buyerTypes: category.buyerTypes?.map(normalizeBasketballClaim),
    keyFeatures: category.keyFeatures?.map(normalizeBasketballClaim),
    coreBenefits: category.coreBenefits?.map(normalizeBasketballClaim),
  }
}
