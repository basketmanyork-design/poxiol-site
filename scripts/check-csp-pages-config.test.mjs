import assert from 'node:assert/strict'
import {readFileSync} from 'node:fs'
import test from 'node:test'
import {fileURLToPath} from 'node:url'
import path from 'node:path'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const headers = readFileSync(path.join(root, 'public', '_headers'), 'utf8')
const routes = JSON.parse(readFileSync(path.join(root, 'public', '_routes.json'), 'utf8'))
const approvedReportOnlyPolicy = "default-src 'self'; base-uri 'self'; object-src 'none'; frame-ancestors 'self'; form-action 'self' https://formspree.io; img-src 'self' data: blob: https://cdn.sanity.io https://*.google-analytics.com https://www.googletagmanager.com; font-src 'self' data:; script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://static.cloudflareinsights.com; style-src 'self' 'unsafe-inline'; connect-src 'self' https://formspree.io https://*.google-analytics.com https://*.analytics.google.com https://www.googletagmanager.com https://cloudflareinsights.com; media-src 'self' blob:; worker-src 'self' blob:; manifest-src 'self'; upgrade-insecure-requests; report-to poxiol-csp; report-uri /__csp-report"

test('Pages source declares the complete approved report-only CSP receiver contract', () => {
  assert.match(headers, /^  Reporting-Endpoints: poxiol-csp="\/__csp-report"$/m)
  assert.match(headers, new RegExp(`^  Content-Security-Policy-Report-Only: ${approvedReportOnlyPolicy.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'm'))
  assert.doesNotMatch(headers, /^  Content-Security-Policy:/m)
})

test('Pages source routes only the CSP receiver to Functions', () => {
  assert.deepEqual(routes, {
    version: 1,
    include: ['/__csp-report', '/__csp-report/'],
    exclude: [],
  })
})
