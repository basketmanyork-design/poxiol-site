import {readFileSync} from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const tool = readFileSync(path.join(root, 'studio', 'components', 'AnalyticsOperationsTool.tsx'), 'utf8')
const config = readFileSync(path.join(root, 'studio', 'sanity.config.ts'), 'utf8')

for (const label of [
  'Analytics configuration',
  'Not configured',
  'Destination URL',
  'Source',
  'Medium',
  'Campaign',
  'Content',
  'Term',
  'Generated URL',
  'Copy',
]) {
  if (!tool.includes(label)) throw new Error(`Analytics operations tool is missing ${label}`)
}

for (const preset of ['reddit', 'linkedin', 'facebook', 'instagram', 'youtube', 'tiktok', 'alibaba', 'outreach-email', 'whatsapp-outreach']) {
  if (!tool.includes(`'${preset}'`)) throw new Error(`UTM builder is missing ${preset}`)
}

if (!config.includes("name: 'analytics-operations'")) throw new Error('Analytics operations Studio tool is not registered')
if (!config.includes('AnalyticsOperationsTool')) throw new Error('Analytics operations component is not wired')

console.log('analytics Studio tool contract passed')
