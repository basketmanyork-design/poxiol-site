export function verifyImportedFiles(entries, hashFile) {
  for (const entry of entries) {
    const actualSha256 = hashFile(entry.path)
    if (actualSha256 !== entry.sha256) {
      throw new Error(`IMPORTED_HASH_MISMATCH:${entry.path}`)
    }
  }

  return true
}
