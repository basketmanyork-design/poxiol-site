import {closeSync, existsSync, mkdirSync, openSync, readFileSync, readdirSync, readSync, statSync, writeFileSync} from 'node:fs'
import path from 'node:path'
import {pathToFileURL} from 'node:url'
import sharp from 'sharp'

export type SourceMediaType = 'image' | 'video'
export type SourceView = 'FRONT' | 'BACK' | 'VIDEO' | `DETAIL_${string}` | 'UNSPECIFIED'
export type CompletenessGrade = 'S' | 'A' | 'B' | 'C' | 'D' | 'UNPAIRED'
export type SourceSport = 'basketball' | 'soccer' | 'baseball' | 'packaging' | 'fabric' | 'unknown'
export type SourceVerificationStatus = 'VERIFIED_POXIOL' | 'PRODUCT_ONLY_VERIFIED' | 'VERIFIED_BUYER_AUTHORIZED' | 'REQUIRES_HUMAN_REVIEW' | 'REJECTED'

type ManualDecision = {
  verificationStatus: SourceVerificationStatus
  visibleText: string | null
  visibleLogo: string | null
  peopleVisible: boolean | null
  privateInformation: boolean | null
  customerArtwork: boolean | null
  likelyUsage: string
  reviewNote: string
}

type ManualDecisionFile = {
  reviewedAt: string
  reviewedBy: string
  decisions: Record<string, ManualDecision>
}

const manualDecisionPath = path.resolve('content/real-production/manifest/manual-decisions.json')

export function loadManualDecisions(filePath = manualDecisionPath): ManualDecisionFile {
  if (!existsSync(filePath)) return {reviewedAt: '', reviewedBy: '', decisions: {}}
  return JSON.parse(readFileSync(filePath, 'utf8')) as ManualDecisionFile
}

export function applyManualDecision<T extends {
  absolutePath: string
  visibleText: string | null
  visibleLogo: string | null
  peopleVisible: boolean | null
  privateInformation: boolean | null
  customerArtwork: boolean | null
  likelyUsage: string
  verificationCandidate: SourceVerificationStatus
  reviewNote: string
}>(file: T, decisions: ManualDecisionFile['decisions']): T {
  const decision = decisions[file.absolutePath]
  if (!decision) return file
  return {
    ...file,
    visibleText: decision.visibleText,
    visibleLogo: decision.visibleLogo,
    peopleVisible: decision.peopleVisible,
    privateInformation: decision.privateInformation,
    customerArtwork: decision.customerArtwork,
    likelyUsage: decision.likelyUsage,
    verificationCandidate: decision.verificationStatus,
    reviewNote: decision.reviewNote,
  }
}

export function parseSourceFilename(filename: string): {
  sampleId: string
  mediaType: SourceMediaType
  view: SourceView
  pairingEligible: boolean
} {
  const lowerFilename = filename.toLowerCase()
  const extension = lowerFilename === '.jpg' || lowerFilename === '.jpeg' || lowerFilename === '.mp4'
    ? lowerFilename
    : path.extname(filename).toLowerCase()
  const stem = path.basename(filename, extension) || '(unnamed)'
  const suffix = stem.match(/^(.*)-([A-H])$/i)

  if (extension === '.mp4') {
    return suffix
      ? {sampleId: stem, mediaType: 'video', view: 'VIDEO', pairingEligible: false}
      : {sampleId: stem, mediaType: 'video', view: 'VIDEO', pairingEligible: true}
  }

  if (suffix) {
    const code = suffix[2].toUpperCase()
    return {
      sampleId: suffix[1],
      mediaType: 'image',
      view: code === 'A' ? 'FRONT' : code === 'B' ? 'BACK' : `DETAIL_${code}`,
      pairingEligible: true,
    }
  }

  return {sampleId: stem, mediaType: 'image', view: 'UNSPECIFIED', pairingEligible: false}
}

export function gradeSampleGroup(views: readonly SourceView[]): CompletenessGrade {
  const unique = new Set(views)
  const front = unique.has('FRONT')
  const back = unique.has('BACK')
  const video = unique.has('VIDEO')
  if (front && back && video) return 'S'
  if (front && back) return 'A'
  if ((front || back) && video) return 'B'
  if (front || back) return 'C'
  if (video) return 'D'
  return 'UNPAIRED'
}

export function classifySourceFolder(folder: string): SourceSport {
  if (folder.includes('篮球')) return 'basketball'
  if (folder.includes('足球')) return 'soccer'
  if (folder.includes('棒球')) return 'baseball'
  if (folder.includes('吊牌') || folder.includes('包装')) return 'packaging'
  if (folder.includes('面料')) return 'fabric'
  return 'unknown'
}

