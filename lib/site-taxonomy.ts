export type TaxonomyGroupId = 'SPORTS' | 'TEAMWEAR' | 'MANUFACTURING_SOLUTIONS'
export type TaxonomyPublicStatus = 'PUBLISHED' | 'OWNER_CONFIRMATION_REQUIRED' | 'PLANNED'

export const PRODUCT_CATEGORY_STATES = ['ACTIVE_VERIFIED', 'MANUFACTURABLE_NOT_PROVEN', 'PLANNED', 'DISABLED'] as const
export type ProductCategoryState = (typeof PRODUCT_CATEGORY_STATES)[number]

export type CategoryPublicationGate = {
  public: boolean
  navigation: boolean
  products: boolean
  sitemap: boolean
  internalLinks: boolean
  seoLandingPage: boolean
  noindex: boolean
}

export function categoryPublicationGate(state: ProductCategoryState, indexabilityApproved = false): CategoryPublicationGate {
  if (state === 'ACTIVE_VERIFIED') return {public: true, navigation: true, products: true, sitemap: true, internalLinks: true, seoLandingPage: true, noindex: false}
  if (state === 'MANUFACTURABLE_NOT_PROVEN' && indexabilityApproved) {
    return {public: true, navigation: false, products: false, sitemap: true, internalLinks: true, seoLandingPage: true, noindex: false}
  }
  return {public: false, navigation: false, products: false, sitemap: false, internalLinks: false, seoLandingPage: false, noindex: true}
}

export const CATEGORY_PUBLICATION_DECISIONS: Readonly<Record<string, {state: ProductCategoryState; reason: string}>> = {
  basketball: {state: 'ACTIVE_VERIFIED', reason: 'Approved core sport with a canonical public offer.'},
  soccer: {state: 'ACTIVE_VERIFIED', reason: 'Approved core sport with a canonical public offer.'},
  baseball: {state: 'ACTIVE_VERIFIED', reason: 'Approved core sport with a canonical public offer.'},
  'training-wear': {state: 'ACTIVE_VERIFIED', reason: 'Approved public Teamwear category.'},
  'hoodies-jackets': {state: 'ACTIVE_VERIFIED', reason: 'Approved public Teamwear category.'},
  'team-accessories': {state: 'MANUFACTURABLE_NOT_PROVEN', reason: 'CMS may retain the category, but public capability evidence is not established.'},
  'american-football': {state: 'PLANNED', reason: 'Offer is not owner-verified for public promotion.'},
  esports: {state: 'PLANNED', reason: 'Offer is not owner-verified for public promotion.'},
  golf: {state: 'PLANNED', reason: 'Offer is not owner-verified for public promotion.'},
  'ice-hockey': {state: 'PLANNED', reason: 'Offer is not owner-verified for public promotion.'},
  rugby: {state: 'PLANNED', reason: 'Offer is not owner-verified for public promotion.'},
  'running-marathon': {state: 'PLANNED', reason: 'Offer is not owner-verified for public promotion.'},
  tennis: {state: 'PLANNED', reason: 'Offer is not owner-verified for public promotion.'},
  volleyball: {state: 'PLANNED', reason: 'Offer is not owner-verified for public promotion.'},
}

export type TaxonomyEntry = {
  id: string
  label: string
  path?: string
  publicStatus: TaxonomyPublicStatus
  navigation: boolean
  sitemap: boolean
}

export type TaxonomyGroup = {
  id: TaxonomyGroupId
  label: string
  items: readonly TaxonomyEntry[]
}

