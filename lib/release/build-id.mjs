import {createHash} from 'node:crypto'
import {lstatSync, readFileSync, readdirSync} from 'node:fs'
import {relative, resolve, sep} from 'node:path'

function normalize(root, path) {
  const absolute = resolve(root, path)
  const normalized = relative(root, absolute).split(sep).join('/')
  if (!normalized || normalized === '..' || normalized.startsWith('../')) {
    throw new Error(`BUILD_ID_PATH_OUTSIDE_ROOT:${path}`)
  }
  return {absolute, normalized}
}

function collect(root, path, entries) {
  const {absolute, normalized} = normalize(root, path)
  const stat = lstatSync(absolute)
  if (stat.isSymbolicLink()) throw new Error(`BUILD_ID_SYMLINK_FORBIDDEN:${normalized}`)
  if (stat.isDirectory()) {
    for (const name of readdirSync(absolute).sort((a, b) => a.localeCompare(b, 'en'))) {
      collect(root, `${normalized}/${name}`, entries)
    }
    return
  }
  if (!stat.isFile()) throw new Error(`BUILD_ID_ENTRY_UNSUPPORTED:${normalized}`)
  entries.set(normalized, readFileSync(absolute))
}

export function buildDeterministicBuildId({root, paths}) {
  if (!Array.isArray(paths) || paths.length === 0) throw new Error('BUILD_ID_PATHS_MISSING')
  const entries = new Map()
  for (const path of [...new Set(paths)].sort((a, b) => a.localeCompare(b, 'en'))) {
    collect(resolve(root), path, entries)
  }

  const hash = createHash('sha256')
  for (const [path, bytes] of [...entries.entries()].sort(([a], [b]) => a.localeCompare(b, 'en'))) {
    hash.update(path)
    hash.update('\0')
    hash.update(bytes)
    hash.update('\0')
  }
  return `poxiol-${hash.digest('hex').slice(0, 24)}`
}
