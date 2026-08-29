import assert from 'node:assert/strict'
import {spawnSync} from 'node:child_process'
import {readFileSync} from 'node:fs'
import path from 'node:path'
import test from 'node:test'
import {pathToFileURL} from 'node:url'
import {assertAnalyticsReleaseReady} from '../lib/privacy/analytics-release.ts'

test('pending legal approval rejects enabled analytics', () => {
  assert.throws(
    () => assertAnalyticsReleaseReady({legalApproved: false, ga4Enabled: true, cloudflareAnalyticsEnabled: false}),
    /ANALYTICS_APPROVAL_REQUIRED/,
  )
  assert.throws(
    () => assertAnalyticsReleaseReady({legalApproved: false, ga4Enabled: false, cloudflareAnalyticsEnabled: true}),
    /ANALYTICS_APPROVAL_REQUIRED/,
  )
})

test('pending legal approval permits both analytics systems disabled', () => {
  assert.equal(assertAnalyticsReleaseReady({legalApproved: false, ga4Enabled: false, cloudflareAnalyticsEnabled: false}), true)
})

test('the governed release record starts fully disabled and unapproved', () => {
  const record = JSON.parse(readFileSync('content/privacy/analytics-release.json', 'utf8'))
  assert.equal(record.ga4, 'DISABLED_PENDING_APPROVAL')
  assert.equal(record.cloudflareWebAnalytics, 'DISABLED_PENDING_APPROVAL')
  assert.equal(record.approvedBy, null)
  assert.equal(record.approvedAt, null)
})

test('an isolated enabled fixture exits non-zero and runtime config consumes the governed gate', () => {
  const moduleUrl = pathToFileURL(path.resolve('lib/privacy/analytics-release.ts')).href
  const fixture = spawnSync(process.execPath, [
    '--no-warnings',
    '--experimental-strip-types',
    '--input-type=module',
    '--eval',
    `import {assertAnalyticsReleaseReady} from ${JSON.stringify(moduleUrl)}; assertAnalyticsReleaseReady({legalApproved:false,ga4Enabled:true,cloudflareAnalyticsEnabled:false})`,
  ], {encoding: 'utf8'})
  assert.notEqual(fixture.status, 0)
  assert.match(fixture.stderr, /ANALYTICS_APPROVAL_REQUIRED/)

  const server = readFileSync('lib/analytics/server.ts', 'utf8')
  assert.match(server, /governedAnalyticsEnabled\('ga4'\)/)
  assert.match(server, /governedAnalyticsEnabled\('cloudflareWebAnalytics'\)/)
})

test('build and test commands retain both analytics gates', () => {
  const packageJson = JSON.parse(readFileSync('package.json', 'utf8'))
  assert.match(packageJson.scripts.prebuild, /assert-analytics-release-ready/)
  assert.match(packageJson.scripts.test, /check:analytics-permission/)
  assert.match(packageJson.scripts.test, /check:analytics-release/)
  assert.match(packageJson.scripts.build, /check:analytics-permission:output/)
})
