import {execFileSync} from 'child_process'
import {existsSync, readFileSync, readdirSync} from 'fs'
import {basename, extname, join, relative} from 'path'
import {fileURLToPath} from 'url'
import {canPublishProductionAsset} from '../lib/real-production/policy.ts'
import type {RealProductionAsset, RealProductionManifest} from '../lib/real-production/types.ts'

const ROOT = join(fileURLToPath(new URL('.', import.meta.url)), '..')
const REAL_MANIFEST_PATH = 'content/real-production/manifest/assets.json'
const REAL_PUBLIC_ROOT = 'public/real-production'
const REAL_PUBLIC_PREFIX = 'public/real-production/'
const REAL_PUBLIC_PATH_PREFIX = '/real-production/'
const VISUAL_MANIFEST_PATH = 'content/product-visualization/assets.json'
const VISUAL_PUBLIC_ROOT = 'public/product-visualization'
const VISUAL_PUBLIC_PREFIX = 'public/product-visualization/'
const ALLOWED_EXTENSION = '.webp'
const ALLOWED_STATUSES = new Set([
  'VERIFIED_POXIOL',
  'VERIFIED_BUYER_AUTHORIZED',
  'PRODUCT_ONLY_VERIFIED',
])
const REQUIRED_VISUAL_PROHIBITIONS = [
  'real production proof',
  'real factory proof',
  'real QC proof',
  'real customer project proof',
]

type ProductVisualizationRecord = {
  assetId: string
  publicFile: string
  packagePath: string
  classification: string
  generatedByAI: boolean
  thirdPartyLogoAudit: string
  prohibitedUse: string[]
  recommendedPages: string[]
  alt: string
  caption: string
}

