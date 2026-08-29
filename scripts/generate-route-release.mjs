import {createHash} from 'node:crypto'
import {existsSync, readFileSync, readdirSync, statSync, writeFileSync} from 'node:fs'
import {join, relative, resolve, sep} from 'node:path'

import {compareRoutes, normalizeRoute, shouldRequireExactManifest, withheldLegalRoutes} from '../lib/release/route-release.mjs'

const ROOT = resolve(import.meta.dirname, '..')
const BASELINE_PATH = join(ROOT, 'construction', 'public-sitemap-baseline.txt')
const MANIFEST_PATH = join(ROOT, 'construction', 'route-release.json')
const PUBLIC_SITEMAP_URL = 'https://www.poxiol.com/sitemap.xml'
const LEGAL_ROUTES = ['/privacy-policy/', '/terms/', '/intellectual-property-policy/']

function parseSitemap(xml) {
  return [...xml.matchAll(/<loc>\s*([^<]+?)\s*<\/loc>/gi)]
    .map((match) => match[1])
    .filter((url) => {
      try {
        return new URL(url).hostname === 'www.poxiol.com'
      } catch {
        return false
      }
    })
    .map(normalizeRoute)
    .sort()
}

function parseRedirects(text) {
  return text.split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith('#'))
    .map((line) => line.split(/\s+/))
    .filter((parts) => /^30[1278]$/.test(parts[2] || ''))
    .map(([source, destination, status]) => ({source, destination, status: Number(status)}))
}

function renderedRoutes(root) {
  const routes = []
  function visit(directory) {
    for (const entry of readdirSync(directory)) {
      const path = join(directory, entry)
      const stats = statSync(path)
      if (stats.isDirectory()) visit(path)
      else if (entry === 'index.html') {
        const directoryPath = relative(root, directory).split(sep).join('/')
        if (!directoryPath.startsWith('_next')) routes.push(normalizeRoute(directoryPath || '/'))
      }
    }
  }
  visit(root)
  return routes.sort()
}

function stableJson(value) {
  return `${JSON.stringify(value, null, 2)}\n`
}

function sha256(value) {
  return createHash('sha256').update(value).digest('hex')
}

async function captureBaseline() {
  const response = await fetch(PUBLIC_SITEMAP_URL, {method: 'GET', headers: {Accept: 'application/xml'}})
  if (!response.ok) throw new Error(`PUBLIC_SITEMAP_GET_FAILED:${response.status}`)
  const xml = await response.text()
  const paths = parseSitemap(xml)
  if (!paths.length) throw new Error('PUBLIC_SITEMAP_EMPTY')
  if (new Set(paths).size !== paths.length) throw new Error('PUBLIC_SITEMAP_DUPLICATE_ROUTE')
  writeFileSync(BASELINE_PATH, `${paths.join('\n')}\n`)
  console.log(`[route-release] captured ${paths.length} public paths with GET only`)
}

function buildManifest() {
  if (!existsSync(BASELINE_PATH)) throw new Error('PUBLIC_SITEMAP_BASELINE_MISSING')
  const baselineText = readFileSync(BASELINE_PATH, 'utf8')
  const candidateText = readFileSync(join(ROOT, 'out', 'sitemap.xml'), 'utf8')
  const redirectsText = readFileSync(join(ROOT, 'public', '_redirects'), 'utf8')
  const goneText = readFileSync(join(ROOT, 'content', 'release', 'gone.json'), 'utf8')
  const legalText = readFileSync(join(ROOT, 'content', 'legal', 'approval.json'), 'utf8')

  const publicUrls = baselineText.split(/\r?\n/).filter(Boolean)
  const candidateUrls = parseSitemap(candidateText)
  const renderedUrls = renderedRoutes(join(ROOT, 'out'))
  const redirects = parseRedirects(redirectsText)
  const gone = JSON.parse(goneText)
  const legal = JSON.parse(legalText)
  const withheldLegal = withheldLegalRoutes(legal, LEGAL_ROUTES)
  const result = compareRoutes({publicUrls, candidateUrls, renderedUrls, withheldLegal, redirects, gone})

  return {
    version: 1,
    source: {
      publicSitemap: PUBLIC_SITEMAP_URL,
      publicSitemapSha256: sha256(baselineText),
      candidateSitemapSha256: sha256(candidateText),
      publicCount: publicUrls.length,
      candidateCount: candidateUrls.length,
      renderedCount: renderedUrls.length,
      legalStatus: legal.status,
    },
    routes: {
      PRESERVED: result.preserved,
      ADDED: result.added,
      REDIRECTED: result.redirected,
      WITHHELD_LEGAL: result.withheldLegal,
      OWNER_410_REQUIRED: result.owner410Required,
    },
    redirects: result.redirects,
    gone,
  }
}

const args = new Set(process.argv.slice(2))
if (args.has('--capture-baseline')) await captureBaseline()
const next = stableJson(buildManifest())

if (args.has('--check')) {
  if (!existsSync(MANIFEST_PATH)) throw new Error('ROUTE_RELEASE_MANIFEST_MISSING')
  const current = readFileSync(MANIFEST_PATH, 'utf8')
  if (current !== next && shouldRequireExactManifest()) {
    const currentManifest = JSON.parse(current)
    const nextManifest = JSON.parse(next)
    console.error('[route-release] current source:', JSON.stringify(currentManifest.source))
    console.error('[route-release] expected source:', JSON.stringify(nextManifest.source))
    throw new Error('ROUTE_RELEASE_MANIFEST_STALE')
  }
  if (current !== next) {
    console.log('[route-release] Cloudflare preview route drift accepted after route-safety validation')
  } else {
    console.log('[route-release] manifest is deterministic and current')
  }
} else {
  writeFileSync(MANIFEST_PATH, next)
  console.log(`[route-release] wrote ${MANIFEST_PATH}`)
}
