import {readFileSync} from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const schemaPath = path.join(root, 'studio', 'schemaTypes', 'singletons', 'analyticsSettings.ts')
const indexPath = path.join(root, 'studio', 'schemaTypes', 'index.ts')
const deskPath = path.join(root, 'studio', 'deskStructure.ts')

const schema = readFileSync(schemaPath, 'utf8')
const index = readFileSync(indexPath, 'utf8')
const desk = readFileSync(deskPath, 'utf8')

const requiredFields = [
  'analyticsEnabled',
  'ga4Enabled',
  'ga4MeasurementId',
  'googleTagManagerEnabled',
  'googleTagManagerContainerId',
  'consentModeEnabled',
  'debugMode',
  'searchConsoleProperty',
  'cloudflareAnalyticsEnabled',
  'defaultUtmSource',
  'defaultUtmMedium',
  'defaultUtmCampaign',
  'lastVerifiedAt',
]

for (const field of requiredFields) {
  if (!schema.includes(`name: '${field}'`)) {
    throw new Error(`analyticsSettings is missing ${field}`)
  }
}

if (!schema.includes('/^G-[A-Z0-9]+$/')) {
  throw new Error('GA4 Measurement ID validation is missing')
}

if (!schema.includes('/^GTM-[A-Z0-9]+$/')) {
  throw new Error('GTM Container ID validation is missing')
}

if (!index.includes("import {analyticsSettings} from './singletons/analyticsSettings'")) {
  throw new Error('analyticsSettings is not imported by schemaTypes/index.ts')
}

if (!index.match(/\banalyticsSettings,\s*\]/)) {
  throw new Error('analyticsSettings is not registered in schemaTypes')
}

for (const expected of [
  ".id('analyticsSettings')",
  ".id('analyticsSettingsEditor')",
  ".schemaType('analyticsSettings')",
  ".documentId('analyticsSettings')",
]) {
  if (!desk.includes(expected)) {
    throw new Error(`Studio desk singleton is missing ${expected}`)
  }
}

for (const forbidden of [
  'clientSecret',
  'serviceAccount',
  'privateKey',
  'apiToken',
  'cloudflareToken',
  'dnsToken',
]) {
  if (schema.toLowerCase().includes(forbidden.toLowerCase())) {
    throw new Error(`analyticsSettings must not contain secret field ${forbidden}`)
  }
}

console.log('analytics settings schema contract passed')
