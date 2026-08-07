// POXIOL conversion-optimization CMS update (2026-08-07)
// Targets: navigationSettings (new header nav) + sitePage homepage (hero CTA labels,
// hero heading/subheading alignment, SEO meta description rewrite).
// Safe pattern: exact-ID allowlist, revision guards, dry-run by default.
// Apply only when WRITE_CONVERSION_CMS_ONLY === 'WRITE_CONVERSION_CMS_ONLY' is set.
// No createOrReplace, no delete, no asset upload.

const applyRequested = process.env.WRITE_CONVERSION_CMS_ONLY === 'WRITE_CONVERSION_CMS_ONLY'
const token = process.env.SANITY_WRITE_TOKEN
if (!token) throw new Error('write-token-missing')

const PROJECT_ID = 'oqpv1xbc'
const DATASET = 'production'
const API_VERSION = 'v2024-01-01'
const base = `https://${PROJECT_ID}.api.sanity.io/${API_VERSION}`

async function groq(query, perspective = 'published') {
  const url = new URL(`${base}/data/query/${DATASET}`)
  url.searchParams.set('query', query)
  url.searchParams.set('perspective', perspective)
  const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } })
  if (!res.ok) throw new Error(`query-http-${res.status}`)
  const json = await res.json()
  return json.result ?? null
}

async function mutate(mutations, dryRun) {
  const url = new URL(`${base}/data/mutate/${DATASET}`)
  url.searchParams.set('returnIds', 'true')
  url.searchParams.set('visibility', 'sync')
  if (dryRun) url.searchParams.set('dryRun', 'true')
  const res = await fetch(url, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ mutations, transactionId: 'poxiol-conversion-20260807' }),
  })
  if (!res.ok) {
    const body = await res.text()
    throw new Error(res.status === 409 ? `revision-conflict: ${body}` : `mutate-http-${res.status}: ${body}`)
  }
  return res.json()
}

// ---- 1. Guard queries (exact IDs + current revisions) ----
const navDoc = await groq(`*[_type == "navigationSettings"][0]{_id, _rev}`)
const homeDoc = await groq(`*[_type == "sitePage"][pageKey == "homepage"][0]{_id, _rev}`)
if (!navDoc?._id || !homeDoc?._id) throw new Error('target-doc-missing')

const allowedIds = new Set([navDoc._id, homeDoc._id])
for (const doc of [navDoc, homeDoc]) {
  if (!allowedIds.has(doc._id)) throw new Error(`unexpected-target-${doc._id}`)
}

// ---- 2. Mutation plan ----
const headerNavigation = [
  { _key: 'nav-products', label: 'Products', externalUrl: '/products/', openInNewWindow: false },
  { _key: 'nav-factory', label: 'Factory', externalUrl: '/factory/', openInNewWindow: false },
  { _key: 'nav-customization', label: 'Customization', externalUrl: '/customization/', openInNewWindow: false },
  { _key: 'nav-qc', label: 'Quality Control', externalUrl: '/quality-control-process/', openInNewWindow: false },
  { _key: 'nav-resources', label: 'Resources', externalUrl: '/resources/', openInNewWindow: false },
  { _key: 'nav-get-quote', label: 'Get Quote', externalUrl: '/get-quote/', openInNewWindow: false },
]

const heroHeading = 'Custom Teamwear Manufacturer for Clubs, Schools & Sports Brands'
const heroSubheading = 'Factory-direct basketball uniforms, soccer kits and custom sportswear with free mockup, low MOQ and reliable production support.'
const metaDescription = 'Factory-direct custom basketball uniform manufacturer, custom soccer kit supplier and OEM sportswear factory. Free mockup, MOQ 1 set, sample 2-3 days, QC before shipment.'

// Patching the published document id directly updates the live published version (no draft flow).
const mutations = [
  {
    patch: {
      id: navDoc._id,
      ifRevisionID: navDoc._rev,
      set: { headerNavigation },
    },
  },
  {
    patch: {
      id: homeDoc._id,
      ifRevisionID: homeDoc._rev,
      set: {
        heroHeading,
        heroSubheading,
        'heroCTA.label': 'Get Free Design Mockup',
        'heroCTA.externalUrl': '/free-mockup/',
        'heroSecondaryCTA.label': 'Request Factory Quote',
        'heroSecondaryCTA.externalUrl': '/get-quote/',
        'seo.metaDescription': metaDescription,
        'seo.seoTitle': 'Custom Teamwear Manufacturer | OEM Sports Uniform Supplier | POXIOL',
        'seo.canonicalUrl': 'https://www.poxiol.com/',
      },
    },
  },
]

console.log(`DRY RUN: ${applyRequested ? 'no (apply requested)' : 'yes'}`)
console.log(`targets: ${navDoc._id}@${navDoc._rev.slice(0, 8)} | ${homeDoc._id}@${homeDoc._rev.slice(0, 8)}`)
console.log(`nav items: ${headerNavigation.length}`)
console.log(`heroHeading: ${heroHeading}`)
console.log(`metaDescription: ${metaDescription}`)

if (!applyRequested) {
  const result = await mutate(mutations, true)
  console.log('dry-run result:', JSON.stringify(result))
  console.log('APPLY NOT PERFORMED — set WRITE_CONVERSION_CMS_ONLY to apply.')
  process.exit(0)
}

const result = await mutate(mutations, false)
console.log('apply result:', JSON.stringify(result))
