import assert from 'node:assert/strict'
import test from 'node:test'

import {MAX_BODY_BYTES, onRequest} from '../functions/__csp-report.js'

const endpoint = 'https://preview-branch.poxiol-site.pages.dev/__csp-report'

function body(overrides = {}) {
  return {
    'document-uri': 'https://preview-branch.poxiol-site.pages.dev/contact/?remove=1#remove',
    'effective-directive': 'script-src',
    'blocked-uri': 'inline',
    'status-code': 200,
    disposition: 'report',
    sample: 'REMOVE_ME_SAMPLE',
    ...overrides,
  }
}

async function invoke({
  method = 'POST',
  contentType = 'application/csp-report',
  payload = JSON.stringify({'csp-report': body()}),
  binding = true,
} = {}) {
  const writes = []
  const headers = contentType ? {'content-type': contentType, 'user-agent': 'REMOVE_ME_AGENT'} : {}
  const request = new Request(endpoint, {
    method,
    headers,
    body: method === 'GET' || method === 'HEAD' ? undefined : payload,
  })
  const env = binding ? {POXIOL_CSP_REPORTS: {writeDataPoint: (point) => writes.push(point)}} : {}
  const response = await onRequest({request, env})
  return {response, writes}
}

function assertSafeResponse(response) {
  assert.equal(response.headers.get('cache-control'), 'no-store')
  assert.equal(response.headers.get('x-content-type-options'), 'nosniff')
  assert.equal(response.headers.has('access-control-allow-origin'), false)
}

test('accepts one legacy report and writes only the normalized point', async () => {
  const {response, writes} = await invoke()
  assert.equal(response.status, 204)
  assert.equal(writes.length, 1)
  assert.deepEqual(writes[0].doubles, [1])
  assert.equal(JSON.stringify(writes).includes('REMOVE_ME_'), false)
  assertSafeResponse(response)
})

test('accepts Reporting API batches and writes no more than ten points', async () => {
  const payload = JSON.stringify(Array.from({length: 12}, () => ({
    type: 'csp-violation',
    body: body(),
  })))
  const {response, writes} = await invoke({contentType: 'application/reports+json', payload})
  assert.equal(response.status, 204)
  assert.equal(writes.length, 10)
  assertSafeResponse(response)
})

test('returns 204 and zero writes for valid JSON with no usable CSP entry', async () => {
  const {response, writes} = await invoke({
    contentType: 'application/reports+json',
    payload: JSON.stringify([{type: 'deprecation', body: {id: 'not-csp'}}]),
  })
  assert.equal(response.status, 204)
  assert.deepEqual(writes, [])
  assertSafeResponse(response)
})

test('rejects malformed JSON, unsupported media, and oversized bodies', async () => {
  const malformed = await invoke({payload: '{broken'})
  assert.equal(malformed.response.status, 400)
  assert.deepEqual(malformed.writes, [])
  assertSafeResponse(malformed.response)

  const unsupported = await invoke({contentType: 'application/json'})
  assert.equal(unsupported.response.status, 415)
  assert.deepEqual(unsupported.writes, [])
  assertSafeResponse(unsupported.response)

  const oversized = await invoke({payload: 'x'.repeat(MAX_BODY_BYTES + 1)})
  assert.equal(oversized.response.status, 413)
  assert.deepEqual(oversized.writes, [])
  assertSafeResponse(oversized.response)
})

test('rejects non-POST methods with Allow POST', async () => {
  const {response, writes} = await invoke({method: 'GET'})
  assert.equal(response.status, 405)
  assert.equal(response.headers.get('allow'), 'POST')
  assert.deepEqual(writes, [])
  assertSafeResponse(response)
})

test('fails closed when the Preview Analytics Engine binding is absent', async () => {
  const {response, writes} = await invoke({binding: false})
  assert.equal(response.status, 503)
  assert.deepEqual(writes, [])
  assertSafeResponse(response)
})

test('discards cross-host document URLs without writing', async () => {
  const result = await invoke({
    payload: JSON.stringify({'csp-report': body({'document-uri': 'https://attacker.example/private'})}),
  })
  assert.equal(result.response.status, 204)
  assert.deepEqual(result.writes, [])
})

test('logs nothing and leaks no request sentinels while invoking the real Function', async () => {
  const calls = []
  const methods = ['debug', 'info', 'log', 'warn', 'error']
  const originals = Object.fromEntries(methods.map((method) => [method, console[method]]))
  for (const method of methods) console[method] = (...args) => calls.push({method, args})
  let result
  try {
    result = await invoke({
      payload: JSON.stringify({'csp-report': body({sample: 'REMOVE_ME_SAMPLE'})}),
    })
  } finally {
    for (const method of methods) console[method] = originals[method]
  }
  assert.deepEqual(calls, [])
  assert.equal(JSON.stringify(result.writes).includes('REMOVE_ME_'), false)
  assert.equal((await result.response.text()).includes('REMOVE_ME_'), false)
})
