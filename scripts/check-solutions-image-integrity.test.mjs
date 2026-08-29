import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const sourceOnly = process.argv.includes('--source-only')
const source = fs.readFileSync(path.join(root, 'app/solutions/page.tsx'), 'utf8')
const localImagePaths = [...source.matchAll(/image:\s*["'](\/images\/[^"']+)["']/g)].map((match) => match[1])
const missingImagePaths = localImagePaths.filter((imagePath) => !fs.existsSync(path.join(root, 'public', imagePath)))

assert.deepEqual(missingImagePaths, [], `Solutions page references missing local images:\n${missingImagePaths.join('\n')}`)
// Plan A: unverified category pictures and their empty frames remain withheld.
assert.deepEqual(localImagePaths, [], 'Unverified legacy card imagery must not be restored without a new evidence review')
const sourceH1Count = (source.match(/<h1\b/g) || []).length + (source.match(/<SectionHeading\b[^>]*\blevel=["']h1["']/g) || []).length
assert.equal(sourceH1Count, 1, 'Solutions page must render exactly one visible h1')

for (const forbiddenClaim of ['3,000+ Teams Served', 'KIAN ink', 'EPSON print heads', 'NBA', 'NCAA', 'NFL', 'FIFA', 'UEFA', 'AAU official']) {
  assert.ok(!source.toLowerCase().includes(forbiddenClaim.toLowerCase()), `Solutions page contains forbidden claim: ${forbiddenClaim}`)
}

if (!sourceOnly) {
  const outputPath = path.join(root, 'out/solutions/index.html')
  assert.ok(fs.existsSync(outputPath), 'Missing built /solutions/ route')
  const html = fs.readFileSync(outputPath, 'utf8')
  const visibleHtml = html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '')
  assert.equal((visibleHtml.match(/Project imagery pending verification/g) || []).length, 0, 'Built /solutions/ must not render unfinished image placeholders')
  assert.match(visibleHtml, /This is a planning explanation, not a customer project, factory record, quality result, delivery result or production guarantee\./)
  assert.equal((visibleHtml.match(/<h1\b/g) || []).length, 1, 'Built /solutions/ must contain exactly one visible h1')
  assert.ok(!/<img\b[^>]*\bsrc=(?:""|''|(?=\s|>))/i.test(html), 'Built /solutions/ contains an image with an empty src')
  const builtLocalImages = [...html.matchAll(/<img\b[^>]*\bsrc=["'](\/images\/[^"']+)["']/gi)].map((match) => match[1])
  const missingBuiltImages = builtLocalImages.filter((imagePath) => !fs.existsSync(path.join(root, 'public', imagePath)))
  assert.deepEqual(missingBuiltImages, [], `Built /solutions/ references missing local images:\n${missingBuiltImages.join('\n')}`)
}

console.log(sourceOnly ? 'solutions image source integrity contracts passed' : 'solutions image integrity contracts passed')
