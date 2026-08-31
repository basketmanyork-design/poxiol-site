# POXIOL CSP Reporting Preview Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build and verify a privacy-minimized same-origin CSP report receiver for a Cloudflare Pages Preview while keeping Production unchanged.

**Architecture:** A root `functions/__csp-report.js` Pages Function owns the HTTP boundary and delegates parsing, normalization, and Analytics Engine field construction to pure functions in `lib/security/csp-reporting.mjs`. Static `public/_headers` declares the report-only delivery endpoint, while `public/_routes.json` limits Functions invocation to the receiver route; local tests use an in-memory Analytics Engine stub and real Cloudflare validation is split behind two explicit owner gates.

**Tech Stack:** Node.js 22 project runtime, Node built-in test/assert APIs, Web Fetch APIs, Next.js 15 static export, Cloudflare Pages Functions, Workers Analytics Engine, Cloudflare Pages Git Preview deployments, PowerShell verification commands.

**Spec:** `docs/superpowers/specs/2026-08-31-poxiol-csp-reporting-preview-design.md`

## Global Constraints

- Read the approved spec before starting each task and preserve its field names, limits, status codes, and authorization gates exactly.
- Work only in the existing linked worktree on branch `codex/csp-reporting-preview-design`; do not create another worktree during execution.
- Leave `construction/visual-reviews/category-scenes/` untouched and uncommitted.
- Keep Production on the currently deployed `main` state; do not merge this branch to `main` in this plan.
- Do not create or store an API token, OAuth credential, secret, IP address, User-Agent, referrer, query string, fragment, script sample, original policy, raw request body, or inquiry data.
- The only binding name is `POXIOL_CSP_REPORTS`; the Preview dataset is `poxiol_csp_preview`; no Production binding or Production dataset is created.
- Accept only `application/reports+json` and `application/csp-report`; reject `application/json`.
- The body limit is exactly 16 KiB (`16 * 1024` bytes) and only the first 10 entries of a Reporting API array are inspected.
- Keep CSP non-enforcing: do not add a `Content-Security-Policy` header, remove `unsafe-inline`, or change any existing source allowance.
- Add no CORS header. Every Function response includes `Cache-Control: no-store` and `X-Content-Type-Options: nosniff`.
- Use test-first development, run the named RED command before implementation, and commit after every task passes.
- Any unexpected route, sitemap, canonical, form-action, build, or security-header drift stops execution for diagnosis; it is not accepted as incidental cleanup.

## File Responsibility Map

| File | Responsibility | Change |
|---|---|---|
| `lib/security/csp-reporting.mjs` | Pure content-type, payload, privacy normalization, and data-point functions | Create |
| `scripts/check-csp-reporting.test.mjs` | Pure-module parsing, minimization, classification, bounds, and schema tests | Create |
| `functions/__csp-report.js` | Pages Function method, media type, byte limit, binding, response, and write contract | Create |
| `scripts/check-csp-pages-function.test.mjs` | Direct Function HTTP tests with an in-memory binding and route-manifest contract | Create |
| `public/_routes.json` | Invoke Pages Functions only for `/__csp-report` and `/__csp-report/` | Create |
| `public/_headers` | Declare `Reporting-Endpoints`, `report-to`, and compatibility `report-uri` while retaining Report-Only | Modify |
| `scripts/check-security-headers-integration.test.mjs` | Preserve OpenNext regression coverage and add static Pages header-source assertions | Modify |
| `package.json` | Expose and gate the focused CSP reporting checks | Modify |
| `docs/operations/CSP_REPORTING_PREVIEW_RUNBOOK.md` | Setup, evidence, query, synthetic checks, rollback, and no-go boundaries | Create |

The implementation must not modify `cloudflare-worker.mjs`, `wrangler.jsonc`, `open-next.config.ts`, application pages, form components, Sanity schemas, DNS, or Production settings.

## Execution Shell Bootstrap

On the current Codex Windows host, initialize the approved bundled runtime once before running any plan command:

```powershell
$env:PATH = 'C:\Users\Administrator\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin;C:\Users\Administrator\.cache\codex-runtimes\codex-primary-runtime\dependencies\bin\fallback;' + $env:PATH
node --version
pnpm --version
```

Expected on this host: Node `v24.19.0` and pnpm `11.19.0`. The repository and Cloudflare Pages build setting remain governed by Node `22.x`; the real Preview build in Task 8 is the Node 22 compatibility proof.

---

### Task 1: Pure CSP Reporting Data Contract

**Files:**
- Create: `scripts/check-csp-reporting.test.mjs`
- Create: `lib/security/csp-reporting.mjs`

**Interfaces:**
- Consumes: Browser-shaped JSON text, a supported `Content-Type`, and the receiver request URL.
- Produces: `isSupportedCspReportContentType(contentType) -> boolean`; `parseCspReportPayload({contentType, text}) -> object[]`; `sanitizeCspReport({report, requestUrl}) -> SanitizedCspReport | null`; `buildAnalyticsDataPoint({sanitizedReport, requestUrl}) -> {indexes: string[], blobs: string[], doubles: number[]}`.
- `SanitizedCspReport` has exactly `schemaVersion`, `disposition`, `effectiveDirective`, `documentPath`, `blockedResourceClass`, `blockedHost`, `statusBucket`, `receiverHost`, and `count`.

- [ ] **Step 1: Write the failing pure-module tests**

Create `scripts/check-csp-reporting.test.mjs` with table-driven coverage for both browser formats, array limiting, privacy removal, same-host validation, resource classification, status bucketing, bounded strings, and the Analytics Engine field order:

```js
import assert from 'node:assert/strict'
import test from 'node:test'

import {
  buildAnalyticsDataPoint,
  isSupportedCspReportContentType,
  parseCspReportPayload,
  sanitizeCspReport,
} from '../lib/security/csp-reporting.mjs'

const requestUrl = 'https://preview-branch.poxiol-site.pages.dev/__csp-report'
const receiverHost = 'preview-branch.poxiol-site.pages.dev'

function legacyReport(overrides = {}) {
  return {
    'document-uri': `https://${receiverHost}/contact/?lead=REMOVE_ME_QUERY#REMOVE_ME_FRAGMENT`,
    'effective-directive': 'script-src-elem',
    'blocked-uri': 'https://cdn.example.invalid/private/path.js?token=REMOVE_ME_BLOCKED_QUERY',
    'status-code': 200,
    disposition: 'report',
    referrer: 'https://buyer.example/private?email=REMOVE_ME_REFERRER',
    sample: 'REMOVE_ME_SAMPLE',
    'original-policy': 'REMOVE_ME_POLICY',
    ...overrides,
  }
}

