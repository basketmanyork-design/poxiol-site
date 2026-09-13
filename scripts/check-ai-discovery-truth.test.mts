import assert from 'node:assert/strict'
import {existsSync, readFileSync, readdirSync, statSync} from 'node:fs'
import {test} from 'node:test'
import path from 'node:path'

import {pseoPages} from '../lib/pseo.ts'

const unsupportedClaimPatterns = [
  /\bfactory[- ]direct\b/i,
  /\bdirect[- ]to[- ]factory\b/i,
  /\bdirect[- ]factory\b/i,
  /\bleading\s+(?:soccer|teamwear|custom|supplier)\b/i,
  /\bpreferred\s+(?:manufacturer|partner|supplier)\b/i,
  /\btrusted partner for\b/i,
  /\bover 30 countries\b/i,
  /\bhigh-volume capacity\b/i,
  /\b(?:US-standard sizing|standard US athletic sizing|UK and European standards)\b/i,
  /\b(?:partner with various|work with many|many schools and universities)\b/i,
  /\blow MOQs?\b/i,
  /\b(?:fast turnaround times|rapid international shipping|rapid design support)\b/i,
  /\bfraction of local retail costs\b/i,
  /\b(?:client )?success stories\b/i,
] as const

const outputMode = process.argv.includes('--output')

function listFiles(start: string): string[] {
  if (!statSync(start).isDirectory()) return [start]
  return readdirSync(start).flatMap((entry) => listFiles(path.join(start, entry)))
}

function buyerVisibleText(file: string): string {
  const source = readFileSync(file, 'utf8')
  if (!file.endsWith('.html')) return source
  return source
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, ' ')
    .replace(/<h1\b[^>]*>[\s\S]*?<\/h1>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&#x27;|&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

const pseoBuyerClaims = pseoPages.flatMap((page) => [
  [`/${page.slug}/ intro`, page.intro],
  [`/${page.slug}/ content`, page.content],
  ...page.faqs.flatMap((faq, index) => [
    [`/${page.slug}/ faq-${index + 1}-question`, faq.question],
    [`/${page.slug}/ faq-${index + 1}-answer`, faq.answer],
  ]),
] as const)

test('public buyer copy does not present unsupported ownership, scale, regional or customer claims', () => {
  const runtimeSources = [
    'lib/cms/legacy.ts',
    'lib/faq.ts',
    'lib/buyer-decision.ts',
    'lib/guides.ts',
    'components/sports/SportsLandingPage.tsx',
    'components/sections/TeamwearKnowledgeCenter.tsx',
    'app/resources/page.tsx',
  ]

  for (const [location, value] of pseoBuyerClaims) {
    for (const pattern of unsupportedClaimPatterns) {
      assert.doesNotMatch(value, pattern, `${location} contains an unsupported public claim: ${pattern}`)
    }
  }

  for (const sourcePath of runtimeSources) {
    const source = readFileSync(sourcePath, 'utf8')
      // The approved scope preserves existing H1 copy; this exact fallback heading is therefore excluded.
      .replace("heading: 'Factory Direct Quote.'", '')
    for (const pattern of unsupportedClaimPatterns) {
      assert.doesNotMatch(source, pattern, `${sourcePath} contains an unsupported public claim: ${pattern}`)
    }
  }
})

test('llms.txt states the approved POXIOL brand and operator relationship', () => {
  const llms = readFileSync('public/llms.txt', 'utf8')

  assert.match(llms, /POXIOL is a brand operated by Quanzhou Lanren Electronic Commerce Co\., Ltd\./)
  for (const pattern of unsupportedClaimPatterns) {
    assert.doesNotMatch(llms, pattern, `public/llms.txt contains an unsupported public claim: ${pattern}`)
  }
})

test('generated buyer-visible output keeps the same public truth boundary', {skip: !outputMode}, () => {
  const outDir = path.join(process.cwd(), 'out')
  assert.equal(existsSync(outDir), true, 'Generated out/ is required for the AI-discovery output check')

  const findings: string[] = []
  for (const file of listFiles(outDir).filter((item) => item.endsWith('.html') || item.endsWith('llms.txt'))) {
    const visibleText = buyerVisibleText(file)
    for (const pattern of unsupportedClaimPatterns) {
      const match = visibleText.match(pattern)
      if (match) findings.push(`${path.relative(outDir, file)}\t${pattern}\t${match[0]}`)
    }
  }

  assert.deepEqual(findings, [], `Generated public truth findings remain:\n${findings.join('\n')}`)
})
