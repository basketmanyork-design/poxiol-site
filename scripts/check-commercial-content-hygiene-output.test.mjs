import assert from 'node:assert/strict'
import {existsSync, readFileSync, readdirSync, statSync} from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const outDir = path.join(root, 'out')
assert.equal(existsSync(outDir), true, 'Generated out/ is required before the commercial hygiene check.')

function listFiles(start) {
  if (!statSync(start).isDirectory()) return [start]
  return readdirSync(start).flatMap((entry) => listFiles(path.join(start, entry)))
}

function routeFor(file) {
  const relative = path.relative(outDir, file).replaceAll('\\', '/')
  if (relative === 'index.html') return '/'
  return `/${relative.replace(/index\.html$/, '').replace(/\.(?:html|txt)$/, '')}`
}

function buyerVisibleText(file) {
  const source = readFileSync(file, 'utf8')
  if (!file.endsWith('.html')) return source
  return source
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&#x27;|&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

const forbidden = [
  /\bDraft\b/i,
  /\bPlaceholder\b/i,
  /\bPending\b/i,
  /\bDemo\b/i,
  /\bTemporary\b/i,
  /\bLorem\b/i,
  /Verified production visual pending/i,
  /Product imagery pending verification/i,
  /Moving to New Location/i,
  /draft procurement standard/i,
  /No external CRM is connected/i,
  /No external CRM or unnecessary profiling/i,
  /Zero Fading/i,
  /never crack, peel, or fade/i,
  /highest grade polyester/i,
  /arrive in perfect condition/i,
  /Launching Summer 2026/i,
  /Join Beta Waitlist/i,
  /Phase 3 Evolution/i,
]

const findings = []
for (const file of listFiles(outDir).filter((item) => item.endsWith('.html') || item.endsWith('.txt'))) {
  const text = buyerVisibleText(file)
  for (const pattern of forbidden) {
    const match = text.match(pattern)
    if (match) findings.push(`${routeFor(file)}\t${pattern}\t${match[0]}`)
  }
}

assert.deepEqual(findings, [], `Buyer-visible P0 hygiene findings remain:\n${findings.join('\n')}`)

for (const route of ['/free-mockup/', '/get-quote/', '/sample-order/']) {
  const html = readFileSync(path.join(outDir, route.slice(1), 'index.html'), 'utf8')
  const formTag = html.match(/<form\b[^>]*>/i)?.[0]
  assert.ok(formTag, `${route} must retain its inquiry form.`)
  assert.match(formTag, /method=["']post["']/i, `${route} must retain native POST fallback.`)
}

console.log('POXIOL commercial P0 buyer-visible hygiene checks passed.')
