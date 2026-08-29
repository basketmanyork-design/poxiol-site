import assert from 'node:assert/strict'
import {readFileSync} from 'node:fs'
import {test} from 'node:test'
import {resolveCoreSportGeoDetails} from '../lib/core-sports.ts'

const text = html => html.replace(/<[^>]+>/g, ' ').replace(/&amp;/g, '&').replace(/\s+/g, ' ').trim()
const buyers = ['Teamwear distributors', 'dealers', 'sportswear brands', 'custom resellers']
const owners = [
  {route: '/products/basketball-uniforms/', product: 'Custom Basketball Uniforms', title: 'Custom Basketball Uniform Manufacturer for Distributors and Brands'},
  {route: '/products/soccer-jerseys/', product: 'Custom Soccer Kits', title: 'Custom Soccer Kit Manufacturer for Distributors and Brands'},
  {route: '/custom-baseball-softball-uniforms/', product: 'Custom Baseball Uniforms', title: 'Custom Baseball Uniform Manufacturer for Distributors and Brands'},
]

for (const owner of process.argv.includes('--unit') ? [] : owners) test(`${owner.route} keeps legacy CMS audience overrides out of hero, overview and search description`, () => {
  const html = readFileSync('out' + owner.route + 'index.html', 'utf8')
  const visible = html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '')
  const h1s = [...visible.matchAll(/<h1\b[^>]*>([\s\S]*?)<\/h1>/g)].map(match => text(match[1]))
  assert.deepEqual(h1s, [owner.title])
  const hero = [...visible.matchAll(/<section\b[^>]*>([\s\S]*?)<\/section>/g)].find(match => match[1].includes('<h1'))?.[1] || ''
  const description = html.match(/<meta name="description" content="([^"]*)"/)?.[1]
  assert.ok(description, 'A search description must exist')
  for (const buyer of buyers) {
    assert.ok(text(hero).toLowerCase().includes(buyer.toLowerCase()), 'Hero must address ' + buyer)
    assert.ok(description.toLowerCase().includes(buyer.toLowerCase()), 'Search description must address ' + buyer)
  }
  const sections = [...visible.matchAll(/<section\b[^>]*>([\s\S]*?)<\/section>/g)].map(match=>match[1])
  const overview = sections.find(section=>section.includes('Product Overview')) || ''
  const fit = sections.find(section=>section.includes('Recommended For')) || ''
  assert.ok(overview && fit, 'Both buyer-facing product summaries must render')
  const rows = Object.fromEntries([...overview.matchAll(/<dt\b[^>]*>([\s\S]*?)<\/dt>\s*<dd\b[^>]*>([\s\S]*?)<\/dd>/g)].map(match=>[text(match[1]), text(match[2])]))
  assert.equal(rows['Product Type'], owner.product, 'Product type must not inherit a promotional CMS headline')
  assert.match(rows['Suitable For'], /worldwide/i)
  for(const buyer of buyers) {
    assert.ok(rows['Suitable For'].toLowerCase().includes(buyer.toLowerCase()))
    assert.ok(text(fit).toLowerCase().includes(buyer.toLowerCase()))
  }
  assert.doesNotMatch(text(hero + overview + fit), /U\.S\.|\bUSA\b|United States|Growing Youth Clubs/i)
  const schemas = [...html.matchAll(/<script\b[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)].flatMap(match=>{
    const root=JSON.parse(match[1]); return [root,...(root['@graph'] || [])]
  })
  assert.equal(schemas.find(schema=>schema['@type']==='Product')?.name, owner.title, 'Structured data must describe the visible product owner')
  for(const type of ['Product', 'Service']) assert.equal(schemas.find(schema=>schema['@type']===type)?.description, description, type + ' must share the visible positioning')
  const links = [...visible.matchAll(/<a\b[^>]*href="([^"]+)"/g)].map(match=>new URL(match[1].replace(/&amp;/g,'&'),'https://www.poxiol.com'))
  for(const path of ['/free-mockup/', '/sample-order/', '/get-quote/']) assert.ok(links.some(link=>link.pathname===path), 'Retain inquiry intent: '+path)
})

test('replaces only imported audience fields without changing procurement facts or mutating CMS data', () => {
  const imported = {
    overview: [
      {label:'Product Type',value:'Custom Basketball Uniforms for Growing Youth Clubs'},
      {label:'Application',value:'U.S. Youth Travel Basketball Clubs'},
      {label:'Customization',value:'Project-specific artwork under review'},
      {label:'Production Type',value:'Unconfirmed fixture production type'},
      {label:'Suitable For',value:'U.S. Youth Travel Basketball Clubs'},
    ],
    specifications:[{label:'MOQ',value:'Unconfirmed fixture MOQ'},{label:'Fabric',value:'Unconfirmed fixture fabric'}],
    recommendedFor:['U.S. Youth Travel Basketball Clubs'],
  }
  const original = structuredClone(imported)
  const actual = resolveCoreSportGeoDetails('basketball', imported)
  assert.deepEqual(actual.overview, [
    {label:'Product Type',value:'Custom Basketball Uniforms'},
    {label:'Application',value:'Basketball programs for your downstream teams, clubs and schools'},
    {label:'Customization',value:'Project-specific artwork under review'},
    {label:'Production Type',value:'Unconfirmed fixture production type'},
    {label:'Suitable For',value:'Teamwear distributors, dealers, sportswear brands and custom resellers worldwide'},
  ])
  assert.deepEqual(actual.specifications,[{label:'MOQ',value:'Unconfirmed fixture MOQ'},{label:'Fabric',value:'Unconfirmed fixture fabric'}])
  assert.deepEqual(actual.recommendedFor,['Teamwear Distributors','Dealers','Sportswear Brands','Custom Resellers'])
  assert.deepEqual(imported, original, 'Projection must not mutate the imported content for other consumers')
})
