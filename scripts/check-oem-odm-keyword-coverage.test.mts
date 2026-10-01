import assert from 'node:assert/strict'
import {createHash} from 'node:crypto'
import {readdir, readFile} from 'node:fs/promises'
import path from 'node:path'
import test from 'node:test'

const outputDirectory = path.resolve(process.env.POXIOL_OUTPUT_DIR ?? 'out')
const outputMode = process.argv.includes('--output')
const sourcePath = path.resolve('app/oem-odm/page.tsx')

const approved = {
  eyebrow: 'Buyer Comparison',
  heading: 'Compare OEM/ODM Sportswear Development Paths',
  paragraph1: 'If you are comparing an ODM sportswear manufacturer, a uniform OEM supplier or another OEM/ODM sportswear development path, begin with the same project inputs: product category, reference styles, authorized artwork, fabric and construction requirements, size range, quantities, sample objectives, packaging needs, target date and destination.',
  paragraph2: 'POXIOL reviews those inputs before confirming the suitable OEM or ODM path, quotation scope, sample plan or timing. For production-stage questions, use the manufacturing workflow to review the steps that follow an approved brief.',
  linkLabel: 'Review the manufacturing workflow →',
  linkHref: '/manufacturing/',
  title: 'OEM/ODM Teamwear for Distributors and Brands | POXIOL',
  h1: 'OEM/ODM Teamwear for Channel Partners',
  description: 'OEM/ODM teamwear for teamwear distributors, dealers, sportswear brands and custom resellers worldwide. Plan client collections, samples and repeat orders.',
  canonical: 'https://www.poxiol.com/oem-odm/',
  quoteHref: '/get-quote/?product=OEM+%2F+ODM+Teamwear&source=%2Foem-odm%2F#quote-form',
  schemaHash: '541fcce2dc307ba949c8d46dbabf436e9a5aa321e0f3dea7318babf3d6b745af',
}

function decodeHtml(value: string): string {
  return value
    .replaceAll('&amp;', '&')
    .replaceAll('&quot;', '"')
    .replaceAll('&#x27;', "'")
    .replaceAll('&#39;', "'")
    .replaceAll('&lt;', '<')
    .replaceAll('&gt;', '>')
    .replaceAll('&rarr;', '→')
}

function visibleText(html: string): string {
  return decodeHtml(html
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim())
}

function outputFile(route: string): string {
  return route === '/'
    ? path.join(outputDirectory, 'index.html')
    : path.join(outputDirectory, ...route.split('/').filter(Boolean), 'index.html')
}

function digest(value: string): string {
  return createHash('sha256').update(value).digest('hex')
}

async function allIndexFiles(directory: string): Promise<string[]> {
  const entries = await readdir(directory, {withFileTypes: true})
  const nested = await Promise.all(entries.map(async (entry) => {
    const target = path.join(directory, entry.name)
    if (entry.isDirectory()) return allIndexFiles(target)
    return entry.isFile() && entry.name === 'index.html' ? [target] : []
  }))
  return nested.flat()
}

function one(values: string[], label: string): string {
  assert.equal(values.length, 1, `${label} must occur exactly once`)
  return values[0]
}

