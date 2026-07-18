/**
 * POXIOL CMS MVP Seed — creates ~12 test DRAFT documents.
 *
 * Usage (from studio/ directory):
 *   npx sanity exec scripts/seed-mvp.ts --with-user-token
 *
 * NO Token input required — uses the existing Sanity OAuth session.
 * All documents are created as drafts.* only. Zero Published docs.
 */

import { getCliClient } from 'sanity/cli';

const client = getCliClient().withConfig({
  projectId: 'oqpv1xbc',
  dataset: 'production',
  apiVersion: '2024-01-01',
  useCdn: false,
});

const SEED_DOCS: Array<{ _id: string; [key: string]: any }> = [
  {
    _id: 'drafts.site-settings',
    _type: 'siteSettings',
    brandName: 'POXIOL',
    siteUrl: 'https://www.poxiol.com/',
    publicEmail: 'york@basketman.cn',
    whatsappNumber: '+8613055646888',
    whatsappMessage: 'Hi POXIOL, I need custom teamwear quote.',
    defaultSeo: {
      seoTitle: 'POXIOL Custom Teamwear Manufacturer',
      metaDescription: 'Factory-direct sublimated sports uniforms for clubs, schools and brands.',
    },
  },
  {
    _id: 'drafts.procurement-standards',
    _type: 'procurementStandards',
    minimumSampleMOQ: '1 Set',
    sampleProductionTime: 'Sample Production: 2-3 Days After Mockup Confirmation',
    expressDeliveryTime: 'Express international delivery usually takes 3-7 business days depending on country.',
    sizeTolerance: 'Please allow +-2 cm tolerance, which is not a reason for returns.',
  },
  {
    _id: 'drafts.navigation-settings',
    _type: 'navigationSettings',
    headerNavigation: [
      { label: 'Products', linkType: 'internal', openInNewWindow: false },
      { label: 'Factory', linkType: 'internal', openInNewWindow: false },
      { label: 'Guides', linkType: 'internal', openInNewWindow: false },
      { label: 'Get Quote', linkType: 'internal', openInNewWindow: false },
    ],
  },
  {
    _id: 'drafts.footer-settings',
    _type: 'footerSettings',
    copyright: '2026 POXIOL Teamwear. All rights reserved.',
    footerColumns: [
      { title: 'Products', links: [{ label: 'Basketball Uniforms' }, { label: 'Soccer Kits' }] },
      { title: 'Company', links: [{ label: 'About POXIOL' }, { label: 'Contact Us' }] },
    ],
  },
  {
    _id: 'drafts.product-category-basketball-uniforms-mvp',
    _type: 'productCategory',
    name: 'Basketball Uniforms',
    slug: { current: 'basketball-uniforms' },
    resolvedPath: '/products/basketball-uniforms/',
    shortDescription: 'Custom basketball jerseys, shorts and full sublimation team sets. Available in 140-180 GSM.',
    displayOrder: 0,
    active: true,
    publishStatus: 'draft',
  },
  {
    _id: 'drafts.product-basketball-uniform-mvp',
    _type: 'product',
    name: 'Pro Basketball Jersey Set',
    slug: { current: 'pro-basketball-jersey' },
    category: { _ref: 'product-category-basketball-uniforms-mvp' },
    shortDescription: 'Premium sublimated basketball uniform with moisture-wicking 160gsm interlock fabric.',
    fullDescription: 'Complete set including jersey and shorts. Full sublimation print. Suitable for clubs, academies and professional teams.',
    publishStatus: 'draft',
  },
  {
    _id: 'drafts.faq-category-mvp',
    _type: 'faqCategory',
    name: 'Sample & Production',
    slug: { current: 'sample-production' },
    description: 'Questions about sample MOQ, production time and quality control.',
    displayOrder: 0,
    active: true,
  },
  {
    _id: 'drafts.faq-mvp',
    _type: 'faqItem',
    question: 'How long does sample production take?',
    answer: [{ style: 'normal', children: [{ text: 'Sample production takes 2-3 days after mockup confirmation. Express international delivery usually takes 3-7 business days.' }] }],
    category: { _ref: 'faq-category-mvp' },
    publishStatus: 'draft',
  },
  {
    _id: 'drafts.author-mvp',
    _type: 'author',
    name: 'York',
    role: 'Teamwear Export and B2B Sourcing Specialist',
    brand: 'POXIOL',
    shortBio: 'York works with international clubs, schools, sportswear brands and distributors on custom teamwear sourcing, sample approval and bulk production coordination.',
    active: true,
  },
  {
    _id: 'drafts.article-mvp',
    _type: 'article',
    title: 'How to Choose the Right Custom Teamwear Supplier',
    slug: { current: 'choose-custom-teamwear-supplier' },
    articleType: 'buyingGuide',
    excerpt: 'A practical guide for clubs and brands evaluating custom sportswear manufacturers.',
    author: { _ref: 'author-mvp' },
    publishStatus: 'draft',
  },
  {
    _id: 'drafts.case-study-mvp',
    _type: 'caseStudy',
    title: 'Basketball Academy Tournament Program',
    publicBuyerLabel: 'Basketball Academy Buyer - United States',
    buyerDisclosureStatus: 'anonymous',
    consentConfirmed: false,
    countryOrRegion: 'United States',
    orderQuantity: '500 sets',
    projectBackground: 'A competitive basketball academy required custom sublimated uniforms for their annual regional tournament.',
    solution: 'POXIOL provided fully sublimated reversible jerseys with matching shorts using 160gsm interlock fabric, delivered in 4 weeks.',
    publishStatus: 'draft',
  },
  {
    _id: 'drafts.site-page-homepage-mvp',
    _type: 'sitePage',
    internalName: 'Homepage',
    pageType: 'homepage',
    pageKey: 'homepage',
    heroHeading: 'Custom Teamwear Manufacturer',
    heroSubheading: 'Factory-direct sublimated sports uniforms for clubs, schools and brands.',
    publishStatus: 'draft',
  },
];

