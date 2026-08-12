import assert from 'node:assert/strict'
import {existsSync, readFileSync} from 'node:fs'
import path from 'node:path'
import {V8_CONVERSION_ENTRIES} from '../lib/v8/leads.ts'

const root = process.cwd()
const outputMode = process.argv.includes('--output')
const read = (relative: string) => readFileSync(path.join(root, relative), 'utf8')

assert.deepEqual(V8_CONVERSION_ENTRIES.map((entry) => [entry.intent, entry.path]), [
  ['mockup', '/free-mockup/'],
  ['quote', '/get-quote/'],
  ['sample', '/sample-order/'],
  ['contact', '/contact/'],
])
assert.equal(new Set(V8_CONVERSION_ENTRIES.map((entry) => entry.purpose)).size, 4, 'Conversion pages must keep separate buyer intents.')
assert.equal(new Set(V8_CONVERSION_ENTRIES.map((entry) => entry.ctaLabel)).size, 4, 'Each conversion intent needs a specific submission CTA.')

if (outputMode) {
  const requiredFields = [
    'buyerRole',
    'sport',
    'quantity',
    'deadline',
    'customizationRequirements',
    'logo_file',
    'reference_design_file',
    'whatsapp',
    'email',
  ]

  for (const entry of V8_CONVERSION_ENTRIES) {
    const outputFile = path.join(root, 'out', entry.path.replace(/^\/+|\/+$/g, ''), 'index.html')
    assert.equal(existsSync(outputFile), true, `Missing conversion route: ${entry.path}`)
    const html = readFileSync(outputFile, 'utf8')
    const visibleHtml = html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '')
    const visibleText = visibleHtml.replace(/<[^>]+>/g, ' ').replace(/&amp;/g, '&').replace(/\s+/g, ' ')
    assert.ok(visibleText.includes(entry.formTitle), `${entry.path} is missing its intent-specific form title.`)
    assert.ok(visibleText.includes(entry.ctaLabel), `${entry.path} is missing its intent-specific CTA label.`)
    for (const field of requiredFields) {
      assert.match(visibleHtml, new RegExp(`<(?:input|select|textarea)\\b[^>]*name=["']${field}["']`, 'i'), `${entry.path} is missing ${field}.`)
    }
    assert.ok(visibleHtml.indexOf('name="buyerRole"') < visibleHtml.indexOf('<footer'), `${entry.path} must render its project form before the site footer.`)
    assert.ok(visibleText.includes('One project, one clear next step'), `${entry.path} is missing the shared conversion-entry guide.`)
  }

  const funnelRoutes = [
    '/',
    '/youth-team-uniforms/',
    '/school-teamwear/',
    '/club-teamwear-program/',
    '/private-label-teamwear/',
    '/products/basketball-uniforms/',
    '/customization/',
    '/manufacturing/',
  ]
  for (const route of funnelRoutes) {
    const relative = route === '/' ? 'out/index.html' : `out/${route.replace(/^\/+|\/+$/g, '')}/index.html`
    const html = read(relative)
    const hrefs = [...html.matchAll(/<a\b[^>]*href=["']([^"']+)["']/gi)].map((match) => match[1])
    assert.ok(hrefs.some((href) => ['/free-mockup/', '/get-quote/', '/sample-order/', '/contact/'].includes(href)), `${route} has no conversion entry CTA.`)
  }

  const customizationHtml = read('out/customization/index.html')
  assert.match(customizationHtml, /href=["']\/manufacturing\/["']/, 'Customization must link to the manufacturing authority page.')
  assert.match(customizationHtml, /href=["']\/get-quote\/["']/, 'Customization must retain a direct qualified inquiry path.')
  assert.ok(customizationHtml.includes('What information helps POXIOL review a custom teamwear project?'), 'Customization must show its shared project FAQ.')
  assert.ok(customizationHtml.includes('"@type":"FAQPage"'), 'Customization must expose FAQPage schema from the visible shared FAQ data.')
}

console.log(`POXIOL V8 Phase 5 ${outputMode ? 'output' : 'source'} checks passed.`)
