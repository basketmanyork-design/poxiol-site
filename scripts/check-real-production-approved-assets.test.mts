import assert from 'node:assert/strict'
import {existsSync, readFileSync} from 'node:fs'
import type {RealProductionManifest} from '../lib/real-production/types.ts'
import {canPublishProductionAsset} from '../lib/real-production/policy.ts'

const manifest = JSON.parse(readFileSync('content/real-production/manifest/assets.json', 'utf8')) as RealProductionManifest
const rp001 = manifest.assets.filter((asset) => asset.sampleId === 'POXIOL-RP-001')

assert.ok(rp001.length >= 5, 'POXIOL-RP-001 must include the approved front, back, shorts and full-set photographs')
assert.deepEqual(new Set(rp001.map((asset) => asset.verificationStatus)), new Set(['VERIFIED_POXIOL']))
assert.ok(rp001.every(canPublishProductionAsset), 'Every POXIOL-RP-001 asset in the manifest must pass the publication gate')
assert.ok(rp001.every((asset) => !asset.peopleVisible && !asset.thirdPartyLogoVisible && !asset.customerArtworkVisible && !asset.privateInformationVisible))
assert.ok(rp001.every((asset) => asset.sourceId.startsWith('POXIOL-SOURCE-RP001-')))
assert.ok(rp001.every((asset) => !('originalPath' in asset) && !('sourceFolder' in asset) && !('originalFilename' in asset) && !('derivativeOf' in asset)))
assert.ok(rp001.every((asset) => existsSync(`public${asset.publicPath}`)), 'Every approved asset must have a generated public file')
assert.ok(rp001.some((asset) => asset.category === 'front'))
assert.ok(rp001.some((asset) => asset.category === 'back'))
assert.ok(rp001.some((asset) => asset.category === 'shorts-front'))
assert.ok(rp001.some((asset) => asset.category === 'shorts-back'))
assert.ok(rp001.some((asset) => asset.category === 'full-set'))
assert.ok(rp001.some((asset) => asset.intendedPages.includes('home')))
assert.ok(rp001.every((asset) => asset.intendedPages.includes('basketball')))

console.log('Approved POXIOL-RP-001 asset checks passed')
