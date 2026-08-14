import {mkdirSync, readFileSync} from 'node:fs'
import path from 'node:path'
import {pathToFileURL} from 'node:url'
import sharp from 'sharp'

type ReviewFile = {absolutePath: string; filename?: string; mediaType: string; view: string; sport?: string}
type ReviewGroup = {sampleId: string; sport: string; completenessGrade: string; files: ReviewFile[]}

export function escapeXml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;')
}

export function selectGroupReviewFiles(group: {files: ReviewFile[]}): ReviewFile[] {
  return group.files
    .filter((file) => file.mediaType === 'image' && (file.view === 'FRONT' || file.view === 'BACK'))
    .sort((left, right) => (left.view === 'FRONT' ? -1 : right.view === 'FRONT' ? 1 : 0))
    .slice(0, 2)
}

async function thumbnail(filePath: string, width: number, height: number): Promise<Buffer> {
  return sharp(filePath)
    .rotate()
    .resize({width, height, fit: 'contain', background: '#f7f7f7'})
    .flatten({background: '#f7f7f7'})
    .jpeg({quality: 72})
    .toBuffer()
}

function labelSvg(label: string, width: number, height: number): Buffer {
  return Buffer.from(`<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg"><rect width="100%" height="100%" fill="#111827"/><text x="10" y="22" fill="#ffffff" font-size="16" font-family="Arial, sans-serif">${escapeXml(label)}</text></svg>`)
}

async function createSingleImageSheets(files: ReviewFile[], outputDirectory: string, prefix: string) {
  const columns = 5
  const rows = 6
  const cellWidth = 250
  const cellHeight = 220
  const imageWidth = 230
  const imageHeight = 180
  const perSheet = columns * rows

  for (let offset = 0; offset < files.length; offset += perSheet) {
    const batch = files.slice(offset, offset + perSheet)
    const composites: sharp.OverlayOptions[] = []
    for (let index = 0; index < batch.length; index++) {
      const file = batch[index]
      const column = index % columns
      const row = Math.floor(index / columns)
      const left = column * cellWidth + 10
      const top = row * cellHeight + 5
      composites.push({input: await thumbnail(file.absolutePath, imageWidth, imageHeight), left, top})
      composites.push({input: labelSvg(file.filename || path.basename(file.absolutePath), imageWidth, 30), left, top: top + imageHeight + 2})
    }
    await sharp({create: {width: columns * cellWidth, height: rows * cellHeight, channels: 3, background: '#e5e7eb'}})
      .composite(composites)
      .webp({quality: 78})
      .toFile(path.join(outputDirectory, `${prefix}-${String(offset / perSheet + 1).padStart(2, '0')}.webp`))
  }
}

async function createGroupSheets(groups: ReviewGroup[], outputDirectory: string, prefix: string) {
  const columns = 4
  const rows = 4
  const cellWidth = 390
  const cellHeight = 250
  const imageWidth = 175
  const imageHeight = 205
  const perSheet = columns * rows

  for (let offset = 0; offset < groups.length; offset += perSheet) {
    const batch = groups.slice(offset, offset + perSheet)
    const composites: sharp.OverlayOptions[] = []
    for (let index = 0; index < batch.length; index++) {
      const group = batch[index]
      const files = selectGroupReviewFiles(group)
      const column = index % columns
      const row = Math.floor(index / columns)
      const left = column * cellWidth + 10
      const top = row * cellHeight + 5
      for (let imageIndex = 0; imageIndex < files.length; imageIndex++) {
        composites.push({input: await thumbnail(files[imageIndex].absolutePath, imageWidth, imageHeight), left: left + imageIndex * (imageWidth + 10), top})
      }
      composites.push({input: labelSvg(`${group.sampleId} [${group.completenessGrade}]`, cellWidth - 20, 30), left, top: top + imageHeight + 2})
    }
    await sharp({create: {width: columns * cellWidth, height: rows * cellHeight, channels: 3, background: '#e5e7eb'}})
      .composite(composites)
      .webp({quality: 78})
      .toFile(path.join(outputDirectory, `${prefix}-${String(offset / perSheet + 1).padStart(2, '0')}.webp`))
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const inventory = JSON.parse(readFileSync('content/real-production/manifest/source-inventory.json', 'utf8')) as {files: ReviewFile[]}
  const groupData = JSON.parse(readFileSync('content/real-production/manifest/sample-groups.json', 'utf8')) as {groups: ReviewGroup[]}
  const runId = new Date().toISOString().replaceAll(':', '-').replaceAll('.', '-')
  const outputDirectory = path.join('tmp', 'real-production-review', runId)
  mkdirSync(outputDirectory, {recursive: true})

  const basketballImages = inventory.files.filter((file) => file.sport === 'basketball' && file.mediaType === 'image')
  const packagingImages = inventory.files.filter((file) => file.sport === 'packaging' && file.mediaType === 'image')
  const completeGroups = groupData.groups.filter((group) => ['S', 'A'].includes(group.completenessGrade))

  await createSingleImageSheets(basketballImages, outputDirectory, 'basketball-all')
  await createSingleImageSheets(packagingImages, outputDirectory, 'packaging')
  await createGroupSheets(completeGroups.filter((group) => group.sport === 'basketball'), outputDirectory, 'basketball-complete')
  await createGroupSheets(completeGroups.filter((group) => group.sport === 'soccer'), outputDirectory, 'soccer-complete')
  await createGroupSheets(completeGroups.filter((group) => group.sport === 'baseball'), outputDirectory, 'baseball-complete')

  console.log(JSON.stringify({outputDirectory: path.resolve(outputDirectory), basketballImages: basketballImages.length, packagingImages: packagingImages.length, completeGroups: completeGroups.length}, null, 2))
}
