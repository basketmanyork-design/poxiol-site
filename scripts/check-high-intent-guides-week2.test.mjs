import assert from 'node:assert/strict'
import {existsSync, readFileSync} from 'node:fs'
import {fileURLToPath} from 'node:url'
import path from 'node:path'
import {highIntentGuides as buyingGuides} from '../lib/high-intent-guides.ts'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const sourceOnly = process.argv.includes('--source-only')
const guideRegistrySource = readFileSync(path.join(root, 'lib', 'guides.ts'), 'utf8')
assert.match(guideRegistrySource, /import \{highIntentGuides\} from '\.\/high-intent-guides'/, 'guide registry must import high-intent records')
assert.match(guideRegistrySource, /\.\.\.highIntentGuides/, 'guide registry must expose high-intent records')
const siteUrl = 'https://www.poxiol.com'
const contracts = [
  {slug: 'reversible-vs-single-layer-basketball-uniforms', h1: 'Reversible vs Single-Layer Basketball Uniforms: Which Is Better for Your Team?', primary: ['Start with 1 Sample', '/sample-order/'], secondary: ['Get a Free Mockup', '/free-mockup/'], markers: ['30-Second Answer', 'Youth Programs', 'Sample Verification', 'Specification Checklist']},
  {slug: 'custom-basketball-uniform-fabric-gsm', h1: 'How to Choose Fabric and GSM for Youth Basketball Uniforms', primary: ['Talk to a Teamwear Specialist', '/contact/'], secondary: ['Start with 1 Sample', '/sample-order/'], markers: ['What GSM Means', 'Structure Changes the Wearing Experience', 'Sample Test Checklist', 'Information to Send for a Quotation']},
  {slug: 'sample-first-vs-bulk-teamwear-order', h1: 'Sample First or Bulk Order: Which Is Safer for Custom Teamwear?', primary: ['Start with 1 Sample', '/sample-order/'], secondary: ['Talk to a Teamwear Specialist', '/contact/'], markers: ['Decision Tree', 'When a Sample Comes First', 'Sample Approval Record', 'Time and Cost Factors']},
  {slug: 'custom-basketball-uniform-cost-factors', h1: 'What Affects the Cost of Custom Basketball Uniforms?', primary: ['Talk to a Teamwear Specialist', '/contact/'], secondary: ['Get a Free Mockup', '/free-mockup/'], markers: ['Seven Cost Factors', 'Reversible vs Single-Layer', 'Itemized Quotation', 'Information That Reduces Requoting']},
]
const allowedCtas = new Set(['Get a Free Mockup', 'Talk to a Teamwear Specialist', 'Start with 1 Sample'])
const targets = new Map(buyingGuides.filter((guide) => contracts.some(({slug}) => slug === guide.slug)).map((guide) => [guide.slug, guide]))

assert.equal(targets.size, 4, 'all four high-intent guide data records must exist')
assert.equal(buyingGuides.some(({slug}) => slug === 'youth-basketball-uniform-fabric-gsm'), false, 'Fabric/GSM must retain its original URL')
const titles = new Set()
const descriptions = new Set()
for (const contract of contracts) {
  const guide = targets.get(contract.slug)
  assert.ok(guide, `missing guide: ${contract.slug}`)
  assert.equal(guide.h1, contract.h1)
  assert.equal(guide.title, contract.h1)
  assert.ok(guide.metaTitle && guide.metaDescription)
  assert.equal(guide.imageStatus, 'Product imagery pending verification')
  assert.equal(titles.has(guide.metaTitle), false, 'metadata titles must be unique')
  assert.equal(descriptions.has(guide.metaDescription), false, 'metadata descriptions must be unique')
  titles.add(guide.metaTitle)
  descriptions.add(guide.metaDescription)
  assert.ok(guide.faqs.length >= 3 && guide.faqs.length <= 6, 'each guide requires 3-6 FAQs')
  assert.deepEqual([guide.cta?.label, guide.cta?.href], contract.primary)
  assert.deepEqual([guide.secondaryCta?.label, guide.secondaryCta?.href], contract.secondary)
  assert.ok(allowedCtas.has(guide.cta.label) && allowedCtas.has(guide.secondaryCta.label))
  for (const marker of contract.markers) assert.ok(guide.sections.some(({title}) => title.includes(marker)), `${contract.slug} missing ${marker}`)
  assert.ok(guide.relatedArticles.length >= 4, 'each guide requires at least four internal links')
}
const sourceText = JSON.stringify([...targets.values()])
for (const forbidden of ['NBA', 'NCAA', 'NFL', 'FIFA', 'UEFA', 'AAU', 'KIAN', 'EPSON', 'market average', 'lowest price', 'automatic refund', 'free replacement', 'guaranteed delivery', 'always better']) {
  assert.equal(sourceText.toLowerCase().includes(forbidden.toLowerCase()), false, `forbidden unsupported claim: ${forbidden}`)
}
assert.equal(/(?:\b(?:USD|EUR|GBP)\s*\d|\$\s*\d|\d+\s*(?:g|grams?|gsm)\s*(?:lighter|heavier)|\d+\s*(?:years?|countries|units))/i.test(sourceText), false, 'unsupported numeric claim found')

