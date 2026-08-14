import {readFileSync, writeFileSync} from 'node:fs'
import {approvalSummary} from './validate-real-production-assets.mts'
import type {RealProductionManifest} from '../lib/real-production/types.ts'

const manifest = JSON.parse(readFileSync('content/real-production/manifest/assets.json', 'utf8')) as RealProductionManifest
writeFileSync('content/real-production/manifest/approval-summary.md', approvalSummary(manifest), 'utf8')
console.log('Wrote content/real-production/manifest/approval-summary.md')
