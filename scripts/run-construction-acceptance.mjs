import {spawnSync} from 'node:child_process'
import {existsSync, readFileSync, writeFileSync} from 'node:fs'
import {resolve} from 'node:path'

import {buildCommandRecord, mergeCommandRecords} from '../lib/release/acceptance-results.mjs'

const phases = {
  source: [
    'git status --short',
    'git diff --check',
    'npm test',
    'npm run check:real-production',
    'npm run check:product-visualization',
    'npm run check:conversion-ctas',
    'npm run check:analytics-release',
    'npm run check:construction-release',
    'npm run check:preview-readiness',
  ],
  build: ['npm run build:prelaunch'],
  postbuild: [
    'npm run check:canonical',
    'npm run check:cms-redirects',
    'node scripts/check-sitemap-output.mjs',
    'node scripts/generate-route-release.mjs --check',
    'node scripts/assert-preview-readiness.mjs --check',
  ],
}
const expectedCommands = Object.values(phases).flat().sort((a, b) => a.localeCompare(b, 'en'))
const phase = process.argv[2]
if (!phases[phase]) throw new Error(`UNKNOWN_ACCEPTANCE_PHASE:${String(phase)}`)

const target = resolve('construction/acceptance-command-results.json')
const current = existsSync(target)
  ? JSON.parse(readFileSync(target, 'utf8')).commands || []
  : []
const incoming = []
let failed = false

for (const command of phases[phase]) {
  console.log(`[acceptance:${phase}] running ${command}`)
  const started = performance.now()
  const result = spawnSync(command, {
    cwd: resolve('.'),
    encoding: 'utf8',
    env: process.env,
    maxBuffer: 64 * 1024 * 1024,
    shell: true,
  })
  const durationMs = Math.round(performance.now() - started)
  const output = `${result.stdout || ''}${result.stderr || ''}`
  const exitCode = result.status ?? 1
  incoming.push(buildCommandRecord({command, durationMs, exitCode, output}))
  console.log(`[acceptance:${phase}] exit=${exitCode} durationMs=${durationMs}`)
  if (exitCode !== 0) {
    failed = true
    console.error(output.slice(-4000))
    break
  }
}

const commands = mergeCommandRecords(current, incoming)
const complete = expectedCommands.every((command) => commands.some((record) => record.command === command))
const pass = complete && commands.every((record) => record.exitCode === 0)
const record = {
  schemaVersion: 1,
  status: pass ? 'PASS' : 'IN_PROGRESS',
  productionAuthorized: false,
  deploymentPerformed: false,
  cmsWrites: 0,
  realFormSubmissions: 0,
  commands,
}
writeFileSync(target, `${JSON.stringify(record, null, 2)}\n`)

if (failed) process.exitCode = 1
else console.log(`[acceptance:${phase}] recorded ${incoming.length} commands; aggregate=${record.status}`)