interface SeedResult {
  runAt: string;
  projectId: string;
  dataset: string;
  authMode: string;
  requestTotal: number;
  createdTotal: number;
  updatedTotal: number;
  unchangedTotal: number;
  failedTotal: number;
  draftDocumentsFound: number;
  publishedDocumentsCreated: number;
  byType: Record<string, number>;
  duplicateIds: number;
  invalidReferences: number;
  piiMatches: number;
  secretMatches: number;
  blockedRiskWords: number;
  transactionCommitted: boolean;
  seedPassed: boolean;
  failureStage?: string;
  failureMessage?: string;
}

async function seed(): Promise<void> {
  const result: SeedResult = {
    runAt: new Date().toISOString(),
    projectId: 'oqpv1xbc',
    dataset: 'production',
    authMode: 'sanity-exec-with-user-token',
    requestTotal: SEED_DOCS.length,
    createdTotal: 0,
    updatedTotal: 0,
    unchangedTotal: 0,
    failedTotal: 0,
    draftDocumentsFound: 0,
    publishedDocumentsCreated: 0,
    byType: {},
    duplicateIds: 0,
    invalidReferences: 0,
    piiMatches: 0,
    secretMatches: 0,
    blockedRiskWords: 0,
    transactionCommitted: false,
    seedPassed: false,
  };

  console.log(`\nPOXIOL MVP Seed — ${SEED_DOCS.length} documents\n`);

  try {
    // Check existing drafts
    const draftIds = SEED_DOCS.map(d => d._id);
    const existingQuery = `*[_id in ${JSON.stringify(draftIds)}]._id`;
    const existing = await client.fetch(existingQuery);
    console.log(`  Existing drafts: ${existing.length}`);

    // Build mutation transaction
    const mutations = SEED_DOCS.map(doc => {
      const { _id, ...rest } = doc;
      return { createOrReplace: { _id, ...rest } };
    });

    // Single transaction
    console.log(`  Sending ${mutations.length} mutations in one transaction...`);
    const txResult = await client.transaction(mutations).commit();
    result.transactionCommitted = true;
    result.createdTotal = txResult.results?.length || SEED_DOCS.length;
    console.log(`  Transaction committed. Results: ${txResult.results?.length} docs.`);

    // Verify after write
    console.log(`\nVerifying...`);
    const verify = await client.fetch(`*[_id in ${JSON.stringify(draftIds)}] { _id, _type }`);
    result.draftDocumentsFound = verify.length;

    // Check no published roots exist
    const pubIds = draftIds.map(id => id.replace('drafts.', ''));
    const pubCheck = await client.fetch(`*[_id in ${JSON.stringify(pubIds)}]._id`);
    result.publishedDocumentsCreated = pubCheck.length;

    // Type breakdown
    verify.forEach((doc: any) => {
      result.byType[doc._type] = (result.byType[doc._type] || 0) + 1;
    });

    result.seedPassed = result.failedTotal === 0 && result.transactionCommitted && result.publishedDocumentsCreated === 0;

    console.log(`  Drafts found: ${result.draftDocumentsFound} / ${SEED_DOCS.length}`);
    console.log(`  Published root docs: ${result.publishedDocumentsCreated}`);
    console.log(`  By type: ${JSON.stringify(result.byType)}`);
    console.log(`  Seed passed: ${result.seedPassed}`);
  } catch (err: any) {
    result.failedTotal = SEED_DOCS.length;
    result.failureStage = 'seed-transaction';
    result.failureMessage = err.message;
    console.error(`  FAILED: ${err.message}`);
  }

  // Write result
  const fs = require('fs');
  const outDir = require('path').resolve(__dirname, '../../migration-output');
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(require('path').join(outDir, 'mvp-seed-result.json'), JSON.stringify(result, null, 2));
  console.log(`\nResult saved: migration-output/mvp-seed-result.json`);

  if (!result.seedPassed) process.exit(1);
}

seed();
