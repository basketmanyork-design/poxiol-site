import assert from 'node:assert/strict'
import {existsSync, readFileSync} from 'node:fs'

const redirects = readFileSync('public/_redirects', 'utf8')
assert.match(
  redirects,
  /^\/custom-basketball-uniforms\/ \/products\/basketball-uniforms\/ 301$/m,
  'The legacy basketball URL must issue an HTTP 301 to the only commercial basketball landing page.',
)

assert.equal(existsSync('app/custom-basketball-uniform-manufacturer/page.tsx'), false)
assert.equal(existsSync('app/production-process/page.tsx'), false)

const sitemapSource = readFileSync('app/sitemap.ts', 'utf8')
assert.doesNotMatch(sitemapSource, /\/custom-basketball-uniform-manufacturer\//)
assert.doesNotMatch(sitemapSource, /\/production-process\//)

assert.equal(
  existsSync('app/custom-basketball-uniforms/page.tsx'),
  false,
  'The legacy route must not compete with the Cloudflare HTTP 301.',
)

console.log('POXIOL V8 URL checks passed.')
