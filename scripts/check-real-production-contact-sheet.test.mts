import assert from 'node:assert/strict'
import {escapeXml, selectGroupReviewFiles} from './generate-real-production-contact-sheets.mts'

assert.equal(escapeXml('A&B <23> "POXIOL"'), 'A&amp;B &lt;23&gt; &quot;POXIOL&quot;')

const selected = selectGroupReviewFiles({
  files: [
    {absolutePath: 'front.jpg', mediaType: 'image', view: 'FRONT'},
    {absolutePath: 'back.jpg', mediaType: 'image', view: 'BACK'},
    {absolutePath: 'detail.jpg', mediaType: 'image', view: 'DETAIL_C'},
    {absolutePath: 'sample.mp4', mediaType: 'video', view: 'VIDEO'},
  ],
})

assert.deepEqual(selected.map((file) => file.absolutePath), ['front.jpg', 'back.jpg'])

console.log('Real Production contact-sheet checks passed')
