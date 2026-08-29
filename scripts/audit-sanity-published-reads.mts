import {createHash} from 'node:crypto'
import {writeFileSync} from 'node:fs'
import {resolve} from 'node:path'

import {
  articleBySlugQuery,
  articlesQuery,
  caseStudiesQuery,
  caseStudyBySlugQuery,
  faqItemsQuery,
  footerQuery,
  navigationQuery,
  procurementStandardsQuery,
  productBySlugQuery,
  productCategoriesQuery,
  productCategoryBySlugQuery,
  productsByCategoryQuery,
  productsQuery,
  redirectRulesQuery,
  sitePageByKeyQuery,
  siteSettingsQuery,
} from '../lib/sanity/queries.ts'

const projectId = 'oqpv1xbc'
const dataset = 'production'
const apiVersion = '2024-01-01'

const reads = [
  {name: 'site-settings', query: siteSettingsQuery, params: {}},
  {name: 'navigation', query: navigationQuery, params: {}},
  {name: 'footer', query: footerQuery, params: {}},
  {name: 'site-page', query: sitePageByKeyQuery, params: {key: 'homepage'}},
  {name: 'product-categories', query: productCategoriesQuery, params: {}},
  {name: 'product-category', query: productCategoryBySlugQuery, params: {slug: 'basketball-uniforms'}},
  {name: 'products', query: productsQuery, params: {}},
  {name: 'products-by-category', query: productsByCategoryQuery, params: {categorySlug: 'basketball-uniforms'}},
  {name: 'product', query: productBySlugQuery, params: {slug: '$firstPublishedProduct'}},
  {name: 'case-studies', query: caseStudiesQuery, params: {}},
  {name: 'case-study', query: caseStudyBySlugQuery, params: {slug: 'usa-basketball-academy-uniform-program'}},
  {name: 'faqs', query: faqItemsQuery, params: {}},
  {name: 'articles', query: articlesQuery, params: {}},
  {name: 'article', query: articleBySlugQuery, params: {slug: '$firstPublishedArticle'}},
  {name: 'procurement-standards', query: procurementStandardsQuery, params: {}},
  {name: 'redirect-rules', query: redirectRulesQuery, params: {}},
]

function sha256(value: string) {
  return createHash('sha256').update(value).digest('hex')
}

const results = []
let firstPublishedProduct = ''
let firstPublishedArticle = ''
for (const read of reads) {
  const params = Object.fromEntries(Object.entries(read.params).map(([key, value]) => {
    if (value === '$firstPublishedProduct') return [key, firstPublishedProduct]
    if (value === '$firstPublishedArticle') return [key, firstPublishedArticle]
    return [key, value]
  }))
  const url = new URL(`https://${projectId}.apicdn.sanity.io/v${apiVersion}/data/query/${dataset}`)
  url.searchParams.set('query', read.query)
  url.searchParams.set('perspective', 'published')
  url.searchParams.set('returnQuery', 'false')
  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(`$${key}`, JSON.stringify(value))
  }

  const response = await fetch(url, {method: 'GET', headers: {Accept: 'application/json'}})
  const body = await response.text()
  if (!response.ok) throw new Error(`SANITY_READ_AUDIT_FAILED:${read.name}:${response.status}`)
  const payload = JSON.parse(body) as {result?: unknown}
  if (read.name === 'products' && Array.isArray(payload.result)) {
    firstPublishedProduct = String((payload.result[0] as {slug?: unknown} | undefined)?.slug || '')
  }
  if (read.name === 'articles' && Array.isArray(payload.result)) {
    firstPublishedArticle = String((payload.result[0] as {slug?: unknown} | undefined)?.slug || '')
  }
  results.push({
    name: read.name,
    method: 'GET',
    perspective: 'published',
    params,
    querySha256: sha256(read.query),
    responseSha256: sha256(body),
    resultKind: Array.isArray(payload.result) ? 'array' : payload.result === null ? 'null' : typeof payload.result,
    resultCount: Array.isArray(payload.result) ? payload.result.length : payload.result == null ? 0 : 1,
  })
}

const audit = {
  version: 1,
  projectId,
  dataset,
  apiVersion,
  transport: 'GET_ONLY',
  perspective: 'published',
  authentication: 'none',
  cmsWrites: 0,
  reads: results,
}

writeFileSync(resolve('construction/sanity-read-audit.json'), `${JSON.stringify(audit, null, 2)}\n`)
console.log(`[sanity-read-audit] ${results.length} published GET queries hashed; cmsWrites=0`)
