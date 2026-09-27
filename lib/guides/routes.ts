export const DEDICATED_GUIDE_SLUGS = [
  'b2b-sourcing-faq',
  'oem-odm-sportswear-manufacturing-guide-for-brands',
] as const

export const RETIRED_GUIDE_SLUGS = [
  'how-to-choose-a-custom-soccer-kit-manufacturer',
  'moq-1-custom-teamwear-how-it-works',
  'sublimation-vs-screen-printing-for-custom-teamwear',
] as const

const dedicatedGuideSlugSet = new Set<string>(DEDICATED_GUIDE_SLUGS)
const retiredGuideSlugSet = new Set<string>(RETIRED_GUIDE_SLUGS)

export function filterDedicatedGuideSlugs<T extends {slug: string}>(articles: T[]): T[] {
  return articles.filter((article) => (
    !dedicatedGuideSlugSet.has(article.slug) && !retiredGuideSlugSet.has(article.slug)
  ))
}
