import assert from 'node:assert/strict'
import {readFileSync} from 'node:fs'

import {productCategoryHref, productsFaqs} from '../lib/products-page.ts'

assert.equal(
  productCategoryHref('soccer-kits'),
  '/products/soccer-jerseys/',
  'The hidden soccer-kits category must link to the approved Soccer commercial owner.',
)
assert.equal(
  productCategoryHref('training-wear'),
  '/products/training-wear/',
  'Unrelated product category URLs must remain unchanged.',
)

const productDetailPage = readFileSync('app/products/[slug]/page.tsx', 'utf8')
assert.match(
  productDetailPage,
  /href=\{productCategoryHref\(product\.categorySlug\)\}/,
  'CMS product breadcrumbs must resolve retired category slugs through the governed commercial owner map.',
)
assert.match(
  productDetailPage,
  /item: `https:\/\/www\.poxiol\.com\$\{productCategoryHref\(product\.categorySlug\)\}`/,
  'CMS product BreadcrumbList data must use the same governed category route as the visible breadcrumb.',
)

assert.equal(productsFaqs.length, 3, 'The existing buyer-useful Products FAQs must remain available.')
assert.equal(new Set(productsFaqs.map((faq) => faq.id)).size, productsFaqs.length, 'Products FAQ IDs must be unique.')

console.log('POXIOL Core Sports post-launch cleanup checks passed.')
