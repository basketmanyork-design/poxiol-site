import assert from 'node:assert/strict'
import {execFileSync} from 'node:child_process'
import {existsSync, readFileSync} from 'node:fs'

const localOnlyFiles = [
  'content/real-production/manifest/source-inventory.json',
  'content/real-production/manifest/sample-groups.json',
  'content/real-production/manifest/manual-decisions.json',
  'scripts/ingest-real-production-rp001.mts',
]

const tracked = execFileSync('git', ['ls-files', '-z'], {encoding: 'utf8'})
  .split('\0')
  .filter(Boolean)

for (const file of localOnlyFiles) {
  assert.ok(!tracked.includes(file), `${file} is local-only and must not be tracked by Git`)
}

const textExtensions = /\.(?:json|md|mjs|mts|ts|tsx|js|jsx|css|txt|yml|yaml)$/i
const windowsAbsolutePath = /(?:^|["'`\s(])(?:[A-Za-z]:\\\\|[A-Za-z]:\\(?![A-Za-z]))/
const sourceArchiveFilename = /\b\d{4}\s*\(\d+\)(?:-[A-Z])?\.(?:jpe?g|png|webp|mp4|mov)\b/i
const isRealProductionPublicScope = (file: string) =>
  file.startsWith('content/real-production/') ||
  file.startsWith('lib/real-production/') ||
  /^scripts\/(?:check|scan|validate|generate)-real-production/.test(file) ||
  /^POXIOL_REAL_/.test(file)

for (const file of tracked.filter((entry) => textExtensions.test(entry) && isRealProductionPublicScope(entry))) {
  if (!existsSync(file)) continue
  const source = readFileSync(file, 'utf8')
  assert.doesNotMatch(source, windowsAbsolutePath, `${file} contains a machine-specific Windows absolute path`)
  assert.doesNotMatch(source, sourceArchiveFilename, `${file} contains a local source-archive filename`)
}

const manifest = JSON.parse(readFileSync('content/real-production/manifest/assets.json', 'utf8')) as {
  assets: Array<Record<string, unknown>>
}
assert.equal(manifest.assets.length, 9, 'The public manifest must contain only the 9 approved assets')
for (const asset of manifest.assets) {
  assert.match(String(asset.sourceId || ''), /^POXIOL-SOURCE-[A-Z0-9-]+$/, 'Every public asset requires an abstract sourceId')
  for (const privateField of ['originalPath', 'sourceFolder', 'originalFilename', 'derivativeOf']) {
    assert.ok(!(privateField in asset), `Public manifest must not contain ${privateField}`)
  }
}

console.log('Real Production public-safety checks passed')
