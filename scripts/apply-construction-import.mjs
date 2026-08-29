import { createHash } from 'node:crypto'
import {
  copyFileSync,
  existsSync,
  lstatSync,
  mkdirSync,
  readFileSync,
  realpathSync,
  statSync,
} from 'node:fs'
import path from 'node:path'

import { validateImportEntry } from '../lib/construction/import-policy.mjs'
import { verifyImportedFiles } from '../lib/construction/import-result.mjs'

function argumentValue(name) {
  const index = process.argv.indexOf(name)
  return index === -1 ? undefined : process.argv[index + 1]
}

function assertInsideRoot(root, target, errorCode, entryPath) {
  const relative = path.relative(root, target)
  if (
    relative === '' ||
    relative.startsWith('..') ||
    path.isAbsolute(relative)
  ) {
    throw new Error(`${errorCode}:${entryPath}`)
  }
}

function sha256File(filePath) {
  return createHash('sha256').update(readFileSync(filePath)).digest('hex')
}

const workspaceRoot = path.resolve(process.cwd(), '..', '..')
const candidateRoot = realpathSync(
  path.resolve(
    argumentValue('--candidate-root') ??
      process.env.POXIOL_CANDIDATE_ROOT ??
      path.join(
        workspaceRoot,
        '.worktrees',
        'poxiol-site-build',
        '.analysis_tmp',
        'cloudflare-hybrid-integration-20260828',
      ),
  ),
)
const destinationRoot = realpathSync(process.cwd())
const manifestPath = path.resolve(
  argumentValue('--manifest') ?? 'construction/candidate-import.json',
)
const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'))

const plannedCopies = manifest.map((entry) => {
  validateImportEntry(entry)

  const sourcePath = realpathSync(path.resolve(candidateRoot, entry.path))
  assertInsideRoot(
    candidateRoot,
    sourcePath,
    'IMPORT_SOURCE_ESCAPES_ROOT',
    entry.path,
  )
  if (!statSync(sourcePath).isFile()) {
    throw new Error(`IMPORT_SOURCE_NOT_FILE:${entry.path}`)
  }

  const destinationPath = path.resolve(destinationRoot, entry.path)
  assertInsideRoot(
    destinationRoot,
    destinationPath,
    'IMPORT_DESTINATION_ESCAPES_ROOT',
    entry.path,
  )
  if (existsSync(destinationPath) && lstatSync(destinationPath).isSymbolicLink()) {
    throw new Error(`IMPORT_DESTINATION_IS_SYMLINK:${entry.path}`)
  }

  const actualSha256 = sha256File(sourcePath)
  if (actualSha256 !== entry.sha256) {
    throw new Error(`CANDIDATE_HASH_MISMATCH:${entry.path}`)
  }
  if (statSync(sourcePath).size !== entry.bytes) {
    throw new Error(`CANDIDATE_SIZE_MISMATCH:${entry.path}`)
  }

  return { ...entry, sourcePath, destinationPath }
})

if (!process.argv.includes('--check')) {
  for (const { sourcePath, destinationPath } of plannedCopies) {
    mkdirSync(path.dirname(destinationPath), { recursive: true })
    copyFileSync(sourcePath, destinationPath)
  }
}

verifyImportedFiles(manifest, (entryPath) =>
  sha256File(path.resolve(destinationRoot, entryPath)),
)

console.log(
  `construction import verified (${manifest.length} files${
    process.argv.includes('--check') ? ', check only' : ''
  })`,
)
