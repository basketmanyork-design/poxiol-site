import assert from 'node:assert/strict'
import {readFile} from 'node:fs/promises'
import path from 'node:path'
import {test} from 'node:test'

// Catches a mobile CTA that resets the page, changes inquiry intent, loses its
// actual form target, or replaces the established WhatsApp route.
const cases = [
  {route: '/get-quote/', href: '#quote-form', label: 'Get Quote'},
  {route: '/free-mockup/', href: '#free-mockup-form', label: 'Free Mockup'},
  {route: '/sample-order/', href: '#sample-request-form', label: 'Request Sample'},
  {route: '/contact/', href: '#contact-form', label: 'Inquiry Form'},
  {route: '/', href: '/get-quote/#quote-form', label: 'Get Quote'},
  {route: '/about/', href: '/get-quote/#quote-form', label: 'Get Quote'},
  {route: '/products/basketball-uniforms/', href: '/get-quote/#quote-form', label: 'Get Quote'},
]

for (const expected of cases) {
  test(`${expected.route} mobile action opens the matching form without a detour`, async () => {
    const html = (await readFile(path.join('out', expected.route.slice(1), 'index.html'), 'utf8'))
      .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '')
    const bar = html.match(/<div\b[^>]*class="[^"]*fixed[^"]*bottom-0[^"]*md:hidden[^"]*"[^>]*>[\s\S]*?<\/div>/i)?.[0]
    assert.ok(bar, 'Keep the existing mobile bottom bar')
    const links = [...bar.matchAll(/<a\b[^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/gi)]
      .map(match => ({href: match[1], text: match[2].replace(/<[^>]*>/g, '').trim()}))
    assert.equal(links.length, 2, 'Keep two clear choices, not more competing buttons')
    assert.ok(links[0].href.startsWith('https://wa.me/8613055646888?'), 'Preserve the confirmed WhatsApp account')
    assert.equal(links[0].text, 'WhatsApp')
    if (expected.route === '/products/basketball-uniforms/') {
      const contextual = new URL(links[1].href.replace(/&amp;/g,'&'),'https://www.poxiol.com')
      assert.equal(contextual.pathname,'/get-quote/')
      assert.equal(contextual.hash,'#quote-form')
      assert.equal(contextual.searchParams.get('sport'),'Basketball')
      assert.equal(contextual.searchParams.get('source'),expected.route)
      assert.equal(links[1].text,expected.label)
    } else {
      assert.deepEqual(links[1], {href: expected.href, text: expected.label})
    }
    const [destination, target] = expected.href.split('#')
    const targetHtml = destination
      ? await readFile(path.join('out', destination.slice(1), 'index.html'), 'utf8')
      : html
    assert.equal((targetHtml.match(new RegExp(`id="${target}"`, 'g')) || []).length, 1, 'Destination form anchor must exist exactly once')
  })
}
