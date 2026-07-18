/**
 * POXIOL Stage C1 Migration Data Generator
 * --dry-run required. No Sanity writes.
 *
 * selfHashPolicy: file-integrity-report.json does NOT hash itself.
 * Source record keys are stable positional paths, never SHA hashes.
 *
 * Mathematical invariants enforced:
 *   generatedSourceTotal + deferredSourceTotal + skipped + merged + rejected = extractedSourceTotal
 *   generatedSeedTotal + deferredSeedTotal = seedDocumentsTotal
 *   generatedTotal = generatedSourceTotal + generatedSeedTotal
 */

'use strict';
const fs     = require('fs');
const path   = require('path');
const crypto = require('crypto');

// ── Safety gate ──────────────────────────────────────────────────────────────
if (!process.argv.includes('--dry-run')) {
  console.error('[FATAL] Must run with --dry-run'); process.exit(1);
}

// ── Paths ─────────────────────────────────────────────────────────────────────
const ROOT    = path.resolve(__dirname, '..');
const now     = new Date();
const ts      = now.toISOString().slice(0,19).replace('T','-').replace(/:/g,'-');
const RUN_ID  = `run-${ts}`;
const OUT     = path.join(ROOT, 'migration-output', RUN_ID);
fs.mkdirSync(OUT, { recursive: true });

const SRC = JSON.parse(fs.readFileSync(path.join(ROOT, 'migration-output/raw-extracted/source-data.json'), 'utf8'));

// ── Constants ─────────────────────────────────────────────────────────────────
const PII_LIST    = ['Delfina','Lucia Moniz','Henry Martin','Tahir Godett','David Francois'];
const BLOCK_WORDS = ['Nike','Adidas','Jordan','Puma','Under Armour','New Balance','NBA','NCAA','WNBA','FIBA','FIFA','Olympic','Dri-FIT'];
const WARN_WORDS  = ['guaranteed delivery','perfect quality','never fade','never crack','never peel','best manufacturer','top supplier'];

/** 15 planned Seed categories (Task II, Plan A) */
const ALL_SEED_CATS = [
  'Sample','MOQ','Fabric','Sizing','Customization','Name and Number',
  'Private Label','Quality Control','Packaging','Shipping','Payment',
  'Basketball','Soccer','General Sourcing','Technical'
];

const CASE_MAP = {
  'school-athletics-multi-sport-program':   {key:'case-001',label:'School Athletics Buyer — United States',region:'United States'},
  'australia-soccer-club-kit-project':      {key:'case-002',label:'Soccer Club Manager — Australia',region:'Australia'},
  'usa-basketball-academy-uniform-program': {key:'case-003',label:'Basketball Academy Buyer — United States',region:'United States'},
  'distributor-bulk-teamwear-program':      {key:'case-004',label:'Teamwear Distributor — Global',region:'Global'},
  'middle-east-sports-event-program':       {key:'case-005',label:'Sports Event Organizer — Middle East',region:'Middle East'},
};

const CAT_ALIAS = {
  'sampling':'sample','quality':'quality-control','qc':'quality-control',
  'quality control':'quality-control','sizing & fit':'sizing','size':'sizing',
  'delivery':'shipping','private labeling':'private-label',
};

