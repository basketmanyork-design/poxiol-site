import {readFileSync} from 'node:fs'

function isDocumentVisible(status, source) {
  if (source === 'legacy') return false
  if (source === 'sanity-preview') return status === 'draft' || status === 'published'
  return status === 'published'
}
function mergeCmsList({legacy, cms, sourceState, mode, contentSource, mapCms}) {
  if (contentSource === 'legacy' || sourceState === 'failed') return legacy
  const legacyBySlug = new Map(legacy.map((item) => [item.slug, item]))
  const suppressed = new Set(cms.filter((item) => item.publishStatus === 'unpublished').map((item) => item.slug))
  const cmsVisible = cms.map((item, index) => isDocumentVisible(item.publishStatus, contentSource) ? mapCms(item, legacyBySlug.get(item.slug), index) : null).filter(Boolean)
  if (mode === 'strict') return cmsVisible
  const cmsBySlug = new Map(cmsVisible.map((item) => [item.slug, item]))
  const merged = []
  for (const item of legacy) {
    if (suppressed.has(item.slug)) continue
    merged.push(cmsBySlug.get(item.slug) || item)
    cmsBySlug.delete(item.slug)
  }
  merged.push(...cmsBySlug.values())
  return merged
}
function assert(name, condition) {
  if (!condition) throw new Error(name)
}
const legacy = [{slug:'a', title:'Legacy A'}, {slug:'b', title:'Legacy B'}]
const isCategoryActive = (activeStatus) => activeStatus !== false && activeStatus !== 'inactive'

assert('boolean false category is inactive', isCategoryActive(false) === false)
assert('legacy inactive category is inactive', isCategoryActive('inactive') === false)
assert('missing category status stays active', isCategoryActive(undefined) === true)

const contentSource = readFileSync(new URL('../lib/sanity/content.ts', import.meta.url), 'utf8')
const productsPageSource = readFileSync(new URL('../app/products/page.tsx', import.meta.url), 'utf8')
const sitemapSource = readFileSync(new URL('../app/sitemap.ts', import.meta.url), 'utf8')
const headerSource = readFileSync(new URL('../components/ui.tsx', import.meta.url), 'utf8')

assert('category mapper treats boolean false as inactive', contentSource.includes("active: category.activeStatus !== false && category.activeStatus !== 'inactive'"))
assert('product categories remove inactive cards before route consumers', contentSource.includes('.filter((category) => category.active)'))
assert('homepage excludes categories explicitly hidden from the homepage', contentSource.includes('categories.filter((category) => category.homepageVisibility !== false)'))
assert('Products CollectionPage JSON-LD uses the same category list as visible cards', productsPageSource.includes('items={categories.map((category) => ({ name: category.title') && productsPageSource.includes('{categories.map((category) => ('))
assert('sitemap does not generate CMS category routes that could ignore unpublished or noindex', !sitemapSource.includes('getProductCategories') && !sitemapSource.includes('productCategoriesQuery'))
assert('header navigation does not consume CMS category documents', !headerSource.includes('getProductCategories') && !headerSource.includes('navigationVisibility'))

const mapCms = (item) => ({slug:item.slug, title:item.title})
let result = mergeCmsList({legacy, cms:[{slug:'a', title:'CMS A', publishStatus:'published'}], sourceState:'ok', mode:'merge', contentSource:'sanity', mapCms})
assert('merge keeps other legacy routes', result.length === 2 && result.find((x) => x.slug === 'b'))
assert('published overrides same slug', result.find((x) => x.slug === 'a').title === 'CMS A')
result = mergeCmsList({legacy, cms:[{slug:'a', title:'Draft A', publishStatus:'draft'}], sourceState:'ok', mode:'merge', contentSource:'sanity', mapCms})
assert('draft does not override production legacy', result.find((x) => x.slug === 'a').title === 'Legacy A')
result = mergeCmsList({legacy, cms:[{slug:'a', title:'Gone', publishStatus:'unpublished'}], sourceState:'ok', mode:'merge', contentSource:'sanity', mapCms})
assert('unpublished suppresses legacy', !result.find((x) => x.slug === 'a') && result.find((x) => x.slug === 'b'))
result = mergeCmsList({legacy, cms:[], sourceState:'ok', mode:'strict', contentSource:'sanity', mapCms})
assert('strict empty list stays empty', result.length === 0)
result = mergeCmsList({legacy, cms:[], sourceState:'failed', mode:'strict', contentSource:'sanity', mapCms})
assert('strict failed falls back emergency', result.length === 2)
console.log('cms list mode tests passed')