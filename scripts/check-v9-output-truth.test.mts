import assert from 'node:assert/strict'
import {existsSync, readdirSync, readFileSync} from 'node:fs'
import {join, relative, sep} from 'node:path'
import {CANONICAL_URLS, redirectEntries} from '../lib/canonical-architecture.ts'
import {claimContextForClassification, classifyResidual, scanV9ClaimText} from './scan-v9-red-claims.mts'

const out = join(process.cwd(), 'out')
const sitemap = readFileSync(join(out, 'sitemap.xml'), 'utf8')
const urls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1])
const sitemapPaths = new Set(urls.map((value) => new URL(value).pathname))
const redirectPaths = new Set(redirectEntries().map((entry) => entry.path))

function fileFor(pathname: string): string {
  return pathname === '/' ? join(out, 'index.html') : join(out, pathname.replace(/^\//, ''), 'index.html')
}

function decodeHtml(value: string): string {
  return value
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#x27;|&#39;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
}

function scanSegment(pathname: string, area: string, content: string) {
  const text = decodeHtml(content.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim())
  return scanV9ClaimText(text).map((match) => {
    const context = claimContextForClassification(text, match)
    return {pathname, area, kind: match.kind, value: match.value, classification: classifyResidual(pathname, context)}
  })
}

const findings: Array<{pathname: string; area: string; kind: string; value: string; classification: string}> = []
const scannedPaths = new Set<string>()

const expectedExplainedResiduals = [
  {pathname: '/guides/how-to-choose-teamwear-manufacturer-china/', area: 'metadata', kind: 'CAPACITY_OR_SCALE', value: 'capacity', classification: 'LEGAL_RETAIN'},
  {pathname: '/guides/how-to-choose-teamwear-manufacturer-china/', area: 'metadata', kind: 'CAPACITY_OR_SCALE', value: 'capacity', classification: 'LEGAL_RETAIN'},
  {pathname: '/guides/how-to-choose-teamwear-manufacturer-china/', area: 'metadata', kind: 'CAPACITY_OR_SCALE', value: 'capacity', classification: 'LEGAL_RETAIN'},
  {pathname: '/guides/how-to-choose-teamwear-manufacturer-china/', area: 'schema', kind: 'CAPACITY_OR_SCALE', value: 'capacity', classification: 'LEGAL_RETAIN'},
  {pathname: '/guides/sample-first-vs-bulk-teamwear-order/', area: 'visible', kind: 'UNLIMITED', value: 'unlimited', classification: 'SAFE_NEGATION'},
  {pathname: '/terms/', area: 'visible', kind: 'CAPACITY_OR_SCALE', value: 'capacity', classification: 'LEGAL_RETAIN'},
] as const

function findingKey(item: {pathname: string; area: string; kind: string; value: string; classification: string}): string {
  return [item.pathname, item.area, item.kind, item.value.toLowerCase(), item.classification].join('|')
}

function scanHtml(pathname: string, file: string) {
  const html = readFileSync(file, 'utf8')
  if (redirectPaths.has(pathname)) return
  scannedPaths.add(pathname)
  const title = html.match(/<title>([\s\S]*?)<\/title>/i)?.[1] || ''
  const metas = [...html.matchAll(/<meta\b[^>]*\bcontent=["']([^"']*)["'][^>]*>/gi)].map((match) => match[1]).join(' ')
  const jsonLd = [...html.matchAll(/<script\b[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)].map((match) => match[1]).join(' ')
  const visible = html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, ' ').replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, ' ')
  findings.push(...scanSegment(pathname, 'metadata', `${title} ${metas}`))
  findings.push(...scanSegment(pathname, 'schema', jsonLd))
  findings.push(...scanSegment(pathname, 'visible', visible))
}

function allIndexFiles(directory: string): string[] {
  return readdirSync(directory, {withFileTypes: true}).flatMap((entry) => {
    const path = join(directory, entry.name)
    if (entry.isDirectory() && entry.name !== '_next') return allIndexFiles(path)
    return entry.isFile() && entry.name === 'index.html' ? [path] : []
  })
}

for (const value of urls) {
  const pathname = new URL(value).pathname
  const file = fileFor(pathname)
  assert.equal(existsSync(file), true, `Missing sitemap output: ${pathname}`)
}

for (const file of allIndexFiles(out)) {
  const outputRelative = relative(out, file).split(sep).join('/')
  const pathname = outputRelative === 'index.html' ? '/' : `/${outputRelative.replace(/\/index\.html$/, '')}/`
  scanHtml(pathname, file)
}

const expectedResidualKeys = new Set(expectedExplainedResiduals.map(findingKey))
const residuals = findings.filter((item) => !expectedResidualKeys.has(findingKey(item)))
assert.deepEqual(residuals, [])
assert.deepEqual(
  findings.map(findingKey).sort(),
  expectedExplainedResiduals.map(findingKey).sort(),
  'The exact explained-residual allowlist must match the generated output',
)
for (const entry of redirectEntries()) assert.equal(sitemapPaths.has(entry.path), false, `${entry.path} redirect leaked into sitemap`)
for (const entry of CANONICAL_URLS.filter((item) => item.status === 'OWNER_REVIEW')) assert.equal(sitemapPaths.has(entry.path), false, `${entry.path} owner-review route leaked into sitemap`)

const configuredRedirects = new Map(
  readFileSync(join(out, '_redirects'), 'utf8')
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith('#'))
    .map((line) => {
      const [source, target, status] = line.split(/\s+/)
      return [source, {target, status: Number(status)}] as const
    }),
)
for (const entry of redirectEntries()) assert.deepEqual(configuredRedirects.get(entry.path), {target: entry.canonicalTarget, status: entry.redirect})

if (process.argv.includes('--details')) console.log(JSON.stringify(findings, null, 2))
console.log(`POXIOL V9.1 output truth checks passed (${urls.length} sitemap URLs, ${scannedPaths.size} non-redirect HTML outputs, ${findings.length} explained residuals).`)
