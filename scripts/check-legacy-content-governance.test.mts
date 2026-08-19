import assert from 'node:assert/strict'
import {existsSync, readFileSync, readdirSync, statSync} from 'node:fs'
import path from 'node:path'

import {findLegacyClaims} from './legacy-claim-policy.mts'
import {normalizeBuyerFacingClaim, normalizeBuyerFacingQuestion} from '../lib/legacy-claim-normalizer.ts'

const root = process.cwd()
const outputMode = process.argv.includes('--output')

const unsafeFixtures = [
  'MOQ 1 set',
  'MOQ: 1 set',
  'MOQ 1',
  '1 set MOQ',
  '1-set MOQ',
  'minimum order 1 set',
  '1 set sample',
  '1-Set Sample Production',
  'Sample MOQ: 1 set',
  'POXIOL supports flexible MOQ from 1 piece for sample orders.',
  'Start a 1-piece custom jersey sample order.',
  'Sample production: 2-3 working days',
  'Sample production: 2–3 Days',
  'Bulk production: 7—12 working days',
  'Free Mockup in 2h',
  'Professional mockup in 1-2 hours',
  'Request a free mockup within 24 hours',
  'Response within 1 business day',
  'Usually within 2 hours after receiving the brief',
  '15+ years of apparel experience',
  'Serving 3,000+ teams',
  '30,000 sets per month',
  'Over 20 years of experience',
  'Over 500 sports academies',
  'Express shipping typically takes 3-6 business days.',
  'Guaranteed delivery',
  'BSCI certified factory',
  'iso 9001 certified production',
  'bsci certified supplier',
  'Oeko-Tex certification',
  'sedex factory audit',
] as const

for (const fixture of unsafeFixtures) {
  assert.ok(findLegacyClaims(fixture).length > 0, `Guard missed unsafe fixture: ${fixture}`)
}

const safeFixtures = [
  'Order quantity is confirmed according to the product and project requirements.',
  'Sample availability and timing are confirmed after the design, product and project requirements are reviewed.',
  'Production scheduling is confirmed after the design, quantity, size breakdown and project requirements are approved.',
  'POXIOL can prepare a design mockup after receiving the project brief, logo, colors and reference files.',
  'Shipping method and delivery timing are confirmed for the destination and project requirements.',
  'Certification requirements can be discussed and verified for the specific sourcing project.',
  'Use flex-wrap and overflow-wrap for responsive layouts.',
] as const

for (const fixture of safeFixtures) {
  assert.deepEqual(findLegacyClaims(fixture), [], `Guard rejected safe fixture: ${fixture}`)
}

const normalizationFixtures = [
  ['MOQ 1 Set', 'project-specific order quantity'],
  ['Sample MOQ: 1 set', 'Sample quantity is confirmed for the project'],
  ['Sample Production in 2-3 Days', 'Sample timing is confirmed after project review'],
  ['sampling (2–3 days)', 'sample timing confirmed after project review'],
  ['Bulk production usually takes 7–12 working days', 'Production scheduling is confirmed after project approval'],
  ['Express shipping typically takes 3-6 business days', 'Shipping timing is confirmed for the destination and project requirements'],
] as const

for (const [unsafe, expected] of normalizationFixtures) {
  assert.equal(normalizeBuyerFacingClaim(unsafe), expected, `Public-content normalizer missed: ${unsafe}`)
}
assert.equal(normalizeBuyerFacingQuestion('Does POXIOL support MOQ 1 set?'), 'How is the order quantity confirmed?')

const sourceRoots = ['app', 'components', 'geo', 'lib', 'content', 'public', 'seo', 'studio/schemaTypes'] as const
const includedScripts = ['scripts/cms-apply-conversion-20260807.mjs', 'scripts/cms-migration-dry-run.ts'] as const
const sourceExtensions = new Set(['.ts', '.tsx', '.js', '.jsx', '.mjs', '.mts', '.json', '.txt', '.csv', '.md'])

function listFiles(start: string): string[] {
  if (!existsSync(start)) return []
  if (!statSync(start).isDirectory()) return [start]
  return readdirSync(start).flatMap((entry) => listFiles(path.join(start, entry)))
}

