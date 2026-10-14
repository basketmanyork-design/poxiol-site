import assert from 'node:assert/strict'
import {spawnSync} from 'node:child_process'
import {readFileSync} from 'node:fs'
import path from 'node:path'
import test from 'node:test'
import {pathToFileURL} from 'node:url'
import {shouldEnableAnalytics, shouldEnableClarity} from '../lib/analytics/core.ts'
import {
  analyticsReleaseApproved,
  assertAnalyticsReleaseReady,
  governedAnalyticsEnabled,
  type AnalyticsReleaseRecord,
} from '../lib/privacy/analytics-release.ts'

const approvedMetadata = {
  schemaVersion: 1,
  status: 'APPROVED',
  approvedBy: 'POXIOL Owner',
  approvedAt: '2026-09-02T00:00:00.000Z',
}

test('approved governance record allows GA4 while Cloudflare Web Analytics remains disabled', () => {
  const record: AnalyticsReleaseRecord = {
    ...approvedMetadata,
    ga4: 'ENABLED',
    cloudflareWebAnalytics: 'DISABLED_PENDING_APPROVAL',
  }

  assert.equal(analyticsReleaseApproved(record), true)
  assert.equal(governedAnalyticsEnabled('ga4', record), true)
  assert.equal(governedAnalyticsEnabled('cloudflareWebAnalytics', record), false)
})

test('approved governance record allows Cloudflare Web Analytics while GA4 remains disabled', () => {
  const record: AnalyticsReleaseRecord = {
    ...approvedMetadata,
    ga4: 'DISABLED_PENDING_APPROVAL',
    cloudflareWebAnalytics: 'ENABLED',
  }

  assert.equal(governedAnalyticsEnabled('ga4', record), false)
  assert.equal(governedAnalyticsEnabled('cloudflareWebAnalytics', record), true)
})

test('approved governance record loads neither provider when both are disabled', () => {
  const record: AnalyticsReleaseRecord = {
    ...approvedMetadata,
    ga4: 'DISABLED_PENDING_APPROVAL',
    cloudflareWebAnalytics: 'DISABLED_PENDING_APPROVAL',
  }

  assert.equal(governedAnalyticsEnabled('ga4', record), false)
  assert.equal(governedAnalyticsEnabled('cloudflareWebAnalytics', record), false)
})

test('enabled GA4 remains blocked when Owner approval metadata is incomplete', () => {
  const record: AnalyticsReleaseRecord = {
    ...approvedMetadata,
    ga4: 'ENABLED',
    cloudflareWebAnalytics: 'DISABLED_PENDING_APPROVAL',
    approvedBy: null,
  }

  assert.equal(analyticsReleaseApproved(record), false)
  assert.equal(governedAnalyticsEnabled('ga4', record), false)
})

test('Preview and development never enable the Production GA loader even for an approved GA4 record', () => {
  const record: AnalyticsReleaseRecord = {
    ...approvedMetadata,
    ga4: 'ENABLED',
    cloudflareWebAnalytics: 'DISABLED_PENDING_APPROVAL',
  }
  assert.equal(governedAnalyticsEnabled('ga4', record), true)

  const base = {
    analyticsEnabled: true,
    ga4Enabled: true,
    measurementId: 'G-PRODUCTION123',
    contentSource: 'legacy',
    cloudflarePages: '1',
  }
  assert.equal(shouldEnableAnalytics({...base, nodeEnv: 'development', cloudflareBranch: 'main'}), false)
  assert.equal(shouldEnableAnalytics({...base, nodeEnv: 'production', cloudflareBranch: 'preview-branch'}), false)
})

test('Clarity requires a valid project ID, production deployment, and its own release approval', () => {
  const base = {
    analyticsEnabled: true,
    projectId: 'yxe6yo9s3s',
    nodeEnv: 'production',
    contentSource: 'sanity',
    cloudflarePages: '1',
    cloudflareBranch: 'main',
  }
  assert.equal(shouldEnableClarity(base), true)
  assert.equal(shouldEnableClarity({...base, projectId: 'invalid/id'}), false)
  assert.equal(shouldEnableClarity({...base, nodeEnv: 'development'}), false)
  assert.equal(shouldEnableClarity({...base, cloudflareBranch: 'preview'}), false)
  assert.equal(shouldEnableClarity({...base, analyticsEnabled: false}), false)
  const release = JSON.parse(readFileSync('content/privacy/analytics-release.json', 'utf8')) as AnalyticsReleaseRecord
  assert.equal(release.clarityProjectId, base.projectId)
  assert.equal(governedAnalyticsEnabled('clarity', release), true)
  assert.equal(governedAnalyticsEnabled('clarity', {
    ...release, clarityApprovedBy: null,
  }), false)
  assert.equal(governedAnalyticsEnabled('clarity', {
    ...release, clarity: 'ENABLED', clarityApprovedBy: 'POXIOL Owner', clarityApprovedAt: '2026-10-14T00:00:00.000Z',
  }), true)
  const provider = readFileSync('components/analytics/AnalyticsProvider.tsx', 'utf8')
  assert.match(provider, /permission === 'accepted' && Boolean\(config\.clarityProjectId\)/)
  assert.match(provider, /'consentv2', \{ad_Storage:'denied', analytics_Storage:'granted'\}/)
  assert.match(provider, /window\.location\.reload\(\)/)
  const privacyPolicy = readFileSync('app/privacy-policy/page.tsx', 'utf8')
  assert.match(privacyPolicy, /Microsoft Clarity to understand how visitors use our website through heatmaps and session recordings/)
})

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

test('every enabled provider requires an approved governance record with valid Owner metadata', () => {
  const record = JSON.parse(readFileSync('content/privacy/analytics-release.json', 'utf8')) as AnalyticsReleaseRecord
  const providers = ['ga4', 'clarity', 'cloudflareWebAnalytics'] as const

  for (const provider of providers) {
    assert.ok(
      record[provider] === 'ENABLED' || record[provider] === 'DISABLED_PENDING_APPROVAL',
      `${provider} has an unsupported release state`,
    )
    if (record[provider] !== 'ENABLED') {
      assert.equal(governedAnalyticsEnabled(provider, record), false)
      continue
    }

    assert.equal(record.status, 'APPROVED')
    assert.ok(record.approvedBy?.trim(), `${provider} requires approvedBy`)
    assert.ok(record.approvedAt?.trim(), `${provider} requires approvedAt`)
    assert.equal(Number.isNaN(Date.parse(record.approvedAt)), false)
    assert.equal(analyticsReleaseApproved(record), true)
    if (provider === 'clarity') {
      assert.ok(record.clarityApprovedBy?.trim())
      assert.ok(record.clarityApprovedAt?.trim())
    }
    assert.equal(governedAnalyticsEnabled(provider, record), true)
  }
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