test('accepts only the two browser CSP media types and ignores parameters', () => {
  assert.equal(isSupportedCspReportContentType('application/reports+json'), true)
  assert.equal(isSupportedCspReportContentType('Application/CSP-Report; charset=utf-8'), true)
  assert.equal(isSupportedCspReportContentType('application/json'), false)
  assert.equal(isSupportedCspReportContentType('text/plain'), false)
})

test('parses Reporting API batches and inspects only the first ten entries', () => {
  const entries = Array.from({length: 12}, (_, index) => ({
    type: 'csp-violation',
    url: `https://${receiverHost}/`,
    body: legacyReport({'effective-directive': index === 9 ? 'img-src' : 'script-src'}),
  }))
  const parsed = parseCspReportPayload({
    contentType: 'application/reports+json',
    text: JSON.stringify(entries),
  })
  assert.equal(parsed.length, 10)
  assert.equal(parsed.at(-1)['effective-directive'], 'img-src')
})

test('ignores non-CSP Reporting API entries and unknown valid shapes', () => {
  assert.deepEqual(parseCspReportPayload({
    contentType: 'application/reports+json',
    text: JSON.stringify([{type: 'deprecation', body: {id: 'not-csp'}}]),
  }), [])
  assert.deepEqual(parseCspReportPayload({
    contentType: 'application/csp-report',
    text: JSON.stringify({other: legacyReport()}),
  }), [])
})

test('parses the legacy csp-report envelope', () => {
  const report = legacyReport()
  assert.deepEqual(parseCspReportPayload({
    contentType: 'application/csp-report; charset=utf-8',
    text: JSON.stringify({'csp-report': report}),
  }), [report])
})

test('leaves malformed JSON as a SyntaxError for the HTTP boundary', () => {
  assert.throws(
    () => parseCspReportPayload({contentType: 'application/csp-report', text: '{broken'}),
    SyntaxError,
  )
})

test('sanitizes a same-host report to the approved bounded fields', () => {
  const sanitized = sanitizeCspReport({report: legacyReport(), requestUrl})
  assert.deepEqual(sanitized, {
    schemaVersion: 'v1',
    disposition: 'report',
    effectiveDirective: 'script-src-elem',
    documentPath: '/contact/',
    blockedResourceClass: 'external',
    blockedHost: 'cdn.example.invalid',
    statusBucket: '2xx',
    receiverHost,
    count: 1,
  })
  const serialized = JSON.stringify(sanitized)
  for (const forbidden of [
    'REMOVE_ME_QUERY',
    'REMOVE_ME_FRAGMENT',
    'REMOVE_ME_BLOCKED_QUERY',
    'REMOVE_ME_REFERRER',
    'REMOVE_ME_SAMPLE',
    'REMOVE_ME_POLICY',
  ]) assert.equal(serialized.includes(forbidden), false)
})

test('discards missing, invalid, and cross-host document URLs', () => {
  assert.equal(sanitizeCspReport({report: legacyReport({'document-uri': undefined}), requestUrl}), null)
  assert.equal(sanitizeCspReport({report: legacyReport({'document-uri': 'http://[invalid'}), requestUrl}), null)
  assert.equal(sanitizeCspReport({
    report: legacyReport({'document-uri': 'https://attacker.example/private'}),
    requestUrl,
  }), null)
})

test('normalizes allowed token classes, directive bounds, and status buckets', () => {
  const cases = [
    ['inline', 'inline', '', 0, '0'],
    ['eval', 'eval', '', 301, '3xx'],
    ['data:text/plain,hello', 'data', '', 404, '4xx'],
    ['blob:https://preview-branch.poxiol-site.pages.dev/id', 'blob', '', 503, '5xx'],
    [`https://${receiverHost}/asset.js?secret=1`, 'self', '', 199, 'unknown'],
    ['not a url', 'other', '', 'bad', 'unknown'],
  ]
  for (const [blocked, resourceClass, blockedHost, status, statusBucket] of cases) {
    const sanitized = sanitizeCspReport({
      report: legacyReport({
        'blocked-uri': blocked,
        'status-code': status,
        'effective-directive': 'A'.repeat(65),
        disposition: 'unexpected',
      }),
      requestUrl,
    })
    assert.equal(sanitized.blockedResourceClass, resourceClass)
    assert.equal(sanitized.blockedHost, blockedHost)
    assert.equal(sanitized.statusBucket, statusBucket)
    assert.equal(sanitized.effectiveDirective, 'unknown')
    assert.equal(sanitized.disposition, 'unknown')
  }
})

test('caps document paths and external hostnames to the approved maxima', () => {
  const longPath = `/${'a'.repeat(400)}`
  const sanitized = sanitizeCspReport({
    report: legacyReport({
      'document-uri': `https://${receiverHost}${longPath}?secret=1`,
      'blocked-uri': `https://${'b'.repeat(120)}.example.invalid/path`,
    }),
    requestUrl,
  })
  assert.equal(sanitized.documentPath.length, 256)
  assert.ok(sanitized.blockedHost.length <= 128)
})

test('builds the fixed Analytics Engine field order and sampling count', () => {
  const sanitizedReport = sanitizeCspReport({report: legacyReport(), requestUrl})
  const point = buildAnalyticsDataPoint({sanitizedReport, requestUrl})
  assert.deepEqual(point, {
    indexes: [`${receiverHost}|script-src-elem`],
    blobs: [
      'v1',
      'report',
      'script-src-elem',
      '/contact/',
      'external',
      'cdn.example.invalid',
      '2xx',
      receiverHost,
    ],
    doubles: [1],
  })
})
```

- [ ] **Step 2: Run the pure-module test to verify RED**

Run:

```powershell
node --test scripts/check-csp-reporting.test.mjs
```

Expected: FAIL with `ERR_MODULE_NOT_FOUND` for `lib/security/csp-reporting.mjs`.

- [ ] **Step 3: Implement the minimal pure module**

Create `lib/security/csp-reporting.mjs` with no environment access, network calls, logging, cookies, or request-header reads:

```js
const SUPPORTED_CONTENT_TYPES = new Set([
  'application/reports+json',
  'application/csp-report',
])

function mediaType(contentType) {
  return String(contentType || '').split(';', 1)[0].trim().toLowerCase()
}

function bounded(value, maxLength) {
  return String(value || '').slice(0, maxLength)
}

