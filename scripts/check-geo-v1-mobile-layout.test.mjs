import assert from 'node:assert/strict'
import fs from 'node:fs'

const homepage = fs.readFileSync('app/page.tsx', 'utf8')
const pageTemplate = fs.readFileSync('components/cms/PageTemplate.tsx', 'utf8')

assert.match(
  pageTemplate,
  /grid grid-cols-1 max-w-7xl/,
  'About hero must constrain the mobile grid to one minmax(0, 1fr) column',
)
assert.match(
  pageTemplate,
  /<div className="min-w-0">[\s\S]*?<h1 className="[^"]*break-words[^"]*text-4xl[^"]*md:text-7xl/,
  'About hero content must allow shrinking and wrap the heading at a mobile-safe size',
)
assert.match(
  pageTemplate,
  /mt-10 flex flex-col gap-4 sm:flex-row sm:flex-wrap/,
  'About hero CTAs must stack and stretch on mobile',
)
assert.match(
  pageTemplate,
  /PrimaryButton href=\{page\.heroCta\.href\} className="w-full sm:w-auto"/,
  'About primary CTA must fit the mobile content width',
)
assert.match(
  pageTemplate,
  /SecondaryButton href="\/contact\/" className="w-full sm:w-auto"/,
  'About secondary CTA must fit the mobile content width',
)

assert.match(
  homepage,
  /grid grid-cols-1 max-w-7xl items-center/,
  'Homepage hero must constrain the mobile grid to the viewport width',
)
assert.match(
  homepage,
  /<div className="min-w-0">[\s\S]*?<h1 className="[^"]*break-words[^"]*text-4xl[^"]*md:text-8xl/,
  'Homepage hero heading must wrap without clipping at the mobile-safe size',
)
assert.match(
  homepage,
  /mb-4[^"]*md:mb-6/,
  'Homepage mobile eyebrow spacing must leave room for the primary CTA',
)
assert.match(
  homepage,
  /mt-4[^"]*md:mt-8[^"]*text-lg/,
  'Homepage mobile description spacing must leave room for the primary CTA',
)
assert.match(
  homepage,
  /order-2 mt-6[^"]*sm:mt-8[^"]*lg:mt-12/,
  'Homepage mobile CTA group must stay above the fixed conversion bar',
)

assert.match(homepage, /BUYER_DECISION_HERO_HEADING_MOBILE/, 'Homepage must retain the shared GEO heading')
assert.match(pageTemplate, /\{page\.description\}/, 'About must retain the GEO description supplied by the page data')

console.log('POXIOL GEO V1 mobile layout source checks passed')
