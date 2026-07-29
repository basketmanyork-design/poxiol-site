import assert from 'node:assert/strict'
// @ts-expect-error Node executes this focused check with native TypeScript stripping.
import {legacyProductsWhenCategoryVisibilityFails} from '../lib/cms/category-visibility.ts'

const legacy = [{slug: 'legacy-product'}]
const cms = {slug: 'cms-product'}
const resolved = legacyProductsWhenCategoryVisibilityFails(true, legacy)
const failed = legacyProductsWhenCategoryVisibilityFails(false, legacy)

assert.equal(resolved, null, 'resolved category visibility must defer to normal CMS product merging')
assert.deepEqual(failed, legacy, 'category-query failure must fall back to the legacy product set')
assert.equal(failed?.some((product) => product.slug === cms.slug), false, 'category-query failure must exclude CMS products with unknown visibility')

console.log('category visibility failure decision passed')
