import path from 'node:path'
import {fileURLToPath} from 'node:url'

import {createLockedReviewServer} from '../lib/release/locked-review-server.mjs'

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const root = path.join(projectRoot, 'out')
const port = Number(process.env.REVIEW_PORT || 4173)
const server = createLockedReviewServer({root})

server.listen(port, '127.0.0.1', () => {
  console.log(`POXIOL locked review server: http://127.0.0.1:${port}`)
})

for (const signal of ['SIGINT', 'SIGTERM']) {
  process.on(signal, () => server.close(() => process.exit(0)))
}
