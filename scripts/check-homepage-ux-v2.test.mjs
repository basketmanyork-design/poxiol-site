import assert from 'node:assert/strict'
import {readFile} from 'node:fs/promises'
import {test} from 'node:test'

test('homepage keeps one inquiry H2 and passes buyer-role hints from its two buyer entries', async () => {
  const [homepage, qualificationForm, procurementForm] = await Promise.all([
    readFile('components/home-optimization/HomepageOptimization.tsx', 'utf8'),
    readFile('components/v8/ProjectQualificationForm.tsx', 'utf8'),
    readFile('components/forms/ProcurementContactForm.tsx', 'utf8'),
  ])
  assert.match(homepage, /buyerRole=Team%20%2F%20School%20%2F%20Club/)
  assert.match(homepage, /buyerRole=Brand%20%2F%20Reseller/)
  assert.match(homepage, /showTitle=\{false\}/)
  assert.match(qualificationForm, /showTitle\?: boolean/)
  assert.match(procurementForm, /showTitle\s*\?\s*<h2/)
})

test('homepage gives every navigable module safe sticky-header space and preloads only the Poster', async () => {
  const [homepageStyles, layout, hero] = await Promise.all([
    readFile('components/home-optimization/HomepageOptimization.module.css', 'utf8'),
    readFile('app/layout.tsx', 'utf8'),
    readFile('components/home-optimization/HeroBackgroundVideo.tsx', 'utf8'),
  ])
  assert.match(homepageStyles, /#product-discovery,#who-we-help,#customization-details,#free-mockup,#sample,#production-delivery,#faq,#contact\{scroll-margin-top:7rem\}/)
  assert.match(layout, /rel="preload" as="image" href="\/images\/poxiol-teamwear-range-banner-2x1\.webp"/)
  assert.doesNotMatch(layout, /rel="preload"[^>]+poxiol-hero-22s-720p\.mp4/)
  assert.match(hero, /preload="none"/)
})

test('homepage uses the approved hierarchy for product, mockup, and sample actions', async () => {
  const homepage = await readFile('components/home-optimization/HomepageOptimization.tsx', 'utf8')
  assert.match(homepage, /Explore by Sport &amp; Teamwear Type/)
  assert.match(homepage, /action: 'View Options'/)
  assert.match(homepage, /className=\{styles\.secondary\} href="\/free-mockup\//)
  assert.match(homepage, /className=\{styles\.secondary\} href="\/sample-order\//)
})

test('delivery-country labels are static so server and browser render identical option text', async () => {
  const procurement = await readFile('lib/procurement-inquiry.ts', 'utf8')
  assert.doesNotMatch(procurement, /Intl\.DisplayNames/)
  assert.match(procurement, /DELIVERY_COUNTRY_NAMES/)
})
