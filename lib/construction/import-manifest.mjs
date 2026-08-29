import { createHash } from 'node:crypto'
import {
  existsSync,
  readFileSync,
  realpathSync,
  statSync,
} from 'node:fs'
import path from 'node:path'

import { validateImportEntry } from './import-policy.mjs'

function entriesForBatch(batch, manifest) {
  if (/^CF-HYBRID-0[2-6]$/.test(batch)) {
    return (manifest.changed ?? []).map((entry) => ({
      path: entry.file,
      sha256: entry.after,
      bytes: undefined,
    }))
  }

  if (batch === 'CF-HYBRID-07') {
    const hasMutation = Object.values(manifest.mutations ?? {}).some(
      (count) => count !== 0,
    )
    if (hasMutation) {
      throw new Error('UNDECLARED_CF_HYBRID_07_MUTATION')
    }
    return []
  }

  if (batch === 'CF-HYBRID-08') {
    return manifest.candidateFiles ?? []
  }

  if (batch === 'CF-HYBRID-09') {
    return manifest.sourceEvidence ?? []
  }

  throw new Error(`UNSUPPORTED_CANDIDATE_BATCH:${batch}`)
}

function isInsideRoot(root, target) {
  const relative = path.relative(root, target)
  return relative !== '' && !relative.startsWith('..') && !path.isAbsolute(relative)
}

function sha256File(filePath) {
  return createHash('sha256').update(readFileSync(filePath)).digest('hex')
}

export function extractScriptFileReferences(packageJson) {
  const references = new Set()
  const pattern = /\bscripts\/[A-Za-z0-9_./-]+\.(?:mjs|mts|js|ts)\b/g

  for (const command of Object.values(packageJson.scripts ?? {})) {
    for (const match of command.matchAll(pattern)) {
      references.add(match[0])
    }
  }

  return [...references].sort((left, right) =>
    left.localeCompare(right, 'en'),
  )
}

const sourceDependencyExtensions = [
  '.mjs',
  '.mts',
  '.js',
  '.ts',
  '.tsx',
  '.jsx',
  '.json',
  '.css',
  '.md',
]

function resolveRelativeDependency(root, importerPath, specifier) {
  const unresolved = specifier.startsWith('@/')
    ? path.resolve(root, specifier.slice(2))
    : path.resolve(root, path.dirname(importerPath), specifier)
  const candidates = path.extname(unresolved)
    ? [unresolved]
    : [
        ...sourceDependencyExtensions.map(
          (extension) => `${unresolved}${extension}`,
        ),
        ...sourceDependencyExtensions.map((extension) =>
          path.join(unresolved, `index${extension}`),
        ),
      ]
  const resolved = candidates.find(
    (candidate) =>
      existsSync(candidate) && statSync(candidate).isFile(),
  )
  if (!resolved || !isInsideRoot(root, resolved)) {
    throw new Error(
      `RELATIVE_SOURCE_DEPENDENCY_MISSING:${importerPath}:${specifier}`,
    )
  }
  if (!sourceDependencyExtensions.includes(path.extname(resolved))) {
    throw new Error(`UNREVIEWED_BINARY_DEPENDENCY:${importerPath}:${specifier}`)
  }
  return path.relative(root, resolved).replaceAll('\\', '/')
}

export function expandRelativeSourceDependencies({
  candidateRoot,
  entryPaths,
}) {
  const root = realpathSync(candidateRoot)
  const discovered = new Set()
  const queue = [...entryPaths]
  const staticImport =
    /(?:import|export)\s+(?:[^'"\n]*?\s+from\s+)?['"]([^'"]+)['"]/g
  const dynamicImport = /import\(\s*['"]([^'"]+)['"]\s*\)/g

  while (queue.length) {
    const entryPath = queue.shift()
    if (discovered.has(entryPath)) {
      continue
    }

    validateImportEntry({
      path: entryPath,
      sha256: '0'.repeat(64),
      bytes: 0,
    })
    const absolutePath = path.resolve(root, entryPath)
    if (
      !isInsideRoot(root, absolutePath) ||
      !existsSync(absolutePath) ||
      !statSync(absolutePath).isFile()
    ) {
      throw new Error(`REQUIRED_SOURCE_ENTRY_MISSING:${entryPath}`)
    }

    discovered.add(entryPath)
    const source = readFileSync(absolutePath, 'utf8')
    for (const pattern of [staticImport, dynamicImport]) {
      pattern.lastIndex = 0
      for (const match of source.matchAll(pattern)) {
        if (!match[1].startsWith('.') && !match[1].startsWith('@/')) {
          continue
        }
        const dependencyPath = resolveRelativeDependency(
          root,
          entryPath,
          match[1],
        )
        if (!discovered.has(dependencyPath)) {
          queue.push(dependencyPath)
        }
      }
    }
  }

  return [...discovered].sort((left, right) =>
    left.localeCompare(right, 'en'),
  )
}

export function buildCandidateImport({
  candidateRoot,
  batches,
  requiredPaths = [],
  baselineInventory = {},
  baselineApprovedBy = 'baseline-inventory',
}) {
  const latestByPath = new Map()

  for (const { batch, manifest } of batches) {
    for (const entry of entriesForBatch(batch, manifest)) {
      validateImportEntry({
        path: entry.path,
        sha256: entry.sha256,
        bytes: entry.bytes ?? 0,
      })
      latestByPath.set(entry.path, { ...entry, approvedBy: batch })
    }
  }

  for (const requiredPath of requiredPaths) {
    if (latestByPath.has(requiredPath)) {
      continue
    }

    const sha256 = baselineInventory[requiredPath]
    if (!sha256) {
      throw new Error(`REQUIRED_BASELINE_EVIDENCE_MISSING:${requiredPath}`)
    }
    validateImportEntry({ path: requiredPath, sha256, bytes: 0 })
    latestByPath.set(requiredPath, {
      path: requiredPath,
      sha256,
      bytes: undefined,
      approvedBy: baselineApprovedBy,
    })
  }

  const realCandidateRoot = realpathSync(candidateRoot)

  return [...latestByPath.values()]
    .sort((left, right) => left.path.localeCompare(right.path, 'en'))
    .map((entry) => {
      const candidatePath = realpathSync(
        path.resolve(realCandidateRoot, entry.path),
      )
      if (!isInsideRoot(realCandidateRoot, candidatePath)) {
        throw new Error(`CANDIDATE_PATH_ESCAPES_ROOT:${entry.path}`)
      }

      const stats = statSync(candidatePath)
      if (!stats.isFile()) {
        throw new Error(`CANDIDATE_ENTRY_NOT_FILE:${entry.path}`)
      }

      const actualSha256 = sha256File(candidatePath)
      if (actualSha256 !== entry.sha256) {
        throw new Error(`CANDIDATE_HASH_MISMATCH:${entry.path}`)
      }

      if (entry.bytes !== undefined && entry.bytes !== stats.size) {
        throw new Error(`CANDIDATE_SIZE_MISMATCH:${entry.path}`)
      }

      const result = {
        path: entry.path,
        sha256: entry.sha256,
        bytes: stats.size,
        approvedBy: entry.approvedBy,
      }
      validateImportEntry(result)
      return result
    })
}
