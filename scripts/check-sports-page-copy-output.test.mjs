import assert from 'node:assert/strict'
import {readFileSync} from 'node:fs'
import path from 'node:path'
import {test} from 'node:test'

const routes = [
  ['products/training-wear', 'Choose the Right Training Wear Format'],
  ['products/hoodies-jackets', 'Choose the Right Hoodies Format'],
  ['products/team-accessories', 'Choose the Right Team Accessories Format'],
]

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

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

for (const [route, productTitle] of routes) {
  test(`${route} renders only its shared category headings`, () => {
    const outputPath = path.join(process.cwd(), 'out', route, 'index.html')
    const visibleText = buyerVisibleText(readFileSync(outputPath, 'utf8'))

    assert.match(visibleText, new RegExp(escapeRegExp(productTitle)))

    for (const [, otherProductTitle] of routes) {
      if (otherProductTitle !== productTitle) {
        assert.doesNotMatch(visibleText, new RegExp(escapeRegExp(otherProductTitle)))
      }
    }
  })
}
