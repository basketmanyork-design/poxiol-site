/**
 * POXIOL CMS MVP Seed — creates ~12 test documents as drafts.
 * Run with: node scripts/seed-mvp.cjs
 * Requires SANITY_AUTH_TOKEN env var.
 */
const fs = require('fs');
const path = require('path');

const TOKEN = process.env.SANITY_AUTH_TOKEN;
if (!TOKEN) { console.error('SANITY_AUTH_TOKEN not set'); process.exit(1); }

const PROJECT = 'oqpv1xbc';
const DATASET = 'production';
const API = `https://${PROJECT}.api.sanity.io/v2024-01-01/data/mutate/${DATASET}`;

const HEADERS = {
  'Authorization': `Bearer ${TOKEN.trim()}`,
  'Content-Type': 'application/json',
};

async function mutate(mutations) {
  const body = JSON.stringify({ mutations });
  const res = await fetch(API, { method: 'POST', headers: HEADERS, body });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`${res.status}: ${text.slice(0, 200)}`);
  }
  return res.json();
}

async function seed() {
  const docs = [
    { _id: 'drafts.siteSettings', _type: 'siteSettings', brandName: 'POXIOL', siteUrl: 'https://www.poxiol.com/', publicEmail: 'york@basketman.cn', whatsappNumber: '+8613055646888', whatsappMessage: 'Hi POXIOL, I need custom teamwear.' },
    { _id: 'drafts.procurementStandards', _type: 'procurementStandards', minimumSampleMOQ: '1 Set', sampleProductionTime: 'Sample Production: 2-3 Days After Mockup Confirmation', expressDeliveryTime: 'Express international delivery usually takes 3-7 business days.', sizeTolerance: 'Please allow +-2 cm tolerance.' },
    { _id: 'drafts.navigationSettings', _type: 'navigationSettings', headerNavigation: [{ label: 'Products', linkType: 'internal' }, { label: 'Factory', linkType: 'internal' }, { label: 'Guides', linkType: 'internal' }] },
    { _id: 'drafts.footerSettings', _type: 'footerSettings', copyright: '2026 POXIOL Teamwear.', footerColumns: [{ title: 'Company', links: [{ label: 'About' }, { label: 'Contact' }] }] },
    { _id: 'drafts.faq-category-sample', _type: 'faqCategory', name: 'Sample', slug: { current: 'sample' }, displayOrder: 0, active: true },
    { _id: 'drafts.faq-sample-time', _type: 'faqItem', question: 'How long does sample production take?', answer: [{ style: 'normal', children: [{ text: 'Sample production takes 2-3 days after mockup confirmation.' }] }], category: { _ref: 'faq-category-sample' }, publishStatus: 'draft', internalKey: 'faq-sample-time' },
    { _id: 'drafts.product-category-basketball', _type: 'productCategory', name: 'Basketball Uniforms', slug: { current: 'basketball-uniforms' }, resolvedPath: '/products/basketball-uniforms/', shortDescription: 'Custom basketball jerseys, shorts and full sublimation team sets.', displayOrder: 0, active: true },
    { _id: 'drafts.product-basketball-jersey', _type: 'product', name: 'Pro Basketball Jersey', slug: { current: 'pro-basketball-jersey' }, category: { _ref: 'product-category-basketball' }, shortDescription: 'Premium sublimated basketball jersey with moisture-wicking 160gsm fabric.', productType: 'Jersey', fabric: 'Interlock', gsm: '160', printingMethod: 'Sublimation', publishStatus: 'draft' },
    { _id: 'drafts.author-york', _type: 'author', name: 'York', role: 'Teamwear Export and B2B Sourcing Specialist', brand: 'POXIOL', shortBio: 'York works with international clubs, schools, sportswear brands and distributors on custom teamwear sourcing, sample approval and bulk production coordination.' },
    { _id: 'drafts.article-fabric-guide', _type: 'article', title: 'Teamwear Fabric Guide 2026', slug: { current: 'teamwear-fabric-guide-2026' }, articleType: 'buyingGuide', excerpt: 'Everything you need to know about sports fabric GSM, composition and performance.', author: { _ref: 'author-york' }, publishStatus: 'draft' },
    { _id: 'drafts.case-study-basketball-project', _type: 'caseStudy', title: 'Basketball Academy Project', publicBuyerLabel: 'Basketball Academy Buyer - USA', buyerDisclosureStatus: 'anonymous', consentConfirmed: false, countryOrRegion: 'United States', sportType: 'basketball', orderQuantity: '500 sets', projectBackground: 'A competitive basketball academy needed custom sublimated uniforms for their regional tournament.', solution: 'POXIOL delivered fully sublimated reversible jerseys with matching shorts, using 160gsm interlock fabric.', publishStatus: 'draft' },
    { _id: 'drafts.site-page-homepage', _type: 'sitePage', internalName: 'Homepage', pageType: 'homepage', pageKey: 'homepage', heroHeading: 'Custom Teamwear Manufacturer', heroSubheading: 'Factory-direct sublimated sports uniforms for clubs, schools and brands.', publishStatus: 'draft' },
  ];

  const mutations = docs.map(d => {
    const { _id, ...rest } = d;
    return { createOrReplace: { _id, ...rest } };
  });

  console.log(`Seeding ${mutations.length} documents...`);
  try {
    const result = await mutate(mutations);
    console.log(`Done. Transaction ID: ${result.transactionId}`);
    console.log(`Results: ${result.results?.length || 'N/A'}`);
  } catch (e) {
    console.error('Seed failed:', e.message);
    process.exit(1);
  }
}

seed();
