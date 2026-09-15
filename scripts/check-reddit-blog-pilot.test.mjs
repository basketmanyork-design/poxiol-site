import assert from 'node:assert/strict'
import {readFileSync} from 'node:fs'
import test from 'node:test'

import {isArticleRouteReleased, publicSectionDecision} from '../lib/release/publication-policy.ts'

const approved = [
  'sportswear-manufacturer-project-brief-checklist',
  'tech-pack-vs-pattern-vs-sample',
  'custom-team-uniform-roster-checklist',
]

test('blog publication is default deny with only the approved pilot released', () => {
  for (const slug of approved) assert.equal(isArticleRouteReleased('blog', slug), true)
  assert.equal(isArticleRouteReleased('blog', 'oem-soccer-apparel-manufacturer'), false)
  assert.equal(isArticleRouteReleased('blog', 'custom-teamwear-production-notes'), false)
  assert.equal(isArticleRouteReleased('guide', 'b2b-sourcing-faq'), true)
  assert.equal(isArticleRouteReleased('resource', 'teamwear-manufacturer-evaluation-checklist'), true)

  for (const slug of approved) {
    assert.equal(publicSectionDecision(`blog-${slug}`), 'QUALIFIED_EXPLANATION')
  }
})

test('approved candidate contains exactly three bound blog documents', () => {
  const lines = readFileSync('content/editorial/reddit-blog-pilot-001.ndjson', 'utf8').trim().split(/\r?\n/)
  const documents = lines.map((line) => JSON.parse(line))
  const articles = documents.filter((document) => document._type === 'article')
  assert.deepEqual(articles.map((article) => article.slug.current).sort(), [...approved].sort())
  assert.equal(documents.filter((document) => document._type === 'author').length, 0, 'existing approved author documents must be reused')
  for (const article of articles) {
    assert.equal(article.articleType, 'blog')
    assert.equal(article.publishStatus, 'published')
    assert.equal(article.structuredDataType, 'Article')
    assert.equal(article.featuredImage, undefined)
    assert.match(article.sourceSha256, /^[a-f0-9]{64}$/)
    assert.equal(article.approvalId, 'REDDIT-BLOG-APPROVAL-002')
  }
})

test('approved candidate cannot bypass certification claim governance through NDJSON', () => {
  const lines = readFileSync('content/editorial/reddit-blog-pilot-001.ndjson', 'utf8').trim().split(/\r?\n/)
  const documents = lines.map((line) => JSON.parse(line))
  const certificationPattern = /\b(?:ISO(?:\s*\d+)?|BSCI|SGS|CE|OEKO[- ]TEX|WRAP|Sedex)\b|iso\.org/i

  for (const document of documents) {
    assert.doesNotMatch(
      JSON.stringify(document),
      certificationPattern,
      `${document._id} contains a certification token that the output gate will reject`,
    )
  }
})

test('approved candidate omits workflow placeholders forbidden by the buyer-visible hygiene gate', () => {
  const candidate = readFileSync('content/editorial/reddit-blog-pilot-001.ndjson', 'utf8')
  assert.doesNotMatch(candidate, /\bPending\b/i)
})

test('safe text renderer only links root-relative internal markdown targets', () => {
  const source = readFileSync('components/content/SafeInternalText.tsx', 'utf8')
  assert.match(source, /href\.startsWith\('\/'\)/)
  assert.match(source, /!href\.startsWith\('\/\/'\)/)
  assert.match(source, /<Link/)
  assert.doesNotMatch(source, /dangerouslySetInnerHTML/)
})

test('approved incoming links are bound to their authoritative sources', () => {
  const article = readFileSync('components/cms/ArticleTemplate.tsx', 'utf8')
  const sample = readFileSync('lib/high-intent-guides.js', 'utf8')
  const club = readFileSync('lib/v8/buyer-pages.ts', 'utf8')
  const cards = readFileSync('components/v8/SolutionCards.tsx', 'utf8')
  assert.match(article, /SafeInternalText/)
  assert.match(cards, /SafeInternalText/)
  assert.match(sample, /Review \[Tech Pack vs Pattern vs Sample\]\(\/blog\/tech-pack-vs-pattern-vs-sample\/\)/)
  assert.match(club, /Prepare names, numbers, sizes and exceptions with the \[Custom Team Uniform Roster Checklist\]/)
})
