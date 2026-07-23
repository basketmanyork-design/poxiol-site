import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const outDir = path.join(root, 'out')
const sections = ['blog', 'guides', 'resources']
const seen = new Map()
const conflicts = []

for (const section of sections) {
  const dir = path.join(outDir, section)
  if (!fs.existsSync(dir)) continue
  for (const entry of fs.readdirSync(dir, {withFileTypes: true})) {
    if (!entry.isDirectory()) continue
    const slug = entry.name
    if (slug.startsWith('_')) continue
    const previous = seen.get(slug)
    if (previous && previous !== section) conflicts.push(`${slug}: ${previous} + ${section}`)
    seen.set(slug, section)
  }
}

if (conflicts.length) {
  throw new Error(`Article route slug conflicts detected: ${conflicts.join('; ')}`)
}

console.log(`article route conflict check passed (${seen.size} exported article routes)`)