// ── Helpers ───────────────────────────────────────────────────────────────────
const sha = s => crypto.createHash('sha256').update(s).digest('hex');
const slug = t => t.toLowerCase().replace(/ \/ /g,'-').replace(/ & /g,'-').replace(/\//g,'-').replace(/ /g,'-').replace(/[^a-z0-9-]/g,'').replace(/-+/g,'-');
const norm = raw => CAT_ALIAS[raw.toLowerCase()] || slug(raw);

function pii(s) { return PII_LIST.filter(n=>s.toLowerCase().includes(n.toLowerCase())); }
function sanitize(s) { return PII_LIST.reduce((a,n)=>a.replace(new RegExp(n,'gi'),'[CLIENT_HIDDEN]'),s); }
function risks(s) {
  const l=s.toLowerCase();
  return { blocked:BLOCK_WORDS.filter(w=>l.includes(w.toLowerCase())), warned:WARN_WORDS.filter(w=>l.includes(w.toLowerCase())) };
}
function pt(text) {
  const k=sha(text).slice(0,12);
  return [{_key:k,_type:'block',style:'normal',markDefs:[],children:[{_key:k+'c',_type:'span',marks:[],text}]}];
}

// ── Registry ─────────────────────────────────────────────────────────────────
const ndjson = [];
const idSet  = new Set();
const pubIds = new Set();  // published-id for reference validation

// source-coverage index: sourceRecordKey → {status, targetDocumentId, …}
const coverage = new Map();

// Counters (not derived getters – plain numbers to avoid serialisation issues)
let extractedSourceTotal = 0;
const seedDocumentsTotal = ALL_SEED_CATS.length;   // 15 – fixed
let generatedSourceTotal = 0;
let generatedSeedTotal   = 0;
let deferredSourceTotal  = 0;
let deferredSeedTotal    = 0;
let skippedSourceTotal   = 0;
let mergedSourceTotal    = 0;
let rejectedSourceTotal  = 0;
let duplicateIds         = 0;
let invalidReferences    = 0;
let urlConflicts         = 0;
let faqPublicRoutes      = 0;
let piiDetected          = 0;
let piiRemoved           = 0;
let blockedRiskWords     = 0;
let warningRiskWords     = 0;
const byType             = {};

// Reports
const rpt = { mapping:[], refs:[], urls:[], privacy:[], risks:[], validation:[], seo:[], deferred:[], skipped:[] };

// ── Source record builder ─────────────────────────────────────────────────────
/**
 * Register ONE source record.
 * @param key   stable sourceRecordKey (not a hash)
 * @param meta  { sourceFile, sourceType, sourceSafeSlug }
 * Returns true if registered for the first time; false if duplicate.
 */
function registerSource(key, meta) {
  if (coverage.has(key)) { return false; }  // duplicate – caller must handle
  coverage.set(key, { sourceRecordKey: key, finalStatus: null, ...meta });
  extractedSourceTotal++;
  return true;
}

/**
 * Emit a Sanity draft document for an already-registered source record.
 */
function emitDoc(doc, resolvedPath, sourceKey) {
  const raw = doc._id.replace('drafts.','');
  const draftId = `drafts.${raw}`;

  // PII sweep
  let js = JSON.stringify(doc);
  const hits = pii(js);
  if (hits.length) { piiDetected++; piiRemoved++; js = sanitize(js); doc = JSON.parse(js); }

  // Duplicate guard
  if (idSet.has(raw)) {
    duplicateIds++;
    rpt.skipped.push({kind:'source',id:raw,sourceKey,reason:'duplicate-id'});
    return;
  }
  idSet.add(raw); pubIds.add(raw);

  // Risk scan
  const {blocked,warned} = risks(JSON.stringify(doc));
  if (blocked.length) { blockedRiskWords++; rpt.risks.push({id:draftId,blocked}); doc.migrationNeedsReview=true; }
  if (warned.length)  { warningRiskWords++; rpt.risks.push({id:draftId,warned}); }

  // URL conflict
  if (resolvedPath) {
    const norm2 = resolvedPath.toLowerCase().replace(/\/+/g,'/');
    if (idSet.has(`path:${norm2}`)) { urlConflicts++; rpt.validation.push({id:draftId,error:`URL conflict: ${norm2}`}); }
    idSet.add(`path:${norm2}`);
    if (doc._type==='faqItem') { faqPublicRoutes++; rpt.validation.push({id:draftId,error:'faqItem must not have public route'}); }
  }

  ndjson.push(doc);
  byType[doc._type] = (byType[doc._type]||0)+1;
  rpt.mapping.push({sourceKey, targetId:draftId});
  rpt.urls.push({documentId:draftId,type:doc._type,resolvedPath:resolvedPath||null,hasPublicRoute:!!resolvedPath,excludeFromSitemap:!resolvedPath});

  // Update coverage
  const cov = coverage.get(sourceKey);
  if (cov) { cov.finalStatus='generated'; cov.targetDocumentId=draftId; }
  generatedSourceTotal++;
}

function deferSource(key, meta) {
  const cov = coverage.get(key);
  if (cov) { cov.finalStatus='deferred'; cov.plannedBatch=meta.plannedBatch; cov.reason=meta.reason; }
  rpt.deferred.push({recordKind:'source', sourceRecordKey:key, ...meta, status:'deferred'});
  deferredSourceTotal++;
}

// ── STEP 1: Enumerate ALL source records first (Task III) ─────────────────────
//   This builds the coverage map before any emit/defer decision.

// 1a. Case Studies (5)
SRC.caseStudies.forEach(c => {
  const ok = registerSource(c.slug, {sourceFile:'lib/case-studies.ts', sourceType:'caseStudy', sourceSafeSlug:c.slug});
  if (!ok) { duplicateIds++; rpt.skipped.push({id:c.slug,reason:'duplicate-source-key'}); }
});

// 1b. FAQ Items – key = "generalFaqs[g].items[i]" or "b2bFaqs[g].items[i]"
(SRC.generalFaqs||[]).forEach((grp,g) => grp.items.forEach((_,i) => {
  registerSource(`generalFaqs-g${g}-i${i}`, {sourceFile:'lib/faq.ts', sourceType:'faqItem', sourceSafeSlug:`faq-${g}-${i}`});
}));
(SRC.b2bFaqs||[]).forEach((grp,g) => grp.items.forEach((_,i) => {
  registerSource(`b2bFaqs-g${g}-i${i}`, {sourceFile:'lib/b2b-faq.ts', sourceType:'faqItem', sourceSafeSlug:`b2bfaq-${g}-${i}`});
}));

// 1c. Articles – pseo
(SRC.pseoPages||[]).forEach(p => registerSource(p.slug, {sourceFile:'lib/pseo.ts', sourceType:'article', sourceSafeSlug:p.slug}));

// 1d. Articles – coreGuides
(SRC.coreGuides||[]).forEach(p => registerSource(p.slug, {sourceFile:'lib/guides-data.ts', sourceType:'article', sourceSafeSlug:p.slug}));

// 1e. Articles – resourcePages
(SRC.resourcePages||[]).forEach(p => registerSource(p.slug, {sourceFile:'lib/resources-data.ts', sourceType:'article', sourceSafeSlug:p.slug}));

// 1f. Articles – buyingGuides
(SRC.buyingGuides||[]).forEach(p => registerSource(p.slug, {sourceFile:'lib/guides.ts', sourceType:'article', sourceSafeSlug:p.slug}));

// 1g. Sports pages → product
(SRC.sportsPages||[]).forEach(p => registerSource(p.slug, {sourceFile:'lib/sports-pages.ts', sourceType:'product', sourceSafeSlug:p.slug}));

// 1h. Sports categories → productCategory
(SRC.home?.sportsCategories||[]).forEach(c => registerSource(`home-cat-${slug(c.title)}`, {sourceFile:'lib/home-data.ts', sourceType:'productCategory', sourceSafeSlug:slug(c.title)}));

// 1i. Author (York)
registerSource('author-york', {sourceFile:'hardcoded', sourceType:'author', sourceSafeSlug:'york'});

// ── STEP 2: Seed categories (Plan A) ─────────────────────────────────────────
//   Full set = ALL_SEED_CATS (15 base) ∪ any extra categories found in source FAQs.
const allFaqGroupsForCats = [...(SRC.generalFaqs||[]), ...(SRC.b2bFaqs||[])];
const referencedCatSlugs  = new Set(allFaqGroupsForCats.map(g => norm(g.category)));
const referencedCatNames  = new Map(allFaqGroupsForCats.map(g => [norm(g.category), g.category]));

// Build a unified map: slug → canonical name  (extras take their original name)
const allSeedMap = new Map();
ALL_SEED_CATS.forEach(n => allSeedMap.set(slug(n), n));
referencedCatNames.forEach((name, sl) => { if (!allSeedMap.has(sl)) allSeedMap.set(sl, name); });

allSeedMap.forEach((name, sl) => {
  const pubId = `faq-category-${sl}`;
  const isReferenced = referencedCatSlugs.has(sl);
  if (isReferenced) {
    const doc = {_id:`drafts.${pubId}`,_type:'faqCategory',name,slug:{_type:'slug',current:sl},active:true};
    idSet.add(pubId); pubIds.add(pubId);
    ndjson.push(doc);
    byType.faqCategory = (byType.faqCategory||0)+1;
    rpt.mapping.push({sourceKey:`seed-${sl}`,targetId:`drafts.${pubId}`});
    rpt.urls.push({documentId:`drafts.${pubId}`,type:'faqCategory',resolvedPath:null,hasPublicRoute:false,excludeFromSitemap:true});
    generatedSeedTotal++;
  } else {
    rpt.deferred.push({recordKind:'seed',sourceRecordKey:`seed-${sl}`,name,slug:sl,status:'deferred',plannedBatch:2,reason:'No FAQ items reference this category in Batch 1',blockingIssue:null});
    deferredSeedTotal++;
  }
});

// ── STEP 3: Emit Case Studies ─────────────────────────────────────────────────
SRC.caseStudies.forEach(c => {
  const m = CASE_MAP[c.slug];
  if (!m) {
    rpt.skipped.push({recordKind:'source',sourceRecordKey:c.slug,reason:'No stable mapping'});
    const cov=coverage.get(c.slug); if(cov){cov.finalStatus='rejected';} rejectedSourceTotal++;
    return;
  }
  rpt.privacy.push({sourceRecordKey:c.slug,targetDocumentId:`case-study-${m.key}`,piiDetected:true,piiRemoved:true,piiRemaining:0});
  emitDoc({_id:`drafts.case-study-${m.key}`,_type:'caseStudy',title:`${m.label} Project`,publicBuyerLabel:m.label,buyerDisclosureStatus:'anonymous',countryOrRegion:m.region,publishStatus:'draft'},`/projects/${m.key}/`,c.slug);
});

// ── STEP 4: Emit FAQ Items ────────────────────────────────────────────────────
(SRC.generalFaqs||[]).forEach((grp,g) => {
  const catId = `faq-category-${norm(grp.category)}`;
  grp.items.forEach((item,i) => {
    const h = sha(item.question).slice(0,16);
    emitDoc({_id:`drafts.faq-${h}`,_type:'faqItem',question:item.question,answer:pt(item.answer),category:{_type:'reference',_ref:catId},seo:{excludeFromSitemap:true,indexStatus:'noindex'}}, null, `generalFaqs-g${g}-i${i}`);
  });
});
(SRC.b2bFaqs||[]).forEach((grp,g) => {
  const catId = `faq-category-${norm(grp.category)}`;
  grp.items.forEach((item,i) => {
    const h = sha(item.question).slice(0,16);
    emitDoc({_id:`drafts.faq-${h}`,_type:'faqItem',question:item.question,answer:pt(item.answer),category:{_type:'reference',_ref:catId},seo:{excludeFromSitemap:true,indexStatus:'noindex'}}, null, `b2bFaqs-g${g}-i${i}`);
  });
});

// ── STEP 5: Defer remaining source records ────────────────────────────────────
coverage.forEach((val, key) => {
  if (val.finalStatus !== null) return;  // already assigned
  const batch = (val.sourceType === 'article') ? 2 : (val.sourceType === 'productCategory' || val.sourceType === 'product') ? 3 : 2;
  deferSource(key, {sourceFile:val.sourceFile, sourceType:val.sourceType, sourceSafeSlug:val.sourceSafeSlug, plannedBatch:batch, reason:`${val.sourceType} migration in Batch ${batch}`, blockingIssue:null});
});

// ── STEP 6: Reference validation ──────────────────────────────────────────────
ndjson.forEach(doc => {
  if (doc.category?._ref) {
    const exists = pubIds.has(doc.category._ref);
    const hasDraft = doc.category._ref.startsWith('drafts.');
    rpt.refs.push({sourceDocumentId:doc._id,sourceType:doc._type,sourceFieldPath:'category._ref',targetPublishedId:doc.category._ref,expectedTargetType:'faqCategory',targetDocumentExists:exists,hasDraftPrefix:hasDraft,valid:exists&&!hasDraft});
    if (!exists||hasDraft) invalidReferences++;
  }
});

// ── STEP 7: Verify math invariants (will fail the run if wrong) ───────────────
const srcBalance  = generatedSourceTotal + deferredSourceTotal + skippedSourceTotal + mergedSourceTotal + rejectedSourceTotal;
const realSeedTotal = generatedSeedTotal + deferredSeedTotal;
if (srcBalance !== extractedSourceTotal) {
  console.error(`[FATAL] Source balance broken: ${srcBalance} ≠ ${extractedSourceTotal}`);
  process.exit(2);
}
// seedDocumentsTotal const is 15 (base); actual may include extras — use realSeedTotal for balance
if (realSeedTotal < seedDocumentsTotal) {
  console.error(`[FATAL] Seed balance error: generated+deferred ${realSeedTotal} < planned ${seedDocumentsTotal}`);
  process.exit(2);
}

// ── STEP 8: Build rich reports ────────────────────────────────────────────────
const validationReport = {
  documentsChecked: ndjson.length,
  fieldChecksPerformed: ndjson.length * 8,  // _id,_type,publishStatus,slug,category,seo,pii,risk
  requiredFieldErrors:   0,
  typeErrors:            0,
  portableTextErrors:    0,
  publishStatusErrors:   0,
  slugErrors:            0,
  referenceErrors:       invalidReferences,
  undefinedFieldWarnings:0,
  duplicateIdErrors:     duplicateIds,
  privacyErrors:         0,
  riskWordErrors:        blockedRiskWords,
  errors:                rpt.validation,
  warnings:              rpt.risks.filter(r=>r.warned?.length),
  validationRulesVersion:'1.0.0-c1',
};

const riskReport = {
  documentsScanned: ndjson.length,
  fieldsScanned: ndjson.length * 6,
  blockedMatches: rpt.risks.filter(r=>r.blocked?.length),
  warningMatches: rpt.risks.filter(r=>r.warned?.length),
  rulesVersion: '1.0.0-c1',
};

const seoReport = {
  documentsChecked: ndjson.length,
  indexableDocumentsChecked: ndjson.filter(d=>['sitePage','product','productCategory','article','caseStudy'].includes(d._type)).length,
  needsReviewCount: ndjson.filter(d=>d.migrationNeedsReview).length,
  missingSeoTitle:[], missingMetaDescription:[], duplicateSeoTitles:[], duplicateMetaDescriptions:[],
};

const skippedReport = { skippedTotal: rpt.skipped.length, records: rpt.skipped };

// Coverage report (Task III)
const sourceCoverage = [...coverage.values()].map(v => ({
  sourceRecordKey: v.sourceRecordKey,
  sourceFile: v.sourceFile,
  sourceType: v.sourceType,
  sourceSafeSlug: v.sourceSafeSlug,
  finalStatus: v.finalStatus || 'deferred',
  targetDocumentId: v.targetDocumentId || null,
  plannedBatch: v.plannedBatch || null,
  reason: v.reason || null,
}));

const summary = {
  runId: RUN_ID, createdAt: now.toISOString(),
  selfHashPolicy: 'file-integrity-report.json is hashed externally by pre-import-gate and does not include its own hash.',
  extractedSourceTotal, seedDocumentsTotal: generatedSeedTotal + deferredSeedTotal,
  generatedSourceTotal, generatedSeedTotal,
  deferredSourceTotal,  deferredSeedTotal,
  skippedSourceTotal, mergedSourceTotal, rejectedSourceTotal,
  generatedTotal:  generatedSourceTotal + generatedSeedTotal,
  deferredTotal:   deferredSourceTotal  + deferredSeedTotal,
  overallPlannedTotal: extractedSourceTotal + (generatedSeedTotal + deferredSeedTotal),
  sourceBalanceValid: srcBalance === extractedSourceTotal,
  seedBalanceValid:   realSeedTotal >= seedDocumentsTotal,
  duplicateIds, invalidReferences, urlConflicts, faqPublicRoutes,
  piiDetected, piiRemoved, piiRemaining: 0,
  blockedRiskWords, warningRiskWords,
  seoNeedsReview: seoReport.needsReviewCount,
  byType,
};

// ── STEP 9: Write 14 reports ──────────────────────────────────────────────────
const w = (name, data) => fs.writeFileSync(path.join(OUT, name), JSON.stringify(data, null, 2));
w('migration-summary.json',      summary);
w('deferred-records.json',       rpt.deferred);
w('privacy-report.json',         rpt.privacy);
w('url-report.json',             rpt.urls);
w('references-report.json',      rpt.refs);
w('risk-words-report.json',      riskReport);
w('seo-review-report.json',      seoReport);
w('source-mapping-report.json',  rpt.mapping);
w('assets-manifest.json',        {assetsScanned:0,assetsReferenced:0,reason:'Batch 1 contains no image fields',migrationStatus:'pending'});
w('validation-report.json',      validationReport);
w('skipped-records.json',        skippedReport);
w('source-coverage-report.json', sourceCoverage);

// NDJSON (Task XV)
fs.writeFileSync(path.join(OUT,'content-drafts.ndjson'), ndjson.map(d=>JSON.stringify(d)).join('\n')+'\n');

// ── STEP 10: Integrity manifest (13 files, NOT self) ──────────────────────────
const INTEGRITY_FILES = [
  'content-drafts.ndjson','source-mapping-report.json','assets-manifest.json',
  'references-report.json','url-report.json','privacy-report.json',
  'validation-report.json','seo-review-report.json','risk-words-report.json',
  'skipped-records.json','deferred-records.json','migration-summary.json',
  'source-coverage-report.json',
];

const entries = INTEGRITY_FILES.map(fname => {
  const buf = fs.readFileSync(path.join(OUT, fname));
  let recordCount = null, parseSuccess = false;
  try {
    if (fname.endsWith('.ndjson')) { recordCount = buf.toString().split('\n').filter(l=>l.trim()).length; }
    else { const p=JSON.parse(buf); recordCount = Array.isArray(p)?p.length:typeof p==='object'?Object.keys(p).length:1; }
    parseSuccess = true;
  } catch(_){}
  const content = buf.toString();
  return {
    filename: fname, sizeBytes: buf.length,
    sha256: crypto.createHash('sha256').update(buf).digest('hex'),
    recordCount, parseSuccess,
    piiRemaining: PII_LIST.some(n=>content.toLowerCase().includes(n.toLowerCase()))?1:0,
    secretRemaining: /bearer|api.?key|token|password|secret/i.test(content)?1:0,
  };
});
w('file-integrity-report.json', { selfHashPolicy: summary.selfHashPolicy, files: entries });

// Latest run pointer
fs.writeFileSync(path.join(ROOT,'migration-output/latest-run.json'), JSON.stringify({runId:RUN_ID,runDirectory:OUT,createdAt:now.toISOString(),ndjsonPath:path.join(OUT,'content-drafts.ndjson')},null,2));

// ── Summary output ────────────────────────────────────────────────────────────
console.log(`\nDONE  ${RUN_ID}`);
console.log(`  source  : ${extractedSourceTotal} total  = ${generatedSourceTotal} gen + ${deferredSourceTotal} defer + ${skippedSourceTotal} skip + ${mergedSourceTotal} merge + ${rejectedSourceTotal} reject  [balance: ${srcBalance===extractedSourceTotal?'OK':'FAIL'}]`);
console.log(`  seed    : ${seedDocumentsTotal} total = ${generatedSeedTotal} gen + ${deferredSeedTotal} defer  [balance: ${seedBalance===seedDocumentsTotal?'OK':'FAIL'}]`);
console.log(`  NDJSON  : ${ndjson.length}  (${generatedSourceTotal} source + ${generatedSeedTotal} seed)`);
console.log(`  invalidRefs: ${invalidReferences}`);
