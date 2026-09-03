import {existsSync, readFileSync, readdirSync, statSync, writeFileSync} from 'node:fs'
import {relative, resolve, sep} from 'node:path'

import {
  assertConstructionOutputMatchesRouteRelease,
  buildReleaseManifest,
  releaseManifestTextMatches,
  sha256ReleaseFile,
} from '../lib/release/release-manifest.mjs'

const root = resolve('.')
const target = 'construction/release-manifest.json'
const sourcePaths = [
  'construction/baseline-semantic-import.json',
  'construction/candidate-import.json',
  'construction/public-sitemap-baseline.txt',
  'construction/route-release.json',
  'construction/sanity-read-audit.json',
  'construction/source-baseline.json',
  'content/legal/approval.json',
  'content/privacy/analytics-release.json',
  'content/release/asset-allowlist.json',
  'content/release/gone.json',
  'content/release/public-sections.json',
  'docs/operations/construction-c1-acceptance.md',
  'docs/operations/construction-c2-acceptance.md',
  'docs/operations/construction-c3-acceptance.md',
  'docs/operations/construction-c4-acceptance.md',
  'docs/operations/content-publishing.md',
  'docs/operations/inquiries.md',
  'docs/operations/seo.md',
  'public/_redirects',
]
const commits = [
  'fe95f8676f3dad38f51542efeb106d328a2ade15',
  'd35ba81587ae411a7f920fa2ba50e918ca340b31',
  'ee7c429811e313e01502a0e760a4edde27486d49',
  '38ae154017e7efa0a7d3eb83cb50fed6df1a0b58',
]

function sha256(path) {
  return sha256ReleaseFile(path, readFileSync(resolve(root, path)))
}

function listFiles(directory) {
  const absolute = resolve(root, directory)
  if (!existsSync(absolute)) throw new Error(`MISSING_RELEASE_DIRECTORY:${directory}`)
  const files = []
  const visit = (current) => {
    for (const name of readdirSync(current).sort((a, b) => a.localeCompare(b, 'en'))) {
      const child = resolve(current, name)
      if (statSync(child).isDirectory()) visit(child)
      else files.push(relative(root, child).split(sep).join('/'))
    }
  }
  visit(absolute)
  return files
}

function entries(paths) {
  return paths.map((path) => {
    if (!existsSync(resolve(root, path))) throw new Error(`MISSING_RELEASE_FILE:${path}`)
    return {path, sha256: sha256(path)}
  })
}

const outputPaths = listFiles('out')
const routeManifest = JSON.parse(readFileSync(resolve(root, 'construction/route-release.json'), 'utf8'))
const candidateSitemap = readFileSync(resolve(root, 'out/sitemap.xml'), 'utf8')
const renderedCount = outputPaths.filter((path) => (
  (path === 'out/index.html' || path.endsWith('/index.html'))
  && !path.startsWith('out/_next/')
)).length
assertConstructionOutputMatchesRouteRelease({routeManifest, candidateSitemap, renderedCount})

const manifest = buildReleaseManifest({
  commits,
  sourceFiles: entries(sourcePaths),
  outputFiles: entries(outputPaths),
  gates: {c1: true, c2: true, c3: true, c4: true},
})
const serialized = `${JSON.stringify(manifest, null, 2)}\n`

if (process.argv.includes('--check')) {
  if (!existsSync(resolve(root, target))) throw new Error('CONSTRUCTION_RELEASE_MANIFEST_MISSING')
  const current = readFileSync(resolve(root, target), 'utf8')
  if (!releaseManifestTextMatches(current, serialized)) throw new Error('CONSTRUCTION_RELEASE_MANIFEST_STALE')
  console.log('[construction-release] manifest is deterministic and current')
} else {
  writeFileSync(resolve(root, target), serialized)
  console.log(`[construction-release] wrote ${target} with ${manifest.sourceFiles.length} source and ${manifest.outputFiles.length} output hashes`)
}
