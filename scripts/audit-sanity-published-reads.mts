import {execFileSync} from 'node:child_process'
import {readFileSync, writeFileSync} from 'node:fs'
import {resolve} from 'node:path'

import {buildDeterministicBuildId} from '../lib/release/build-id.mjs'
import {
  SANITY_EVIDENCE_BUILD_ID_PATHS,
  buildSanityEvidence,
  captureSanityBuildEvidence,
  formatSanityEvidenceLog,
  resolveCandidateCommit,
  verifySanityBuildEvidence,
} from '../lib/release/sanity-build-evidence.mjs'

import {
  articleBySlugQuery,
  articlesQuery,
  caseStudiesQuery,
  caseStudyBySlugQuery,
  faqItemsQuery,
  footerQuery,
  navigationQuery,
  procurementStandardsQuery,
  productBySlugQuery,
  productCategoriesQuery,
  productCategoryBySlugQuery,
  productsByCategoryQuery,
  productsQuery,
  redirectRulesQuery,
  sitePageByKeyQuery,
  siteSettingsQuery,
} from '../lib/sanity/queries.ts'

const reads = [
  {name: 'site-settings', query: siteSettingsQuery, params: {}},
  {name: 'navigation', query: navigationQuery, params: {}},
  {name: 'footer', query: footerQuery, params: {}},
  {name: 'site-page', query: sitePageByKeyQuery, params: {key: 'homepage'}},
  {name: 'product-categories', query: productCategoriesQuery, params: {}},
  {name: 'product-category', query: productCategoryBySlugQuery, params: {slug: 'basketball-uniforms'}},
  {name: 'products', query: productsQuery, params: {}},
  {name: 'products-by-category', query: productsByCategoryQuery, params: {categorySlug: 'basketball-uniforms'}},
  {name: 'product', query: productBySlugQuery, params: {slug: '$firstPublishedProduct'}},
  {name: 'case-studies', query: caseStudiesQuery, params: {}},
  {name: 'case-study', query: caseStudyBySlugQuery, params: {slug: 'usa-basketball-academy-uniform-program'}},
  {name: 'faqs', query: faqItemsQuery, params: {}},
  {name: 'articles', query: articlesQuery, params: {}},
  {name: 'article', query: articleBySlugQuery, params: {slug: '$firstPublishedArticle'}},
  {name: 'procurement-standards', query: procurementStandardsQuery, params: {}},
  {name: 'redirect-rules', query: redirectRulesQuery, params: {}},
]

function gitCommit(root: string) {
  return execFileSync('git', ['-c', `safe.directory=${root.replaceAll('\\', '/')}`, 'rev-parse', 'HEAD'], {
    cwd: root,
    encoding: 'utf8',
    windowsHide: true,
  }).trim()
}

async function run() {
  const root = process.cwd()
  const mode = process.argv[2] || '--legacy'

  if (mode === '--legacy') {
    const evidence = await buildSanityEvidence({candidateCommit: '0'.repeat(40), reads})
    const audit = {
      version: 1,
      projectId: evidence.projectId,
      dataset: evidence.dataset,
      apiVersion: evidence.apiVersion,
      transport: evidence.transport,
      perspective: evidence.perspective,
      authentication: evidence.authentication,
      cmsWrites: evidence.cmsWrites,
      reads: evidence.reads.map((read) => ({...read, perspective: 'published'})),
    }
    writeFileSync(resolve(root, 'construction/sanity-read-audit.json'), `${JSON.stringify(audit, null, 2)}\n`)
    console.log(`[sanity-read-audit] ${audit.reads.length} published GET queries hashed; cmsWrites=0`)
    return
  }

  if (mode !== '--capture' && mode !== '--verify') throw new Error('SANITY_BUILD_EVIDENCE_MODE_INVALID')
  const candidateCommit = resolveCandidateCommit({
    envCommit: process.env.CF_PAGES_COMMIT_SHA || '',
    gitCommit: gitCommit(root),
  })

  if (mode === '--capture') {
    await captureSanityBuildEvidence({root, candidateCommit, reads})
    return
  }

  const buildId = readFileSync(resolve(root, '.next/BUILD_ID'), 'utf8').trim()
  const expectedBuildId = buildDeterministicBuildId({root, paths: SANITY_EVIDENCE_BUILD_ID_PATHS})
  const evidence = await verifySanityBuildEvidence({
    root,
    candidateCommit,
    reads,
    buildId,
    expectedBuildId,
  })
  console.log(formatSanityEvidenceLog({evidence, buildId}))
}

await run()
