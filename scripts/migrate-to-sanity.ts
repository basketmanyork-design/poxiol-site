/**
 * POXIOL CMS 内容迁移脚本 (Stage C - 占位框架)
 * 
 * 本脚本将在 Stage C 执行正式迁移。
 * 目前仅定义迁移数据结构，不执行任何写入操作。
 * 
 * 迁移数据源 (13 个 .ts 文件 -> Sanity Content Lake):
 * - lib/home-data.ts        -> siteSettings, productCategory
 * - lib/faq.ts              -> faqItem (32 items)
 * - lib/b2b-faq.ts          -> faqItem (9 items)
 * - lib/guides-data.ts      -> article (4 guides)
 * - lib/guides.ts           -> article (3 guides)
 * - lib/sports-pages.ts     -> product (5 products)
 * - lib/pseo.ts             -> article (18 articles)
 * - lib/case-studies.ts     -> caseStudy (5 case studies)
 * - lib/resources-data.ts   -> article (9 articles)
 * - lib/seo-data.ts         -> SEO fields on each document
 * - lib/contact-data.ts     -> siteSettings (contact info)
 * - lib/fabrics.ts          -> product (fabric references)
 * - lib/free-mockup-data.ts -> siteSettings, faqItem
 * 
 * 总计: ~130+ 条内容文档
 */

interface MigrationPlan {
  source: string
  targetType: string
  estimatedCount: number
}

const migrationPlan: MigrationPlan[] = [
  {source: 'lib/home-data.ts', targetType: 'siteSettings/productCategory', estimatedCount: 31},
  {source: 'lib/faq.ts', targetType: 'faqItem', estimatedCount: 32},
  {source: 'lib/b2b-faq.ts', targetType: 'faqItem', estimatedCount: 9},
  {source: 'lib/guides-data.ts', targetType: 'article', estimatedCount: 4},
  {source: 'lib/guides.ts', targetType: 'article', estimatedCount: 3},
  {source: 'lib/sports-pages.ts', targetType: 'product', estimatedCount: 5},
  {source: 'lib/pseo.ts', targetType: 'article', estimatedCount: 18},
  {source: 'lib/case-studies.ts', targetType: 'caseStudy', estimatedCount: 5},
  {source: 'lib/resources-data.ts', targetType: 'article', estimatedCount: 9},
  {source: 'lib/contact-data.ts', targetType: 'siteSettings', estimatedCount: 1},
  {source: 'lib/fabrics.ts', targetType: 'product', estimatedCount: 1},
  {source: 'lib/seo-data.ts', targetType: 'seoFields', estimatedCount: 10},
  {source: 'lib/free-mockup-data.ts', targetType: 'siteSettings', estimatedCount: 5},
]

console.log('Migration plan ready. Total estimated documents:', migrationPlan.reduce((sum, m) => sum + m.estimatedCount, 0))
console.log('Stage C execution pending user confirmation.')