function normalizedDirective(value) {
  const directive = String(value || '').trim().toLowerCase()
  return /^[a-z-]{1,64}$/.test(directive) ? directive : 'unknown'
}

function normalizedDisposition(value) {
  const disposition = String(value || '').trim().toLowerCase()
  return disposition === 'report' || disposition === 'enforce' ? disposition : 'unknown'
}

function statusBucket(value) {
  const status = Number(value)
  if (status === 0) return '0'
  if (Number.isInteger(status) && status >= 200 && status <= 599) {
    return `${Math.floor(status / 100)}xx`
  }
  return 'unknown'
}

function classifyBlockedResource(value, receiverUrl) {
  const raw = String(value || '').trim()
  const lower = raw.toLowerCase()
  if (lower === 'self') return {blockedResourceClass: 'self', blockedHost: ''}
  if (lower === 'inline') return {blockedResourceClass: 'inline', blockedHost: ''}
  if (lower === 'eval') return {blockedResourceClass: 'eval', blockedHost: ''}
  if (lower.startsWith('data:')) return {blockedResourceClass: 'data', blockedHost: ''}
  if (lower.startsWith('blob:')) return {blockedResourceClass: 'blob', blockedHost: ''}
  try {
    const blockedUrl = new URL(raw)
    if (!['http:', 'https:'].includes(blockedUrl.protocol)) {
      return {blockedResourceClass: 'other', blockedHost: ''}
    }
    if (blockedUrl.hostname.toLowerCase() === receiverUrl.hostname.toLowerCase()) {
      return {blockedResourceClass: 'self', blockedHost: ''}
    }
    return {
      blockedResourceClass: 'external',
      blockedHost: bounded(blockedUrl.hostname.toLowerCase(), 128),
    }
  } catch {
    return {blockedResourceClass: 'other', blockedHost: ''}
  }
}

export function isSupportedCspReportContentType(contentType) {
  return SUPPORTED_CONTENT_TYPES.has(mediaType(contentType))
}

export function parseCspReportPayload({contentType, text}) {
  const type = mediaType(contentType)
  const payload = JSON.parse(text)
  if (type === 'application/reports+json') {
    if (!Array.isArray(payload)) return []
    return payload
      .slice(0, 10)
      .filter((entry) => entry?.type === 'csp-violation' && entry.body && typeof entry.body === 'object')
      .map((entry) => entry.body)
  }
  if (type === 'application/csp-report') {
    const report = payload?.['csp-report']
    return report && typeof report === 'object' && !Array.isArray(report) ? [report] : []
  }
  return []
}

export function sanitizeCspReport({report, requestUrl}) {
  let receiverUrl
  let documentUrl
  try {
    receiverUrl = new URL(requestUrl)
    const documentValue = report?.documentURL ?? report?.['document-uri']
    if (!documentValue) return null
    documentUrl = new URL(documentValue, receiverUrl)
  } catch {
    return null
  }
  const receiverHost = bounded(receiverUrl.hostname.toLowerCase(), 128)
  if (documentUrl.hostname.toLowerCase() !== receiverHost) return null

  const effectiveDirective = normalizedDirective(
    report?.effectiveDirective ?? report?.['effective-directive'] ?? report?.['violated-directive'],
  )
  const blockedValue = report?.blockedURL ?? report?.['blocked-uri']
  const blocked = classifyBlockedResource(blockedValue, receiverUrl)

  return {
    schemaVersion: 'v1',
    disposition: normalizedDisposition(report?.disposition),
    effectiveDirective,
    documentPath: bounded(documentUrl.pathname || '/', 256),
    blockedResourceClass: blocked.blockedResourceClass,
    blockedHost: blocked.blockedHost,
    statusBucket: statusBucket(report?.statusCode ?? report?.['status-code']),
    receiverHost,
    count: 1,
  }
}

export function buildAnalyticsDataPoint({sanitizedReport, requestUrl}) {
  const receiverHost = new URL(requestUrl).hostname.toLowerCase()
  if (!sanitizedReport || sanitizedReport.receiverHost !== receiverHost) {
    throw new TypeError('Sanitized report receiver host mismatch')
  }
  return {
    indexes: [`${receiverHost}|${sanitizedReport.effectiveDirective}`],
    blobs: [
      sanitizedReport.schemaVersion,
      sanitizedReport.disposition,
      sanitizedReport.effectiveDirective,
      sanitizedReport.documentPath,
      sanitizedReport.blockedResourceClass,
      sanitizedReport.blockedHost,
      sanitizedReport.statusBucket,
      sanitizedReport.receiverHost,
    ],
    doubles: [sanitizedReport.count],
  }
}
```

- [ ] **Step 4: Run the focused test and verify GREEN**

Run:

```powershell
node --test scripts/check-csp-reporting.test.mjs
```

Expected: all tests PASS with zero console output containing any `REMOVE_ME_` sentinel.

- [ ] **Step 5: Commit the pure data contract**

```powershell
git add lib/security/csp-reporting.mjs scripts/check-csp-reporting.test.mjs
git commit -m "feat: add sanitized CSP reporting contract"
```

---

### Task 2: Pages Function HTTP Boundary

**Files:**
- Create: `scripts/check-csp-pages-function.test.mjs`
- Create: `functions/__csp-report.js`

**Interfaces:**
- Consumes: `context.request`, `context.env.POXIOL_CSP_REPORTS.writeDataPoint(point)`, and the four pure functions from Task 1.
- Produces: exported `onRequest(context) -> Promise<Response>` and `MAX_BODY_BYTES = 16384`.
- The binding receives only the fixed `{indexes, blobs, doubles}` object; there is no fallback store and no raw logging.

- [ ] **Step 1: Write the failing Function contract tests**

Create `scripts/check-csp-pages-function.test.mjs`:

```js
import assert from 'node:assert/strict'
import {readFileSync} from 'node:fs'
import path from 'node:path'
import test from 'node:test'
import {fileURLToPath} from 'node:url'

import {MAX_BODY_BYTES, onRequest} from '../functions/__csp-report.js'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
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

test('the Function source contains no raw logging or request metadata access', () => {
  const source = readFileSync(path.join(root, 'functions', '__csp-report.js'), 'utf8')
  assert.doesNotMatch(source, /console\.|CF-Connecting-IP|user-agent|referer|referrer|cookie|authorization/i)
})
```

- [ ] **Step 2: Run the Function test to verify RED**

Run:

```powershell
node --test scripts/check-csp-pages-function.test.mjs
```

Expected: FAIL with `ERR_MODULE_NOT_FOUND` for `functions/__csp-report.js`.

- [ ] **Step 3: Implement the bounded Pages Function**

Create `functions/__csp-report.js`:

```js
import {
  buildAnalyticsDataPoint,
  isSupportedCspReportContentType,
  parseCspReportPayload,
  sanitizeCspReport,
} from '../lib/security/csp-reporting.mjs'

