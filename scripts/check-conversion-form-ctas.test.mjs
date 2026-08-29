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
  {route: '/get-quote/', target: 'quote-form', title: 'Request a Factory Quote', bottomCta: true},
  {route: '/free-mockup/', target: 'free-mockup-form', title: 'Request a Free Mockup', bottomCta: true},
  {route: '/sample-order/', target: 'sample-request-form', title: 'Request a Production Sample', bottomCta: true},
  {route: '/contact/', target: 'contact-form', title: 'Send a General Inquiry', bottomCta: false},
]

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
    assert.equal((html.match(/<input\b[^>]*type="file"/gi) || []).length, page.route === '/contact/' ? 0 : 3, 'Only the general inquiry drops project attachments')
    for (const name of page.route === '/contact/' ? ['message', 'email'] : ['buyerRole', 'sport', 'quantity', 'email']) {
      const control = html.match(new RegExp(`<(?:input|select|textarea)\\b[^>]*name="${name}"[^>]*>`, 'i'))?.[0]
      assert.ok(control && /\srequired(?:\s|=|>)/i.test(control), `Keep ${name} validation unchanged in CTA-01`)
    }
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