function hasTypeScriptTwin(file: string): boolean {
  if (file.endsWith('.jsx')) return existsSync(file.slice(0, -4) + '.tsx')
  if (file.endsWith('.js')) return existsSync(file.slice(0, -3) + '.ts')
  return false
}

function toRoute(relativeFile: string): string {
  const normalized = relativeFile.replaceAll('\\', '/')
  if (normalized === 'out/index.html') return '/'
  if (normalized === 'out/llms.txt') return '/llms.txt'
  return `/${normalized.replace(/^out\//, '').replace(/\/index\.html$/, '/')}`
}

const targets = outputMode
  ? listFiles(path.join(root, 'out')).filter((file) => file.endsWith('index.html') || file.endsWith('.txt') || file.endsWith('.json'))
  : [
      ...sourceRoots.flatMap((directory) => listFiles(path.join(root, directory))),
      ...includedScripts.map((file) => path.join(root, file)),
    ].filter((file) =>
      sourceExtensions.has(path.extname(file))
      && !hasTypeScriptTwin(file)
      && path.relative(root, file).replaceAll('\\', '/') !== 'studio/schemaTypes/validation.ts',
    )

const findings = targets.flatMap((file) => {
  const content = readFileSync(file, 'utf8')
  const relativeFile = path.relative(root, file)
  const scanContent = outputMode ? `${content}\n${content.replace(/<[^>]+>/g, ' ')}` : content
  return findLegacyClaims(scanContent).map((claim) => ({
    location: outputMode ? toRoute(relativeFile) : relativeFile.replaceAll('\\', '/'),
    kind: claim.kind,
    value: claim.value,
  }))
})

if (findings.length > 0) {
  const summary = findings
    .map((finding) => `${finding.location}\t${finding.kind}\t${finding.value}`)
    .join('\n')
  assert.fail(`Unsupported legacy claims remain in ${outputMode ? 'generated output' : 'public content sources'}:\n${summary}`)
}

const sanityContentSource = readFileSync(path.join(root, 'lib/sanity/content.ts'), 'utf8')
assert.match(
  sanityContentSource,
  /faqKey\(normalizeBuyerFacingQuestion\(faq\.question as string\), faqCategoryName\(faq\.category\)\)/,
  'CMS unpublished FAQ suppression must use the same normalized question key as the visible Legacy FAQ.',
)

const aiSummarySource = readFileSync(path.join(root, 'app/ai-summary/page.tsx'), 'utf8')
assert.match(aiSummarySource, /const aiSummaryFaqs\s*=/, 'AI Summary must define page-specific FAQ data.')
assert.match(aiSummarySource, /generateFaqSchema\(aiSummaryFaqs\)/, 'AI Summary FAQPage schema must use the visible page-specific FAQ data.')
assert.match(aiSummarySource, /aiSummaryFaqs\.map\(/, 'AI Summary visible FAQ must render from its page-specific FAQ data.')

if (outputMode) {
  const aiSummaryHtml = readFileSync(path.join(root, 'out/ai-summary/index.html'), 'utf8')
  const schemaNodes = [...aiSummaryHtml.matchAll(/<script[^>]+type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)]
    .flatMap((match) => {
      const parsed = JSON.parse(match[1].replaceAll('&quot;', '"'))
      return Array.isArray(parsed) ? parsed : [parsed]
    })
  const faqSchema = schemaNodes.find((node) => node?.['@type'] === 'FAQPage')
  assert.ok(faqSchema, 'AI Summary must expose one FAQPage schema.')
  const schemaFaqs = faqSchema.mainEntity.map((item: {name: string; acceptedAnswer: {text: string}}) => ({
    question: item.name,
    answer: item.acceptedAnswer.text,
  }))
  const visibleFaqs = [...aiSummaryHtml.matchAll(/<h3[^>]*>([^<]+)<\/h3>\s*<p[^>]*>([^<]+)<\/p>/g)]
    .map((match) => ({question: match[1], answer: match[2]}))
  assert.deepEqual(schemaFaqs, visibleFaqs, 'AI Summary visible FAQ and FAQPage schema must match exactly.')
}

console.log(`POXIOL legacy content governance ${outputMode ? 'output' : 'source'} checks passed.`)