export const MAX_BODY_BYTES = 16 * 1024

const SAFE_HEADERS = {
  'Cache-Control': 'no-store',
  'X-Content-Type-Options': 'nosniff',
}

class PayloadTooLargeError extends Error {}

function emptyResponse(status, extraHeaders = {}) {
  return new Response(null, {status, headers: {...SAFE_HEADERS, ...extraHeaders}})
}

async function readLimitedText(request) {
  const declaredLength = Number(request.headers.get('content-length'))
  if (Number.isFinite(declaredLength) && declaredLength > MAX_BODY_BYTES) {
    throw new PayloadTooLargeError()
  }
  if (!request.body) return ''

  const reader = request.body.getReader()
  const decoder = new TextDecoder()
  let size = 0
  let text = ''

  while (true) {
    const {done, value} = await reader.read()
    if (done) break
    size += value.byteLength
    if (size > MAX_BODY_BYTES) {
      await reader.cancel()
      throw new PayloadTooLargeError()
    }
    text += decoder.decode(value, {stream: true})
  }
  return text + decoder.decode()
}

export async function onRequest(context) {
  const {request, env} = context
  if (request.method !== 'POST') return emptyResponse(405, {Allow: 'POST'})

  const contentType = request.headers.get('content-type') || ''
  if (!isSupportedCspReportContentType(contentType)) return emptyResponse(415)

  const binding = env?.POXIOL_CSP_REPORTS
  if (!binding || typeof binding.writeDataPoint !== 'function') return emptyResponse(503)

  let reports
  try {
    const text = await readLimitedText(request)
    reports = parseCspReportPayload({contentType, text})
  } catch (error) {
    if (error instanceof PayloadTooLargeError) return emptyResponse(413)
    if (error instanceof SyntaxError) return emptyResponse(400)
    return emptyResponse(400)
  }

  try {
    for (const report of reports) {
      const sanitizedReport = sanitizeCspReport({report, requestUrl: request.url})
      if (!sanitizedReport) continue
      binding.writeDataPoint(buildAnalyticsDataPoint({sanitizedReport, requestUrl: request.url}))
    }
  } catch {
    return emptyResponse(503)
  }

  return emptyResponse(204)
}
```

- [ ] **Step 4: Run both focused suites and verify GREEN**

Run:

```powershell
node --test scripts/check-csp-reporting.test.mjs scripts/check-csp-pages-function.test.mjs
```

Expected: all tests PASS; no test output includes the synthetic `REMOVE_ME_` values.

- [ ] **Step 5: Commit the Function boundary**

```powershell
git add functions/__csp-report.js scripts/check-csp-pages-function.test.mjs
git commit -m "feat: add bounded CSP Pages Function"
```

---

### Task 3: Static Pages Routing and Report-Only Headers

**Files:**
- Create: `public/_routes.json`
- Modify: `public/_headers:1-7`
- Modify: `scripts/check-security-headers-integration.test.mjs:1-126`

**Interfaces:**
- Consumes: Cloudflare Pages file-based routing and static header files copied from `public/` to `out/`.
- Produces: exact Function route inclusion for `/__csp-report` and `/__csp-report/`; root static responses with `Reporting-Endpoints`; Report-Only CSP with `report-to poxiol-csp` and `report-uri /__csp-report`.
- Preserves: the separate OpenNext Worker wrapper test and every existing CSP source allowance.

- [ ] **Step 1: Add failing source-contract assertions before creating the route file**

In `scripts/check-security-headers-integration.test.mjs`, extend the `node:fs` import to `existsSync, readFileSync`, then add these constants and tests after the existing root constants:

```js
const pagesHeadersSource = readFileSync(path.join(root, 'public', '_headers'), 'utf8')
const pagesRoutes = JSON.parse(readFileSync(path.join(root, 'public', '_routes.json'), 'utf8'))

test('Pages static headers declare same-origin report-only delivery', () => {
  assert.match(pagesHeadersSource, /^  Reporting-Endpoints: poxiol-csp="\/__csp-report"$/m)
  const policyLine = pagesHeadersSource
    .split(/\r?\n/)
    .find((line) => line.startsWith('  Content-Security-Policy-Report-Only:'))
  assert.ok(policyLine)
  assert.match(policyLine, /(?:^|; )report-to poxiol-csp(?:;|$)/)
  assert.match(policyLine, /(?:^|; )report-uri \/__csp-report(?:;|$)/)
  assert.doesNotMatch(pagesHeadersSource, /^  Content-Security-Policy:/m)
})