function listFiles(root: string): string[] {
  const files: string[] = []
  const visit = (directory: string) => {
    for (const entry of readdirSync(directory, {withFileTypes: true})) {
      const absolutePath = path.join(directory, entry.name)
      if (entry.isDirectory()) visit(absolutePath)
      else if (entry.isFile() && ['.jpg', '.jpeg', '.mp4'].some((extension) => entry.name.toLowerCase().endsWith(extension))) files.push(absolutePath)
    }
  }
  visit(root)
  return files.sort((left, right) => left.localeCompare(right, 'zh-CN'))
}

function readMp4Windows(filePath: string, windowSize = 4 * 1024 * 1024): Buffer[] {
  const size = statSync(filePath).size
  const fd = openSync(filePath, 'r')
  try {
    const headLength = Math.min(size, windowSize)
    const head = Buffer.alloc(headLength)
    readSync(fd, head, 0, headLength, 0)
    if (size <= windowSize) return [head]
    const tailLength = Math.min(size, windowSize)
    const tail = Buffer.alloc(tailLength)
    readSync(fd, tail, 0, tailLength, size - tailLength)
    return [head, tail]
  } finally {
    closeSync(fd)
  }
}

function findBox(buffer: Buffer, type: string): {typeOffset: number; start: number; size: number} | null {
  let typeOffset = buffer.indexOf(type, 4, 'ascii')
  while (typeOffset >= 4) {
    const start = typeOffset - 4
    const size = buffer.readUInt32BE(start)
    if (size >= 8 && start + size <= buffer.length) return {typeOffset, start, size}
    typeOffset = buffer.indexOf(type, typeOffset + 4, 'ascii')
  }
  return null
}

export function readMp4Metadata(filePath: string): {width?: number; height?: number; durationSeconds?: number} {
  const windows = readMp4Windows(filePath)
  let width: number | undefined
  let height: number | undefined
  let durationSeconds: number | undefined

  for (const buffer of windows) {
    if (durationSeconds === undefined) {
      const mvhd = findBox(buffer, 'mvhd')
      if (mvhd) {
        const version = buffer[mvhd.typeOffset + 4]
        const timescaleOffset = mvhd.typeOffset + (version === 1 ? 24 : 16)
        const durationOffset = mvhd.typeOffset + (version === 1 ? 28 : 20)
        const timescale = buffer.readUInt32BE(timescaleOffset)
        const duration = version === 1
          ? Number(buffer.readBigUInt64BE(durationOffset))
          : buffer.readUInt32BE(durationOffset)
        if (timescale > 0 && duration >= 0) durationSeconds = Math.round((duration / timescale) * 1000) / 1000
      }
    }

    if (width === undefined || height === undefined) {
      const tkhd = findBox(buffer, 'tkhd')
      if (tkhd && tkhd.size >= 16) {
        const widthFixed = buffer.readUInt32BE(tkhd.start + tkhd.size - 8)
        const heightFixed = buffer.readUInt32BE(tkhd.start + tkhd.size - 4)
        const parsedWidth = Math.round(widthFixed / 65536)
        const parsedHeight = Math.round(heightFixed / 65536)
        if (parsedWidth > 0 && parsedHeight > 0) {
          width = parsedWidth
          height = parsedHeight
        }
      }
    }
  }

  return {width, height, durationSeconds}
}

async function mapWithConcurrency<T, R>(items: readonly T[], concurrency: number, mapper: (item: T) => Promise<R>): Promise<R[]> {
  const results = new Array<R>(items.length)
  let cursor = 0
  await Promise.all(Array.from({length: Math.min(concurrency, items.length)}, async () => {
    while (cursor < items.length) {
      const index = cursor++
      results[index] = await mapper(items[index])
    }
  }))
  return results
}

