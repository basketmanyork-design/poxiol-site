import assert from 'node:assert/strict'
import {readFileSync} from 'node:fs'

const html=readFileSync('out/index.html','utf8')
const text=html.replace(/<script[\s\S]*?<\/script>/gi,' ').replace(/<style[\s\S]*?<\/style>/gi,' ').replace(/<[^>]+>/g,' ').replace(/&amp;/g,'&').replace(/&#x27;/g,"'").replace(/&quot;/g,'"').replace(/\s+/g,' ')
assert.equal((html.match(/<h1\b/gi)||[]).length,1)
assert.match(text,/Custom Teamwear for Teams, Clubs & Brands/)
assert.match(text,/Teams, schools, clubs, brands and resellers welcome/)
assert.match(html,/<video[^>]+controls[^>]+playsinline/i)
assert.match(html,/website-optimization\/poxiol-hero-22s-720p\.mp4/)
const ids=['home-hero-title','product-discovery','who-we-help','customization-details','free-mockup','sample','production-delivery','faq','contact']
const positions=ids.map(id=>html.indexOf(`id="${id}"`))
assert.ok(positions.every(position=>position>=0),'Nine confirmed homepage modules must be present')
assert.deepEqual([...positions].sort((a,b)=>a-b),positions,'Nine homepage modules must retain the confirmed order')
for(const [name,path] of [['soccer','/products/soccer-jerseys/'],['basketball','/products/basketball-uniforms/'],['baseball','/custom-baseball-softball-uniforms/'],['training','/products/training-wear/'],['running-track','/products/running-track-uniforms/'],['warm-up','/products/warm-up-wear/']]){
  assert.match(html,new RegExp(`website-optimization/${name}-800\\.webp`))
  assert.match(html,new RegExp(`href="${path.replaceAll('/','\\/')}"`))
}
assert.match(text,/For Teams, Schools & Clubs/)
assert.match(text,/For Brands & Resellers/)
assert.match(text,/Delivery Postal Code/)
assert.match(text,/My delivery area does not use postal codes/)
assert.match(html,/"@type":"Organization"/)
assert.doesNotMatch(html,/"@type":"FAQPage"/)
console.log('POXIOL V1.1 homepage output checks passed.')