test('Pages Functions routing invokes only the CSP receiver', () => {
  assert.deepEqual(pagesRoutes, {
    version: 1,
    include: ['/__csp-report', '/__csp-report/'],
    exclude: [],
  })
})
```

- [ ] **Step 2: Run the integration test to verify RED**

Run:

```powershell
node --test scripts/check-security-headers-integration.test.mjs
```

Expected: FAIL with `ENOENT` for `public/_routes.json`; no Cloudflare account change occurs.

- [ ] **Step 3: Add the exact Pages route manifest**

Create `public/_routes.json`:

```json
{
  "version": 1,
  "include": ["/__csp-report", "/__csp-report/"],
  "exclude": []
}
```

- [ ] **Step 4: Add reporting delivery to the existing static header block**

In the root `/*` block of `public/_headers`, insert this line after `Permissions-Policy`:

```text
  Reporting-Endpoints: poxiol-csp="/__csp-report"
```

Append these directives to the existing `Content-Security-Policy-Report-Only` value without changing any other directive or source:

```text
; report-to poxiol-csp; report-uri /__csp-report
```

The file must contain no enforcing `Content-Security-Policy:` line.

- [ ] **Step 5: Build the unchanged OpenNext path and verify the combined regression test**

Run:

```powershell
pnpm run cf:build
node --test scripts/check-security-headers-integration.test.mjs
node --test scripts/check-cloudflare-worker-wrapper.test.mjs
```

Expected: the static Pages assertions PASS; the existing OpenNext HTML responses remain Report-Only; XML remains free of document CSP headers; `cloudflare-worker.mjs` is unchanged.

- [ ] **Step 6: Commit routing and header delivery**

```powershell
git add public/_routes.json public/_headers scripts/check-security-headers-integration.test.mjs
git commit -m "feat: route CSP reports in Pages Preview"
```

---

### Task 4: Project Test Gates

**Files:**
- Modify: `package.json:4-63`

**Interfaces:**
- Consumes: the four focused source and HTTP test files from Tasks 1–3.
- Produces: `pnpm run check:csp-reporting`; the static build and full test commands both execute the focused gate before release verification.

- [ ] **Step 1: Add the failing package-script expectation**

Temporarily run this assertion before editing `package.json`:

```powershell
node -e "const p=require('./package.json'); if(!p.scripts['check:csp-reporting']) process.exit(1)"
```

Expected: exit code `1` because the script does not yet exist.

- [ ] **Step 2: Add the focused script and insert it into both governed command chains**

Add this property immediately after `check:security-headers:integration`:

```json
"check:csp-reporting": "node --test scripts/check-csp-reporting.test.mjs scripts/check-csp-pages-function.test.mjs"
```

In the existing `build` value, replace this exact segment:

```text
npm run check:cms-redirects && next build
```

with:

```text
npm run check:cms-redirects && npm run check:csp-reporting && next build
```

In the existing `test` value, replace this exact segment:

```text
npm run check:cms-redirects && node scripts/check-week3-guide-contracts.test.mjs
```

with:

```text
npm run check:cms-redirects && npm run check:csp-reporting && node scripts/check-week3-guide-contracts.test.mjs
```

Do not add a dependency and do not modify `package-lock.json`.

- [ ] **Step 3: Verify the package gate**

Run:

```powershell
pnpm run check:csp-reporting
node -e "const p=require('./package.json'); if(!p.scripts.build.includes('npm run check:csp-reporting')) process.exit(1); if(!p.scripts.test.includes('npm run check:csp-reporting')) process.exit(1)"
```

Expected: all focused tests PASS and the structural assertion exits `0`.

- [ ] **Step 4: Commit the release gates**

```powershell
git add package.json
git commit -m "test: gate CSP reporting contracts"
```

---

### Task 5: Preview Operations Runbook

**Files:**
- Create: `docs/operations/CSP_REPORTING_PREVIEW_RUNBOOK.md`

**Interfaces:**
- Consumes: the approved spec, exact field order, binding name, dataset name, source tests, and the two owner authorization gates.
- Produces: an operator-safe procedure that starts in a non-authorized state and never includes credentials.

- [ ] **Step 1: Write the runbook with explicit current state and gates**

Create `docs/operations/CSP_REPORTING_PREVIEW_RUNBOOK.md` with these sections and values:

```markdown
# POXIOL CSP Reporting Preview Runbook

## Governed state

- Written specification: APPROVED on 2026-08-31.
- Local implementation: LOCAL CODE PRESENT; VERIFICATION PENDING.
- Workers Analytics Engine account feature: NOT AUTHORIZED TO ENABLE.
- Preview binding `POXIOL_CSP_REPORTS`: NOT AUTHORIZED TO CREATE.
- Preview dataset `poxiol_csp_preview`: NOT AUTHORIZED TO CREATE.
- Preview branch deployment and synthetic POSTs: NOT AUTHORIZED.
- Production binding, merge, deployment, CSP enforcement and source tightening: OUT OF SCOPE.

## Fixed data contract

| Position | Analytics Engine field | Meaning |
|---|---|---|
| index1 | `${receiverHost}|${effectiveDirective}` | bounded aggregation key |
| blob1 | `v1` | schema version |
| blob2 | `report`, `enforce`, or `unknown` | disposition |
| blob3 | normalized directive | maximum 64 characters |
| blob4 | same-host pathname | maximum 256 characters, no query or fragment |
| blob5 | resource class | `self`, `inline`, `eval`, `data`, `blob`, `external`, or `other` |
| blob6 | external hostname or empty string | maximum 128 characters, no path |
| blob7 | status bucket | `0`, `2xx`, `3xx`, `4xx`, `5xx`, or `unknown` |
| blob8 | receiver hostname | maximum 128 characters |
| double1 | `1` | event count |

Never store or log IP addresses, User-Agent, referrer, cookies, authorization, query strings, fragments, original policy, samples, source paths, line or column numbers, raw bodies, names, email addresses, telephone numbers, form fields, or inquiry content.

## Owner Gate A — account feature and Preview binding

Stop until the owner explicitly authorizes enabling Workers Analytics Engine and creating the Preview-only binding.

After authorization:

1. Open Cloudflare → Workers & Pages → `poxiol-site` → Settings → Bindings.
2. Confirm the selected environment is Preview, not Production.
3. Enable Workers Analytics Engine at account level.
4. Add Analytics Engine binding `POXIOL_CSP_REPORTS` targeting dataset `poxiol_csp_preview` in Preview only.
5. Re-open Production bindings and confirm `POXIOL_CSP_REPORTS` is absent.
6. Do not create an API token or secret.
7. Record the operator, timestamp, Preview binding name, dataset name, and Production absence in the evidence section.

## Owner Gate B — branch Preview deployment and controlled tests

Stop until the owner explicitly authorizes a non-main Preview deployment and controlled synthetic reports. Do not merge to `main`.

After authorization, use the immutable `poxiol-site.pages.dev` branch Preview URL shown by the Cloudflare Pages check. Store it only in the current shell as `POXIOL_PREVIEW_URL`; do not write it into source configuration.

## Sampling-aware query

Use the Analytics Engine dashboard query surface for dataset `poxiol_csp_preview`:

```sql
SELECT
  blob3 AS effective_directive,
  blob4 AS document_path,
  blob5 AS blocked_resource_class,
  blob6 AS blocked_host,
  blob7 AS status_bucket,
  SUM(_sample_interval) AS estimated_reports
FROM poxiol_csp_preview
WHERE timestamp >= NOW() - INTERVAL '1' HOUR
GROUP BY blob3, blob4, blob5, blob6, blob7
ORDER BY estimated_reports DESC
LIMIT 100
```

If the dashboard cannot perform the query and SQL API access would require a token, stop and request separate approval for a time-bounded `Account Analytics: Read` token. Never paste a token into this file, a workbook, Git, shell history, or chat.

## Synthetic sentinels

Controlled payloads use only these non-personal markers:

- `REMOVE_ME_QUERY`
- `REMOVE_ME_FRAGMENT`
- `REMOVE_ME_REFERRER`
- `REMOVE_ME_SAMPLE`
- `REMOVE_ME_POLICY`
- `REMOVE_ME_AGENT`

The dataset may contain the approved directive, document pathname, resource class, and blocked hostname. It must contain none of the six markers above.

## Preview rollback

1. Remove `Reporting-Endpoints`, `report-to`, and `report-uri` from the branch.
2. Remove Preview binding `POXIOL_CSP_REPORTS`.
3. Redeploy the immediately preceding known-good Preview commit.
4. Leave `poxiol_csp_preview` to Cloudflare's approved default three-month expiry unless an approved earlier deletion control is available.
5. Recheck the Preview homepage, `/contact/`, `/get-quote/`, `/free-mockup/`, sitemap, robots, form action, and mobile layout.

## Production no-go boundary

This runbook does not authorize a Production binding, Production dataset, `main` merge, Production deployment, enforcing CSP, source tightening, DNS change, WAF rule, credential, or data deletion. Production requires a new owner decision after every Preview acceptance criterion passes.

## Evidence register

- Local focused tests: NOT RUN.
- Local static build and generated-file inspection: NOT RUN.
- Preview binding verification: NOT AUTHORIZED.
- Preview deployment URL and commit: NOT AUTHORIZED.
- Synthetic legacy report: NOT AUTHORIZED.
- Synthetic Reporting API batch: NOT AUTHORIZED.
- Browser-generated report-only violation: NOT AUTHORIZED.
- Sanitized dataset inspection: NOT AUTHORIZED.
- Production unchanged check: NOT RUN.
```

- [ ] **Step 2: Verify the runbook contains no credentials and every no-go item**

Run:

```powershell
rg -n "POXIOL_CSP_REPORTS|poxiol_csp_preview|SUM\(_sample_interval\)|Production no-go|NOT AUTHORIZED" docs/operations/CSP_REPORTING_PREVIEW_RUNBOOK.md
rg -n "api[_-]?token|Bearer [A-Za-z0-9]|CF-Connecting-IP|authorization:" docs/operations/CSP_REPORTING_PREVIEW_RUNBOOK.md
```

Expected: the first command finds every governed contract; the second command returns no credential value and only explanatory text if it matches a field name.

- [ ] **Step 3: Commit the runbook**

```powershell
git add docs/operations/CSP_REPORTING_PREVIEW_RUNBOOK.md
git commit -m "docs: add CSP Preview operations runbook"
```

---

### Task 6: Local Acceptance and Generated Output Proof

**Files:**
- Modify: `docs/operations/CSP_REPORTING_PREVIEW_RUNBOOK.md`
- Inspect only: `out/_headers`, `out/_routes.json`, `construction/route-release.json`, `cloudflare-worker.mjs`

**Interfaces:**
- Consumes: all local implementation commits and a Production-equivalent static content view.
- Produces: reproducible local evidence without enabling a Cloudflare account feature, binding, or deployment.

- [ ] **Step 1: Run focused source and HTTP checks**

```powershell
pnpm run check:csp-reporting
pnpm run cf:build
node --test scripts/check-security-headers-integration.test.mjs
node scripts/check-cloudflare-next-compatibility.test.mjs
node --test scripts/check-cloudflare-worker-wrapper.test.mjs
pnpm test
```

Expected: all focused and full source checks PASS; the OpenNext Worker wrapper remains unchanged and separate from the Pages Function.

- [ ] **Step 2: Run the governed static build in a Production-equivalent content mode on the non-main branch**

```powershell
$env:NEXT_PUBLIC_CONTENT_SOURCE = 'sanity'
$env:CMS_LEGACY_LIST_MODE = 'strict'
$env:CF_PAGES = '1'
$env:CF_PAGES_BRANCH = (git branch --show-current)
pnpm run build
```

Expected: Next.js static export succeeds, existing SEO/form/release gates pass, and no route deletion or sitemap drift is introduced.

- [ ] **Step 3: Prove the generated static files contain the exact Pages contracts**

```powershell
node -e "const fs=require('node:fs'); const h=fs.readFileSync('out/_headers','utf8'); const r=JSON.parse(fs.readFileSync('out/_routes.json','utf8')); if(!h.includes('Reporting-Endpoints: poxiol-csp=\"/__csp-report\"')) process.exit(1); if(!h.includes('report-to poxiol-csp')||!h.includes('report-uri /__csp-report')) process.exit(1); if(/^  Content-Security-Policy:/m.test(h)) process.exit(1); if(JSON.stringify(r)!==JSON.stringify({version:1,include:['/__csp-report','/__csp-report/'],exclude:[]})) process.exit(1)"
node scripts/generate-route-release.mjs --check
git diff --check
git status --short
```

Expected: each command exits `0`; `out/_routes.json` has only the two receiver paths; `out/_headers` remains Report-Only; route-release remains deterministic; the status contains only the planned files plus the preserved untracked `construction/visual-reviews/category-scenes/` directory.

- [ ] **Step 4: Update only the local evidence lines in the runbook**

After every command above passes, change:

```text
- Local implementation: LOCAL CODE PRESENT; VERIFICATION PENDING.
- Local focused tests: NOT RUN.
- Local static build and generated-file inspection: NOT RUN.
```

to:

```text
- Local implementation: VERIFIED; Cloudflare account and deployments remain unchanged.
- Local focused tests: PASS; pure module, Function HTTP contract, static header source, and OpenNext regression checks completed.
- Local static build and generated-file inspection: PASS; out/_headers and out/_routes.json match the approved Pages contract.
```

Do not alter any external-state line from `NOT AUTHORIZED`.

- [ ] **Step 5: Commit local acceptance evidence**

```powershell
git add docs/operations/CSP_REPORTING_PREVIEW_RUNBOOK.md
git commit -m "docs: record CSP Preview local verification"
```

- [ ] **Step 6: Stop for code review and owner approval of the implementation branch**

Use `superpowers:requesting-code-review`. Confirm the review covers privacy field leakage, byte-limit streaming, response status precedence, first-ten semantics, exact route scope, static header preservation, and the unchanged Production boundary. Do not push, enable Analytics Engine, add a binding, or deploy while review findings remain.

---

### Task 7: Owner Gate A — Enable Analytics Engine and Add the Preview Binding

**Files:**
- Modify after external verification: `docs/operations/CSP_REPORTING_PREVIEW_RUNBOOK.md`

**Interfaces:**
- Consumes: a reviewed local implementation and explicit owner authorization for the account feature plus Preview-only binding.
- Produces: Cloudflare Preview binding `POXIOL_CSP_REPORTS` → `poxiol_csp_preview`; Production bindings remain empty for this feature.

- [ ] **Step 1: Stop until the exact external-change authorization is recorded**

Required owner decision:

```text
批准启用 Analytics Engine 并创建 Preview 绑定
```

Approval of this implementation plan or a choice of execution mode is not equivalent to this authorization.

- [ ] **Step 2: Verify the exact Cloudflare target before mutation**

In the signed-in Cloudflare dashboard, confirm account, Pages project `poxiol-site`, environment `Preview`, source branch `codex/csp-reporting-preview-design`, and that Production has no `POXIOL_CSP_REPORTS` binding. Stop if any target differs.

- [ ] **Step 3: Enable the account feature and create only the Preview binding**

Follow Runbook Owner Gate A exactly:

```text
Binding: POXIOL_CSP_REPORTS
Dataset: poxiol_csp_preview
Environment: Preview only
```

Do not create a token, secret, D1 database, KV namespace, R2 bucket, Production binding, WAF rule, or DNS record.

- [ ] **Step 4: Re-open both environments and record read-back evidence**

Verify Preview shows the exact binding and dataset, then switch to Production and verify the binding is absent. Record the visible read-back state and timestamp in the runbook; do not record account IDs, credentials, or private identifiers.

- [ ] **Step 5: Commit the binding evidence only**

```powershell
git add docs/operations/CSP_REPORTING_PREVIEW_RUNBOOK.md
git commit -m "docs: record CSP Preview binding verification"
```

---

### Task 8: Owner Gate B — Deploy the Non-Main Preview and Run Controlled Reports

**Files:**
- Modify after Preview verification: `docs/operations/CSP_REPORTING_PREVIEW_RUNBOOK.md`

**Interfaces:**
- Consumes: reviewed source, verified Preview binding, and separate deployment/test authorization.
- Produces: one non-main Pages Preview deployment, synthetic sanitized data points, and HTTP evidence; no `main` merge.

- [ ] **Step 1: Stop until the exact Preview deployment/test authorization is recorded**

Required owner decision:

```text
批准部署非 main Preview 并执行受控 CSP 报告测试
```

- [ ] **Step 2: Push only the reviewed branch and wait for the existing Pages Preview check**

Push `codex/csp-reporting-preview-design`, open or update a draft PR, and verify the Cloudflare Pages check deploys the exact branch HEAD. Do not mark the PR ready for merge and do not merge it.

- [ ] **Step 3: Bind the immutable Preview URL to the current shell and validate its host**

Set `POXIOL_PREVIEW_URL` to the exact HTTPS URL shown by the successful `poxiol-site` Pages Preview check, then run:

```powershell
$previewUri = [uri]$env:POXIOL_PREVIEW_URL
if ($previewUri.Scheme -ne 'https' -or -not $previewUri.Host.EndsWith('.poxiol-site.pages.dev')) { throw 'Unexpected Preview URL' }
$previewHost = $previewUri.Host
```

Expected: no exception; the value is not `www.poxiol.com`, `poxiol.com`, or the Production alias.

- [ ] **Step 4: Verify Preview report delivery and the HTTP failure contract**

```powershell
$home = Invoke-WebRequest -Uri "$($env:POXIOL_PREVIEW_URL)/" -Method Get
if (-not $home.Headers['Reporting-Endpoints'].Contains('poxiol-csp="/__csp-report"')) { throw 'Missing Reporting-Endpoints' }
if (-not $home.Headers['Content-Security-Policy-Report-Only'].Contains('report-to poxiol-csp')) { throw 'Missing report-to' }
if (-not $home.Headers['Content-Security-Policy-Report-Only'].Contains('report-uri /__csp-report')) { throw 'Missing report-uri' }
if ($home.Headers['Content-Security-Policy']) { throw 'CSP must remain Report-Only' }

$getResponse = Invoke-WebRequest -Uri "$($env:POXIOL_PREVIEW_URL)/__csp-report" -Method Get -SkipHttpErrorCheck
if ($getResponse.StatusCode -ne 405 -or $getResponse.Headers.Allow -ne 'POST') { throw 'GET contract failed' }

$jsonResponse = Invoke-WebRequest -Uri "$($env:POXIOL_PREVIEW_URL)/__csp-report" -Method Post -ContentType 'application/json' -Body '{}' -SkipHttpErrorCheck
if ($jsonResponse.StatusCode -ne 415) { throw 'application/json must be rejected' }

$largeResponse = Invoke-WebRequest -Uri "$($env:POXIOL_PREVIEW_URL)/__csp-report" -Method Post -ContentType 'application/csp-report' -Body ('x' * 16385) -SkipHttpErrorCheck
if ($largeResponse.StatusCode -ne 413) { throw 'Oversized body contract failed' }
```

Expected: static homepage `200`; GET `405`; generic JSON `415`; oversized body `413`; every endpoint response has `no-store` and `nosniff`; no CORS response header exists.

- [ ] **Step 5: Send one legacy report containing removable sentinels**

```powershell
$legacyPayload = @{
  'csp-report' = @{
    'document-uri' = "$($env:POXIOL_PREVIEW_URL)/contact/?value=REMOVE_ME_QUERY#REMOVE_ME_FRAGMENT"
    'effective-directive' = 'script-src-elem'
    'blocked-uri' = 'https://cdn.synthetic.invalid/private/file.js?value=REMOVE_ME_QUERY'
    'status-code' = 200
    disposition = 'report'
    referrer = 'https://buyer.synthetic.invalid/private?value=REMOVE_ME_REFERRER'
    sample = 'REMOVE_ME_SAMPLE'
    'original-policy' = 'REMOVE_ME_POLICY'
  }
} | ConvertTo-Json -Depth 4 -Compress
$legacyResponse = Invoke-WebRequest -Uri "$($env:POXIOL_PREVIEW_URL)/__csp-report" -Method Post -ContentType 'application/csp-report' -Headers @{'User-Agent'='REMOVE_ME_AGENT'} -Body $legacyPayload
if ($legacyResponse.StatusCode -ne 204) { throw 'Legacy report failed' }
```

Expected: `204 No Content` and no echoed body.

- [ ] **Step 6: Send one Reporting API batch and prove the first-ten limit**

```powershell
$batch = 1..12 | ForEach-Object {
  @{
    type = 'csp-violation'
    url = "$($env:POXIOL_PREVIEW_URL)/"
    body = @{
      documentURL = "$($env:POXIOL_PREVIEW_URL)/get-quote/?value=REMOVE_ME_QUERY#REMOVE_ME_FRAGMENT"
      effectiveDirective = 'connect-src'
      blockedURL = 'https://api.synthetic.invalid/private?value=REMOVE_ME_QUERY'
      statusCode = 200
      disposition = 'report'
      referrer = 'https://buyer.synthetic.invalid/?value=REMOVE_ME_REFERRER'
      sample = 'REMOVE_ME_SAMPLE'
      originalPolicy = 'REMOVE_ME_POLICY'
    }
  }
}
$batchResponse = Invoke-WebRequest -Uri "$($env:POXIOL_PREVIEW_URL)/__csp-report" -Method Post -ContentType 'application/reports+json' -Headers @{'User-Agent'='REMOVE_ME_AGENT'} -Body ($batch | ConvertTo-Json -Depth 5 -Compress)
if ($batchResponse.StatusCode -ne 204) { throw 'Reporting API batch failed' }
```

Expected: `204 No Content`; the resulting count corresponds to at most the first 10 entries, subject to Analytics Engine sampling.

- [ ] **Step 7: Inspect only the approved dimensions in the Analytics Engine dashboard**

Run the sampling-aware query from the runbook. Confirm the rows include `/contact/` with `script-src-elem` and `/get-quote/` with `connect-src`, plus only `cdn.synthetic.invalid` or `api.synthetic.invalid` as external hosts. Search all visible dimensions for every `REMOVE_ME_` sentinel and confirm none appears. If the dashboard cannot query without an API token, stop; do not create one.

- [ ] **Step 8: Record exact Preview evidence and commit it**

Record branch HEAD, immutable Preview URL, Cloudflare deployment state, status-code matrix, observed sanitized rows, first-ten result, and Production-binding absence in the runbook. Then commit:

```powershell
git add docs/operations/CSP_REPORTING_PREVIEW_RUNBOOK.md
git commit -m "docs: record synthetic CSP Preview evidence"
```

---

### Task 9: Browser Acceptance, Production-Unchanged Proof, and Handoff

**Files:**
- Modify: `docs/operations/CSP_REPORTING_PREVIEW_RUNBOOK.md`

**Interfaces:**
- Consumes: the successful Preview deployment and sanitized synthetic evidence.
- Produces: browser-generated report evidence, site-regression evidence, Production no-change evidence, and an owner review package; no Production action.

- [ ] **Step 1: Trigger one controlled browser report-only violation on Preview**

Open the immutable Preview homepage in a clean browser context. In DevTools Console run:

```js
fetch('https://csp-probe.invalid/poxiol-preview-only')
```

Expected: the candidate `connect-src` policy reports the violation but does not enforce it. The probe request itself may fail because `.invalid` is non-routable; that failure is expected and is not a POXIOL application error.

- [ ] **Step 2: Confirm the browser-generated event reaches only the Preview dataset**

Use the runbook query and confirm a recent `connect-src` trend for the Preview receiver host. Verify the row contains no full source path, query, fragment, referrer, sample, original policy, IP, User-Agent, or raw body.

- [ ] **Step 3: Recheck the critical Preview buyer journey and static assets**

Check `/`, `/products/basketball-uniforms/`, `/contact/`, `/get-quote/`, and `/free-mockup/` at desktop and `390 × 844`. Verify `200` responses, one H1 per page, correct canonical, no horizontal overflow, existing Formspree action `https://formspree.io/f/xqernqlv`, zero unexpected console errors, sitemap and robots availability, and no function behavior on ordinary routes.

- [ ] **Step 4: Prove Production remains unchanged**

Run against `https://www.poxiol.com`:

```powershell
$production = Invoke-WebRequest -Uri 'https://www.poxiol.com/' -Method Get
if ($production.Headers['Reporting-Endpoints']) { throw 'Production changed before approval' }
if ($production.Headers['Content-Security-Policy-Report-Only'].Contains('report-to poxiol-csp')) { throw 'Production report-to changed before approval' }
if ($production.Headers['Content-Security-Policy-Report-Only'].Contains('report-uri /__csp-report')) { throw 'Production report-uri changed before approval' }
```

Also verify Cloudflare Production bindings still contain no `POXIOL_CSP_REPORTS` entry and the Production deployment still points to the previously approved `main` release until a later owner-approved production rollout.

- [ ] **Step 5: Close the Preview evidence record without authorizing Production**

Update the runbook evidence lines to PASS only for checks actually observed. Record any sampling delay or dashboard limitation explicitly. Keep every Production no-go statement intact.

- [ ] **Step 6: Commit the Preview acceptance record**

```powershell
git add docs/operations/CSP_REPORTING_PREVIEW_RUNBOOK.md
git commit -m "docs: complete CSP Preview acceptance record"
```

- [ ] **Step 7: Request the next owner decision and stop**

Report the Preview acceptance evidence, residual abuse/sampling risk, rollback point, and exact diff. Ask separately whether to prepare a Production binding and merge plan. Do not create `poxiol_csp_production`, add a Production binding, merge, deploy, enforce CSP, or tighten sources under this plan.

---

## Final Verification Matrix

| Approved requirement | Proof task |
|---|---|
| Both browser media types | Tasks 1, 2, and 8 |
| 16 KiB stream limit and first 10 entries | Tasks 1, 2, and 8 |
| Same-host document requirement | Tasks 1, 2, and 8 |
| Exact sanitized field schema | Tasks 1 and 8 |
| No raw or identifying application data | Tasks 1, 2, 5, 8, and 9 |
| Missing binding fails with 503 | Task 2 |
| No CORS, no-store, nosniff | Tasks 2 and 8 |
| Exact Function route only | Tasks 3 and 6 |
| Report-Only header preserved | Tasks 3, 6, 8, and 9 |
| Existing sources and Formspree preserved | Tasks 3, 6, and 9 |
| Preview-only Analytics Engine isolation | Tasks 7–9 |
| Synthetic and browser end-to-end proof | Tasks 8 and 9 |
| Production remains unchanged | Tasks 7–9 |
| Rollback and retention recorded | Task 5 |

## Execution Stop Conditions

Stop immediately and report evidence if any of these occurs:

- a test fails for a reason other than the named RED condition;
- `public/_routes.json` causes a normal page or asset to invoke a Function;
- generated `out/_headers` contains enforcing CSP or loses an existing source;
- route-release, sitemap, canonical, form action, or build output drifts;
- raw or identifying data appears in a write, log, response, query result, screenshot, runbook, workbook, or commit;
- Preview binding appears in Production;
- the Preview URL resolves to a Production alias;
- Analytics Engine inspection requires an unapproved token;
- a deployment would target `main` or merge the branch;
- the preserved untracked visual-review directory would be staged or modified.
