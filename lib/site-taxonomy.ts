export type TaxonomyGroupId = 'SPORTS' | 'TEAMWEAR' | 'MANUFACTURING_SOLUTIONS'
export type TaxonomyPublicStatus = 'PUBLISHED' | 'OWNER_CONFIRMATION_REQUIRED' | 'PLANNED'

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

export function publicTaxonomyGroups(): TaxonomyGroup[] {
  return SITE_TAXONOMY.map((group) => ({
    ...group,
    items: group.items.filter((item) => item.publicStatus === 'PUBLISHED' && item.path),
  })).filter((group) => group.items.length)
}

export function navigableTaxonomyEntries(): TaxonomyEntry[] {
  return SITE_TAXONOMY.flatMap((group) => group.items).filter(
    (item) => item.publicStatus === 'PUBLISHED' && item.navigation && Boolean(item.path),
  )
}

export function productNavigationEntries(): Array<TaxonomyEntry & {path: string}> {
  const seen = new Set<string>()
  return SITE_TAXONOMY
    .filter((group) => group.id !== 'MANUFACTURING_SOLUTIONS')
    .flatMap((group) => group.items)
    .filter((item): item is TaxonomyEntry & {path: string} => {
      if (item.publicStatus !== 'PUBLISHED' || !item.navigation || !item.path || seen.has(item.path)) return false
      seen.add(item.path)
      return true
    })
}

export function sitemapTaxonomyEntries(): TaxonomyEntry[] {
  const seen = new Set<string>()
  return SITE_TAXONOMY.flatMap((group) => group.items).filter((item) => {
    if (item.publicStatus !== 'PUBLISHED' || !item.sitemap || !item.path || seen.has(item.path)) return false
    seen.add(item.path)
    return true
  })
}
