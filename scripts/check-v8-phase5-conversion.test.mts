import assert from 'node:assert/strict'
import {pageContentHtml} from './helpers/page-content-html.mjs'
import {existsSync, readFileSync} from 'node:fs'
import path from 'node:path'
import {V8_CONVERSION_ENTRIES} from '../lib/v8/leads.ts'
import {FREE_MOCKUP_FAQS, GET_QUOTE_FAQS, SAMPLE_ORDER_FAQS, withFreeMockupFaqs, withGetQuoteFaqs, withSampleOrderFaqs} from '../lib/v8/conversion-faqs.ts'
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
const sampleOrderFaqQuestions = [
  'What information is needed for a sample request?',
  'Can I provide my logo, artwork or reference files for the sample?',
  'What should I review when the sample is received?',
  'What happens after the sample is approved?',
] as const
const approvedSampleProgramClaim = 'Flexible Custom Team Uniforms. Qualified Teams, Clubs, Schools, Brands and Distributors Can Apply for One Free Sample. International Shipping Applies. Subject to Review.'
const unsafeSampleClaimPattern = /2\s*[-–]\s*3\s*day production|3\s*[-–]\s*7\s*day delivery|sample fee credited over 100 sets|MOQ\s*1\s*Set|free shipping/i
const unconditionalSampleFixturePattern = /"Free sample"|"(?:description|body)":"[^"]*\bfree sample\b/i
const withoutApprovedSampleClaim = (value: string) => value.split(approvedSampleProgramClaim).join('')