if (!outputMode) {
  test('OEM/ODM source exposes the approved buyer-comparison path without an identity claim', async () => {
    const source = await readFile(sourcePath, 'utf8')
    const serviceOverview = source.indexOf('eyebrow="Service Overview"')
    const pilotHeading = source.indexOf(approved.heading)
    const partnerGroups = source.indexOf('title="Who Our OEM/ODM Service Is For"')

    assert.ok(serviceOverview >= 0)
    assert.ok(pilotHeading > serviceOverview, 'pilot must follow Service Overview')
    assert.ok(partnerGroups > pilotHeading, 'pilot must precede Partner Groups')
    for (const copy of [approved.eyebrow, approved.heading, approved.paragraph1, approved.paragraph2, approved.linkLabel]) {
      assert.equal(source.split(copy).length - 1, 1, `source must contain approved copy exactly once: ${copy}`)
    }
    assert.equal(source.split(`href="${approved.linkHref}"`).length - 1, 1)
    assert.doesNotMatch(source, /POXIOL\s+(?:is|acts as|operates as)\s+(?:an?\s+)?(?:ODM\s+)?(?:sportswear\s+)?(?:manufacturer|supplier|factory)/i)
  })
} else {
  test('rendered OEM/ODM pilot adds one comparison path while preserving SEO, Schema and inquiry contracts', async () => {
    const html = await readFile(outputFile('/oem-odm/'), 'utf8')
    const visible = visibleText(html)
    const section = html.match(new RegExp(`<section\\b[^>]*>[\\s\\S]*?${approved.heading.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}[\\s\\S]*?<\\/section>`, 'i'))?.[0] ?? ''

    assert.ok(section, 'buyer-comparison section is missing')
    for (const copy of [approved.eyebrow, approved.heading, approved.paragraph1, approved.paragraph2, approved.linkLabel]) {
      assert.equal(visible.split(copy).length - 1, 1, `rendered copy must occur exactly once: ${copy}`)
    }
    assert.equal((section.match(/href="\/manufacturing\/"/g) ?? []).length, 1)
    assert.doesNotMatch(visibleText(section), /POXIOL\s+(?:is|acts as|operates as)\s+(?:an?\s+)?(?:ODM\s+)?(?:sportswear\s+)?(?:manufacturer|supplier|factory)/i)

    assert.equal(one([...html.matchAll(/<title>(.*?)<\/title>/gi)].map((match) => decodeHtml(match[1])), 'title'), approved.title)
    assert.equal(one([...html.matchAll(/<meta name="description" content="([^"]*)"/gi)].map((match) => decodeHtml(match[1])), 'description'), approved.description)
    assert.equal(one([...html.matchAll(/<link rel="canonical" href="([^"]*)"/gi)].map((match) => match[1]), 'canonical'), approved.canonical)
    assert.equal((html.match(/<h1\b/gi) ?? []).length, 1)
    assert.ok(visible.includes(approved.h1))
    assert.ok(decodeHtml(html).includes(`href="${approved.quoteHref}"`))
    assert.equal((html.match(/<form\b/gi) ?? []).length, 0)

    const schemaSources = [...html.matchAll(/<script\b[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi)]
      .map((match) => match[1].trim())
    for (const source of schemaSources) assert.doesNotThrow(() => JSON.parse(source))
    assert.deepEqual(schemaSources.map(digest), [approved.schemaHash])
  })

  test('manufacturing remains the unchanged production-workflow control page', async () => {
    const html = await readFile(outputFile('/manufacturing/'), 'utf8')
    const visible = visibleText(html)

    assert.equal(one([...html.matchAll(/<title>(.*?)<\/title>/gi)].map((match) => decodeHtml(match[1])), 'manufacturing title'), 'Custom Teamwear Manufacturing Process | POXIOL')
    assert.equal(one([...html.matchAll(/<link rel="canonical" href="([^"]*)"/gi)].map((match) => match[1]), 'manufacturing canonical'), 'https://www.poxiol.com/manufacturing/')
    assert.equal((html.match(/<h1\b/gi) ?? []).length, 1)
    assert.ok(visible.includes('How POXIOL Manufactures Custom Teamwear'))
    assert.equal(digest(visible), '0670a4772829544248a36f003e438269786223a670fb01b7ba8859124637ba8f')
    assert.ok(!visible.includes(approved.heading))
  })

  test('the approved comparison heading appears on no other rendered page', async () => {
    const matches: string[] = []
    for (const file of await allIndexFiles(outputDirectory)) {
      if (visibleText(await readFile(file, 'utf8')).includes(approved.heading)) matches.push(path.relative(outputDirectory, file))
    }
    assert.deepEqual(matches, [path.join('oem-odm', 'index.html')])
  })
}
