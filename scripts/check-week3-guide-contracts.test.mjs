import assert from 'node:assert/strict'
import {existsSync, readFileSync} from 'node:fs'
import path from 'node:path'
import {fileURLToPath} from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const guideModelPath = path.join(root, 'lib', 'week3-guides.ts')
assert.ok(existsSync(guideModelPath), 'Week 3 controlled guide model must exist')
const model = readFileSync(guideModelPath, 'utf8')
for (const slug of ['custom-basketball-uniform-manufacturer-guide', 'custom-soccer-kits-wholesale-guide']) {
  assert.ok(model.includes(slug), `controlled guide model must include ${slug}`)
}
const resolver = readFileSync(path.join(root, 'app', 'resources', '[slug]', 'page.tsx'), 'utf8')
assert.match(resolver, /week3|static|controlled/i, 'Resources resolver must explicitly resolve controlled Week 3 guides')
const resources = readFileSync(path.join(root, 'app', 'resources', 'page.tsx'), 'utf8')
assert.match(resources, /getArticles.*resource|new Map/, 'Resources index must merge and deduplicate controlled Week 3 guides')
const certificates = readFileSync(path.join(root, 'app', 'certificates-testing', 'page.tsx'), 'utf8')
for (const marker of ['Currently verified evidence', 'Project or order confirmation', 'Buyer requirements']) {
  assert.ok(certificates.includes(marker), `Certificates page must expose evidence tier: ${marker}`)
}
for (const slug of ['custom-basketball-uniform-manufacturer-guide', 'custom-soccer-kits-wholesale-guide']) {
  assert.ok(model.includes(slug) || resources.includes(slug) || resolver.includes(slug), `Week 3 guide ${slug} must be discoverable in source`)
}
const template = readFileSync(path.join(root, 'components', 'cms', 'ArticleTemplate.tsx'), 'utf8')
assert.match(template, /ArticleJsonLd|FAQPage|BreadcrumbList/, 'controlled guide template must emit required schemas')
console.log('Week 3 guide contracts passed')
