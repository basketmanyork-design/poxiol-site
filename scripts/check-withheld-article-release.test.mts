import assert from 'node:assert/strict'
import {readFileSync} from 'node:fs'
import test from 'node:test'

import {isArticleRouteReleased} from '../lib/release/publication-policy.ts'

const withheldSlug = 'custom-teamwear-production-notes'

test('keeps the owner-excluded blog route withheld', () => {
  assert.equal(isArticleRouteReleased('blog', withheldSlug), false)
  assert.equal(isArticleRouteReleased('blog', 'approved-buyer-guide'), true)
})

test('all blog discovery surfaces consume the article release policy', () => {
  for (const file of ['app/blog/page.tsx', 'app/blog/[slug]/page.tsx', 'app/sitemap.ts']) {
    assert.match(readFileSync(file, 'utf8'), /isArticleRouteReleased/, `${file} bypasses the article release policy`)
  }
  assert.match(
    readFileSync('app/blog/[slug]/page.tsx', 'utf8'),
    /export const dynamic = ['"]force-static['"]/,
    'an empty approved blog set must remain valid for static export',
  )
  assert.match(
    readFileSync('app/blog/[slug]/page.tsx', 'utf8'),
    /__no-public-blog-articles__/,
    'static export needs a non-public fallback parameter when every blog article is withheld',
  )
})
