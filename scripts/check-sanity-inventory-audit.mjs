import assert from 'node:assert/strict'
import {auditDocuments} from './audit-sanity-export.mjs'

const documents = [
  {
    _id: 'category.one',
    _type: 'productCategory',
    categoryName: 'One',
    slug: {current: 'same'},
    seo: {seoTitle: 'One', metaDescription: 'One description'},
  },
  {
    _id: 'category.two',
    _type: 'productCategory',
    categoryName: 'Two',
    slug: {current: 'same'},
    seo: {seoTitle: 'Two'},
  },
  {
    _id: 'drafts.category.one',
    _type: 'productCategory',
    categoryName: 'One draft',
    slug: {current: 'same'},
  },
  {
    _id: 'product.one',
    _type: 'product',
    productName: 'Product',
    slug: {current: 'product'},
    category: {_ref: 'category.missing'},
    primaryImage: {asset: {_ref: 'image.one'}},
  },
  {_id: 'image.one', _type: 'sanity.imageAsset'},
]

const summary = auditDocuments(documents, {
  supportedTypes: ['productCategory', 'product'],
  singletonTypes: [],
})

assert.equal(summary.types.productCategory.published, 2)
assert.equal(summary.types.productCategory.drafts, 1)
assert.equal(summary.types.product.published, 1)
assert.equal(summary.duplicateSlugs.length, 1)
assert.equal(summary.missingSeo.length, 3)
assert.equal(summary.missingImageAlt.length, 1)
assert.equal(summary.brokenReferences.length, 1)
assert.deepEqual(summary.unknownTypes, [])

console.log('Sanity inventory audit tests passed')
