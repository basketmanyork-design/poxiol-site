import {highIntentGuides} from '../lib/high-intent-guides.ts'

export const resource = {projectId: 'oqpv1xbc', dataset: 'production'}

const identities = {
  'reversible-vs-single-layer-basketball-uniforms': {draftId: 'drafts.article-reversible-vs-single-layer-basketball-uniforms', publishedId: 'article-reversible-vs-single-layer-basketball-uniforms'},
  'custom-basketball-uniform-fabric-gsm': {draftId: 'drafts.5df7417df6e44eb4', publishedId: '5df7417df6e44eb4', expectedDraftRevision: 'BtROzTuZsdqYCncKTsNK0k', expectedPublishedRevision: 'poxiol-published-production-time-fix-20260803'},
  'sample-first-vs-bulk-teamwear-order': {draftId: 'drafts.article-sample-first-vs-bulk-teamwear-order', publishedId: 'article-sample-first-vs-bulk-teamwear-order'},
  'custom-basketball-uniform-cost-factors': {draftId: 'drafts.article-custom-basketball-uniform-cost-factors', publishedId: 'article-custom-basketball-uniform-cost-factors'},
}

export const draftPlan = highIntentGuides.map((guide, index) => ({
  ...identities[guide.slug],
  slug: guide.slug,
  document: {
    _id: identities[guide.slug].draftId,
    _type: 'article',
    title: guide.h1,
    slug: {_type: 'slug', current: guide.slug},
    articleType: 'guide',
    excerpt: guide.intro,
    methodology: guide.methodology,
    cta: {_type: 'callToAction', label: guide.cta.label, href: guide.cta.href},
    seo: {_type: 'seoFields', metaTitle: guide.metaTitle, metaDescription: guide.metaDescription},
    structuredDataType: 'Article',
    publishStatus: 'draft',
    displayOrder: 200 + index,
  },
}))

export function validatePlan() {
  if (draftPlan.length !== 4) throw new Error('Draft allowlist must contain exactly four articles')
  if (new Set(draftPlan.map(({draftId}) => draftId)).size !== 4) throw new Error('Duplicate Draft ID')
  if (new Set(draftPlan.map(({publishedId}) => publishedId)).size !== 4) throw new Error('Duplicate Published ID')
  for (const item of draftPlan) {
    if (!item.draftId.startsWith('drafts.') || item.publishedId !== item.draftId.replace(/^drafts\./, '')) throw new Error(`Invalid identity: ${item.slug}`)
    if (item.document._id !== item.draftId || item.document._type !== 'article' || item.document.publishStatus !== 'draft') throw new Error(`Invalid Draft document: ${item.slug}`)
  }
  return true
}
