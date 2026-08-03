export const DEDICATED_GUIDE_SLUGS = [
  'b2b-sourcing-faq',
  'how-to-choose-a-custom-soccer-kit-manufacturer',
  'how-to-order-custom-basketball-uniforms-for-your-team',
  'moq-1-custom-teamwear-how-it-works',
  'oem-odm-sportswear-manufacturing-guide-for-brands',
  'sublimation-vs-screen-printing-for-custom-teamwear',
] as const

const dedicatedGuideSlugSet = new Set<string>(DEDICATED_GUIDE_SLUGS)

export function filterDedicatedGuideSlugs<T extends {slug: string}>(articles: T[]): T[] {
  return articles.filter((article) => !dedicatedGuideSlugSet.has(article.slug))
}
