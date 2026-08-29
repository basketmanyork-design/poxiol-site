import assert from 'node:assert/strict'
import {existsSync} from 'node:fs'
import {pathToFileURL} from 'node:url'
import {resolve} from 'node:path'
import {test} from 'node:test'

const file = resolve('lib/inquiry-context.ts')
const subject = existsSync(file) ? await import(pathToFileURL(file).href) : {}
function call(name, ...args) {
  assert.equal(typeof subject[name], 'function', `Missing inquiry context behavior: ${name}`)
  return subject[name](...args)
}
const basketball = {product: 'Basketball Uniforms', sport: 'Basketball', style: '', source: '/products/basketball-uniforms/'}

for (const [route,product] of [['/oem-odm/','OEM / ODM Teamwear'],['/private-label-teamwear/','Private Label Teamwear']]) {
  test(`${route} keeps its public program context through inquiry switching without copying page query data`, () => {
    const context = call('contextFromPage',route,'?product=Unexpected&email=synthetic%40example.invalid&sport=Soccer')
    assert.deepEqual(context,{product,sport:'',style:'',source:route})
    const quote = new URL(call('contextualInquiryHref','/get-quote/',context),'https://www.poxiol.com')
    assert.equal(quote.hash,'#quote-form')
    const next = call('contextFromPage',quote.pathname,quote.search)
    assert.deepEqual(next,context)
    const sample = new URL(call('contextualInquiryHref','/sample-order/',next),quote)
    assert.equal(sample.searchParams.get('product'),product)
    assert.equal(sample.searchParams.get('source'),route)
    assert.equal(sample.searchParams.has('email'),false)
    assert.equal(sample.searchParams.has('sport'),false)
  })
}

test('product page context derives a public reference and supported sport', () => {
  assert.deepEqual(call('contextFromPage', '/products/basketball-uniforms/', ''), basketball)
  assert.equal(call('contextFromPage', '/products/soccer-jerseys/', '').sport, 'Soccer')
  assert.equal(call('contextFromPage', '/products/baseball-uniforms/', '').sport, 'Baseball / Softball')
  assert.equal(call('contextFromPage', '/products/team-accessories/', '').sport, '')
})
test('product CTA preserves intent, adds context and reaches the correct form', () => {
  const url = new URL(call('contextualInquiryHref', '/free-mockup/', basketball), 'https://www.poxiol.com')
  assert.equal(url.pathname, '/free-mockup/')
  assert.equal(url.hash, '#free-mockup-form')
  assert.deepEqual(Object.fromEntries(url.searchParams), {product:'Basketball Uniforms',sport:'Basketball',source:'/products/basketball-uniforms/'})
  assert.equal(new URL(call('contextualInquiryHref', '/sample-order/', basketball), url).hash, '#sample-request-form')
})
test('an explicit solution or style beats generic page context', () => {
  const href = '/get-quote/?product=Soccer+Uniform+Solution&sport=Soccer&style=away-kit'
  const url = new URL(call('contextualInquiryHref', href, {product:'Teamwear Solutions',source:'/solutions/',sport:'',style:''}), 'https://www.poxiol.com')
  assert.equal(url.searchParams.get('product'), 'Soccer Uniform Solution')
  assert.equal(url.searchParams.get('sport'), 'Soccer')
  assert.equal(url.searchParams.get('style'), 'away-kit')
  assert.equal(url.searchParams.get('source'), '/solutions/')
})
test('form query round-trip survives changing inquiry path without inventing a new origin', () => {
  const ctx = call('contextFromPage', '/free-mockup/', '?product=Basketball+Uniforms&sport=Basketball&source=%2Fproducts%2Fbasketball-uniforms%2F')
  assert.deepEqual(ctx, basketball)
  const url = new URL(call('contextualInquiryHref', '/get-quote/', ctx), 'https://www.poxiol.com')
  assert.equal(url.searchParams.get('source'), '/products/basketball-uniforms/')
  assert.equal(url.hash, '#quote-form')
})
test('query data cannot introduce external origins, markup, personal values or invalid sport', () => {
  const ctx = call('contextFromPage', '/get-quote/', '?product=buyer%40example.com&style=%3Cscript%3E&sport=Invalid&source=https%3A%2F%2Fevil.example%2F')
  assert.deepEqual(ctx, {product:'',style:'',sport:'',source:''})
  assert.equal(call('publicSourcePath', 'https://www.poxiol.com/products/basketball-uniforms/?email=buyer@example.com#private'), '/products/basketball-uniforms/')
  assert.equal(call('publicSourcePath', '//evil.example/private'), '')
  assert.equal(call('publicSourcePath', '/products/%2e%2e/private/'), '')
})
test('unrelated links, direct forms and same-page anchors stay unchanged', () => {
  for (const href of ['/factory/', '#quote-form', 'https://example.com/get-quote/', '/get-quote/']) {
    const context = href === '/get-quote/' ? {} : basketball
    assert.equal(call('contextualInquiryHref', href, context), href)
  }
})
test('WhatsApp includes public product, path and intent without forwarding arbitrary query data', () => {
  const url = new URL(call('contextualWhatsAppHref', 'https://wa.me/8613055646888?text=Hello', basketball, 'quote'))
  assert.equal(url.host, 'wa.me')
  assert.equal(url.pathname, '/8613055646888')
  assert.match(url.searchParams.get('text'), /Basketball Uniforms/)
  assert.match(url.searchParams.get('text'), /quote/i)
  assert.match(url.searchParams.get('text'), /https:\/\/www\.poxiol\.com\/products\/basketball-uniforms\//)
  assert.equal(call('contextualWhatsAppHref', 'https://example.com/', basketball, 'quote'), 'https://example.com/')
})

test('a program label alone does not hide the sport when switching to WhatsApp or general inquiry', () => {
  const context = {...basketball,product:'Teamwear Program',source:'/solutions/'}
  const wa = new URL(call('contextualWhatsAppHref','https://wa.me/8613055646888',context,'contact'))
  assert.match(wa.searchParams.get('text'),/Basketball/)
  const body = new FormData()
  call('appendInquiryContext',body,context)
  assert.equal(body.get('sourceSport'),'Basketball')
})
test('submission records the buyer-edited reference and separate original source', () => {
  const body = new FormData()
  body.set('sport', 'Soccer')
  body.set('intent', 'quote')
  call('appendInquiryContext', body, {...basketball, product:'Training tops', style:'updated-look'})
  assert.deepEqual(Object.fromEntries(body), {sport:'Soccer',intent:'quote',requested_product:'Training tops',selected_style:'updated-look',originPage:'/products/basketball-uniforms/',sourceSport:'Basketball'})
})
test('clearing a suggested reference does not silently restore it in the payload', () => {
  const body = new FormData()
  call('appendInquiryContext', body, {...basketball, product:'',style:''})
  assert.equal(body.has('requested_product'), false)
  assert.equal(body.has('selected_style'), false)
  assert.equal(body.get('originPage'), '/products/basketball-uniforms/')
})

test('buyer-edited international references are retained in private submission, not put in a URL', () => {
  const body = new FormData()
  call('appendInquiryContext', body, {...basketball,product:'Équipe 青年队',style:'Saison été'})
  assert.equal(body.get('requested_product'),'Équipe 青年队')
  assert.equal(body.get('selected_style'),'Saison été')
})
