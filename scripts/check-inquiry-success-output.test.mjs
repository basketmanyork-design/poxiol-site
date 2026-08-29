import assert from 'node:assert/strict'
import {readFile} from 'node:fs/promises'
import {join} from 'node:path'
import {test} from 'node:test'

// Check the rendered recovery paths, not source strings or a simulated receipt.
// Removing/misrouting a body contact link must fail even if the footer still has it.
const routes = ['quote-received', 'sample-request-received', 'thank-you']
for (const route of routes) {
  test(`/${route}/ offers email and WhatsApp follow-up in the receipt body without a second submission`, async () => {
    const html = await readFile(join('out', route, 'index.html'), 'utf8')
    const main = html.match(/<main\b[^>]*>([\s\S]*?)<\/main>/i)?.[1] || ''
    const body = main.replace(/<header\b[^>]*>[\s\S]*?<\/header>/gi, '').replace(/<footer\b[^>]*>[\s\S]*?<\/footer>/gi, '')
    const links = [...body.matchAll(/<a\b([^>]*)>([\s\S]*?)<\/a>/gi)].map(match => ({
      attrs: match[1],
      href: (match[1].match(/\bhref="([^"]+)"/)?.[1] || '').replaceAll('&amp;', '&'),
      label: match[2].replace(/<[^>]*>/g, '').trim(),
    }))
    const mail = links.find(link => link.href.startsWith('mailto:'))
    assert.ok(mail?.label, 'A visible email action must be in the confirmation body, not only the footer')
    assert.equal(decodeURIComponent(mail.href.slice(7).split('?')[0]), 'sales@poxiol.com')
    const whatsapp = links.find(link => link.href.startsWith('https://wa.me/'))
    assert.ok(whatsapp?.label, 'A visible WhatsApp fallback must be in the confirmation body')
    assert.equal(new URL(whatsapp.href).pathname, '/8613055646888')
    if (/\btarget="_blank"/.test(whatsapp.attrs)) assert.match(whatsapp.attrs, /\brel="[^"]*noopener/)
    assert.ok(links.some(link => link.href === '/contact/#contact-form' && link.label), 'Direct visitors can reach the existing contact form')
    assert.doesNotMatch(body, /<form\b|<button\b[^>]*type="submit"/i, 'Following up must not re-submit the original request')
    assert.ok(links.some(link => link.href === '/' && link.label), 'Keep the existing home navigation')
  })
  test(`/${route}/ remains an unindexed confirmation page with one primary heading`, async () => {
    const html = await readFile(join('out', route, 'index.html'), 'utf8')
    const robots = [...html.matchAll(/<meta\b[^>]*>/gi)].map(match=>match[0]).find(tag=>/\bname="robots"/.test(tag)) || ''
    assert.match(robots, /noindex/)
    assert.match(robots, /nofollow/)
    assert.equal((html.match(/<h1\b/g)||[]).length, 1)
  })
}
