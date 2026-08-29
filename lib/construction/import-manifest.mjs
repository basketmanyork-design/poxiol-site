import { createHash } from 'node:crypto'
import {
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

export function buildCandidateImport({ candidateRoot, batches }) {
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
