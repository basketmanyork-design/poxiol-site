import assert from 'node:assert/strict'
import {existsSync, readFileSync} from 'node:fs'
import path from 'node:path'
import {V8_CONVERSION_ENTRIES} from '../lib/v8/leads.ts'
import {FREE_MOCKUP_FAQS, GET_QUOTE_FAQS, withFreeMockupFaqs, withGetQuoteFaqs} from '../lib/v8/conversion-faqs.ts'
import type {CmsPage} from '../lib/cms/types.ts'

const root = process.cwd()
const outputMode = process.argv.includes('--output')
const read = (relative: string) => readFileSync(path.join(root, relative), 'utf8')
const freeMockupFaqQuestions = [
  'What information is needed for a mockup request?',
  'Can buyers upload logos or references?',
  'What happens after receiving a mockup?',
  'What information is needed before production discussion?',
] as const
const getQuoteFaqQuestions = [
  'What information is needed to prepare a quote?',
  'What affects the final quotation?',
  'Can I include custom names, numbers, labels or packaging in the quote?',
  'What happens after I submit a quote request?',
] as const

assert.deepEqual(V8_CONVERSION_ENTRIES.map((entry) => [entry.intent, entry.path]), [
  ['mockup', '/free-mockup/'],
  ['quote', '/get-quote/'],
  ['sample', '/sample-order/'],
  ['contact', '/contact/'],
])
assert.equal(new Set(V8_CONVERSION_ENTRIES.map((entry) => entry.purpose)).size, 4, 'Conversion pages must keep separate buyer intents.')
assert.equal(new Set(V8_CONVERSION_ENTRIES.map((entry) => entry.ctaLabel)).size, 4, 'Each conversion intent needs a specific submission CTA.')

const freeMockupSource = read('app/free-mockup/page.tsx')
assert.match(freeMockupSource, /FREE_MOCKUP_FAQS/, 'Free Mockup must use its page-specific shared FAQ data.')
assert.match(freeMockupSource, /withFreeMockupFaqs\(page, FREE_MOCKUP_FAQS\)/, 'Free Mockup must safely override CMS FAQ sections with its approved FAQ set.')
assert.deepEqual(FREE_MOCKUP_FAQS.map((faq) => faq.question), [...freeMockupFaqQuestions])
assert.doesNotMatch(JSON.stringify(FREE_MOCKUP_FAQS), /\b(?:\d+\s*(?:hours?|days?)|MOQ\s*\d+|guarantee(?:d|s)?)\b/i, 'Free Mockup FAQs must not publish fixed timing, MOQ or guarantees.')
const pageWithFreeMockupFaqs = withFreeMockupFaqs({sections: [
  {type: 'richText', title: 'Keep this section'},
  {type: 'faq', title: 'CMS FAQ', faqs: [{question: 'Old question', answer: 'Old answer'}]},
]} as CmsPage, FREE_MOCKUP_FAQS)
assert.deepEqual(pageWithFreeMockupFaqs.sections.filter((section) => section.type === 'faq').flatMap((section) => section.faqs || []), FREE_MOCKUP_FAQS, 'The approved FAQ set must replace CMS FAQ content without duplication.')
assert.ok(pageWithFreeMockupFaqs.sections.some((section) => section.title === 'Keep this section'), 'Non-FAQ CMS sections must remain intact.')

const getQuoteSource = read('app/get-quote/page.tsx')
assert.match(getQuoteSource, /GET_QUOTE_FAQS/, 'Get Quote must use its page-specific shared FAQ data.')
assert.match(getQuoteSource, /withGetQuoteFaqs\(page, GET_QUOTE_FAQS\)/, 'Get Quote must safely override CMS FAQ sections with its approved FAQ set.')
assert.deepEqual(GET_QUOTE_FAQS.map((faq) => faq.question), [...getQuoteFaqQuestions])
assert.doesNotMatch(JSON.stringify(GET_QUOTE_FAQS), /\b(?:\d+\s*(?:hours?|days?)|MOQ\s*\d+|guarantee(?:d|s)?|guaranteed\s+(?:pricing|shipping|discounts?))\b/i, 'Get Quote FAQs must not publish fixed timing, MOQ, pricing, shipping or discount guarantees.')
const pageWithGetQuoteFaqs = withGetQuoteFaqs({sections: [
  {type: 'richText', title: 'Keep this quote section'},
  {type: 'faq', title: 'CMS Quote FAQ', faqs: [{question: 'Old quote question', answer: 'Old quote answer'}]},
]} as CmsPage, GET_QUOTE_FAQS)
assert.deepEqual(pageWithGetQuoteFaqs.sections.filter((section) => section.type === 'faq').flatMap((section) => section.faqs || []), GET_QUOTE_FAQS, 'The approved Get Quote FAQ set must replace CMS FAQ content without duplication.')
assert.ok(pageWithGetQuoteFaqs.sections.some((section) => section.title === 'Keep this quote section'), 'Non-FAQ Get Quote CMS sections must remain intact.')

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

  const freeMockupHtml = read('out/free-mockup/index.html')
  const visibleFreeMockupQuestions = [...freeMockupHtml.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '').matchAll(/<summary\b[^>]*>([\s\S]*?)<\/summary>/gi)]
    .map((match) => match[1].replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim())
  const freeMockupFaqSchemas = [...freeMockupHtml.matchAll(/<script\s+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)]
    .map((match) => JSON.parse(match[1]))
    .filter((schema) => schema['@type'] === 'FAQPage')
  assert.deepEqual(visibleFreeMockupQuestions, [...freeMockupFaqQuestions], 'Free Mockup must show exactly its four page-specific FAQs.')
  assert.equal(freeMockupFaqSchemas.length, 1, 'Free Mockup must publish one FAQPage schema.')
  assert.deepEqual(freeMockupFaqSchemas[0].mainEntity.map((item: {name: string}) => item.name), visibleFreeMockupQuestions, 'Free Mockup FAQPage schema must match the visible FAQ data.')

  const getQuoteHtml = read('out/get-quote/index.html')
  const visibleGetQuoteFaqs = [...getQuoteHtml.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '').matchAll(/<details\b[^>]*>[\s\S]*?<summary\b[^>]*>([\s\S]*?)<\/summary>[\s\S]*?<p\b[^>]*>([\s\S]*?)<\/p>[\s\S]*?<\/details>/gi)]
    .map((match) => ({
      question: match[1].replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim(),
      answer: match[2].replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim(),
    }))
  const getQuoteFaqSchemas = [...getQuoteHtml.matchAll(/<script\s+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)]
    .map((match) => JSON.parse(match[1]))
    .filter((schema) => schema['@type'] === 'FAQPage')
  assert.deepEqual(visibleGetQuoteFaqs, GET_QUOTE_FAQS.map(({question, answer}) => ({question, answer})), 'Get Quote must show exactly its four page-specific FAQ questions and answers.')
  assert.equal(getQuoteFaqSchemas.length, 1, 'Get Quote must publish exactly one FAQPage schema.')
  assert.deepEqual(getQuoteFaqSchemas[0].mainEntity.map((item: {name: string; acceptedAnswer: {text: string}}) => ({question: item.name, answer: item.acceptedAnswer.text})), visibleGetQuoteFaqs, 'Get Quote FAQPage schema must match visible questions, answers and order.')
}

console.log(`POXIOL V8 Phase 5 ${outputMode ? 'output' : 'source'} checks passed.`)