assert.deepEqual(V8_CONVERSION_ENTRIES.map((entry) => [entry.intent, entry.path]), [
  ['project', '/'],
  ['mockup', '/free-mockup/'],
  ['quote', '/get-quote/'],
  ['sample', '/sample-order/'],
  ['contact', '/contact/'],
])
assert.equal(new Set(V8_CONVERSION_ENTRIES.map((entry) => entry.purpose)).size, 5, 'Conversion pages must keep separate buyer intents.')
assert.equal(new Set(V8_CONVERSION_ENTRIES.map((entry) => entry.ctaLabel)).size, 5, 'Each conversion intent needs a specific submission CTA.')
assert.equal(V8_CONVERSION_ENTRIES.find((entry) => entry.intent === 'sample')?.subtitle, approvedSampleProgramClaim, 'The sample entry must use the exact approved sample-program claim.')

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
const procurementFormSource = read('components/forms/ProcurementContactForm.tsx')
const pageTemplateSource = read('components/cms/PageTemplate.tsx')
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
assert.match(pageTemplateSource, /afterHeroSlot\?: React\.ReactNode/, 'The CMS template must expose one optional after-hero slot.')
assert.ok(pageTemplateSource.indexOf('{afterHeroSlot}') > pageTemplateSource.indexOf('</section>'), 'The optional slot must render immediately after the hero.')
assert.match(getQuoteSource, /afterHeroSlot=/, 'Get Quote must place its form in the after-hero slot.')
assert.match(getQuoteSource, /beforeFooterSlot=\{<ConversionEntryGuide currentIntent="quote" \/>\}/, 'Only the conversion guide remains before the footer.')
for (const readiness of [
  'Product and quantity',
  'Required in-hand date and delivery destination',
  'Contact method; artwork or references are optional',
]) assert.ok(getQuoteSource.includes(readiness), `Get Quote is missing readiness copy: ${readiness}`)
assert.match(procurementFormSource, /PROCUREMENT_FORM_STEPS/, 'The procurement form must consume the governed step model.')
assert.match(procurementFormSource, /Step \{stepIndex\s*\+\s*1\} of \{PROCUREMENT_FORM_STEPS\.length\}/, 'The form must expose visible text progress.')
assert.match(procurementFormSource, /aria-current=\{item\.id===step\?'step':undefined\}/, 'The current step must be announced accessibly.')
for (const step of ['products', 'delivery', 'contact']) {
  assert.match(procurementFormSource, new RegExp(`step===['"]${step}['"]`), `The ${step} controls must render only on their active step.`)
}
assert.match(procurementFormSource, /function continueStep\(/, 'The form must validate before advancing.')
assert.match(procurementFormSource, /function backStep\(/, 'The form must support value-preserving back navigation.')
for (const tracker of ['trackFormStepView', 'trackFormStepComplete', 'trackFormValidationError', 'trackFileSelect', 'trackFileUpload']) {
  assert.match(procurementFormSource, new RegExp(`\\b${tracker}\\b`), `The form must wire ${tracker}.`)
}

const sampleOrderSource = read('app/sample-order/page.tsx')
assert.match(sampleOrderSource, /SAMPLE_ORDER_FAQS/, 'Sample Order must use its page-specific shared FAQ data.')
assert.match(sampleOrderSource, /withSampleOrderFaqs\(page, SAMPLE_ORDER_FAQS\)/, 'Sample Order must safely override CMS FAQ sections with its approved FAQ set.')
assert.deepEqual(SAMPLE_ORDER_FAQS.map((faq) => faq.question), [...sampleOrderFaqQuestions])
assert.doesNotMatch(JSON.stringify(SAMPLE_ORDER_FAQS), /\b(?:\d+\s*(?:hours?|days?)|MOQ\s*\d+|guarantee(?:d|s)?|guaranteed\s+(?:shipping|approval|availability)|refund|replacement)\b/i, 'Sample Order FAQs must not publish fixed timing, MOQ, shipping, approval, availability, refund or replacement promises.')
const pageWithSampleOrderFaqs = withSampleOrderFaqs({sections: [
  {type: 'richText', title: 'Keep this sample section', body: 'Free sample with free shipping. Sample fee credited over 100 sets. MOQ 1 Set. 2–3 day production and 3–7 day delivery.'},
  {type: 'evidenceGrid', title: 'Unsafe facts', facts: ['Free sample', 'Free shipping', 'MOQ 1 Set']},
  {type: 'stats', title: 'Unsafe stats', stats: [{value: '2–3 day production', label: 'Production'}, {value: '3–7 day delivery', label: 'Delivery'}]},
  {type: 'processSteps', title: 'Unsafe steps', steps: [{title: 'Credit', description: 'Sample fee credited over 100 sets.'}]},
  {type: 'specifications', title: 'Unsafe specifications', specifications: [{label: 'MOQ', value: 'MOQ 1 Set'}]},
  {type: 'faq', title: 'CMS Sample FAQ', faqs: [{question: 'Old sample question', answer: 'Old sample answer'}]},
], description: 'Start a 1-piece custom jersey sample order with a free sample.', seo: {description: 'Sample production: 2-3 working days after mockup approval. Free shipping.'}} as CmsPage, SAMPLE_ORDER_FAQS)
assert.deepEqual(pageWithSampleOrderFaqs.sections.filter((section) => section.type === 'faq').flatMap((section) => section.faqs || []), SAMPLE_ORDER_FAQS, 'The approved Sample Order FAQ set must replace CMS FAQ content without duplication.')
assert.ok(pageWithSampleOrderFaqs.sections.some((section) => section.title === 'Keep this sample section'), 'Non-FAQ Sample Order CMS sections must remain intact.')
const normalizedSamplePageJson = JSON.stringify(pageWithSampleOrderFaqs)
assert.match(normalizedSamplePageJson, new RegExp(approvedSampleProgramClaim.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')), 'The normalized Sample Order page must publish the exact approved eligibility and shipping claim.')
assert.doesNotMatch(withoutApprovedSampleClaim(normalizedSamplePageJson), unsafeSampleClaimPattern, 'Sample Order must normalize fixed timing, threshold, MOQ, unconditional free-sample and free-shipping claims from CMS content.')
assert.doesNotMatch(withoutApprovedSampleClaim(normalizedSamplePageJson), unconditionalSampleFixturePattern, 'Sample Order CMS copy must not retain an unconditional free-sample statement.')

if (outputMode) {
  const requiredFields = [
    'buyerRole',
    'product-0',
    'quantity-0',
    'required_delivery_date',
    'delivery_country_code',
    'delivery_postal_code',
    'whatsapp',
    'email',
  ]

  for (const entry of V8_CONVERSION_ENTRIES) {
    const outputFile = entry.path==='/'?path.join(root,'out','index.html'):path.join(root, 'out', entry.path.replace(/^\/+|\/+$/g, ''), 'index.html')
    assert.equal(existsSync(outputFile), true, `Missing conversion route: ${entry.path}`)
    const html = readFileSync(outputFile, 'utf8')
    const visibleHtml = html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '')
    const visibleText = visibleHtml.replace(/<[^>]+>/g, ' ').replace(/&amp;/g, '&').replace(/\s+/g, ' ')
    assert.ok(visibleText.includes(entry.formTitle), `${entry.path} is missing its intent-specific form title.`)
    if (entry.intent === 'quote') {
      assert.ok(visibleText.includes('Step 1 of 3') && visibleText.includes('Continue'), `${entry.path} must server-render the first progressive step and its advance control.`)
      assert.ok(['Products', 'Delivery', 'Contact'].every((label) => visibleText.includes(label)), `${entry.path} is missing its approved step labels.`)
    } else {
      assert.ok(visibleText.includes(entry.ctaLabel), `${entry.path} is missing its intent-specific CTA label.`)
    }
    const entryFields = entry.intent === 'contact'
      ? ['message', 'email', 'fullName']
      : entry.intent === 'quote'
        ? ['buyerRole', 'product-0', 'quantity-0']
        : requiredFields
    for (const field of entryFields) {
      assert.match(visibleHtml, new RegExp(`<(?:input|select|textarea)\\b[^>]*name=["']${field}["']`, 'i'), `${entry.path} is missing ${field}.`)
    }
    const firstField = entry.intent === 'contact' ? 'message' : 'buyerRole'
    assert.ok(visibleHtml.indexOf(`name="${firstField}"`) < visibleHtml.indexOf('<footer'), `${entry.path} must render its inquiry form before the site footer.`)
    if (entry.intent!=='project') assert.ok(visibleText.includes('One project, one clear next step'), `${entry.path} is missing the shared conversion-entry guide.`)
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
    assert.ok(hrefs.some((href) => {
      const url = new URL(href.replace(/&amp;/g,'&'),'https://www.poxiol.com')
      return url.origin === 'https://www.poxiol.com' && ['/free-mockup/', '/get-quote/', '/sample-order/', '/contact/'].includes(url.pathname)
    }), `${route} has no conversion entry CTA.`)
  }

  const customizationHtml = read('out/customization/index.html')
  assert.match(customizationHtml, /href=["']\/manufacturing\/["']/, 'Customization must link to the manufacturing authority page.')
  assert.match(customizationHtml, /href=["']\/get-quote\/["']/, 'Customization must retain a direct qualified inquiry path.')
  assert.ok(customizationHtml.includes('What information helps POXIOL review a custom teamwear project?'), 'Customization must show its shared project FAQ.')
  assert.ok(customizationHtml.includes('"@type":"FAQPage"'), 'Customization must expose FAQPage schema from the visible shared FAQ data.')

  const freeMockupHtml = read('out/free-mockup/index.html')
  const visibleFreeMockupQuestions = [...pageContentHtml(freeMockupHtml).matchAll(/<summary\b[^>]*>([\s\S]*?)<\/summary>/gi)]
    .map((match) => match[1].replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim())
  const freeMockupFaqSchemas = [...freeMockupHtml.matchAll(/<script\s+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)]
    .map((match) => JSON.parse(match[1]))
    .filter((schema) => schema['@type'] === 'FAQPage')
  assert.deepEqual(visibleFreeMockupQuestions, [...freeMockupFaqQuestions], 'Free Mockup must show exactly its four page-specific FAQs.')
  assert.equal(freeMockupFaqSchemas.length, 1, 'Free Mockup must publish one FAQPage schema.')
  assert.deepEqual(freeMockupFaqSchemas[0].mainEntity.map((item: {name: string}) => item.name), visibleFreeMockupQuestions, 'Free Mockup FAQPage schema must match the visible FAQ data.')

  const getQuoteHtml = read('out/get-quote/index.html')
  const visibleGetQuoteFaqs = [...pageContentHtml(getQuoteHtml).matchAll(/<details\b[^>]*>[\s\S]*?<summary\b[^>]*>([\s\S]*?)<\/summary>[\s\S]*?<p\b[^>]*>([\s\S]*?)<\/p>[\s\S]*?<\/details>/gi)]
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

  const sampleOrderHtml = read('out/sample-order/index.html')
  const visibleSampleOrderHtml = sampleOrderHtml.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '')
  const visibleSampleOrderText = visibleSampleOrderHtml.replace(/<[^>]+>/g, ' ').replace(/&amp;/g, '&').replace(/\s+/g, ' ')
  const visibleSampleOrderFaqs = [...pageContentHtml(sampleOrderHtml).matchAll(/<details\b[^>]*>[\s\S]*?<summary\b[^>]*>([\s\S]*?)<\/summary>[\s\S]*?<p\b[^>]*>([\s\S]*?)<\/p>[\s\S]*?<\/details>/gi)]
    .map((match) => ({
      question: match[1].replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim(),
      answer: match[2].replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim(),
    }))
  const sampleOrderFaqSchemas = [...sampleOrderHtml.matchAll(/<script\s+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)]
    .map((match) => JSON.parse(match[1]))
    .filter((schema) => schema['@type'] === 'FAQPage')
  assert.deepEqual(visibleSampleOrderFaqs, SAMPLE_ORDER_FAQS.map(({question, answer}) => ({question, answer})), 'Sample Order must show exactly its four page-specific FAQ questions and answers.')
  assert.equal(sampleOrderFaqSchemas.length, 1, 'Sample Order must publish exactly one FAQPage schema.')
  assert.deepEqual(sampleOrderFaqSchemas[0].mainEntity.map((item: {name: string; acceptedAnswer: {text: string}}) => ({question: item.name, answer: item.acceptedAnswer.text})), visibleSampleOrderFaqs, 'Sample Order FAQPage schema must match visible questions, answers and order.')
  assert.ok(visibleSampleOrderText.includes(approvedSampleProgramClaim), 'Sample Order output must publish the exact approved eligibility and shipping claim.')
  assert.doesNotMatch(withoutApprovedSampleClaim(visibleSampleOrderText), unsafeSampleClaimPattern, 'Sample Order output must not publish unsafe sample timing, threshold, MOQ, unconditional free-sample or free-shipping claims.')
}

console.log(`POXIOL V8 Phase 5 ${outputMode ? 'output' : 'source'} checks passed.`)
