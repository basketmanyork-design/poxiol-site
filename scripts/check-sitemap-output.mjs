import {existsSync, readFileSync} from 'node:fs'
import path from 'node:path'

const rootDir = path.resolve(import.meta.dirname, '..')
const outDir = path.join(rootDir, 'out')
const sitemapPath = path.join(outDir, 'sitemap.xml')

if (!existsSync(sitemapPath)) {
  throw new Error('out/sitemap.xml does not exist; run the static build first')
}

const xml = readFileSync(sitemapPath, 'utf8')
const locations = [...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map((match) => match[1])

if (!locations.length) {
  throw new Error('The generated sitemap does not contain any URLs')
}

const duplicates = locations.filter((location, index) => locations.indexOf(location) !== index)
if (duplicates.length) {
  throw new Error(`Duplicate sitemap URLs: ${[...new Set(duplicates)].join(', ')}`)
}

const invalidHosts = locations.filter((location) => {
  const url = new URL(location)
  return url.protocol !== 'https:' || url.hostname !== 'www.poxiol.com'
})
if (invalidHosts.length) {
  throw new Error(`Non-canonical sitemap URLs: ${invalidHosts.join(', ')}`)
}

const missingOutputs = locations.filter((location) => {
  const {pathname} = new URL(location)
  const relativePath = pathname === '/'
    ? 'index.html'
    : pathname.endsWith('/')
      ? path.join(pathname.slice(1), 'index.html')
      : pathname.slice(1)
  return !existsSync(path.join(outDir, relativePath))
})

if (missingOutputs.length) {
  throw new Error(`Sitemap URLs without static output: ${missingOutputs.join(', ')}`)
}

console.log(`sitemap output integrity passed (${locations.length} URLs)`)
