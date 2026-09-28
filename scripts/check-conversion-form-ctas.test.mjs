import assert from 'node:assert/strict'
import {readFile} from 'node:fs/promises'
import path from 'node:path'
import {test} from 'node:test'

// Exercise rendered pages, not source strings: an incorrect CTA destination or
// a missing form target must fail even when the implementation is refactored.
const baseIndex = process.argv.indexOf('--base-url')
const baseUrl = baseIndex === -1 ? null : new URL(process.argv[baseIndex + 1])
if (baseUrl) {
  assert.ok(['localhost', '127.0.0.1', '[::1]'].includes(baseUrl.hostname), 'HTTP checks are local-only; never submit a real inquiry.')
}

const pages = [
  {route: '/get-quote/', target: 'quote-form', title: 'Request a Quote', bottomCta: true},
  {route: '/free-mockup/', target: 'free-mockup-form', title: 'Request Your Free Mockup', bottomCta: true},
  {route: '/sample-order/', target: 'sample-request-form', title: 'Apply for a Free Sample', bottomCta: true},
  {route: '/contact/', target: 'contact-form', title: 'Send a General Inquiry', bottomCta: false},
]

test('CRO pilot keeps existing choices and adds three exact contextual quote entries', async () => {
  const [home, basketball, privateLabel, procurementForm] = await Promise.all([
    readFile('components/home-optimization/HomepageOptimization.tsx', 'utf8'),
    readFile('components/v8/BasketballV8LandingPage.tsx', 'utf8'),
    readFile('app/customization/private-label/page.tsx', 'utf8'),
    readFile('components/forms/ProcurementContactForm.tsx', 'utf8'),
  ])

  assert.match(home, />Tell Us About Your Project<\/Link>/)
  assert.match(home, />Get a Free Mockup<\/Link>/)
  assert.match(home, />Request a Quote<\/Link>/)
  assert.match(home, /contextualInquiryHref\('\/get-quote\/', \{source: '\/'\}\)/)
  assert.match(home, /data-analytics-location="hero"/)

  assert.match(basketball, /label: 'Request a Basketball Quote'/)
  assert.match(basketball, /product: 'Basketball Uniforms'/)
  assert.match(basketball, /source: '\/products\/basketball-uniforms\/'/)
  assert.match(basketball, /<V8Hero[\s\S]*?primary=\{heroQuoteCta\}/)
  assert.match(basketball, /<FinalCTA[\s\S]*?primary=\{PHASE4_BASKETBALL\.primaryCta\}/)

  assert.match(privateLabel, />Request a Private Label Quote<\/PrimaryButton>/)
  assert.match(privateLabel, /product: 'Private Label Teamwear'/)
  assert.match(privateLabel, /source: '\/customization\/private-label\/'/)
  assert.match(privateLabel, /analyticsLocation="hero"/)
  assert.match(procurementForm, /Provide at least one contact method/, 'The progressive quote flow must retain alternative contact validation in its later contact step')
})

test('CRO pilot renders each approved contextual quote entry exactly once', async () => {
  const cases = [
    {route: '/', label: 'Request a Quote', href: '/get-quote/?source=%2F#quote-form'},
    {route: '/products/basketball-uniforms/', label: 'Request a Basketball Quote', href: '/get-quote/?product=Basketball+Uniforms&sport=Basketball&source=%2Fproducts%2Fbasketball-uniforms%2F#quote-form'},
    {route: '/customization/private-label/', label: 'Request a Private Label Quote', href: '/get-quote/?product=Private+Label+Teamwear&source=%2Fcustomization%2Fprivate-label%2F#quote-form'},
  ]

  for (const item of cases) {
    const html = withoutScripts(await renderedPage(item.route))
    const matches = anchors(html)
      .map((link) => ({...link, href: link.href.replaceAll('&amp;', '&')}))
      .filter((link) => link.text === item.label)
    assert.deepEqual(matches, [{href: item.href, text: item.label}], `${item.route} must render its approved contextual quote URL exactly once`)
  }
})

async function renderedPage(route) {
  if (!baseUrl) return readFile(path.join('out', route.slice(1), 'index.html'), 'utf8')
  const response = await fetch(new URL(route, baseUrl))
  assert.equal(response.status, 200, `${route} must render successfully`)
  return response.text()
}

function withoutScripts(html) {
  return html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '')
}

