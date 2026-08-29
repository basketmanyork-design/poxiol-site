import path from 'node:path'

const deniedPath =
  /^(?:\.env|\.git(?:\/|$)|node_modules\/|out\/|\.next\/|\.pnpm-store\/|\.npm\/|\.yarn\/)|(?:^|\/)\.env(?:\/|\.|$)/

export function validateImportEntry(entry) {
  const candidatePath = entry?.path
  const normalizedPath =
    typeof candidatePath === 'string'
      ? candidatePath.replaceAll('\\', '/')
      : ''

  const rejected =
    !normalizedPath ||
    normalizedPath === '.' ||
    path.posix.isAbsolute(normalizedPath) ||
    path.win32.isAbsolute(candidatePath ?? '') ||
    normalizedPath.split('/').includes('..') ||
    deniedPath.test(normalizedPath) ||
    !/^[a-f0-9]{64}$/.test(entry?.sha256 ?? '') ||
    !Number.isInteger(entry?.bytes) ||
    entry.bytes < 0

  if (rejected) {
    throw new Error(`IMPORT_PATH_REJECTED:${candidatePath}`)
  }

  return true
}