export const SITE_TAXONOMY: readonly TaxonomyGroup[] = [
  {
    id: 'SPORTS',
    label: 'Sports',
    items: [
      {id: 'basketball', label: 'Basketball', path: '/products/basketball-uniforms/', publicStatus: 'PUBLISHED', navigation: true, sitemap: true},
      {id: 'soccer', label: 'Soccer', path: '/products/soccer-jerseys/', publicStatus: 'PUBLISHED', navigation: true, sitemap: true},
      {id: 'baseball', label: 'Baseball', path: '/custom-baseball-softball-uniforms/', publicStatus: 'PUBLISHED', navigation: true, sitemap: true},
      {id: 'pickleball', label: 'Pickleball', publicStatus: 'OWNER_CONFIRMATION_REQUIRED', navigation: false, sitemap: false},
      {id: 'hockey', label: 'Hockey', publicStatus: 'OWNER_CONFIRMATION_REQUIRED', navigation: false, sitemap: false},
      {id: 'volleyball', label: 'Volleyball', publicStatus: 'OWNER_CONFIRMATION_REQUIRED', navigation: false, sitemap: false},
      {id: 'running-track', label: 'Running & Track', publicStatus: 'OWNER_CONFIRMATION_REQUIRED', navigation: false, sitemap: false},
    ],
  },
  {
    id: 'TEAMWEAR',
    label: 'Teamwear',
    items: [
      {id: 'training-wear', label: 'Training Wear', path: '/products/training-wear/', publicStatus: 'PUBLISHED', navigation: true, sitemap: true},
      {id: 'warm-up-suits', label: 'Warm-up Suits', path: '/products/training-wear/', publicStatus: 'PUBLISHED', navigation: false, sitemap: false},
      {id: 'hoodies', label: 'Hoodies', path: '/products/hoodies-jackets/', publicStatus: 'PUBLISHED', navigation: true, sitemap: true},
      {id: 'jackets', label: 'Jackets', path: '/products/hoodies-jackets/', publicStatus: 'PUBLISHED', navigation: false, sitemap: false},
      {id: 'polo-shirts', label: 'Polo Shirts', publicStatus: 'OWNER_CONFIRMATION_REQUIRED', navigation: false, sitemap: false},
      {id: 'shorts', label: 'Shorts', path: '/products/', publicStatus: 'PUBLISHED', navigation: false, sitemap: false},
    ],
  },
  {
    id: 'MANUFACTURING_SOLUTIONS',
    label: 'Manufacturing Solutions',
    items: [
      {id: 'custom-team-uniforms', label: 'Custom Team Uniforms', path: '/solutions/', publicStatus: 'PUBLISHED', navigation: true, sitemap: true},
      {id: 'oem-manufacturing', label: 'OEM Manufacturing', path: '/oem-odm/', publicStatus: 'PUBLISHED', navigation: true, sitemap: true},
      {id: 'private-label', label: 'Private Label', path: '/private-label-teamwear/', publicStatus: 'PUBLISHED', navigation: true, sitemap: true},
    ],
  },
] as const

function taxonomyPublicationState(item: TaxonomyEntry): ProductCategoryState {
  return CATEGORY_PUBLICATION_DECISIONS[item.id]?.state || (item.publicStatus === 'PUBLISHED' ? 'ACTIVE_VERIFIED' : 'PLANNED')
}

export function publicTaxonomyGroups(): TaxonomyGroup[] {
  return SITE_TAXONOMY.map((group) => ({
    ...group,
    items: group.items.filter((item) => item.publicStatus === 'PUBLISHED' && categoryPublicationGate(taxonomyPublicationState(item)).public && item.path),
  })).filter((group) => group.items.length)
}

export function navigableTaxonomyEntries(): TaxonomyEntry[] {
  return SITE_TAXONOMY.flatMap((group) => group.items).filter(
    (item) => item.publicStatus === 'PUBLISHED' && categoryPublicationGate(taxonomyPublicationState(item)).navigation && item.navigation && Boolean(item.path),
  )
}

export function productNavigationEntries(): Array<TaxonomyEntry & {path: string}> {
  const seen = new Set<string>()
  return SITE_TAXONOMY
    .filter((group) => group.id !== 'MANUFACTURING_SOLUTIONS')
    .flatMap((group) => group.items)
    .filter((item): item is TaxonomyEntry & {path: string} => {
      if (item.publicStatus !== 'PUBLISHED' || !categoryPublicationGate(taxonomyPublicationState(item)).navigation || !item.navigation || !item.path || seen.has(item.path)) return false
      seen.add(item.path)
      return true
    })
}

export function sitemapTaxonomyEntries(): TaxonomyEntry[] {
  const seen = new Set<string>()
  return SITE_TAXONOMY.flatMap((group) => group.items).filter((item) => {
    if (item.publicStatus !== 'PUBLISHED' || !categoryPublicationGate(taxonomyPublicationState(item)).sitemap || !item.sitemap || !item.path || seen.has(item.path)) return false
    seen.add(item.path)
    return true
  })
}
