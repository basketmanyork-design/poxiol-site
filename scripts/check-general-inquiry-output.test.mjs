import assert from 'node:assert/strict'
import {readFile} from 'node:fs/promises'
import {test} from 'node:test'

const readPage = async route => (await readFile(`out/${route}/index.html`, 'utf8')).replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '')

test('a general question needs only a message and reply email, not production details', async () => {
  const html = await readPage('contact')
  const form = html.match(/<form\b[^>]*>[\s\S]*?<\/form>/i)?.[0]
  assert.ok(form)
  const controls = [...form.matchAll(/<(?:input|textarea|select)\b[^>]*>/gi)].map(match => match[0])
  const required = controls.filter(tag => /\srequired(?:\s|=|>)/i.test(tag)).map(tag => tag.match(/name="([^"]+)"/)?.[1]).sort()
  assert.deepEqual(required, ['email', 'message'])
  const visibleNames = controls.filter(tag => !/name="_gotcha"|type="hidden"/i.test(tag)).map(tag => tag.match(/name="([^"]+)"/)?.[1]).sort()
  assert.deepEqual(visibleNames, ['email', 'fullName', 'message'])
  assert.doesNotMatch(form, /type="file"|<select\b/)
  assert.match(form, /name="email"[^>]*type="email"|type="email"[^>]*name="email"/)
  assert.match(form, /name="_gotcha"/)
  assert.match(form, /href="\/privacy-policy\/"/)
  assert.match(html, /href="https:\/\/wa\.me\/8613055646888/)
  assert.match(form, /href="mailto:/)
})

test('the short contact form appears before project-routing guidance', async () => {
  const html = await readPage('contact')
  assert.ok(html.indexOf('<form') < html.indexOf('id="conversion-entry-guide-title"'))
  assert.doesNotMatch(html, /POXIOL Project Qualification|name="quantity"|name="sport"/)
})

test('contact guidance distinguishes optional project details from a general question', async () => {
  const html = await readPage('contact')
  assert.match(html, /not required for a general question/)
  assert.match(html, /Have a question before you decide/)
  assert.doesNotMatch(html, /All routes use the same secure project review workflow/)
})

for (const route of ['get-quote', 'free-mockup', 'sample-order']) {
  test(`${route} keeps its full project form`, async () => {
    const html = await readPage(route)
    for (const name of ['buyerRole', 'sport', 'quantity', 'email']) {
      const control = html.match(new RegExp(`<(?:input|select)\\b[^>]*name="${name}"[^>]*>`))?.[0]
      assert.ok(control && /\srequired(?:\s|=|>)/.test(control), name)
    }
    assert.equal((html.match(/<input\b[^>]*type="file"/g) || []).length, 3)
  })
}
