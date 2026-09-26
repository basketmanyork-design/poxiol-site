import {createHash} from 'node:crypto'
import {extname} from 'node:path'

const COMMIT_PATTERN = /^[0-9a-f]{40}$/
const SHA256_PATTERN = /^[0-9a-f]{64}$/
const REQUIRED_GATES = ['c1', 'c2', 'c3', 'c4']
const TEXT_EXTENSIONS = new Set([
  '.css', '.csv', '.html', '.js', '.json', '.map', '.md', '.mjs', '.svg', '.txt', '.ts', '.tsx', '.xml',
])
const TEXT_FILENAMES = new Set(['_headers', '_redirects', '_routes.json'])

function normalizeLf(bytes) {
  return Buffer.from(bytes).toString('utf8').replace(/\r\n?/g, '\n')
}

export function releaseManifestTextMatches(current, expected) {
  return normalizeLf(current) === normalizeLf(expected)
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function findClosingDiv(text, start, openingTagEnd) {
  const divTag = /<\/?div\b[^>]*>/gi
  divTag.lastIndex = openingTagEnd
  let depth = 1
  let match

  while ((match = divTag.exec(text))) {
    if (match[0].startsWith('</')) depth -= 1
    else if (!match[0].endsWith('/>')) depth += 1
    if (depth === 0) return {start: match.index, end: divTag.lastIndex}
  }

  return null
}

function canonicalizeResolvedNextSegments(text) {
  const segment = /<div\b(?=[^>]*\bid="S:([^"]+)")(?=[^>]*\bhidden(?:=""|(?=[\s>])))[^>]*>/gi
  let canonical = text
  let searchFrom = 0

  while (searchFrom < canonical.length) {
    segment.lastIndex = searchFrom
    const opening = segment.exec(canonical)
    if (!opening) break

    const id = opening[1]
    const closing = findClosingDiv(canonical, opening.index, segment.lastIndex)
    if (!closing) {
      searchFrom = segment.lastIndex
      continue
    }

    const afterSegment = canonical.slice(closing.end)
    const runtime = afterSegment.match(/^\s*<script\b[^>]*>([\s\S]*?)<\/script>/i)
    const escapedId = escapeRegExp(id)
    const resolvesSegment = runtime && new RegExp(
      `\\$RC\\(\\s*["']B:${escapedId}["']\\s*,\\s*["']S:${escapedId}["']\\s*\\)`,
    ).test(runtime[1])
    if (!resolvesSegment) {
      searchFrom = closing.end
      continue
    }

    const placeholder = new RegExp(
      `<!--\\$\\?--><template id=["']B:${escapedId}["']><\\/template><!--\\/\\$-->`,
      'i',
    ).exec(canonical)
    if (!placeholder) {
      searchFrom = closing.end + runtime[0].length
      continue
    }

    const resolvedContent = canonical.slice(segment.lastIndex, closing.start)
    const edits = [
      {
        start: placeholder.index,
        end: placeholder.index + placeholder[0].length,
        replacement: `<!--$-->${resolvedContent}<!--/$-->`,
      },
      {
        start: opening.index,
        end: closing.end + runtime[0].length,
        replacement: '',
      },
    ].sort((a, b) => b.start - a.start)

    for (const edit of edits) {
      canonical = canonical.slice(0, edit.start) + edit.replacement + canonical.slice(edit.end)
    }
    searchFrom = 0
  }

  return canonical.replace(
    /<script>requestAnimationFrame\(function\(\)\{\$RT=performance\.now\(\)\}\);<\/script>/g,
    '',
  )
}

