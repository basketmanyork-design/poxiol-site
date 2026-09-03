import assert from 'node:assert/strict'
import {readFileSync} from 'node:fs'
import path from 'node:path'
import {test} from 'node:test'

const routes = [
  ['products/training-wear', /Choose the Right Training Wear Format/],
  // Production CMS uses the approved category title while legacy/local fallback uses the shorter keyword.
  ['products/hoodies-jackets', /Choose the Right (?:Hoodies|Hoodies & Jackets) Format/],
  ['products/team-accessories', /Choose the Right Team Accessories Format/],
]

function buyerVisibleText(html) {
  return html
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&#x27;|&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/\s+/g, ' ')
}

for (const [route, productTitlePattern] of routes) {
  test(`${route} renders only its shared product-format heading`, () => {
    const outputPath = path.join(process.cwd(), 'out', route, 'index.html')
    const visibleText = buyerVisibleText(readFileSync(outputPath, 'utf8'))

    assert.match(visibleText, productTitlePattern)

    for (const [, otherProductTitlePattern] of routes) {
      if (otherProductTitlePattern !== productTitlePattern) {
        assert.doesNotMatch(visibleText, otherProductTitlePattern)
      }
    }
  })
}
