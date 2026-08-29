import assert from 'node:assert/strict'
import {existsSync,readFileSync,readdirSync} from 'node:fs'
import {join} from 'node:path'
import {test} from 'node:test'
import {sportsPages} from '../lib/sports-pages.ts'

const root=process.cwd()
const approved='/images/poxiol-teamwear-hero-poxiol-only-v2.png'
const projectWithdrawn=['home_hero_v62.png','project_school_multisport_v62.png','project_soccer_club_v62.png','projects_basketball_academy_uniform_program.png','manufacturing_packing_global_delivery.png','manufacturing_sublimation_printing.png']
const brandUnsafe=['/images/poxiol-v62/home_hero_v62.png','/images/poxiol-v62/project_school_multisport_v62.png','/images/hero/hero-trust-new.webp','/images/sports-pages/basketball/hero.png','/images/sports-pages/soccer/hero.png','/images/sports-pages/training/hero.png']

test('hoodie hero uses the reviewed own-brand illustration with a non-proof disclosure',()=>{
 const hoodie=sportsPages.find(page=>page.slug==='products/hoodies-jackets')
 assert.ok(hoodie)
 assert.equal(hoodie.heroImage,approved)
 assert.equal(hoodie.heroMediaKind,'illustration')
 assert.equal(hoodie.heroImageAlt,'Illustrative basketball, soccer and training range with POXIOL wordmarks')
 assert.match(hoodie.heroMediaDisclosure||'',/not a factory or completed-order photograph/i)
})

test('legacy sports data exposes only approved hero media and no unreviewed design boards',()=>{
 for(const page of sportsPages){
  assert.doesNotMatch(page.heroImage,/\/images\/(?:poxiol-v6|poxiol-v62|sports-pages)\//,page.slug+' has an unreviewed legacy hero')
  for(const design of page.designs)assert.equal(design.image,undefined,page.slug+' exposes '+design.title)
 }
})

test('generic sports template does not present illustrations as manufacturing evidence',()=>{
 const source=readFileSync(join(root,'components/sports/SportsLandingPage.tsx'),'utf8')
 assert.ok(!source.includes('/images/poxiol-v6/manufacturing_sublimation_printing.png'))
 assert.ok(!source.includes('/images/poxiol-v6/manufacturing_quality_control.png'))
 assert.match(source,/Manufacturing evidence pending verification/)
})

test('CMS text overlays cannot reintroduce unreviewed sports media',()=>{
 const source=readFileSync(join(root,'lib/sanity/content.ts'),'utf8')
 const start=source.indexOf('export async function getCmsSportsPageBySlug')
 const end=source.indexOf('\nfunction basketballProcurementTable',start)
 const resolver=source.slice(start,end)
 assert.ok(start>=0&&end>start)
 assert.match(resolver,/heroImage:\s*legacyData\.heroImage/)
 assert.match(resolver,/designs:\s*legacyData\.designs/)
 assert.ok(!resolver.includes('heroImage: category.image.url'))
})

test('gallery pending cards keep copy separate and the CTA visible without hover',()=>{
 const source=readFileSync(join(root,'app/design-gallery/page.tsx'),'utf8')
 assert.ok(!source.includes('absolute inset-0'))
 assert.ok(!source.includes('opacity-0 group-hover:opacity-100'))
 assert.match(source,/Share Your Design Brief/)
})

test('projects heading can wrap safely at the 320px acceptance width',()=>{
 const source=readFileSync(join(root,'app/projects/page.tsx'),'utf8')
 assert.match(source,/<h1 className="[^"]*break-words[^"]*">Teamwear Projects and Manufacturing Scenarios<\/h1>/)
})

if(process.argv.includes('--output')){
 const visible=(html:string)=>html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi,'')
 test('built hoodie page renders the reviewed image uncropped and visibly discloses its illustrative role',()=>{
  const html=visible(readFileSync(join(root,'out/products/hoodies-jackets/index.html'),'utf8'))
  assert.ok(html.includes(approved))
  assert.match(html,/object-contain/)
  assert.match(html,/Illustrative teamwear configuration.*not a factory or completed-order photograph/i)
  assert.ok(!html.includes('home_hero_v62.png'))
 })
 test('legacy project fallback does not expose unapproved project media',()=>{
  const projectRoot=join(root,'out/projects')
  assert.ok(existsSync(join(projectRoot,'index.html')))
  const files=[join(projectRoot,'index.html'),...readdirSync(projectRoot,{withFileTypes:true}).filter(entry=>entry.isDirectory()).map(entry=>join(projectRoot,entry.name,'index.html')).filter(existsSync)]
  assert.ok(files.length>=2)
  for(const file of files){
   const html=visible(readFileSync(file,'utf8'))
   for(const name of projectWithdrawn)assert.ok(!html.includes(name),file+' exposes '+name)
  }
  assert.match(visible(readFileSync(join(projectRoot,'index.html'),'utf8')),/Project imagery pending verification/)
 })
 test('built pages withhold legacy design boards and unsafe schema fallbacks',()=>{
  const htmlFiles:string[]=[]
  const visit=(directory:string)=>{
   for(const entry of readdirSync(directory,{withFileTypes:true})){
    const full=join(directory,entry.name)
    if(entry.isDirectory())visit(full)
    else if(entry.name==='index.html')htmlFiles.push(full)
   }
  }
  visit(join(root,'out'))
  for(const file of htmlFiles){
   const html=readFileSync(file,'utf8')
   for(const path of brandUnsafe)assert.ok(!html.includes(path),file+' exposes '+path)
   assert.doesNotMatch(html,/\/images\/designs\/|\/images\/sports-pages\/(?:basketball|soccer|training)\/design-[23]\.webp/,file+' exposes an unreviewed legacy design image')
  }
  const gallery=visible(readFileSync(join(root,'out/design-gallery/index.html'),'utf8'))
  assert.equal((gallery.match(/Design imagery pending brand review/g)||[]).length,10)
  assert.match(gallery,/Share Your Design Brief/i)
 })
 test('built generic sports pages label unavailable manufacturing evidence instead of simulating proof',()=>{
  for(const slug of ['products/hoodies-jackets','products/training-wear','products/team-accessories']){
   const html=visible(readFileSync(join(root,'out',slug,'index.html'),'utf8'))
   assert.ok(!html.includes('manufacturing_sublimation_printing.png'),slug+' exposes a simulated printing scene')
   assert.ok(!html.includes('manufacturing_quality_control.png'),slug+' exposes a simulated QC scene')
   assert.match(html,/Manufacturing evidence pending verification/,slug+' lacks an evidence-status disclosure')
  }
 })
}