function canonicalizeNextHtml(text) {
  const withoutFlight = canonicalizeResolvedNextSegments(text).replace(
    /<script>self\.__next_f\.push\([\s\S]*?<\/script>/g,
    '',
  )

  return withoutFlight.replace(/<head>([\s\S]*?)<\/head>/, (match, head) => {
    const tags = head.match(
      /<title\b[^>]*>[\s\S]*?<\/title>|<script\b[^>]*>[\s\S]*?<\/script>|<(?:meta|link)\b[^>]*\/?\s*>/gi,
    ) || []
    const remainder = tags.reduce((value, tag) => value.replace(tag, ''), head)
    if (remainder.trim() !== '') return match
    return `<head>${tags.sort((a, b) => a.localeCompare(b, 'en')).join('')}</head>`
  })
}

function parseFlightRecordKindsAndRawText(text) {
  const bytes = Buffer.from(text, 'utf8')
  const recordKinds = []
  const rawText = []
  let offset = 0

  while (offset < bytes.length) {
    while (bytes[offset] === 0x0a) offset += 1
    if (offset >= bytes.length) break

    const prefix = bytes.subarray(offset, Math.min(bytes.length, offset + 48)).toString('ascii')
    // React also emits identifier-less hint records such as `:HL[...]`.
    const recordMatch = prefix.match(/^([0-9a-f]*):/)
    if (!recordMatch) return null
    offset += Buffer.byteLength(recordMatch[0])

    const payloadPrefix = bytes.subarray(offset, Math.min(bytes.length, offset + 48)).toString('ascii')
    const textMatch = payloadPrefix.match(/^T([0-9a-f]+),/)
    if (textMatch) {
      const byteLength = Number.parseInt(textMatch[1], 16)
      offset += Buffer.byteLength(textMatch[0])
      if (!Number.isSafeInteger(byteLength) || offset + byteLength > bytes.length) return null
      rawText.push(bytes.subarray(offset, offset + byteLength).toString('utf8'))
      recordKinds.push('T')
      offset += byteLength
      continue
    }

    const newline = bytes.indexOf(0x0a, offset)
    const end = newline === -1 ? bytes.length : newline
    const payload = bytes.subarray(offset, end).toString('utf8')
    recordKinds.push(payload[0] || 'EMPTY')
    offset = newline === -1 ? bytes.length : newline + 1
  }

  return {recordKinds, rawText}
}

function canonicalizeNextFlight(text) {
  const parsed = parseFlightRecordKindsAndRawText(text)
  if (!parsed) return text

  const strings = [...text.matchAll(/"(?:\\.|[^"\\])*"/g)]
    .map((match) => match[0].replace(/\$L?[0-9a-f]+/g, '$REF'))
    .sort((a, b) => a.localeCompare(b, 'en'))

  return JSON.stringify({
    recordKinds: parsed.recordKinds.sort((a, b) => a.localeCompare(b, 'en')),
    strings,
    rawText: parsed.rawText.sort((a, b) => a.localeCompare(b, 'en')),
  })
}

export function sha256ReleaseFile(path, bytes) {
  const normalizedPath = path.replaceAll('\\', '/')
  const isText = TEXT_EXTENSIONS.has(extname(normalizedPath).toLowerCase())
    || TEXT_FILENAMES.has(normalizedPath.split('/').at(-1))
  let content = isText ? normalizeLf(bytes) : bytes

  if (normalizedPath.startsWith('out/') && normalizedPath.endsWith('.html')) {
    content = canonicalizeNextHtml(content)
  } else if (
    normalizedPath.startsWith('out/')
    && (normalizedPath === 'out/index.txt' || normalizedPath.endsWith('/index.txt'))
  ) {
    content = canonicalizeNextFlight(content)
  }

  return createHash('sha256').update(content).digest('hex')
}

export function assertConstructionOutputMatchesRouteRelease({routeManifest, candidateSitemap, renderedCount}) {
  const source = routeManifest?.source
  if (
    !source
    || typeof source.candidateSitemapSha256 !== 'string'
    || !Number.isInteger(source.candidateCount)
    || !Number.isInteger(source.renderedCount)
  ) {
    throw new Error('CONSTRUCTION_RELEASE_ROUTE_MANIFEST_INVALID')
  }
  if (typeof candidateSitemap !== 'string' || !Number.isInteger(renderedCount)) {
    throw new Error('CONSTRUCTION_RELEASE_OUTPUT_INVALID')
  }

  const candidateCount = [...candidateSitemap.matchAll(/<loc>\s*([^<]+?)\s*<\/loc>/gi)]
    .map((match) => match[1])
    .filter((value) => {
      try {
        return new URL(value).hostname === 'www.poxiol.com'
      } catch {
        return false
      }
    }).length
  const candidateSitemapSha256 = sha256ReleaseFile('out/sitemap.xml', Buffer.from(candidateSitemap))
  const stale = []
  if (candidateSitemapSha256 !== source.candidateSitemapSha256) stale.push('candidateSitemapSha256')
  if (candidateCount !== source.candidateCount) stale.push('candidateCount')
  if (renderedCount !== source.renderedCount) stale.push('renderedCount')
  if (stale.length) throw new Error(`CONSTRUCTION_RELEASE_ROUTE_OUTPUT_STALE:${stale.join(',')}`)
}

function assertRelativePath(path) {
  if (
    typeof path !== 'string'
    || path.length === 0
    || path.startsWith('/')
    || path.includes('\\')
    || path.split('/').includes('..')
  ) {
    throw new Error(`INVALID_PATH:${String(path)}`)
  }
}

function normalizeFiles(files, allPaths) {
  if (!Array.isArray(files)) throw new Error('INVALID_FILE_LIST')

  return files.map((entry) => {
    if (!entry || typeof entry !== 'object') throw new Error('INVALID_FILE_ENTRY')
    assertRelativePath(entry.path)
    if (!SHA256_PATTERN.test(entry.sha256)) throw new Error(`INVALID_SHA256:${entry.path}`)
    if (allPaths.has(entry.path)) throw new Error(`DUPLICATE_PATH:${entry.path}`)
    allPaths.add(entry.path)
    return {path: entry.path, sha256: entry.sha256}
  }).sort((a, b) => a.path.localeCompare(b.path, 'en'))
}

export function buildReleaseManifest({commits, sourceFiles, outputFiles, gates}) {
  if (!Array.isArray(commits) || commits.length === 0) throw new Error('INVALID_COMMITS')
  const seenCommits = new Set()
  for (const commit of commits) {
    if (!COMMIT_PATTERN.test(commit)) throw new Error(`INVALID_COMMIT:${String(commit)}`)
    if (seenCommits.has(commit)) throw new Error(`DUPLICATE_COMMIT:${commit}`)
    seenCommits.add(commit)
  }

  if (!gates || typeof gates !== 'object') throw new Error('INVALID_GATES')
  const normalizedGates = {}
  for (const gate of REQUIRED_GATES) {
    if (typeof gates[gate] !== 'boolean') throw new Error(`INVALID_GATE:${gate}`)
    normalizedGates[gate] = gates[gate]
  }

  const allPaths = new Set()
  return {
    schemaVersion: 1,
    status: 'PREVIEW_READY_PRODUCTION_NO_GO',
    productionAuthorized: false,
    deploymentPerformed: false,
    cmsWrites: 0,
    realFormSubmissions: 0,
    commits: [...commits],
    gates: normalizedGates,
    sourceFiles: normalizeFiles(sourceFiles, allPaths),
    outputFiles: normalizeFiles(outputFiles, allPaths),
  }
}
