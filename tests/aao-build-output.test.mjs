import test from 'node:test'
import assert from 'node:assert/strict'
import {readFile} from 'node:fs/promises'
import {fileURLToPath} from 'node:url'

const outputUrl = new URL('../out/', import.meta.url)

test('exports a schema-aligned human-reviewed RFQ page', async () => {
  const html = await readFile(
    fileURLToPath(new URL('get-quote/index.html', outputUrl)),
    'utf8',
  )

  assert.match(html, /data-rfq-schema-version="1\.0\.0"/)
  assert.match(html, /name="manualReviewAccepted"/)
  assert.match(html, /Human review required/)
  assert.match(
    html,
    /This submission is not an automatic quote or order acceptance\./,
  )
})
