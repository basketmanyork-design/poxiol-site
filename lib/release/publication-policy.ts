import records from '../../content/release/public-sections.json' with {type: 'json'}

export type PublicSectionDecision =
  | 'EVIDENCE'
  | 'QUALIFIED_EXPLANATION'
  | 'WITHHELD'

export type PublicSectionId = keyof typeof records

const validDecisions = new Set<PublicSectionDecision>([
  'EVIDENCE',
  'QUALIFIED_EXPLANATION',
  'WITHHELD',
])

export function publicSectionDecision(
  id: PublicSectionId,
): PublicSectionDecision {
  const decision = records[id]
  if (!decision || !validDecisions.has(decision as PublicSectionDecision)) {
    throw new Error(`UNKNOWN_PUBLIC_SECTION:${id}`)
  }
  return decision as PublicSectionDecision
}

const governedArticleRoutes = {
  'blog/custom-teamwear-production-notes': 'blog-custom-teamwear-production-notes',
  'blog/sportswear-manufacturer-project-brief-checklist': 'blog-sportswear-manufacturer-project-brief-checklist',
  'blog/tech-pack-vs-pattern-vs-sample': 'blog-tech-pack-vs-pattern-vs-sample',
  'blog/custom-team-uniform-roster-checklist': 'blog-custom-team-uniform-roster-checklist',
} as const satisfies Record<string, PublicSectionId>

const approvedBlogRoutes = new Set<string>([
  'sportswear-manufacturer-project-brief-checklist',
  'tech-pack-vs-pattern-vs-sample',
  'custom-team-uniform-roster-checklist',
])

export function isArticleRouteReleased(articleType: string, slug: string): boolean {
  if (articleType === 'blog' && !approvedBlogRoutes.has(slug)) return false
  const policyId = governedArticleRoutes[`${articleType}/${slug}` as keyof typeof governedArticleRoutes]
  return !policyId || publicSectionDecision(policyId) !== 'WITHHELD'
}
