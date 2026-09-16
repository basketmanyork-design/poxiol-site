import {copyFile, mkdir, readFile, stat} from 'node:fs/promises'
import {createHash} from 'node:crypto'
import path from 'node:path'
import sharp from 'sharp'

const sourceRoot = 'E:/Poxiol团队/POXIOL独立站/最新素材'
const outputRoot = path.resolve('public/website-optimization')
const names = ['soccer', 'basketball', 'baseball', 'training', 'running-track', 'warm-up']
const hash = async file => createHash('sha256').update(await readFile(file)).digest('hex')

await mkdir(outputRoot, {recursive: true})
const manifest = []
for (let index = 0; index < names.length; index++) {
  const source = path.join(sourceRoot, `ChatGPT Image 2026年9月15日 20_32_39 (${index + 1}).png`)
  const before = await hash(source)
  const outputs = []
  for (const width of [480, 800]) {
    const filename = `${names[index]}-${width}.webp`
    const target = path.join(outputRoot, filename)
    await sharp(source).resize({width, withoutEnlargement: true}).webp({quality: 82, effort: 5}).toFile(target)
    outputs.push({path: `/website-optimization/${filename}`, bytes: (await stat(target)).size, sha256: await hash(target)})
  }
  if (await hash(source) !== before) throw new Error(`Original asset changed during derivation: ${source}`)
  manifest.push({category: names[index], source, originalSha256: before, sourceBytes: (await stat(source)).size, width: 1122, height: 1402, outputs})
}
const videoSource = path.join(sourceRoot, 'POXIOL_Hero_22s_Web_720p.mp4')
const videoBefore = await hash(videoSource)
const videoTarget = path.join(outputRoot, 'poxiol-hero-22s-720p.mp4')
await copyFile(videoSource, videoTarget)
if (await hash(videoSource) !== videoBefore) throw new Error('Original video changed during copy')
manifest.push({category: 'hero-video', source: videoSource, originalSha256: videoBefore, sourceBytes: (await stat(videoSource)).size, outputs: [{path: '/website-optimization/poxiol-hero-22s-720p.mp4', bytes: (await stat(videoTarget)).size, sha256: await hash(videoTarget)}]})
console.log(JSON.stringify(manifest, null, 2))