if (sourceOnly) {
  console.log('high-intent guide week2 contracts passed (source)')
  process.exit(0)
}

const outRoot = path.join(root, 'out')
const sitemap = readFileSync(path.join(outRoot, 'sitemap.xml'), 'utf8')
const clean = (value) => value.replace(/<[^>]+>/g, ' ').replace(/&amp;/g, '&').replace(/\s+/g, ' ').trim()
const graphs = (html) => [...html.matchAll(/<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)].flatMap((match) => {
  const value = JSON.parse(match[1])
  return Array.isArray(value) ? value : value['@graph'] ? value['@graph'] : [value]
})

for (const contract of contracts) {
  const route = `/guides/${contract.slug}/`
  const htmlPath = path.join(outRoot, 'guides', contract.slug, 'index.html')
  assert.ok(existsSync(htmlPath), `missing built route: ${route}`)
  const html = readFileSync(htmlPath, 'utf8')
  const h1s = [...html.matchAll(/<h1\b[^>]*>([\s\S]*?)<\/h1>/gi)].map((match) => clean(match[1]))
  assert.deepEqual(h1s, [contract.h1], `${route} must have one locked H1`)
  assert.ok(clean(html).includes('Product imagery pending verification') || /<img\b[^>]+src=/i.test(html), `${route} missing verified image or neutral status`)
  const canonicals = [...html.matchAll(/<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']+)["']/gi)].map((match) => match[1])
  assert.deepEqual(canonicals, [`${siteUrl}${route}`], `${route} must self-canonical`)
  assert.ok(titles.has(clean(html.match(/<title>([\s\S]*?)<\/title>/i)?.[1] || '')), `${route} metadata title mismatch`)
  const nodes = graphs(html)
  for (const type of ['Article', 'BreadcrumbList', 'FAQPage']) assert.equal(nodes.filter((node) => node['@type'] === type).length, 1, `${route} missing ${type}`)
  const faq = nodes.find((node) => node['@type'] === 'FAQPage')
  const guide = targets.get(contract.slug)
  assert.deepEqual(faq.mainEntity.map((item) => item.name), guide.faqs.map((item) => item.question), `${route} visible and JSON-LD FAQ must match`)
  for (const item of guide.faqs) assert.ok(clean(html).includes(item.question), `${route} missing visible FAQ`)
  for (const [label, href] of [contract.primary, contract.secondary]) {
    assert.ok(clean(html).includes(label) && html.includes(`href="${href}"`), `${route} missing CTA ${label}`)
  }
  assert.ok(sitemap.includes(`<loc>${siteUrl}${route}</loc>`), `${route} missing from sitemap`)
  for (const link of guide.relatedArticles) {
    const pathname = new URL(link.href, siteUrl).pathname
    assert.ok(html.includes(`href="${link.href}"`), `${route} internal link href missing: ${pathname}`)
    if (contracts.some(({slug}) => pathname === `/guides/${slug}/`)) {
      const output = path.join(outRoot, pathname, 'index.html')
      assert.ok(existsSync(output), `${route} new internal link target missing: ${pathname}`)
    }
  }
}
console.log('high-intent guide week2 contracts passed (output)')
