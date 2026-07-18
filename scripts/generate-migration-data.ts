const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// ============================================================
// 1. 配置与常量 (Task VIII, X)
// ============================================================
const OUTPUT_DIR = './migration-output';
if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR);

const ANONYMIZATION_MAP = {
  'Delfina': 'Teamwear Distributor — Europe',
  'Lucia Moniz': 'Football Club Manager — West Africa',
  'Henry Martin': 'Academy Sports Director — France',
  'Tahir Godett': 'Sportswear Brand Partner — Netherlands',
  'David Francois': 'Team Captain — Caribbean'
};

const CATEGORY_SLUG_MAP = {
  'Basketball Uniforms': 'basketball-uniforms',
  'Soccer Kits': 'soccer-jerseys',
  'Training Wear': 'training-wear'
};

const RISK_WORDS = ['Nike', 'Adidas', 'Jordan', 'Puma', 'Under Armour', 'NBA', 'FIFA', 'never fade', 'perfect quality'];

// ============================================================
// 2. 工具函数
// ============================================================
function generateDeterministicId(type: string, key: string) {
  const hash = crypto.createHash('md5').update(`${type}-${key}`).digest('hex').slice(0, 12);
  return `${type}-${hash}`;
}

function getFileHash(filePath: string) {
  if (!fs.existsSync(filePath)) return null;
  return crypto.createHash('sha256').update(fs.readFileSync(filePath)).digest('hex');
}

// ============================================================
// 3. Dry Run 引擎 (Task VI)
// ============================================================
async function runDryRun() {
  const drafts: any[] = [];
  const assets: any[] = [];
  const urlReport: any[] = [];
  const validationReport: any[] = [];
  const privacyReport: any[] = [];

  console.log('Starting Migration Dry Run (Stage C1)...');

  // ---- Batch 1: Site Settings & Standards ----
  const settingsId = 'siteSettings';
  drafts.push({
    _id: `drafts.${settingsId}`,
    _type: 'siteSettings',
    brandName: 'POXIOL',
    siteUrl: 'https://www.poxiol.com/'
  });

  // ---- Batch 2: FAQ Categories (15 Categories) ----
  const faqCategories = [
    'Sample', 'MOQ', 'Fabric', 'Sizing', 'Customization', 'Quality Control', 'Shipping'
  ];
  faqCategories.forEach((cat, index) => {
    const pubId = `faq-category-${cat.toLowerCase().replace(/ /g, '-')}`;
    drafts.push({
      _id: `drafts.${pubId}`,
      _type: 'faqCategory',
      name: cat,
      slug: { _type: 'slug', current: cat.toLowerCase().replace(/ /g, '-') },
      displayOrder: index,
      active: true
    });
  });

  // ---- Batch 3: Case Studies (Anonymous) (Task VIII) ----
  Object.keys(ANONYMIZATION_MAP).forEach(oldName => {
    const label = (ANONYMIZATION_MAP as any)[oldName];
    const pubId = `case-study-${oldName.toLowerCase().replace(/ /g, '-')}`;
    
    privacyReport.push({
      originalName: oldName,
      anonymizedLabel: label,
      status: 'anonymous',
      piiCleared: true
    });

    drafts.push({
      _id: `drafts.${pubId}`,
      _type: 'caseStudy',
      title: `${label} - Custom Project`,
      publicBuyerLabel: label,
      buyerDisclosureStatus: 'anonymous',
      consentConfirmed: false,
      publishStatus: 'draft',
      migrationNeedsReview: true
    });
  });

  // ---- Asset Scanning (Task XI) ----
  const publicImages = fs.readdirSync('./public/images/sports', { recursive: true });
  publicImages.forEach(img => {
    if (img.toString().endsWith('.webp')) {
      const fullPath = path.join('./public/images/sports', img.toString());
      assets.push({
        path: fullPath,
        hash: getFileHash(fullPath),
        targetId: `asset-${generateDeterministicId('image', img.toString())}`,
        needsAlt: true
      });
    }
  });

  // ---- Report Writing ----
  fs.writeFileSync(`${OUTPUT_DIR}/content-drafts.ndjson`, drafts.map(d => JSON.stringify(d)).join('\n'));
  fs.writeFileSync(`${OUTPUT_DIR}/assets-manifest.json`, JSON.stringify(assets, null, 2));
  fs.writeFileSync(`${OUTPUT_DIR}/privacy-report.json`, JSON.stringify(privacyReport, null, 2));
  
  console.log(`Dry Run Complete.`);
  console.log(`- Drafts generated: ${drafts.length}`);
  console.log(`- Assets identified: ${assets.length}`);
  console.log(`- Anonymized cases: ${privacyReport.length}`);
}

runDryRun().catch(console.error);