function anchors(html) {
  return [...html.matchAll(/<a\b[^>]*href="([^"]*)"[^>]*>([\s\S]*?)<\/a>/gi)]
    .map((match) => ({href: match[1], text: match[2].replace(/<[^>]+>/g, '').trim()}))
}

function targetEnd(html, target) {
  const tag = target[0].match(/^<([a-z][a-z0-9-]*)\b/i)[1]
  const tokens = new RegExp(`<(/?)${tag}\\b[^>]*>`, 'gi')
  tokens.lastIndex = target.index
  let depth = 0
  for (let token; (token = tokens.exec(html));) {
    depth += token[1] ? -1 : 1
    if (depth === 0) return token.index
  }
  assert.fail('Anchor target must be a complete element')
}

for (const page of pages) {
  test(`${page.route} primary actions reach its own existing inquiry form`, async () => {
    const html = withoutScripts(await renderedPage(page.route))
    const hero = html.match(/<h1\b[^>]*>[\s\S]*?<\/section>/i)?.[0]
    assert.ok(hero, `${page.route} needs a rendered hero`)
    assert.deepEqual(anchors(hero), [{href: `#${page.target}`, text: page.title}], 'The hero must have one intent-specific action, not a contact detour or duplicate action')

    const target = html.match(new RegExp(`<[^>]+\\bid="${page.target}"[^>]*>`, 'i'))
    assert.ok(target, `CTA target #${page.target} must exist`)
    assert.equal((html.match(new RegExp(`\\bid="${page.target}"`, 'g')) || []).length, 1, 'The target must be unique')
    assert.match(target[0], /tabindex="-1"/i, 'The destination must accept anchor focus without adding a tab stop')
    const formIndex = html.indexOf('<form')
    assert.ok(formIndex > target.index && formIndex < targetEnd(html, target), 'The target must contain the actual form, not an unrelated preceding guide')
    assert.ok(html.indexOf('<footer') > formIndex, 'The form must remain before the footer')

    if (page.bottomCta) {
      const bottom = html.match(/<h2\b[^>]*>Ready to move this project forward\?[\s\S]*?<\/section>/i)?.[0]
      assert.ok(bottom, 'Keep the existing lower action section')
      assert.deepEqual(anchors(bottom), [{href: `#${page.target}`, text: page.title}], 'Lower actions must not change a quote/sample request into a mockup request')
    }

    assert.equal((html.match(/<form\b/gi) || []).length, 1, 'Do not introduce duplicate inquiry forms')
    assert.equal((html.match(/<input\b[^>]*type="file"/gi) || []).length, page.route === '/contact/' ? 0 : 1, 'Project form has one optional artwork picker')
    const visibleFields = page.route === '/contact/'
      ? ['message', 'email']
      : page.route === '/get-quote/'
        ? ['product-0', 'quantity-0']
        : ['product-0', 'quantity-0', 'required_delivery_date', 'delivery_country_code', 'delivery_postal_code']
    for (const name of visibleFields) {
      const control = html.match(new RegExp(`<(?:input|select|textarea)\\b[^>]*name="${name}"[^>]*>`, 'i'))?.[0]
      assert.ok(control, `Keep ${name} present in the buyer form`)
      if (page.route === '/contact/') assert.match(control, /\srequired(?:\s|=|>)/i)
    }
    if (page.route === '/get-quote/') {
      assert.match(html, /Step\s*<!-- -->1<!-- -->\s*of\s*<!-- -->3/i, 'Get Quote must server-render the first of three progressive steps')
      assert.match(html, />Continue<\/button>/i, 'Get Quote must expose its step advance control')
    }
    if (page.route !== '/contact/' && page.route !== '/get-quote/') assert.match(html, /Provide at least one contact method/, 'Email or WhatsApp is validated as an alternative')
    assert.ok(anchors(html).some((link) => link.href.startsWith('https://wa.me/8613055646888')), 'Keep the established WhatsApp channel')
    assert.match(html, new RegExp(`<link[^>]*rel="canonical"[^>]*href="https://www\\.poxiol\\.com${page.route}"`), 'Do not change canonical URLs')
  })
}

test('About retains a contact action without duplicating the same destination', async () => {
  const html = withoutScripts(await renderedPage('/about/'))
  const hero = html.match(/<h1\b[^>]*>[\s\S]*?<\/section>/i)?.[0]
  assert.ok(hero)
  assert.equal(anchors(hero).filter((link) => link.href === '/contact/').length, 1)
})
