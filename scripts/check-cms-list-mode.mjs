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