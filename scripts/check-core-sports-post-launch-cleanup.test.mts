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

assert.equal(productsFaqs.length, 3, 'The existing buyer-useful Products FAQs must remain available.')
assert.equal(new Set(productsFaqs.map((faq) => faq.id)).size, productsFaqs.length, 'Products FAQ IDs must be unique.')

const productsPage = readFileSync('app/products/page.tsx', 'utf8')
assert.match(
  productsPage,
  /items=\{categories\.map\(\(category\) => \(\{ name: category\.title, url: `\$\{baseUrl\}\$\{productCategoryHref\(category\.slug\)\}` \}\)\)\}/,
  'CollectionPage schema URLs must use the same approved category route resolver as visible links.',
)
assert.match(
  productsPage,
  /href=\{productCategoryHref\(category\.slug\)\}/,
  'Visible product cards must use the approved category route resolver.',
)
assert.match(
  productsPage,
  /<FAQSchema faqs=\{productsFaqs\.map\(\(\{question, answer\}\) => \(\{question, answer\}\)\)\} \/>/,
  'Products FAQPage JSON-LD must use the shared Products FAQ data.',
)
assert.match(
  productsPage,
  /<FAQSection faqs=\{productsFaqs\} schema=\{false\}/,
  'The same Products FAQ data must be rendered visibly without creating duplicate JSON-LD.',
)

console.log('POXIOL Core Sports post-launch cleanup checks passed.')
