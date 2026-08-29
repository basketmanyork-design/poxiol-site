import assert from 'node:assert/strict'
import {existsSync} from 'node:fs'
import {pathToFileURL} from 'node:url'
import {resolve} from 'node:path'
import {test} from 'node:test'

const modulePath = resolve('lib/general-inquiry.ts')
const subject = existsSync(modulePath) ? await import(pathToFileURL(modulePath).href) : {}
function submit(...args) {
  assert.equal(typeof subject.submitGeneralInquiry, 'function', 'The general-question submission handler must exist')
  return subject.submitGeneralInquiry(...args)
}
const endpoint = 'https://formspree.io/f/test-never-sent'
const fields = {message: ' Can you ship to my country? ', email: ' buyer@example.com ', fullName: '', _gotcha: ''}
const context = {endpoint, sourcePage: 'https://www.poxiol.com/contact/'}

test('a minimal question reaches the existing provider as a general inquiry, not a low-priority project', async () => {
  let requests = 0
  await submit(fields, context, async (url, options) => {
    requests++
    assert.equal(url, endpoint)
    assert.equal(options.method, 'POST')
    assert.equal(options.headers.Accept, 'application/json')
    assert.deepEqual(Object.fromEntries(options.body), {
      message: 'Can you ship to my country?', email: 'buyer@example.com', fullName: '', _gotcha: '',
      intent: 'contact', formType: 'Contact Page CMS', inquiryType: 'general-question', sourcePage: context.sourcePage,
    })
    return new Response('{}', {status: 200})
  })
  assert.equal(requests, 1)
  assert.equal(fields.message, ' Can you ship to my country? ', 'Do not mutate the buyer draft')
})

test('empty, whitespace-only, malformed and oversized inputs are rejected before a request', async () => {
  const invalid = [{message: ''}, {message: '  '}, {email: ''}, {email: 'not-an-email'}, {email: 'a@b c.com'}, {message: 'x'.repeat(5001)}, {fullName: 'x'.repeat(101)}, {email: 'a'.repeat(250)+'@x.com'}]
  for (const change of invalid) {
    let requested = false
    await assert.rejects(async () => submit({...fields, ...change}, context, async () => { requested = true; return new Response('{}') }), /Please enter|too long|characters/)
    assert.equal(requested, false)
  }
})

test('a filled honeypot does not submit or claim success', async () => {
  let requested = false
  await assert.rejects(async () => submit({...fields, _gotcha: 'spam'}, context, async () => { requested = true; return new Response('{}') }), /Please use email or WhatsApp/)
  assert.equal(requested, false)
})

test('provider errors distinguish explicit rejection from an uncertain result', async () => {
  for (const [status, unconfirmed] of [[400,false], [422,false], [429,false], [408,true], [500,true], [503,true]]) {
    await assert.rejects(async () => submit(fields, context, async () => new Response('{}', {status})), error => {
      assert.equal(error.unconfirmed, unconfirmed)
      return true
    })
  }
})

test('network errors do not turn into accepted inquiries', async () => {
  await assert.rejects(async () => submit(fields, context, async () => {throw new TypeError('Network unavailable')}), error => {
    assert.equal(error.unconfirmed, true)
    return true
  })
})

test('missing configuration cannot post to the current page', async () => {
  let requested = false
  await assert.rejects(async () => submit(fields, {...context, endpoint: undefined}, async () => { requested = true; return new Response('{}') }), /not configured/)
  assert.equal(requested, false)
})

test('optional name and international question content are preserved', async () => {
  await submit({...fields, message: 'Can we discuss livraison / 配送?', fullName: ' Alex '}, context, async (_url, options) => {
    assert.equal(options.body.get('message'), 'Can we discuss livraison / 配送?')
    assert.equal(options.body.get('fullName'), 'Alex')
    assert.equal(options.body.has('leadPriority'), false)
    return new Response('{}', {status: 200})
  })
})
