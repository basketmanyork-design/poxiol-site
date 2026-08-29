import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import path from 'node:path'

import { buildCandidateImport } from '../lib/construction/import-manifest.mjs'

const batchNames = Array.from(
  { length: 8 },
  (_, index) => `CF-HYBRID-${String(index + 2).padStart(2, '0')}`,
)

function argumentValue(name) {
  const index = process.argv.indexOf(name)
  return index === -1 ? undefined : process.argv[index + 1]
}

const workspaceRoot = path.resolve(process.cwd(), '..', '..')
const candidateRoot = path.resolve(
  argumentValue('--candidate-root') ??
    process.env.POXIOL_CANDIDATE_ROOT ??
    path.join(
      workspaceRoot,
      '.worktrees',
      'poxiol-site-build',
      '.analysis_tmp',
      'cloudflare-hybrid-integration-20260828',
    ),
)
const handoffRoot = path.resolve(
  argumentValue('--handoff-root') ??
    process.env.POXIOL_HANDOFF_ROOT ??
    path.join(
      workspaceRoot,
      'outputs',
      '01a03c6f-0f49-7cb2-83dd-b0df7ffd32a1',
      'cta_audit_20260828',
    ),
)
const outputPath = path.resolve(
  argumentValue('--output') ?? 'construction/candidate-import.json',
)

const batches = batchNames.map((batch) => {
  const manifestPath = path.join(handoffRoot, batch, 'manifest.json')
  return {
    batch,
    manifest: JSON.parse(readFileSync(manifestPath, 'utf8')),
  }
})

const candidateImport = buildCandidateImport({ candidateRoot, batches }).map(
  ({ path: entryPath, sha256, bytes }) => ({
    path: entryPath,
    sha256,
    bytes,
  }),
)
const serialized = `${JSON.stringify(candidateImport, null, 2)}\n`

if (process.argv.includes('--check') && existsSync(outputPath)) {
  const existing = readFileSync(outputPath, 'utf8')
  if (existing !== serialized) {
    throw new Error('CANDIDATE_IMPORT_MANIFEST_CHANGED')
  }
} else {
  writeFileSync(outputPath, serialized)
}

console.log(
  `candidate import manifest verified (${candidateImport.length} files)`,
)