export async function scanSource(root: string, manualDecisions = loadManualDecisions()) {
  const absoluteRoot = path.resolve(root)
  const paths = listFiles(absoluteRoot)
  const files = await mapWithConcurrency(paths, 12, async (absolutePath) => {
    const folder = path.dirname(absolutePath)
    const filename = path.basename(absolutePath)
    const parsed = parseSourceFilename(filename)
    const fileStat = statSync(absolutePath)
    const metadata = parsed.mediaType === 'image'
      ? await sharp(absolutePath).metadata().then(({width, height}) => ({width, height, durationSeconds: undefined}))
      : readMp4Metadata(absolutePath)
    const sport = classifySourceFolder(folder)
    return applyManualDecision({
      absolutePath,
      folder,
      filename,
      extension: filename.toLowerCase() === '.jpg' ? '.jpg' : path.extname(filename).toLowerCase(),
      fileSize: fileStat.size,
      width: metadata.width ?? null,
      height: metadata.height ?? null,
      durationSeconds: metadata.durationSeconds ?? null,
      mediaType: parsed.mediaType,
      baseSampleId: parsed.sampleId,
      view: parsed.view,
      pairingEligible: parsed.pairingEligible,
      sport,
      visibleText: null,
      visibleLogo: null,
      peopleVisible: null,
      privateInformation: null,
      customerArtwork: null,
      likelyUsage: sport === 'packaging' ? 'packaging-detail' : sport === 'fabric' ? 'fabric-detail' : 'product-sample',
      verificationCandidate: 'REQUIRES_HUMAN_REVIEW' as SourceVerificationStatus,
      reviewNote: 'Visual, ownership, privacy and IP review not completed.',
    }, manualDecisions.decisions)
  })

  const groupMap = new Map<string, typeof files>()
  for (const file of files) {
    const key = `${file.sport}:${file.baseSampleId}`
    const group = groupMap.get(key) || []
    group.push(file)
    groupMap.set(key, group)
  }

  const groups = Array.from(groupMap.entries()).map(([key, groupFiles]) => {
    const eligibleViews = groupFiles.filter((file) => file.pairingEligible).map((file) => file.view)
    const [sport, ...sampleParts] = key.split(':')
    return {
      sampleId: sampleParts.join(':'),
      sport,
      completenessGrade: gradeSampleGroup(eligibleViews),
      files: groupFiles.map((file) => ({absolutePath: file.absolutePath, filename: file.filename, mediaType: file.mediaType, view: file.view, pairingEligible: file.pairingEligible})),
      verificationStatus: groupFiles.some((file) => file.verificationCandidate === 'REJECTED')
        ? 'REJECTED'
        : groupFiles.every((file) => file.verificationCandidate === 'VERIFIED_POXIOL')
          ? 'VERIFIED_POXIOL'
          : 'REQUIRES_HUMAN_REVIEW',
      reviewNote: groupFiles.some((file) => file.verificationCandidate === 'REJECTED')
        ? 'At least one grouped file was rejected during visual IP/privacy review.'
        : groupFiles.every((file) => file.verificationCandidate === 'VERIFIED_POXIOL')
          ? 'All grouped files have a recorded manual verification decision.'
          : 'One or more grouped files still require visual, ownership, privacy or IP review.',
    }
  }).sort((left, right) => `${left.sport}:${left.sampleId}`.localeCompare(`${right.sport}:${right.sampleId}`, 'zh-CN'))

  return {
    generatedAt: new Date().toISOString(),
    sourceRoot: absoluteRoot,
    totalFiles: files.length,
    totals: {
      images: files.filter((file) => file.mediaType === 'image').length,
      videos: files.filter((file) => file.mediaType === 'video').length,
    },
    files,
    groups,
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const sourceRoot = process.argv[2] || process.env.POXIOL_REAL_SOURCE_ROOT
  if (!sourceRoot) throw new Error('Pass a local source root as the first argument or set POXIOL_REAL_SOURCE_ROOT.')
  const outputDirectory = 'content/real-production/manifest'
  const scan = await scanSource(sourceRoot)
  mkdirSync(outputDirectory, {recursive: true})
  writeFileSync(path.join(outputDirectory, 'source-inventory.json'), `${JSON.stringify({
    generatedAt: scan.generatedAt,
    sourceRoot: scan.sourceRoot,
    totalFiles: scan.totalFiles,
    totals: scan.totals,
    files: scan.files,
  }, null, 2)}\n`, 'utf8')
  writeFileSync(path.join(outputDirectory, 'sample-groups.json'), `${JSON.stringify({
    generatedAt: scan.generatedAt,
    sourceRoot: scan.sourceRoot,
    totalGroups: scan.groups.length,
    groups: scan.groups,
  }, null, 2)}\n`, 'utf8')
  console.log(JSON.stringify({
    totalFiles: scan.totalFiles,
    images: scan.totals.images,
    videos: scan.totals.videos,
    groups: scan.groups.length,
    grades: Object.fromEntries(['S', 'A', 'B', 'C', 'D', 'UNPAIRED'].map((grade) => [grade, scan.groups.filter((group) => group.completenessGrade === grade).length])),
  }, null, 2))
}
