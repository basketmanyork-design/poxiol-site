import assert from 'node:assert/strict'
import {readFile} from 'node:fs/promises'
import {join} from 'node:path'
import {test} from 'node:test'

const expected = 'https://formspree.io/f/xnpqqnol'
for (const route of ['', 'get-quote', 'free-mockup', 'sample-order', 'contact']) {
  test(`/${route}${route ? '/' : ''} sends both native and hydrated inquiry flows to the approved prelaunch endpoint`, async () => {
    const html = await readFile(join('out',route,'index.html'),'utf8')
    const forms = [...html.matchAll(/<form\b[^>]*>[\s\S]*?<\/form>/gi)].map(match=>match[0])
    assert.equal(forms.length,1,'Expected exactly one buyer inquiry form')
    const form = forms[0]
    assert.equal(form.match(/\baction="([^"]*)"/)?.[1],expected,'Native form action must use the newly tested account')
    assert.match(form, /\bmethod="post"/i)
    if (route === 'contact') {
      assert.doesNotMatch(form, /type="file"/)
    } else {
      assert.match(form, /\benctype="multipart\/form-data"/i)
      assert.equal((form.match(/type="file"/g)||[]).length,3)
    }
    const sources = [...new Set([...html.matchAll(/<script\b[^>]*\bsrc="([^"?#]+\.js)"/gi)].map(m=>m[1]))]
    assert.ok(sources.length > 0,'A hydrated client bundle must be present')
    const chunks = await Promise.all(sources.filter(s=>s.startsWith('/_next/')).map(s=>readFile(join('out',s.slice(1)),'utf8')))
    assert.ok(chunks.some(chunk=>chunk.includes(expected)),'Hydrated submit handler must also contain the approved endpoint')
    for (const chunk of chunks) assert.ok(!chunk.includes('https://formspree.io/f/xqernqlv'),'Old-account endpoint must not remain in the page client code')
  })
}
