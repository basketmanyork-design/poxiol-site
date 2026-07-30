import assert from 'node:assert/strict'
// @ts-expect-error Node executes this focused check with native TypeScript stripping.
const visibilityModule = await import('../lib/cms/category-visibility.ts')

const legacy = [{slug: 'legacy-product'}]
const cms = {slug: 'cms-product'}
const legacyProductsWhenCategoryVisibilityFails = visibilityModule.legacyProductsWhenCategoryVisibilityFails
const resolveProductsForCategoryVisibility = (visibilityModule as unknown as Record<string, unknown>).resolveProductsForCategoryVisibility
const resolved = legacyProductsWhenCategoryVisibilityFails(true, legacy)

assert.equal(resolved, null, 'resolved category visibility must defer to normal CMS product merging')
assert.equal(typeof resolveProductsForCategoryVisibility, 'function', 'production must expose the category-source product decision entry')
const failed = (resolveProductsForCategoryVisibility as <T>(visibilityResolved: boolean, legacy: T[], resolved: () => T[]) => T[])(false, legacy, () => [cms])
assert.deepEqual(failed, legacy, 'category-query failure must fall back to the legacy product set')
assert.equal(failed.some((product) => product.slug === cms.slug), false, 'category-query failure must exclude CMS products with unknown visibility')

console.log('category visibility failure decision passed')
