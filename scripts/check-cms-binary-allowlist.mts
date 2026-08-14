import {execFileSync} from 'child_process'
import {existsSync, readFileSync, readdirSync} from 'fs'
import {basename, extname, join, relative} from 'path'
import {fileURLToPath} from 'url'
import {canPublishProductionAsset} from '../lib/real-production/policy.ts'
import type {RealProductionAsset, RealProductionManifest} from '../lib/real-production/types.ts'

const ROOT = join(fileURLToPath(new URL('.', import.meta.url)), '..')
const MANIFEST_PATH = 'content/real-production/manifest/assets.json'
const PUBLIC_ROOT = 'public/real-production'
const PUBLIC_PREFIX = 'public/real-production/'
const PUBLIC_PATH_PREFIX = '/real-production/'
const ALLOWED_EXTENSION = '.webp'
const ALLOWED_STATUSES = new Set([
  'VERIFIED_POXIOL',
  'VERIFIED_BUYER_AUTHORIZED',
  'PRODUCT_ONLY_VERIFIED',
])

const normalizeRepoPath = (value: string): string => value.replaceAll('\\', '/').replace(/^\.\//, '')

const repoPathFromPublicPath = (publicPath: string): string => `public${publicPath}`

function listPublicProductionFiles(root: string): string[] {
  const directory = join(root, ...PUBLIC_ROOT.split('/'))
  if (!existsSync(directory)) return []

  const files: string[] = []
  const visit = (current: string) => {
    for (const entry of readdirSync(current, {withFileTypes: true})) {
      const fullPath = join(current, entry.name)
      if (entry.isDirectory()) visit(fullPath)
      if (entry.isFile() && entry.name !== '.gitkeep') {
        files.push(normalizeRepoPath(relative(root, fullPath)))
      }
    }
  }
  visit(directory)
  return files.sort()
}

export function getBinaryChanges(root: string, diffSpec = 'origin/main...HEAD'): string[] {
  const output = execFileSync(
    'git',
    ['diff', '--numstat', '--no-renames', diffSpec],
    {cwd: root, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe']},
  ).trim()

  if (!output) return []
  return Array.from(new Set(output.split(/\r?\n/).flatMap((line) => {
    const parts = line.split('\t')
    if (parts.length < 3 || (parts[0] !== '-' && parts[1] !== '-')) return []
    return [normalizeRepoPath(parts.slice(2).join('\t'))]
  }))).sort()
}

export function auditBinaryAllowlist(root: string, binaryPaths: string[]) {
  const changedBinaryPaths = Array.from(new Set(binaryPaths.map(normalizeRepoPath))).sort()
  if (changedBinaryPaths.length === 0) {
    return {passed: true, binaryChangeCount: 0, approvedBinaryChangeCount: 0, errors: [] as string[]}
  }

  const errors: string[] = []
  const manifestFile = join(root, ...MANIFEST_PATH.split('/'))
  let manifest: RealProductionManifest | null = null

  try {
    manifest = JSON.parse(readFileSync(manifestFile, 'utf8')) as RealProductionManifest
    if (!manifest || !Array.isArray(manifest.assets)) throw new Error('assets must be an array')
  } catch (error) {
    errors.push(`Manifest unavailable or invalid: ${MANIFEST_PATH}`)
  }

  const assets = manifest?.assets ?? []
  const assetsByPublicPath = new Map<string, RealProductionAsset[]>()
  const assetIds = new Set<string>()

  for (const asset of assets) {
    const publicPath = typeof asset.publicPath === 'string' ? asset.publicPath : ''
    const repoPath = normalizeRepoPath(repoPathFromPublicPath(publicPath))
    const records = assetsByPublicPath.get(repoPath) ?? []
    records.push(asset)
    assetsByPublicPath.set(repoPath, records)

    if (!asset.assetId || assetIds.has(asset.assetId)) errors.push(`Manifest assetId must be unique: ${asset.assetId || '(missing)'}`)
    assetIds.add(asset.assetId)
    if (!publicPath.startsWith(PUBLIC_PATH_PREFIX) || extname(publicPath) !== ALLOWED_EXTENSION) {
      errors.push(`Manifest publicPath is outside the approved WebP allowlist: ${publicPath || '(missing)'}`)
    }
    if (!asset.sourceId?.trim()) errors.push(`Manifest sourceId is missing for: ${publicPath || asset.assetId || '(unknown asset)'}`)
    if (asset.filename !== basename(publicPath)) errors.push(`Manifest filename/publicPath mismatch: ${publicPath || asset.assetId || '(unknown asset)'}`)
    if (!ALLOWED_STATUSES.has(asset.verificationStatus)) errors.push(`Disallowed verificationStatus for: ${publicPath || asset.assetId || '(unknown asset)'}`)
    if (!canPublishProductionAsset(asset)) errors.push(`canPublishProductionAsset() rejected: ${publicPath || asset.assetId || '(unknown asset)'}`)
  }

  for (const [repoPath, records] of assetsByPublicPath) {
    if (records.length !== 1) errors.push(`Manifest public asset path must map to exactly one record: ${repoPath}`)
  }

  const publicFiles = listPublicProductionFiles(root)
  for (const repoPath of publicFiles) {
    if (!repoPath.startsWith(PUBLIC_PREFIX) || extname(repoPath) !== ALLOWED_EXTENSION) {
      errors.push(`Unapproved file type in real-production directory: ${repoPath}`)
      continue
    }
    if ((assetsByPublicPath.get(repoPath) ?? []).length !== 1) {
      errors.push(`Public real-production WebP is not registered exactly once: ${repoPath}`)
    }
  }

  for (const repoPath of assetsByPublicPath.keys()) {
    if (!publicFiles.includes(repoPath)) errors.push(`Manifest public asset is missing from disk: ${repoPath}`)
  }

  let approvedBinaryChangeCount = 0
  for (const repoPath of changedBinaryPaths) {
    if (!repoPath.startsWith(PUBLIC_PREFIX)) {
      errors.push(`Binary change outside approved directory: ${repoPath}`)
      continue
    }
    if (extname(repoPath) !== ALLOWED_EXTENSION) {
      errors.push(`Binary extension is not approved: ${repoPath}`)
      continue
    }
    const records = assetsByPublicPath.get(repoPath) ?? []
    if (records.length !== 1) {
      errors.push(`Changed WebP is not registered exactly once: ${repoPath}`)
      continue
    }
    if (!existsSync(join(root, ...repoPath.split('/')))) {
      errors.push(`Changed WebP is missing from disk: ${repoPath}`)
      continue
    }
    if (!ALLOWED_STATUSES.has(records[0].verificationStatus) || !canPublishProductionAsset(records[0])) {
      errors.push(`Changed WebP is not publishable: ${repoPath}`)
      continue
    }
    approvedBinaryChangeCount++
  }

  const uniqueErrors = Array.from(new Set(errors)).sort()
  return {
    passed: uniqueErrors.length === 0 && approvedBinaryChangeCount === changedBinaryPaths.length,
    binaryChangeCount: changedBinaryPaths.length,
    approvedBinaryChangeCount,
    errors: uniqueErrors,
  }
}

function runCli() {
  const rootArgIndex = process.argv.indexOf('--root')
  const diffArgIndex = process.argv.indexOf('--diff')
  const root = rootArgIndex >= 0 ? process.argv[rootArgIndex + 1] : ROOT
  const diffSpec = diffArgIndex >= 0 ? process.argv[diffArgIndex + 1] : 'origin/main...HEAD'
  const result = auditBinaryAllowlist(root, getBinaryChanges(root, diffSpec))

  if (process.argv.includes('--json')) {
    process.stdout.write(JSON.stringify(result))
  } else if (result.passed) {
    console.log(`CMS binary allowlist passed (${result.approvedBinaryChangeCount}/${result.binaryChangeCount} approved binary changes)`)
  } else {
    console.error('CMS binary allowlist FAILED')
    result.errors.forEach((error) => console.error(`- ${error}`))
  }
  process.exitCode = result.passed ? 0 : 1
}

if (normalizeRepoPath(process.argv[1] || '') === normalizeRepoPath(fileURLToPath(import.meta.url))) runCli()
