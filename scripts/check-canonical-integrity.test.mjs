import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const outDir = path.resolve(root, 'out')
const productionOrigin = 'https://www.poxiol.com'

function normalizePathname(value) {
  const decoded = decodeURIComponent(value || '/')
  if (decoded === '/') return '/'
  return `${decoded.replace(/^\/+|\/+$/g, '')}/`.replace(/^/, '/')
}

function outputFileFor(pathname) {
  const normalized = normalizePathname(pathname)
  return normalized === '/' ? path.join(outDir, 'index.html') : path.join(outDir, normalized.slice(1), 'index.html')
}

function canonicalLinks(html) {
  return [...html.matchAll(/<link\b[^>]*>/gi)]
    .map((match) => match[0])
    .filter((tag) => /\brel=["'][^"']*\bcanonical\b[^"']*["']/i.test(tag))
    .map((tag) => tag.match(/\bhref=["']([^"']+)["']/i)?.[1])
    .filter(Boolean)
}

function robotsValue(html) {
  const tag = [...html.matchAll(/<meta\b[^>]*>/gi)]
    .map((match) => match[0])
    .find((candidate) => /\bname=["']robots["']/i.test(candidate))
  return tag?.match(/\bcontent=["']([^"']*)["']/i)?.[1] || ''
}

const sitemapPath = path.join(outDir, 'sitemap.xml')
assert.ok(fs.existsSync(sitemapPath), 'Missing out/sitemap.xml')
const sitemap = fs.readFileSync(sitemapPath, 'utf8')
const sitemapUrls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1])
assert.ok(sitemapUrls.length > 0, 'Sitemap must contain URLs')

const auditUrls = [...new Set([...sitemapUrls, productionOrigin + '/projects/'])]
const rows = auditUrls.map((sitemapUrl) => {
  const url = new URL(sitemapUrl)
  const expectedPathname = normalizePathname(url.pathname)
  const outputFile = outputFileFor(expectedPathname)
  const html = fs.existsSync(outputFile) ? fs.readFileSync(outputFile, 'utf8') : ''
  const canonicals = canonicalLinks(html)
  const canonical = canonicals[0] ? new URL(canonicals[0], productionOrigin) : null
  const robots = robotsValue(html)
  const h1Tags = [...html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '').matchAll(/<h1\b([^>]*)>/gi)]
  const h1Count = h1Tags.filter((match) => {
    const attrs = match[1] || ''
    return !/\bhidden\b/i.test(attrs) && !/\baria-hidden=["']true["']/i.test(attrs) &&
      !/\bclass=["'][^"']*\bsr-only\b/i.test(attrs) &&
      !/\bstyle=["'][^"']*(?:display\s*:\s*none|visibility\s*:\s*hidden)/i.test(attrs)
  }).length

  const errors = []
  if (!fs.existsSync(outputFile)) errors.push('missing-static-route')
  if (canonicals.length !== 1) errors.push(`canonical-count:${canonicals.length}`)
  if (canonical) {
    if (canonical.protocol !== 'https:') errors.push('canonical-not-https')
    if (canonical.host !== 'www.poxiol.com') errors.push(`canonical-host:${canonical.host}`)
    if (canonical.search) errors.push('canonical-has-query')
    if (canonical.hash) errors.push('canonical-has-hash')
    if (normalizePathname(canonical.pathname) !== expectedPathname) errors.push(`canonical-path:${normalizePathname(canonical.pathname)}`)
    if (expectedPathname !== '/' && normalizePathname(canonical.pathname) === '/') errors.push('non-home-canonical-to-home')
    if (!fs.existsSync(outputFileFor(canonical.pathname))) errors.push('canonical-target-missing')
  }
  if (/\bnoindex\b/i.test(robots)) errors.push('sitemap-page-noindex')
  if (h1Count !== 1) errors.push('visible-h1-count:' + h1Count)

  return {
    sitemapUrl,
    expectedPathname,
    outputFile: path.relative(root, outputFile),
    canonicalCount: canonicals.length,
    canonicalRaw: canonicals[0] || null,
    canonicalAbsolute: canonical?.href || null,
    canonicalHost: canonical?.host || null,
    canonicalPathname: canonical ? normalizePathname(canonical.pathname) : null,
    robots,
    h1Count,
    errors,
  }
})

const canonicalOwners = new Map()
for (const row of rows) {
  if (!row.canonicalAbsolute) continue
  const owners = canonicalOwners.get(row.canonicalAbsolute) || []
  owners.push(row.sitemapUrl)
  canonicalOwners.set(row.canonicalAbsolute, owners)
}
const sharedCanonicals = [...canonicalOwners.entries()].filter(([, owners]) => owners.length > 1)
const failures = rows.filter((row) => row.errors.length > 0)
const solutions = rows.find((row) => row.expectedPathname === '/solutions/')
const projects = rows.find((row) => row.expectedPathname === '/projects/')

const summary = {
  sitemapUrls: sitemapUrls.length,
  auditedUrls: rows.length,
  failures: failures.length,
  canonicalPathMismatches: rows.filter((row) => row.errors.some((error) => error.startsWith('canonical-path:'))).length,
  canonicalMissing: rows.filter((row) => row.canonicalCount === 0).length,
  canonicalDuplicates: rows.filter((row) => row.canonicalCount > 1).length,
  canonicalTargetsMissing: rows.filter((row) => row.errors.includes('canonical-target-missing')).length,
  nonHomeCanonicalToHome: rows.filter((row) => row.errors.includes('non-home-canonical-to-home')).length,
  sitemapNoindexConflicts: rows.filter((row) => row.errors.includes('sitemap-page-noindex')).length,
  sharedCanonicalTargets: sharedCanonicals.length,
  solutionsCanonical: solutions?.canonicalAbsolute || null,
  projectsCanonical: projects?.canonicalAbsolute || null,
  missingH1: rows.filter((row) => row.h1Count === 0).length,
  duplicateH1: rows.filter((row) => row.h1Count > 1).length,
  failureRoutes: failures.map((row) => ({route: row.expectedPathname, canonical: row.canonicalAbsolute, errors: row.errors})),
}

console.log(JSON.stringify(summary, null, 2))
assert.equal(failures.length, 0, `Canonical integrity failures: ${failures.length}`)
assert.equal(sharedCanonicals.length, 0, `Shared canonical targets: ${sharedCanonicals.length}`)
assert.equal(solutions?.canonicalAbsolute, 'https://www.poxiol.com/solutions/', '/solutions/ canonical mismatch')
assert.equal(projects?.canonicalAbsolute, 'https://www.poxiol.com/projects/', '/projects/ canonical mismatch')
