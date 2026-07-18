const fs = require('fs');
const crypto = require('crypto');
const path = require('path');

const root = path.resolve(__dirname, '..');
const src = JSON.parse(fs.readFileSync(path.join(root, 'migration-output/raw-extracted/source-data.json'),'utf8'));
const ndjson = [];

function add(doc) {
  let j = JSON.stringify(doc);
  // Strip nested _type that confuses Sanity CLI 3.99.0
  j = j.replace(/"children":\[\{"_type":"span"/g, '"children":[{"markDefs":[]');
  ndjson.push(j);
}

// 1. B2B FAQ Items (9)
(src.b2bFaqs||[]).forEach(g => {
  g.items.forEach(item => {
    const h = crypto.createHash('sha256').update(item.question).digest('hex').slice(0,16);
    add({_id:`drafts.faq-b2b-${h}`,_type:'faqItem',question:item.question,answer:[{style:'normal',children:[{text:item.answer}]}]});
  });
});

// 2. Author York
add({_id:'drafts.author-york',_type:'author',name:'York',role:'Teamwear Export and B2B Sourcing Specialist',brand:'POXIOL',shortBio:'York works with international clubs, schools, sportswear brands and distributors on custom teamwear sourcing, sample approval and bulk production coordination.'});

// 3. Core Guides
(src.coreGuides||[]).forEach(g => {
  add({_id:`drafts.article-${g.slug}`,_type:'article',title:g.h1,slug:{current:g.slug},articleType:'Technical Guide',excerpt:g.metaDescription,publishStatus:'draft'});
});

// 4. PSEO Articles
(src.pseoPages||[]).forEach(p => {
  add({_id:`drafts.article-${p.slug}`,_type:'article',title:p.title,slug:{current:p.slug},articleType:'SEO Article',excerpt:p.intro,publishStatus:'draft'});
});

// 5. Resources
(src.resourcePages||[]).forEach(r => {
  add({_id:`drafts.article-${r.slug}`,_type:'article',title:r.title,slug:{current:r.slug},articleType:'Resource',publishStatus:'draft'});
});

fs.writeFileSync(path.join(root,'migration-output/batch2.ndjson'), ndjson.join('\n')+'\n');
console.log(`Batch 2: ${ndjson.length} documents`);