const normalizeRepoPath = (value: string): string => value.replaceAll('\\', '/').replace(/^\.\//, '')
const repoPathFromPublicPath = (publicPath: string): string => `public${publicPath}`

function listPublicFiles(root: string, publicRoot: string): string[] {
  const directory = join(root, ...publicRoot.split('/'))
  if (!existsSync(directory)) return []

  const files: string[] = []
  const visit = (current: string) => {
    for (const entry of readdirSync(current, {withFileTypes: true})) {
      const fullPath = join(current, entry.name)
      if (entry.isDirectory()) visit(fullPath)
      if (entry.isFile() && entry.name !== '.gitkeep') files.push(normalizeRepoPath(relative(root, fullPath)))
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

function auditRealProduction(root: string, changedPaths: string[]) {
  if (!changedPaths.length) return {approved: 0, errors: [] as string[]}
  const errors: string[] = []
  const manifestFile = join(root, ...REAL_MANIFEST_PATH.split('/'))
  let manifest: RealProductionManifest | null = null

  try {
    manifest = JSON.parse(readFileSync(manifestFile, 'utf8')) as RealProductionManifest
    if (!manifest || !Array.isArray(manifest.assets)) throw new Error('assets must be an array')
  } catch {
    errors.push(`Manifest unavailable or invalid: ${REAL_MANIFEST_PATH}`)
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
    if (!publicPath.startsWith(REAL_PUBLIC_PATH_PREFIX) || extname(publicPath) !== ALLOWED_EXTENSION) errors.push(`Manifest publicPath is outside the approved WebP allowlist: ${publicPath || '(missing)'}`)
    if (!asset.sourceId?.trim()) errors.push(`Manifest sourceId is missing for: ${publicPath || asset.assetId || '(unknown asset)'}`)
    if (asset.filename !== basename(publicPath)) errors.push(`Manifest filename/publicPath mismatch: ${publicPath || asset.assetId || '(unknown asset)'}`)
    if (!ALLOWED_STATUSES.has(asset.verificationStatus)) errors.push(`Disallowed verificationStatus for: ${publicPath || asset.assetId || '(unknown asset)'}`)
    if (!canPublishProductionAsset(asset)) errors.push(`canPublishProductionAsset() rejected: ${publicPath || asset.assetId || '(unknown asset)'}`)
  }

  for (const [repoPath, records] of assetsByPublicPath) {
    if (records.length !== 1) errors.push(`Manifest public asset path must map to exactly one record: ${repoPath}`)
  }

  const publicFiles = listPublicFiles(root, REAL_PUBLIC_ROOT)
  for (const repoPath of publicFiles) {
    if (!repoPath.startsWith(REAL_PUBLIC_PREFIX) || extname(repoPath) !== ALLOWED_EXTENSION) {
      errors.push(`Unapproved file type in real-production directory: ${repoPath}`)
    } else if ((assetsByPublicPath.get(repoPath) ?? []).length !== 1) {
      errors.push(`Public real-production WebP is not registered exactly once: ${repoPath}`)
    }
  }
  for (const repoPath of assetsByPublicPath.keys()) {
    if (!publicFiles.includes(repoPath)) errors.push(`Manifest public asset is missing from disk: ${repoPath}`)
  }

  let approved = 0
  for (const repoPath of changedPaths) {
    if (extname(repoPath) !== ALLOWED_EXTENSION) {
      errors.push(`Binary extension is not approved: ${repoPath}`)
      continue
    }
    const records = assetsByPublicPath.get(repoPath) ?? []
    if (records.length !== 1) errors.push(`Changed WebP is not registered exactly once: ${repoPath}`)
    else if (!existsSync(join(root, ...repoPath.split('/')))) errors.push(`Changed WebP is missing from disk: ${repoPath}`)
    else if (!ALLOWED_STATUSES.has(records[0].verificationStatus) || !canPublishProductionAsset(records[0])) errors.push(`Changed WebP is not publishable: ${repoPath}`)
    else approved++
  }
  return {approved, errors}
}

function auditProductVisualizations(root: string, changedPaths: string[]) {
  if (!changedPaths.length) return {approved: 0, errors: [] as string[]}
  const errors: string[] = []
  const manifestFile = join(root, ...VISUAL_MANIFEST_PATH.split('/'))
  let assets: ProductVisualizationRecord[] = []

  try {
    const parsed = JSON.parse(readFileSync(manifestFile, 'utf8')) as unknown
    if (!Array.isArray(parsed)) throw new Error('manifest must be an array')
    assets = parsed as ProductVisualizationRecord[]
  } catch {
    errors.push(`Manifest unavailable or invalid: ${VISUAL_MANIFEST_PATH}`)
  }

  const assetsByRepoPath = new Map<string, ProductVisualizationRecord[]>()
  const assetIds = new Set<string>()
  for (const asset of assets) {
    const repoPath = `${VISUAL_PUBLIC_PREFIX}${asset.publicFile || ''}`
    const records = assetsByRepoPath.get(repoPath) ?? []
    records.push(asset)
    assetsByRepoPath.set(repoPath, records)

    if (!asset.assetId || assetIds.has(asset.assetId)) errors.push(`Visualization assetId must be unique: ${asset.assetId || '(missing)'}`)
    assetIds.add(asset.assetId)
    if (asset.classification !== 'PRODUCT_VISUALIZATION') errors.push(`Visualization classification is invalid: ${asset.assetId || '(missing)'}`)
    if (asset.generatedByAI !== true) errors.push(`Visualization generation record is invalid: ${asset.assetId || '(missing)'}`)
    if (asset.thirdPartyLogoAudit !== 'PASS_MANUAL_VISUAL_REVIEW') errors.push(`Visualization logo audit is invalid: ${asset.assetId || '(missing)'}`)
    if (!asset.publicFile || extname(asset.publicFile) !== ALLOWED_EXTENSION || basename(asset.publicFile) !== asset.publicFile) errors.push(`Visualization publicFile is invalid: ${asset.publicFile || '(missing)'}`)
    if (!asset.packagePath?.endsWith(`/${asset.publicFile}`)) errors.push(`Visualization packagePath/publicFile mismatch: ${asset.assetId || '(missing)'}`)
    if (!asset.alt?.trim() || !asset.caption?.trim() || !asset.recommendedPages?.length) errors.push(`Visualization metadata is incomplete: ${asset.assetId || '(missing)'}`)
    if (!Array.isArray(asset.prohibitedUse) || REQUIRED_VISUAL_PROHIBITIONS.some((label) => !asset.prohibitedUse.includes(label))) errors.push(`Visualization proof prohibitions are incomplete: ${asset.assetId || '(missing)'}`)
  }

  for (const [repoPath, records] of assetsByRepoPath) {
    if (records.length !== 1) errors.push(`Visualization public asset path must map to exactly one record: ${repoPath}`)
  }

  const publicFiles = listPublicFiles(root, VISUAL_PUBLIC_ROOT)
  for (const repoPath of publicFiles) {
    if (!repoPath.startsWith(VISUAL_PUBLIC_PREFIX) || extname(repoPath) !== ALLOWED_EXTENSION) errors.push(`Unapproved file type in product-visualization directory: ${repoPath}`)
    else if ((assetsByRepoPath.get(repoPath) ?? []).length !== 1) errors.push(`Public product visualization is not registered exactly once: ${repoPath}`)
  }
  for (const repoPath of assetsByRepoPath.keys()) {
    if (!publicFiles.includes(repoPath)) errors.push(`Visualization manifest asset is missing from disk: ${repoPath}`)
  }

  let approved = 0
  for (const repoPath of changedPaths) {
    if (extname(repoPath) !== ALLOWED_EXTENSION) errors.push(`Binary extension is not approved: ${repoPath}`)
    else if ((assetsByRepoPath.get(repoPath) ?? []).length !== 1) errors.push(`Changed product visualization is not registered exactly once: ${repoPath}`)
    else if (!existsSync(join(root, ...repoPath.split('/')))) errors.push(`Changed product visualization is missing from disk: ${repoPath}`)
    else approved++
  }
  return {approved, errors}
}

export function auditBinaryAllowlist(root: string, binaryPaths: string[]) {
  const changedBinaryPaths = Array.from(new Set(binaryPaths.map(normalizeRepoPath))).sort()
  if (!changedBinaryPaths.length) return {passed: true, binaryChangeCount: 0, approvedBinaryChangeCount: 0, errors: [] as string[]}

  const realPaths = changedBinaryPaths.filter((path) => path.startsWith(REAL_PUBLIC_PREFIX))
  const visualPaths = changedBinaryPaths.filter((path) => path.startsWith(VISUAL_PUBLIC_PREFIX))
  const outsidePaths = changedBinaryPaths.filter((path) => !path.startsWith(REAL_PUBLIC_PREFIX) && !path.startsWith(VISUAL_PUBLIC_PREFIX))
  const real = auditRealProduction(root, realPaths)
  const visual = auditProductVisualizations(root, visualPaths)
  const errors = [
    ...outsidePaths.map((path) => `Binary change outside approved directories: ${path}`),
    ...real.errors,
    ...visual.errors,
  ]
  const uniqueErrors = Array.from(new Set(errors)).sort()
  const approvedBinaryChangeCount = real.approved + visual.approved
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

  if (process.argv.includes('--json')) process.stdout.write(JSON.stringify(result))
  else if (result.passed) console.log(`CMS binary allowlist passed (${result.approvedBinaryChangeCount}/${result.binaryChangeCount} approved binary changes)`)
  else {
    console.error('CMS binary allowlist FAILED')
    result.errors.forEach((error) => console.error(`- ${error}`))
  }
  process.exitCode = result.passed ? 0 : 1
}

if (normalizeRepoPath(process.argv[1] || '') === normalizeRepoPath(fileURLToPath(import.meta.url))) runCli()
