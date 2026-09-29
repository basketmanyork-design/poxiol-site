import assert from 'node:assert/strict'
import {readFile} from 'node:fs/promises'
import path from 'node:path'
import test from 'node:test'

import {pseoPages} from '../lib/pseo.ts'

const route = '/custom-basketball-jerseys-melbourne/'
const basketballRoute = '/products/basketball-uniforms/'
const outputDirectory = path.resolve(process.env.POXIOL_OUTPUT_DIR ?? 'out')
const outputMode = process.argv.includes('--output')

const expected = {
  slug: 'custom-basketball-jerseys-melbourne',
  title: 'Custom Basketball Jerseys Melbourne | Club & Team Orders | POXIOL',
  h1: 'Custom Basketball Jerseys for Melbourne Clubs and Teams',
  intro: 'Plan custom basketball jerseys for a Melbourne club, school, academy or distributor. Review roster, artwork, sizing, sample and delivery details before a quote.',
  content: 'POXIOL reviews Melbourne basketball uniform projects according to the product mix, quantity, artwork, colors, names and numbers, size breakdown, target date and delivery destination. Product specifications, sample options, quotation, shipping method and delivery timing are confirmed only after the complete project requirements are reviewed.',
  decisionSections: [
    {
      heading: 'Prepare a Melbourne Basketball Uniform Brief',
      body: 'Send the jersey and shorts requirements, reversible or single-layer preference, team colors, logo files, names and numbers, separate top and bottom sizes, quantity, target date and Melbourne or Victoria delivery postcode. These inputs allow the project team to review the uniform format and identify missing decisions before quotation.',
    },
    {
      heading: 'Confirm Roster, Artwork and Sizing',
      body: 'Use one controlled roster for each player and keep printed names, numbers, jersey sizes and shorts sizes in separate fields. Review artwork placement, color direction and the applicable size chart before sample or bulk-production decisions.',
    },
    {
      heading: 'Plan Samples, Quotation and Delivery to Victoria',
      body: 'Sample availability, unit pricing, shipping method and delivery timing are project-specific. They are confirmed after the garment format, materials, customization, quantity, destination and schedule have been reviewed. Do not treat an unconfirmed target date as a production or delivery commitment.',
    },
  ],
  faqs: [
    {
      question: 'What details should a Melbourne basketball club send for a quote?',
      answer: 'Send the jersey and shorts formats, quantity, colors, logo files, names and numbers, separate size breakdowns, target date and delivery postcode. Any missing specification is reviewed before the quotation is confirmed.',
    },
    {
      question: 'Can jersey and shorts sizes be listed separately?',
      answer: 'List jersey and shorts sizes in separate roster fields for each player. The applicable size chart and final size breakdown must be reviewed before production decisions.',
    },
    {
      question: 'Can a sample be reviewed before a bulk basketball uniform order?',
      answer: 'Sample availability, specification and timing are confirmed after the design, materials, construction, quantity and project requirements are reviewed.',
    },
    {
      question: 'How is delivery to Melbourne planned?',
      answer: 'Shipping method and delivery timing are confirmed according to the Melbourne or Victoria destination, shipment details and complete project requirements.',
    },
  ],
  finalCtaHeading: 'Ready to Plan a Melbourne Basketball Uniform Project?',
  primaryCta: {
    label: 'Request a Basketball Project Quote',
    href: '/get-quote/?product=Basketball+Uniforms&sport=Basketball&source=%2Fcustom-basketball-jerseys-melbourne%2F#quote-form',
  },
}

function decodeHtml(value: string): string {
  return value
    .replaceAll('&amp;', '&')
    .replaceAll('&quot;', '"')
    .replaceAll('&#x27;', "'")
    .replaceAll('&#39;', "'")
    .replaceAll('&lt;', '<')
    .replaceAll('&gt;', '>')
}

function visibleText(html: string): string {
  return decodeHtml(html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim())
}

function outputFile(pathname: string): string {
  return path.join(outputDirectory, ...pathname.split('/').filter(Boolean), 'index.html')
}

if (!outputMode) {
  test('Melbourne pSEO data exposes the approved buyer-decision and attributed quote contract', () => {
    const page = pseoPages.find(({slug}) => slug === expected.slug)
    assert.ok(page)
    assert.deepEqual(page, expected)

    const forbidden = /premium|high-performance|across Melbourne|Absolutely|free 3D mockups|help your academy stand out/i
    assert.doesNotMatch(JSON.stringify(page), forbidden)
  })

  test('the other 18 pSEO pages do not inherit Melbourne-only decision or CTA data', () => {
    const others = pseoPages.filter(({slug}) => slug !== expected.slug)
    assert.equal(others.length, 18)
    for (const page of others) {
      assert.equal(page.decisionSections, undefined, page.slug)
      assert.equal(page.finalCtaHeading, undefined, page.slug)
      assert.equal(page.primaryCta, undefined, page.slug)
    }
  })
} else {
  test('rendered Melbourne page preserves SEO boundaries and exposes the exact approved decision path', async () => {
    const html = await readFile(outputFile(route), 'utf8')
    const text = visibleText(html)

    assert.match(html, /<title>Custom Basketball Jerseys Melbourne \| Club &amp; Team Orders \| POXIOL<\/title>/)
    assert.match(html, /<meta name="description" content="Plan custom basketball jerseys for a Melbourne club, school, academy or distributor\. Review roster, artwork, sizing, sample and delivery details before a quote\."\/?>/)
    assert.match(html, /<link rel="canonical" href="https:\/\/www\.poxiol\.com\/custom-basketball-jerseys-melbourne\/"\/?>/)
    assert.equal((html.match(/<h1\b/gi) ?? []).length, 1)
    assert.match(text, /Custom Basketball Jerseys for Melbourne Clubs and Teams/)
    for (const section of expected.decisionSections) assert.match(text, new RegExp(section.heading))
    assert.match(html, /href="\/get-quote\/\?product=Basketball\+Uniforms&amp;sport=Basketball&amp;source=%2Fcustom-basketball-jerseys-melbourne%2F#quote-form"/)
    assert.doesNotMatch(text, /premium|high-performance|across Melbourne|Absolutely|free 3D mockups|help your academy stand out/i)
    assert.doesNotMatch(html, /<form\b/i)

    const jsonLd = [...html.matchAll(/<script\b[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi)]
      .map(([, json]) => JSON.parse(json))
    assert.equal(jsonLd.length, 1)
    assert.equal(jsonLd[0]['@type'], 'FAQPage')
    assert.deepEqual(
      jsonLd[0].mainEntity.map((item: {name: string; acceptedAnswer: {text: string}}) => ({
        question: item.name,
        answer: item.acceptedAnswer.text,
      })),
      expected.faqs,
    )

    const sitemap = await readFile(path.join(outputDirectory, 'sitemap.xml'), 'utf8')
    assert.match(sitemap, /https:\/\/www\.poxiol\.com\/custom-basketball-jerseys-melbourne\//)
  })

  test('rendered global Basketball page contains exactly one Melbourne project-brief link', async () => {
    const html = await readFile(outputFile(basketballRoute), 'utf8')
    const links = html.match(/href="\/custom-basketball-jerseys-melbourne\/"/g) ?? []
    assert.equal(links.length, 1)
    assert.match(visibleText(html), /Planning for a Melbourne club, school or distributor\? Review the Melbourne basketball jersey project brief →/)
  })
}
