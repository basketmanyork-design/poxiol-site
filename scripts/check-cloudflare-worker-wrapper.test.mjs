import assert from 'node:assert/strict'
import {cpSync, mkdirSync, mkdtempSync, rmSync, writeFileSync} from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import {after, test} from 'node:test'
import {pathToFileURL} from 'node:url'

const root = path.resolve(import.meta.dirname, '..')
const fixtureRoot = mkdtempSync(path.join(os.tmpdir(), 'poxiol-worker-wrapper-'))
let fixtureSequence = 0

after(() => rmSync(fixtureRoot, {recursive: true, force: true}))

async function loadWrapper() {
  const fixture = path.join(fixtureRoot, `fixture-${fixtureSequence++}`)
  const generatedRoot = path.join(fixture, '.open-next')
  mkdirSync(generatedRoot, {recursive: true})
  writeFileSync(path.join(generatedRoot, 'worker.js'), `
    export class DOQueueHandler {}
    export class DOShardedTagCache {}
    export class BucketCachePurge {}
    export default {
      fetch: async (request) => {
        const isXml = new URL(request.url).pathname.endsWith('.xml')
        return new Response(isXml ? '<urlset />' : '<main>ok</main>', {
          headers: {'content-type': isXml ? 'application/xml' : 'text/html'},
        })
      },
    }
  `)
  cpSync(path.join(root, 'cloudflare-worker.mjs'), path.join(fixture, 'cloudflare-worker.mjs'))
  return import(`${pathToFileURL(path.join(fixture, 'cloudflare-worker.mjs')).href}?test=${Date.now()}`)
}

test('preserves every generated OpenNext Durable Object export', async () => {
  const wrapper = await loadWrapper()
  assert.equal(typeof wrapper.DOQueueHandler, 'function')
  assert.equal(typeof wrapper.DOShardedTagCache, 'function')
  assert.equal(typeof wrapper.BucketCachePurge, 'function')
})

test('adds the document CSP only to HTML responses', async () => {
  const wrapper = await loadWrapper()
  const html = await wrapper.default.fetch(new Request('https://www.poxiol.com/'))
  const xml = await wrapper.default.fetch(new Request('https://www.poxiol.com/sitemap.xml'))

  assert.equal(html.headers.has('content-security-policy-report-only'), true)
  assert.equal(xml.headers.has('content-security-policy'), false)
  assert.equal(xml.headers.has('content-security-policy-report-only'), false)
})
