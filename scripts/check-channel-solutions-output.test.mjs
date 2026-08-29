import assert from 'node:assert/strict'
import {readFileSync} from 'node:fs'
import {test} from 'node:test'

const text = html => html.replace(/<[^>]+>/g,' ').replace(/&amp;/g,'&').replace(/\s+/g,' ').trim()
const read = route => readFileSync('out'+route+'index.html','utf8')
const visible = html => html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi,'')
const links = html => [...html.matchAll(/<a\b[^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/g)].map(m=>({label:text(m[2]),url:new URL(m[1].replace(/&amp;/g,'&'),'https://www.poxiol.com')}))
const roles = ['teamwear distributors','dealers','sportswear brands','custom resellers']
function assertCanonical(html, route) {
  const tags = [...html.matchAll(/<link\b[^>]*\brel="canonical"[^>]*>/gi)].map(match=>match[0])
  assert.equal(tags.length,1,'Must have exactly one canonical link element')
  const href = tags[0].match(/\bhref="([^"]+)"/)?.[1]
  assert.equal(new URL(href,'https://www.poxiol.com').href,'https://www.poxiol.com'+route,'Retain canonical owner')
}

test('canonical validation rejects navigation-only matches, duplicates and wrong owners',()=>{
  const navigation='<a href="/solutions/">Solutions</a>'
  const canonical='<link rel="canonical" href="https://www.poxiol.com/solutions/"/>'
  assert.doesNotThrow(()=>assertCanonical(canonical+navigation,'/solutions/'))
  assert.throws(()=>assertCanonical(navigation,'/solutions/'))
  assert.throws(()=>assertCanonical(canonical+canonical+navigation,'/solutions/'))
  assert.throws(()=>assertCanonical(canonical,'/oem-odm/'))
})

for(const route of ['/solutions/','/oem-odm/','/private-label-teamwear/']) test(`${route} presents worldwide channel positioning in the hero and search previews`,()=>{
  const html=read(route)
  const body=visible(html)
  const hero=body.match(/<section\b[^>]*>[\s\S]*?<\/section>/i)?.[0] || ''
  const meta=html.match(/<meta name="description" content="([^"]*)"/)?.[1] || ''
  const heroDescription=text(hero.match(/<h1\b[^>]*>[\s\S]*?<\/h1>([\s\S]*?)<a\b/i)?.[1] || '')
  for(const role of roles) {
    assert.ok(heroDescription.toLowerCase().includes(role),'Hero omits '+role)
    assert.ok(meta.toLowerCase().includes(role),'Search preview omits '+role)
  }
  assert.match(heroDescription,/worldwide/i)
  assert.equal((body.match(/<h1\b/g)||[]).length,1)
  assertCanonical(html,route)
  const og=html.match(/<meta property="og:description" content="([^"]*)"/)?.[1]
  if(og)assert.equal(og,meta,'Social/search positioning must agree')
})

test('shared footer keeps global channel positioning on the home and both page families',()=>{
  for(const route of ['/','/solutions/','/oem-odm/','/private-label-teamwear/','/products/basketball-uniforms/','/products/soccer-jerseys/','/custom-baseball-softball-uniforms/']) {
    const footer=visible(read(route)).match(/<footer\b[^>]*>[\s\S]*?<\/footer>/i)?.[0] || ''
    assert.ok(footer,'Missing footer: '+route)
    for(const role of roles)assert.ok(text(footer).toLowerCase().includes(role),route+' footer omits '+role)
    assert.match(text(footer),/worldwide/i)
  }
})

test('OEM buttons accurately describe contact vs mockup destinations',()=>{
  const all=links(visible(read('/oem-odm/')))
  const questions=all.filter(link=>link.label==='Ask a Project Question')
  assert.equal(questions.length,2,'Both hero and closing contact CTAs must state their actual intent')
  for(const link of questions)assert.equal(link.url.pathname,'/contact/')
  const mockups=all.filter(link=>/mockup/i.test(link.label))
  assert.ok(mockups.length>0)
  for(const link of mockups)assert.equal(link.url.pathname,'/free-mockup/','Mockup-labelled CTA must not enter generic contact')
})

test('OEM hero separates project quote from a general question instead of duplicating contact',()=>{
  const hero=visible(read('/oem-odm/')).match(/<section\b[^>]*>[\s\S]*?<\/section>/i)?.[0] || ''
  assert.deepEqual(links(hero).map(link=>link.url.pathname),['/get-quote/','/contact/'])
})

test('OEM uses the reviewed own-brand illustration without presenting it as factory or order proof',()=>{
  const body=visible(read('/oem-odm/'))
  const hero=body.match(/<section\b[^>]*>[\s\S]*?<\/section>/i)?.[0] || ''
  assert.match(hero,/<img\b[^>]*src="\/images\/poxiol-teamwear-hero-poxiol-only-v2\.png"/)
  assert.match(text(hero),/Illustrative teamwear configuration.*not a factory or completed-order photograph/i)
  assert.doesNotMatch(body,/\/images\/solutions\/oem-odm-catalog\.jpg/)
})

test('solution cards withhold unverified legacy pictures and their embedded brand or project claims',()=>{
  const body=visible(read('/solutions/'))
  for(const file of ['manufacturing_sublimation_printing.png','home_hero_v62.png','project_school_multisport_v62.png','home_oem_odm_solutions.png']) assert.ok(!body.includes(file),'Unverified legacy visual remains: '+file)
  assert.equal((text(body).match(/Project imagery pending verification/g)||[]).length,6)
})

for(const [route,product] of [['/oem-odm/','OEM / ODM Teamwear'],['/private-label-teamwear/','Private Label Teamwear']]) test(`${route} includes its program context in every inquiry link`,()=>{
  const all=links(visible(read(route))).filter(link=>['/free-mockup/','/get-quote/','/sample-order/','/contact/'].includes(link.url.pathname))
  assert.ok(all.length>=3)
  for(const link of all){
    assert.equal(link.url.searchParams.get('product'),product,link.label)
    assert.equal(link.url.searchParams.get('source'),route,link.label)
    assert.equal(link.url.searchParams.get('sport'),null,'Do not assume a sport for a multi-sport service')
  }
})

test('solution cards state planning requirements instead of blanket delivery/color guarantees',()=>{
  const body=text(visible(read('/solutions/')))
  assert.doesNotMatch(body,/Reliable delivery for tournament seasons|Consistent colors across youth and adult sizes/i)
  assert.match(body,/confirm.*colors/i)
  assert.match(body,/target.*date/i)
})
