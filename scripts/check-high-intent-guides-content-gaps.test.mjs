import assert from 'node:assert/strict'
import {readFileSync} from 'node:fs'
import path from 'node:path'
import {fileURLToPath} from 'node:url'
import {buyingGuides} from '../lib/guides.ts'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const fabric = buyingGuides.find(({slug}) => slug === 'custom-basketball-uniform-fabric-gsm')
assert.ok(fabric, 'Fabric/GSM guide must exist')
assert.equal(fabric.h1, 'How to Choose Fabric and GSM for Youth Basketball Uniforms')

const requiredSections = [
  '30-Second Answer',
  'What GSM Means',
  'What GSM Does Not Mean',
  'Single-Layer',
  'Double-Layer',
  'Reversible',
  'Use-Case',
  'Age, Size and Fit',
  'Training Frequency and Care',
  'Sample Testing Checklist',
  'Quotation Information Checklist',
]
for (const marker of requiredSections) {
  assert.ok(fabric.sections.some(({title}) => title.includes(marker)), `Fabric/GSM guide missing required module: ${marker}`)
}
const fabricText = JSON.stringify(fabric)
for (const phrase of [
  'mass per area', 'quality', 'breathability', 'durability', 'comfort', 'structure', 'climate',
  'age and size', 'washing', 'drying', 'sample', 'traceable', 'Product type', 'Target delivery',
]) assert.match(fabricText, new RegExp(phrase, 'i'), `Fabric/GSM guide missing evidence-bounded phrase: ${phrase}`)
assert.ok(fabric.sections.find(({title}) => title.includes('Sample Testing Checklist')).content.length >= 12, 'sample checklist must be actionable')
assert.ok(fabric.sections.find(({title}) => title.includes('Quotation Information Checklist')).content.length >= 11, 'quotation checklist must be actionable')
assert.ok(fabric.faqs.length >= 3 && fabric.faqs.length <= 6, 'Fabric/GSM FAQ count must remain 3-6')

const expectedGuideHrefs = [
  '/guides/reversible-vs-single-layer-basketball-uniforms/',
  '/guides/custom-basketball-uniform-fabric-gsm/',
  '/guides/sample-first-vs-bulk-teamwear-order/',
  '/guides/custom-basketball-uniform-cost-factors/',
]
const sources = [
  readFileSync(path.join(root, 'app', 'page.tsx'), 'utf8'),
  readFileSync(path.join(root, 'lib', 'sports-pages.ts'), 'utf8'),
  readFileSync(path.join(root, 'lib', 'guides.ts'), 'utf8'),
]
for (const href of expectedGuideHrefs) {
  assert.ok(sources.some((source) => source.includes(href)), `missing server-rendered entry for ${href}`)
}
const b2bSource = readFileSync(path.join(root, 'lib', 'guides.ts'), 'utf8')
assert.match(b2bSource, /b2b-sourcing-faq[\s\S]{0,800}relatedArticles/, 'B2B FAQ must expose a related buying guides cluster')

for (const forbidden of ['NBA', 'NCAA', 'NFL', 'FIFA', 'UEFA', 'AAU', 'KIAN', 'EPSON']) {
  assert.equal(fabricText.toLowerCase().includes(forbidden.toLowerCase()), false, `forbidden unsupported term: ${forbidden}`)
}

console.log('high-intent guide content-gap contracts passed')
