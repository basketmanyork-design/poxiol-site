import assert from 'node:assert/strict'
import {readFileSync} from 'node:fs'
import {test} from 'node:test'
const read = route => readFileSync(`out/${route}/index.html`, 'utf8').replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '')
const links = html => [...html.matchAll(/<a\b[^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/g)].map(m=>({url:new URL(m[1].replace(/&amp;/g,'&'),'https://www.poxiol.com'),text:m[2].replace(/<[^>]+>/g,'')}))
for (const [route,sport] of [['products/basketball-uniforms','Basketball'],['products/soccer-jerseys','Soccer'],['custom-baseball-softball-uniforms','Baseball & Softball']]) {
  test(`${route} renders contextual inquiry links without relying on a click interceptor`, () => {
    const all = links(read(route)).filter(a=>['/free-mockup/','/get-quote/','/sample-order/','/contact/'].includes(a.url.pathname))
    assert.ok(all.length >= 3)
    for (const a of all) {
      assert.equal(a.url.searchParams.get('sport'),sport,a.text)
      assert.equal(a.url.searchParams.get('source'),`/${route}/`,a.text)
      const targets = {'/free-mockup/':'#free-mockup-form','/get-quote/':'#quote-form','/sample-order/':'#sample-request-form','/contact/':'#contact-form'}
      assert.equal(a.url.hash,targets[a.url.pathname],a.text)
    }
  })
}
test('solution-specific buttons retain their distinct program and sport', () => {
  const all = links(read('solutions')).filter(a=>a.text==='Start Mockup')
  assert.equal(all.length,6)
  assert.equal(all[0].url.searchParams.get('product'),'Basketball Uniform Solution')
  assert.equal(all[0].url.searchParams.get('sport'),'Basketball')
  assert.equal(all[1].url.searchParams.get('sport'),'Soccer')
  assert.equal(all[5].url.searchParams.get('product'),'Private Label Teamwear Solution')
  assert.equal(all[5].url.searchParams.get('sport'),null,'Private label is not a specific sport')
  const programs = ['Basketball Uniform Solution','Soccer Uniform Solution','Training Wear Solution','Hoodie & Jacket Solution','Teamwear Package Solution','Private Label Teamwear Solution']
  for (const [index,link] of all.entries()) {
    assert.equal(link.url.pathname,'/free-mockup/')
    assert.equal(link.url.hash,'#free-mockup-form')
    assert.equal(link.url.searchParams.get('source'),'/solutions/')
    assert.equal(link.url.searchParams.get('product'),programs[index])
  }
  const quotes = links(read('solutions')).filter(a=>a.url.pathname==='/get-quote/' && a.url.searchParams.get('product') !== 'Teamwear Solutions')
  assert.equal(quotes.length,6)
  for (const [index,link] of quotes.entries()) {
    assert.equal(link.url.hash,'#quote-form')
    assert.equal(link.url.searchParams.get('source'),'/solutions/')
    assert.equal(link.url.searchParams.get('product'),programs[index])
  }
})
