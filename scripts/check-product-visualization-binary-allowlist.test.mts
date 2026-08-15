import {mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync} from 'fs'
import {tmpdir} from 'os'
import {dirname, join} from 'path'
import {fileURLToPath} from 'url'
import {auditBinaryAllowlist} from './check-cms-binary-allowlist.mts'

const ROOT = join(fileURLToPath(new URL('.', import.meta.url)), '..')
const sourceManifest = JSON.parse(readFileSync(join(ROOT, 'content', 'product-visualization', 'assets.json'), 'utf8'))

function invariant(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message)
}

function writeBinary(root: string, repoPath: string) {
  const target = join(root, ...repoPath.split('/'))
  mkdirSync(dirname(target), {recursive: true})
  writeFileSync(target, Buffer.from([0, 1, 2, 3]))
}

function fixture(update?: (manifest: typeof sourceManifest) => void) {
  const root = mkdtempSync(join(tmpdir(), 'poxiol-product-visualization-'))
  const manifest = structuredClone(sourceManifest)
  update?.(manifest)
  const manifestPath = join(root, 'content', 'product-visualization', 'assets.json')
  mkdirSync(dirname(manifestPath), {recursive: true})
  writeFileSync(manifestPath, JSON.stringify(manifest))
  for (const asset of sourceManifest) writeBinary(root, `public/product-visualization/${asset.publicFile}`)
  return {root, paths: sourceManifest.map((asset: {publicFile: string}) => `public/product-visualization/${asset.publicFile}`)}
}

function runCase(name: string, execute: (root: string, paths: string[]) => void, update?: (manifest: typeof sourceManifest) => void) {
  const {root, paths} = fixture(update)
  try {
    execute(root, paths)
    console.log(`PASS ${name}`)
  } finally {
    rmSync(root, {recursive: true, force: true})
  }
}

runCase('14 approved product visualizations', (root, paths) => {
  const result = auditBinaryAllowlist(root, paths)
  invariant(result.passed && result.approvedBinaryChangeCount === 14, JSON.stringify(result.errors))
})

runCase('unregistered fifteenth WebP fails', (root, paths) => {
  const extra = 'public/product-visualization/unregistered.webp'
  writeBinary(root, extra)
  invariant(!auditBinaryAllowlist(root, [...paths, extra]).passed, 'Unregistered visualization was accepted')
})

runCase('wrong classification fails', (root, paths) => {
  invariant(!auditBinaryAllowlist(root, paths).passed, 'Wrong visualization classification was accepted')
}, (manifest) => { manifest[0].classification = 'VERIFIED_POXIOL' })

runCase('missing manifest record fails', (root, paths) => {
  invariant(!auditBinaryAllowlist(root, paths).passed, 'Missing visualization record was accepted')
}, (manifest) => { manifest.pop() })

runCase('other directory binary fails', (root) => {
  const extra = 'public/images/unapproved.png'
  writeBinary(root, extra)
  invariant(!auditBinaryAllowlist(root, [extra]).passed, 'Binary outside approved directories was accepted')
})

runCase('non-WebP visualization fails', (root, paths) => {
  const extra = 'public/product-visualization/unapproved.png'
  writeBinary(root, extra)
  invariant(!auditBinaryAllowlist(root, [...paths, extra]).passed, 'Unapproved visualization extension was accepted')
})

console.log('POXIOL product visualization binary allowlist checks passed')
