import { createClient } from '@sanity/client';
const client = createClient({projectId:'oqpv1xbc',dataset:'production',apiVersion:'v2023-08-01',token:process.env.SANITY_READ_TOKEN,useCdn:false});

async function verify(name, promise) { try { const v = await promise; if (v) { console.log(`PASS: ${name} = ${JSON.stringify(v)}`); return true; } } catch {} console.log(`FAIL: ${name}`); return false; }

const results = [];

async function main() {
  const drafts = await client.fetch('count(*[_id in path("drafts.**")])');
  results.push({check:'Draft Total = 136', expected:136, actual:drafts, pass:drafts===136});
  
  const published = await client.fetch('count(*[!(_id in path("drafts.**")) && !(_type match "system.*")])');
  results.push({check:'Published = 0', expected:0, actual:published, pass:published===0});
  
  const idx = await client.fetch('*[_id=="drafts.siteSettings"]{"v":globalSeo.indexStatus}[0].v');
  results.push({check:'indexStatus = index', expected:'index', actual:idx, pass:idx==='index'});
  
  const nav = await client.fetch('count(*[_id=="drafts.navigationSettings"])');
  results.push({check:'navigationSettings exists', expected:1, actual:nav, pass:nav===1});
  
  const footer = await client.fetch('count(*[_id=="drafts.footerSettings"])');
  results.push({check:'footerSettings exists', expected:1, actual:footer, pass:footer===1});
  
  const proc = await client.fetch('*[_id=="drafts.procurementStandards"]{defaultMOQ,sampleTime}[0]');
  results.push({check:'procurement has defaultMOQ', expected:true, actual:!!proc?.defaultMOQ, pass:!!proc?.defaultMOQ});
  
  const faqStr = await client.fetch('count(*[_id in path("drafts.**") && _type=="faqItem" && !defined(answer[0]._type)])');
  results.push({check:'FAQ string answers = 0', expected:0, actual:faqStr, pass:faqStr===0});
  
  const generic = await client.fetch('count(*[_id in path("drafts.**") && defined(fields)])');
  results.push({check:'Generic fields wrapper = 0', expected:0, actual:generic, pass:generic===0});
  
  const dupes = await client.fetch('*[_id in path("drafts.**") && defined(slug.current)]{"s":slug.current}');
  const sc = {}; dupes.forEach(d=>sc[d.s]=(sc[d.s]||0)+1);
  const dupeCount = Object.values(sc).filter(v=>v>1).length;
  results.push({check:'Duplicate slugs = 0', expected:0, actual:dupeCount, pass:dupeCount===0});
  
  const allPassed = results.every(r => r.pass);
  
  console.log('\n=== GATE 1 PRODUCTION STATE ===');
  results.forEach(r => console.log(`${r.pass?'PASS':'FAIL'}: ${r.check} (expected ${r.expected}, actual ${r.actual})`));
  console.log(`\nFINAL: Gate 1 ${allPassed?'PASS':'FAIL'}`);
  
  if (!allPassed) process.exit(1);
}
main();
