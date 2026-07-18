import * as fs from 'fs';
import * as path from 'path';

// 导入数据
import { caseStudies } from '../lib/case-studies';
import { faqData as generalFaqs } from '../lib/faq';
import { b2bFaqData } from '../lib/b2b-faq';
import { sportsCategories, homeFaqs, factoryStats } from '../lib/home-data';
import { guidePages } from '../lib/guides-data';
import { buyingGuides } from '../lib/guides';
import { sportsPages } from '../lib/sports-pages';
import { pseoPages } from '../lib/pseo';
import { resourcePages } from '../lib/resources-data';

const RAW_DATA_DIR = path.join(__dirname, '../migration-output/raw-extracted');
if (!fs.existsSync(RAW_DATA_DIR)) fs.mkdirSync(RAW_DATA_DIR, { recursive: true });

// 1. 案例显式稳定映射 (PII 物理脱敏)
const STABLE_CASE_MAP: Record<string, { key: string, label: string }> = {
  'school-athletics-multi-sport-program': { key: 'case-001', label: 'Teamwear Distributor — Europe' },
  'australia-soccer-club-kit-project': { key: 'case-002', label: 'Football Club Manager — West Africa' },
  'usa-basketball-academy-uniform-program': { key: 'case-003', label: 'Academy Sports Director — France' },
  'distributor-bulk-teamwear-program': { key: 'case-004', label: 'Sportswear Brand Partner — Netherlands' },
  'middle-east-sports-event-program': { key: 'case-005', label: 'Team Captain — Caribbean' }
};

const anonymizedCaseStudies = caseStudies.map(c => {
  const mapping = STABLE_CASE_MAP[c.slug];
  if (!mapping) return null;
  
  // 物理清除 PII
  const { ...safeContent } = c;
  // @ts-ignore (原有字段即使存在也不再导出)
  delete safeContent.buyerName;
  // @ts-ignore
  delete safeContent.clientName;

  return {
    ...safeContent,
    sourceRecordKey: mapping.key,
    publicBuyerLabel: mapping.label,
    buyerDisclosureStatus: 'anonymous',
    consentConfirmed: false
  };
}).filter(Boolean);

const payload = {
  home: { sportsCategories, homeFaqs, factoryStats },
  generalFaqs,
  b2bFaqs: b2bFaqData,
  coreGuides: guidePages,
  buyingGuides,
  sportsPages,
  pseoPages,
  resourcePages,
  caseStudies: anonymizedCaseStudies
};

fs.writeFileSync(
  path.join(RAW_DATA_DIR, 'source-data.json'), 
  JSON.stringify(payload, null, 2)
);

console.log('Successfully extracted and anonymized source data.');
