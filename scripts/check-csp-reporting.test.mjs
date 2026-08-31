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

test('ignores a valid CSP entry after ten non-CSP Reporting API entries', () => {
  const entries = [
    ...Array.from({length: 10}, () => ({type: 'deprecation', body: {id: 'not-csp'}})),
    {type: 'csp-violation', body: legacyReport()},
  ]
  assert.deepEqual(parseCspReportPayload({
    contentType: 'application/reports+json',
    text: JSON.stringify(entries),
  }), [])
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
    schemaVersion: 'v1', disposition: 'report', effectiveDirective: 'script-src-elem',
    documentPath: '/contact/', blockedResourceClass: 'external', blockedHost: 'cdn.example.invalid',
    statusBucket: '2xx', receiverHost, count: 1,
  })
  const serialized = JSON.stringify(sanitized)
  for (const forbidden of ['REMOVE_ME_QUERY', 'REMOVE_ME_FRAGMENT', 'REMOVE_ME_BLOCKED_QUERY', 'REMOVE_ME_REFERRER', 'REMOVE_ME_SAMPLE', 'REMOVE_ME_POLICY']) assert.equal(serialized.includes(forbidden), false)
})

test('discards missing, invalid, and cross-host document URLs', () => {
  assert.equal(sanitizeCspReport({report: legacyReport({'document-uri': undefined}), requestUrl}), null)
  assert.equal(sanitizeCspReport({report: legacyReport({'document-uri': 'http://[invalid'}), requestUrl}), null)
  assert.equal(sanitizeCspReport({report: legacyReport({'document-uri': 'https://attacker.example/private'}), requestUrl}), null)
})

test('rejects non-string document URL values before URL parsing', () => {
  for (const documentUrl of [123, {href: `https://${receiverHost}/contact/`}, []]) {
    assert.equal(sanitizeCspReport({report: legacyReport({'document-uri': documentUrl}), requestUrl}), null)
  }
})

test('normalizes allowed token classes, directive bounds, and status buckets', () => {
  const cases = [
    ['inline', 'inline', '', 0, '0'], ['eval', 'eval', '', 301, '3xx'], ['data:text/plain,hello', 'data', '', 404, '4xx'],
    ['blob:https://preview-branch.poxiol-site.pages.dev/id', 'blob', '', 503, '5xx'], [`https://${receiverHost}/asset.js?secret=1`, 'self', '', 199, 'unknown'], ['not a url', 'other', '', 'bad', 'unknown'],
  ]
  for (const [blocked, resourceClass, blockedHost, status, statusBucket] of cases) {
    const sanitized = sanitizeCspReport({report: legacyReport({'blocked-uri': blocked, 'status-code': status, 'effective-directive': 'A'.repeat(65), disposition: 'unexpected'}), requestUrl})
    assert.equal(sanitized.blockedResourceClass, resourceClass); assert.equal(sanitized.blockedHost, blockedHost)
    assert.equal(sanitized.statusBucket, statusBucket); assert.equal(sanitized.effectiveDirective, 'unknown'); assert.equal(sanitized.disposition, 'unknown')
  }
})

test('classifies canonical IPv4 and bracketed IPv6 blocked hosts as other without retaining them', () => {
  for (const blocked of ['https://192.0.2.44/private.js', 'https://[2001:db8::44]/private.js']) {
    const sanitized = sanitizeCspReport({report: legacyReport({'blocked-uri': blocked}), requestUrl})
    assert.equal(sanitized.blockedResourceClass, 'other')
    assert.equal(sanitized.blockedHost, '')
    assert.equal(JSON.stringify(sanitized).includes(new URL(blocked).hostname), false)
  }
})

test('classifies an IP blocked host as other even when it matches the receiver', () => {
  const ipRequestUrl = 'https://192.0.2.44/__csp-report'
  const sanitized = sanitizeCspReport({
    report: legacyReport({
      'document-uri': 'https://192.0.2.44/contact/',
      'blocked-uri': 'https://192.0.2.44/private.js',
    }),
    requestUrl: ipRequestUrl,
  })
  assert.equal(sanitized.blockedResourceClass, 'other')
  assert.equal(sanitized.blockedHost, '')
})

test('caps document paths and external hostnames to the approved maxima', () => {
  const sanitized = sanitizeCspReport({report: legacyReport({'document-uri': `https://${receiverHost}/${'a'.repeat(400)}?secret=1`, 'blocked-uri': `https://${'b'.repeat(120)}.example.invalid/path`}), requestUrl})
  assert.equal(sanitized.documentPath.length, 256); assert.ok(sanitized.blockedHost.length <= 128)
})

test('builds the fixed Analytics Engine field order and sampling count', () => {
  const sanitizedReport = sanitizeCspReport({report: legacyReport(), requestUrl})
  assert.deepEqual(buildAnalyticsDataPoint({sanitizedReport, requestUrl}), {
    indexes: [`${receiverHost}|script-src-elem`], blobs: ['v1', 'report', 'script-src-elem', '/contact/', 'external', 'cdn.example.invalid', '2xx', receiverHost], doubles: [1],
  })
})
