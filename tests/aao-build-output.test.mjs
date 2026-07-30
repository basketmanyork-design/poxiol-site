import test from 'node:test'
import assert from 'node:assert/strict'
import {readFile} from 'node:fs/promises'
import {fileURLToPath} from 'node:url'

const outputUrl = new URL('../out/', import.meta.url)

test('exports a schema-aligned human-reviewed RFQ page', async () => {
  const html = await readFile(fileURLToPath(new URL('get-quote/index.html', outputUrl)), 'utf8')
  assert.match(html, /data-rfq-schema-version="1\.0\.0"/)
  assert.match(html, /name="manualReviewAccepted"/)
  assert.match(html, /Human review required/)
  assert.match(html, /This submission is not an automatic quote or order acceptance\./)
})

test('exports procurement facts and a page-specific AI summary FAQ', async () => {
  const html = await readFile(fileURLToPath(new URL('ai-summary/index.html', outputUrl)), 'utf8')
  assert.match(html, /one-set sample/i)
  assert.match(html, /sample MOQ of one set/i)
  assert.match(html, /Bulk-order MOQ depends/)
  assert.match(html, /Does POXIOL support a one-set sample\?/)
  assert.match(html, /FAQPage/)
  assert.doesNotMatch(html, /MOQ 1 flexible custom orders/i)
  assert.doesNotMatch(html, /small teams and custom retail projects/i)
})

test('does not export an all-orders MOQ 1 claim on the OEM page', async () => {
  const html = await readFile(fileURLToPath(new URL('oem-odm/index.html', outputUrl)), 'utf8')
  assert.doesNotMatch(html, /MOQ 1 custom orders/i)
  assert.match(html, /one-set sample/i)
})
