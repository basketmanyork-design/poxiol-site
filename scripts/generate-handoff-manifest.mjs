import {createHash} from 'node:crypto'
import {execFileSync} from 'node:child_process'
import {readFile, writeFile} from 'node:fs/promises'
import path from 'node:path'
import {fileURLToPath} from 'node:url'

import {buildHandoffManifest} from '../lib/release/handoff-manifest.mjs'

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const targetPath = path.join(projectRoot, 'construction', 'handoff-manifest.json')
const artifactPaths = [
  'construction/acceptance-command-results.json',
  'construction/browser-acceptance.json',
  'construction/lighthouse-local.json',
  'construction/preview-readiness.json',
  'construction/release-manifest.json',
  'construction/rollback-manifest.json',
  'docs/operations/construction-c1-acceptance.md',
  'docs/operations/construction-c2-acceptance.md',
  'docs/operations/construction-c3-acceptance.md',
  'docs/operations/construction-c4-acceptance.md',
  'docs/operations/construction-c5-acceptance.md',
  'docs/operations/owner-gates.md',
  'docs/operations/release-checklist.md',
  'docs/operations/rollback.md',
]

function sha256(buffer) {
  return createHash('sha256').update(buffer).digest('hex')
}

async function createManifest() {
  // Bind the handoff to the newest commit that changed a handed-off artifact.
  // The manifest's own later commit must not create a self-referential hash loop.
  const commit = execFileSync('git', ['log', '-1', '--format=%H', '--', ...artifactPaths], {cwd: projectRoot, encoding: 'utf8'}).trim()
  const artifacts = []
  for (const relativePath of artifactPaths) {
    const contents = await readFile(path.join(projectRoot, relativePath))
    artifacts.push({path: relativePath, sha256: sha256(contents)})
  }
  return buildHandoffManifest({commit, artifacts})
}

const serialized = `${JSON.stringify(await createManifest(), null, 2)}\n`
if (process.argv.includes('--check')) {
  const current = await readFile(targetPath, 'utf8').catch(() => '')
  if (current !== serialized) {
    console.error('HANDOFF_MANIFEST_OUT_OF_DATE')
    process.exitCode = 1
  } else {
    console.log('HANDOFF_MANIFEST_OK')
  }
} else {
  await writeFile(targetPath, serialized)
  console.log('HANDOFF_MANIFEST_WRITTEN')
}
