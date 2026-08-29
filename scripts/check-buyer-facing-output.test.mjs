import assert from 'node:assert/strict'
import {readFileSync} from 'node:fs'
import {test} from 'node:test'

const routes = ['/', '/about/', '/factory/', '/manufacturing/', '/quality-control-process/', '/customization/', '/contact/', '/oem-odm/', '/free-mockup/', '/sample-order/', '/get-quote/']
const internalLanguage = /legacy POXIOL site|overridden in Sanity|Local editorial review|Owner-approved editorial wording only|Evidence pending|local source projection|pilot does not add a second form/i

function visibleText(route) {
  const file = route === '/' ? 'out/index.html' : `out${route}index.html`
  return readFileSync(file, 'utf8')
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&#x27;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/\s+/g, ' ')
    .trim()
}

for (const route of routes) {
  test(`${route} keeps internal construction language out of buyer-visible output`, () => {
    assert.doesNotMatch(visibleText(route), internalLanguage)
  })
}
