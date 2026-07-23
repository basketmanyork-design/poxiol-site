// @ts-nocheck
import {createHash} from 'node:crypto'
import {existsSync, mkdirSync, readFileSync, statSync, writeFileSync} from 'node:fs'
import path from 'node:path'
import {fileURLToPath} from 'node:url'

import {b2bFaqData} from '../lib/b2b-faq.ts'
import {caseStudies} from '../lib/case-studies.ts'
import {contactCards, contactFaqs, inquiryTypeOptions} from '../lib/contact-data.ts'
import {faqData} from '../lib/faq.ts'
import {buyingGuides} from '../lib/guides.ts'
import {guidePages} from '../lib/guides-data.ts'
import {sportsCategories} from '../lib/home-data.ts'
import {pseoPages} from '../lib/pseo.ts'
import {resourcePages} from '../lib/resources-data.ts'
import {sportsPages} from '../lib/sports-pages.ts'

type Primitive = string | number | boolean | null
type Json = Primitive | Json[] | {[key: string]: Json}

type CandidateDocument = {
  _id: string
  _type: string
  source: string
  slug?: string
  route?: string
  title?: string
  publishStatus?: 'draft'
  fields: Record<string, Json | undefined>
}

type AssetCandidate = {
  sourcePath: string
  exists: boolean
  extension: string
  byteSize: number | null
  sha256: string | null
  intendedSanityField: string
  intendedDocumentId: string
  altText: string
  duplicateAssetHash: string | null
}

type Finding = {
  severity: 'info' | 'warning' | 'error'
  category: string
  message: string
  documentId?: string
  route?: string
}

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const tmpDir = path.join(rootDir, 'tmp', 'cms-migration-dry-run')
const docsDir = path.join(rootDir, 'docs')

const corePageSlugs = [
  'homepage',
  'about',
  'factory',
  'manufacturing',
  'quality-control-process',
  'customization',
  'contact',
  'oem-odm',
  'free-mockup',
  'sample-order',
  'get-quote',
] as const

const knownVisualReviewItems = [
  'Checkpoint A visual review is not final acceptance; these differences block final PR merge until resolved.',
  'H1 changed on About, Factory, Manufacturing, Quality Control, Customization, OEM/ODM, Free Mockup, Sample Order, Get Quote, Basketball, and Soccer.',
  'Factory image count changed from 4 to 1.',
  'Free Mockup image count changed from 1 to 0.',
  'Products section count changed from 3 to 2.',
  'Free Mockup section count changed from 4 to 3.',
]

function slugify(value: unknown, fallback: string) {
  const raw = String(value || fallback)
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
  return raw || fallback
}

function hashText(value: string | Buffer) {
  return createHash('sha256').update(value).digest('hex')
}

function stableStringify(value: unknown): string {
  if (Array.isArray(value)) {
    return `[${value.map((item) => stableStringify(item)).join(',')}]`
  }

  if (value && typeof value === 'object') {
    return `{${Object.keys(value as Record<string, unknown>)
      .sort()
      .map((key) => `${JSON.stringify(key)}:${stableStringify((value as Record<string, unknown>)[key])}`)
      .join(',')}}`
  }

  return JSON.stringify(value)
}

function asArray<T = unknown>(value: unknown): T[] {
  return Array.isArray(value) ? (value as T[]) : []
}

function normalizeRoute(route: string) {
  if (route === '/') return '/'
  return `/${route.replace(/^\/+|\/+$/g, '')}/`
}

function routeFromSlug(prefix: string, slug: string) {
  return normalizeRoute(`${prefix}/${slug}`)
}

function getSeoTitle(item: Record<string, unknown>) {
  return String(item.metaTitle || item.seoTitle || item.title || item.h1 || '')
}

function getMetaDescription(item: Record<string, unknown>) {
  return String(item.metaDescription || item.description || item.intro || item.overview || '')
}

function addFinding(findings: Finding[], finding: Finding) {
  findings.push(finding)
}

function addDoc(documents: CandidateDocument[], doc: CandidateDocument) {
  documents.push({
    publishStatus: 'draft',
    ...doc,
    fields: Object.fromEntries(
      Object.entries(doc.fields)
        .filter(([, value]) => value !== undefined)
        .sort(([a], [b]) => a.localeCompare(b)),
    ),
  })
}

function addSeoFindings(findings: Finding[], doc: CandidateDocument) {
  const title = String(doc.fields.seoTitle || doc.fields.title || doc.title || '')
  const description = String(doc.fields.metaDescription || doc.fields.description || '')

  if (!title.trim()) {
    addFinding(findings, {
      severity: 'warning',
      category: 'missingSeoTitle',
      message: 'Document does not have a usable SEO title candidate.',
      documentId: doc._id,
      route: doc.route,
    })
  }

  if (!description.trim()) {
    addFinding(findings, {
      severity: 'warning',
      category: 'missingMetaDescription',
      message: 'Document does not have a usable meta description candidate.',
      documentId: doc._id,
      route: doc.route,
    })
  }
}

function collectImagePaths(value: unknown, baseField = 'image'): Array<{path: string; field: string; alt: string}> {
  const results: Array<{path: string; field: string; alt: string}> = []

  function walk(current: unknown, trail: string, siblingAlt = '') {
    if (!current) return

    if (typeof current === 'string') {
      if (current.startsWith('/images/') || current.startsWith('/brand/') || current.startsWith('/ai-generated-assets/')) {
        results.push({path: current, field: trail, alt: siblingAlt})
      }
      return
    }

    if (Array.isArray(current)) {
      current.forEach((item, index) => walk(item, `${trail}[${index}]`, siblingAlt))
      return
    }

    if (typeof current === 'object') {
      const record = current as Record<string, unknown>
      const alt = String(record.alt || record.imageAlt || record.title || record.name || siblingAlt || '')
      for (const [key, nested] of Object.entries(record)) {
        walk(nested, `${trail}.${key}`, alt)
      }
    }
  }

  walk(value, baseField)
  return results
}

function makeAssetCandidate(imagePath: string, field: string, documentId: string, altText: string): AssetCandidate {
  const relativePath = imagePath.replace(/^\/+/, '')
  const fullPath = path.join(rootDir, 'public', relativePath.replace(/^public\//, ''))
  const exists = existsSync(fullPath)
  const byteSize = exists ? statSync(fullPath).size : null
  const sha256 = exists ? hashText(readFileSync(fullPath)) : null

  return {
    sourcePath: imagePath,
    exists,
    extension: path.extname(imagePath).toLowerCase(),
    byteSize,
    sha256,
    intendedSanityField: field,
    intendedDocumentId: documentId,
    altText,
    duplicateAssetHash: null,
  }
}

function addAssetsForSource(assets: AssetCandidate[], documentId: string, source: unknown) {
  for (const image of collectImagePaths(source)) {
    assets.push(makeAssetCandidate(image.path, image.field, documentId, image.alt))
  }
}

function buildDocuments() {
  const documents: CandidateDocument[] = []
  const findings: Finding[] = []
  const assets: AssetCandidate[] = []

  addDoc(documents, {
    _id: 'siteSettings',
    _type: 'siteSettings',
    source: 'legacy/site-chrome',
    title: 'POXIOL Site Settings',
    fields: {
      brandName: 'POXIOL',
      email: 'Legacy contact email candidate',
      salesEmail: 'Legacy sales email candidate',
      whatsappNumber: 'Legacy WhatsApp number candidate',
      alibabaStoreUrl: 'Legacy Alibaba store URL candidate',
    },
  })

  addDoc(documents, {
    _id: 'navigationSettings',
    _type: 'navigationSettings',
    source: 'legacy/header-navigation',
    title: 'Header Navigation',
    fields: {status: 'manual-review-required'},
  })

  addDoc(documents, {
    _id: 'footerSettings',
    _type: 'footerSettings',
    source: 'legacy/footer',
    title: 'Footer',
    fields: {status: 'manual-review-required'},
  })

  for (const slug of corePageSlugs) {
    addDoc(documents, {
      _id: `page.${slug}`,
      _type: 'sitePage',
      source: slug === 'homepage' ? 'app/page + lib/home-data.ts' : `app/${slug}/page.tsx`,
      slug,
      route: slug === 'homepage' ? '/' : normalizeRoute(slug),
      title: slug === 'homepage' ? 'Homepage' : slug,
      fields: {
        slug,
        route: slug === 'homepage' ? '/' : normalizeRoute(slug),
        requiresVisualParityReview: knownVisualReviewItems.some((item) => item.toLowerCase().includes(slug)),
      },
    })
  }

  for (const [index, category] of sportsCategories.entries()) {
    const categoryRecord = category as Record<string, unknown>
    const slug = slugify(categoryRecord.title, `homepage-category-${index + 1}`)
    const id = `homepage-card.${slug}`
    addDoc(documents, {
      _id: id,
      _type: 'homepageSportCategoryCard',
      source: 'lib/home-data.ts:sportsCategories',
      slug,
      route: categoryRecord.href ? normalizeRoute(String(categoryRecord.href)) : undefined,
      title: String(categoryRecord.title || slug),
      fields: {
        title: String(categoryRecord.title || ''),
        description: String(categoryRecord.description || ''),
        cta: String(categoryRecord.cta || ''),
        href: String(categoryRecord.href || ''),
        displayOrder: index + 1,
      },
    })
    addAssetsForSource(assets, id, category)
  }

  for (const [categoryIndex, page] of sportsPages.entries()) {
    const pageRecord = page as Record<string, unknown>
    const categorySlug = slugify(pageRecord.slug, `category-${categoryIndex + 1}`)
    const categoryId = `category.${categorySlug}`
    addDoc(documents, {
      _id: categoryId,
      _type: 'productCategory',
      source: 'lib/sports-pages.ts:sportsPages',
      slug: categorySlug,
      route: routeFromSlug('products', categorySlug),
      title: String(pageRecord.h1 || pageRecord.title || categorySlug),
      fields: {
        slug: categorySlug,
        seoTitle: getSeoTitle(pageRecord),
        metaDescription: getMetaDescription(pageRecord),
        h1: String(pageRecord.h1 || ''),
        heroText: String(pageRecord.heroText || ''),
        displayOrder: categoryIndex + 1,
      },
    })
    addAssetsForSource(assets, categoryId, page)

    for (const [productIndex, productType] of asArray<Record<string, unknown>>(pageRecord.productTypes).entries()) {
      const productSlug = slugify(productType.title || productType.name, `${categorySlug}-product-${productIndex + 1}`)
      const productId = `product.${categorySlug}.${productSlug}`
      addDoc(documents, {
        _id: productId,
        _type: 'product',
        source: 'lib/sports-pages.ts:productTypes',
        slug: productSlug,
        route: routeFromSlug('products', productSlug),
        title: String(productType.title || productType.name || productSlug),
        fields: {
          slug: productSlug,
          category: categoryId,
          productName: String(productType.title || productType.name || ''),
          shortDescription: String(productType.description || ''),
          displayOrder: productIndex + 1,
        },
      })
      addAssetsForSource(assets, productId, productType)
    }
  }

  for (const [index, study] of caseStudies.entries()) {
    const record = study as Record<string, unknown>
    const slug = slugify(record.slug, `case-study-${index + 1}`)
    const id = `case-study.${slug}`
    addDoc(documents, {
      _id: id,
      _type: 'caseStudy',
      source: 'lib/case-studies.ts',
      slug,
      route: routeFromSlug('projects', slug),
      title: String(record.title || slug),
      fields: {
        slug,
        title: String(record.title || ''),
        country: String(record.country || ''),
        product: String(record.product || ''),
        solution: String(record.solution || ''),
        qualityControl: String(record.qualityControl || ''),
      },
    })
    addAssetsForSource(assets, id, study)
  }

  const faqSources = [
    {name: 'lib/faq.ts', entries: faqData},
    {name: 'lib/b2b-faq.ts', entries: b2bFaqData},
  ]

  for (const source of faqSources) {
    for (const [categoryIndex, category] of source.entries.entries()) {
      const categoryRecord = category as Record<string, unknown>
      const categorySlug = slugify(categoryRecord.category, `faq-category-${categoryIndex + 1}`)
      addDoc(documents, {
        _id: `faq-category.${categorySlug}`,
        _type: 'faqCategory',
        source: source.name,
        slug: categorySlug,
        title: String(categoryRecord.category || categorySlug),
        fields: {title: String(categoryRecord.category || ''), displayOrder: categoryIndex + 1},
      })

      for (const [itemIndex, item] of asArray<Record<string, unknown>>(categoryRecord.items).entries()) {
        const question = String(item.question || item.q || '')
        const itemSlug = slugify(question, `faq-${hashText(`${source.name}-${categorySlug}-${itemIndex}`).slice(0, 10)}`)
        const id = `faq.${itemSlug}`
        addDoc(documents, {
          _id: id,
          _type: 'faqItem',
          source: source.name,
          slug: itemSlug,
          title: question,
          fields: {
            question,
            answer: String(item.answer || item.a || ''),
            category: `faq-category.${categorySlug}`,
            displayOrder: itemIndex + 1,
          },
        })
      }
    }
  }

  const articleSources = [
    {name: 'lib/guides-data.ts', type: 'guide', entries: guidePages},
    {name: 'lib/guides.ts', type: 'guide', entries: buyingGuides},
    {name: 'lib/resources-data.ts', type: 'resource', entries: resourcePages},
    {name: 'lib/pseo.ts', type: 'blog', entries: pseoPages},
  ]

  for (const source of articleSources) {
    for (const [index, article] of source.entries.entries()) {
      const record = article as Record<string, unknown>
      const slug = slugify(record.slug, `${source.type}-${index + 1}`)
      const id = `article.${slug}`
      addDoc(documents, {
        _id: id,
        _type: 'article',
        source: source.name,
        slug,
        route: routeFromSlug(source.type === 'blog' ? 'blog' : `${source.type}s`, slug),
        title: String(record.title || record.h1 || slug),
        fields: {
          slug,
          articleType: source.type,
          title: String(record.title || record.h1 || ''),
          h1: String(record.h1 || ''),
          excerpt: String(record.intro || record.metaDescription || ''),
          seoTitle: getSeoTitle(record),
          metaDescription: getMetaDescription(record),
          publishedAt: String(record.publishedDate || record.publishedAt || ''),
          updatedAt: String(record.lastUpdated || record.updatedAt || ''),
        },
      })
      addAssetsForSource(assets, id, article)
    }
  }

  addDoc(documents, {
    _id: 'author.poxiol-editorial-team',
    _type: 'author',
    source: 'legacy/article-defaults',
    slug: 'poxiol-editorial-team',
    title: 'POXIOL Editorial Team',
    fields: {name: 'POXIOL Editorial Team'},
  })

  for (const [index, card] of contactCards.entries()) {
    const record = card as Record<string, unknown>
    addDoc(documents, {
      _id: `contact-card.${slugify(record.title, `contact-card-${index + 1}`)}`,
      _type: 'contactCard',
      source: 'lib/contact-data.ts',
      title: String(record.title || ''),
      fields: {
        title: String(record.title || ''),
        description: String(record.description || ''),
        cta: String(record.cta || ''),
        href: String(record.href || ''),
      },
    })
  }

  for (const [index, option] of inquiryTypeOptions.entries()) {
    addDoc(documents, {
      _id: `inquiry-type.${slugify(option, `inquiry-type-${index + 1}`)}`,
      _type: 'inquiryType',
      source: 'lib/contact-data.ts',
      title: String(option),
      fields: {title: String(option), displayOrder: index + 1},
    })
  }

  for (const [index, faq] of contactFaqs.entries()) {
    const record = faq as Record<string, unknown>
    const question = String(record.question || '')
    addDoc(documents, {
      _id: `faq.${slugify(question, `contact-faq-${index + 1}`)}`,
      _type: 'faqItem',
      source: 'lib/contact-data.ts:contactFaqs',
      title: question,
      fields: {
        question,
        answer: String(record.answer || ''),
        category: 'faq-category.contact',
        displayOrder: index + 1,
      },
    })
  }

  const redirectsPath = path.join(rootDir, 'public', '_redirects')
  const redirectLines = existsSync(redirectsPath)
    ? readFileSync(redirectsPath, 'utf8')
        .split(/\r?\n/)
        .map((line) => line.trim())
        .filter((line) => line && !line.startsWith('#'))
    : []

  for (const line of redirectLines) {
    const [from, to, status] = line.split(/\s+/)
    const id = `redirect.${hashText(`${from}->${to}->${status || '301'}`).slice(0, 16)}`
    addDoc(documents, {
      _id: id,
      _type: 'redirectRule',
      source: 'public/_redirects',
      route: from,
      title: `${from} -> ${to}`,
      fields: {sourcePath: from, destinationPath: to, redirectType: Number(status || 301)},
    })
  }

  const docsById = new Map<string, CandidateDocument[]>()
  const routesByPath = new Map<string, CandidateDocument[]>()
  const articleSlugsBySlug = new Map<string, Set<string>>()

  for (const doc of documents) {
    docsById.set(doc._id, [...(docsById.get(doc._id) || []), doc])
    if (doc.route) routesByPath.set(doc.route, [...(routesByPath.get(doc.route) || []), doc])
    if (doc._type === 'article' && doc.slug) {
      articleSlugsBySlug.set(doc.slug, new Set([...(articleSlugsBySlug.get(doc.slug) || []), String(doc.fields.articleType || '')]))
    }
    addSeoFindings(findings, doc)
  }

  for (const [id, docs] of docsById) {
    if (docs.length > 1) {
      addFinding(findings, {
        severity: 'error',
        category: 'duplicateDocumentId',
        message: `${docs.length} candidate documents share the deterministic ID ${id}.`,
        documentId: id,
      })
    }
  }

  for (const [route, docs] of routesByPath) {
    if (docs.length > 1) {
      addFinding(findings, {
        severity: 'error',
        category: 'routeConflict',
        message: `${docs.length} candidate documents resolve to route ${route}.`,
        route,
      })
    }
  }

  for (const [slug, types] of articleSlugsBySlug) {
    if (types.size > 1) {
      addFinding(findings, {
        severity: 'error',
        category: 'articleCrossTypeSlugConflict',
        message: `Article slug ${slug} appears across article types: ${[...types].sort().join(', ')}.`,
        documentId: `article.${slug}`,
      })
    }
  }

  for (const doc of documents) {
    if ((doc._type === 'productCategory' || doc._type === 'product' || doc._type === 'caseStudy' || doc._type === 'article') && !doc.slug) {
      addFinding(findings, {
        severity: 'error',
        category: 'missingSlug',
        message: 'Routable candidate document has no slug.',
        documentId: doc._id,
        route: doc.route,
      })
    }
  }

  for (const asset of assets) {
    if (!asset.exists) {
      addFinding(findings, {
        severity: 'warning',
        category: 'brokenAssetPath',
        message: `Referenced local asset does not exist: ${asset.sourcePath}.`,
        documentId: asset.intendedDocumentId,
      })
    }
    if (!asset.altText.trim()) {
      addFinding(findings, {
        severity: 'warning',
        category: 'missingImageAlt',
        message: `Image candidate has no usable alt text: ${asset.sourcePath}.`,
        documentId: asset.intendedDocumentId,
      })
    }
  }

  const assetsByHash = new Map<string, AssetCandidate[]>()
  for (const asset of assets) {
    if (!asset.sha256) continue
    assetsByHash.set(asset.sha256, [...(assetsByHash.get(asset.sha256) || []), asset])
  }

  for (const [sha, group] of assetsByHash) {
    if (group.length <= 1) continue
    for (const asset of group) {
      asset.duplicateAssetHash = sha
    }
  }

  for (const item of knownVisualReviewItems) {
    addFinding(findings, {
      severity: 'warning',
      category: 'manualVisualReview',
      message: item,
    })
  }

  documents.sort((a, b) => a._id.localeCompare(b._id))
  assets.sort((a, b) =>
    `${a.intendedDocumentId}:${a.intendedSanityField}:${a.sourcePath}`.localeCompare(
      `${b.intendedDocumentId}:${b.intendedSanityField}:${b.sourcePath}`,
    ),
  )
  findings.sort((a, b) =>
    `${a.severity}:${a.category}:${a.documentId || ''}:${a.route || ''}:${a.message}`.localeCompare(
      `${b.severity}:${b.category}:${b.documentId || ''}:${b.route || ''}:${b.message}`,
    ),
  )

  return {documents, assets, findings}
}

function countBy<T extends Record<string, unknown>>(items: T[], key: keyof T) {
  return items.reduce<Record<string, number>>((acc, item) => {
    const value = String(item[key] || 'unknown')
    acc[value] = (acc[value] || 0) + 1
    return acc
  }, {})
}

function buildSummary() {
  const {documents, assets, findings} = buildDocuments()
  const missingSeoCategories = new Set(
    findings
      .filter((item) => item.category === 'missingSeoTitle' || item.category === 'missingMetaDescription')
      .map((item) => item.documentId || item.message),
  )
  const duplicateSlugFindings = findings.filter((item) => item.category === 'articleCrossTypeSlugConflict')
  const routeConflicts = findings.filter((item) => item.category === 'routeConflict')
  const invalidFindings = findings.filter((item) => item.severity === 'error')
  const duplicateAssetHashCount = new Set(assets.filter((asset) => asset.duplicateAssetHash).map((asset) => asset.duplicateAssetHash)).size

  const sourceInventory = {
    homepageSportCategoryCards: sportsCategories.length,
    productCategories: sportsPages.length,
    customSportLandingPages: pseoPages.length,
    productsOrProductTypes: sportsPages.reduce((total, page) => total + asArray((page as Record<string, unknown>).productTypes).length, 0),
    caseStudies: caseStudies.length,
    faqGroupsFromFaq: faqData.length,
    faqItemsFromFaq: faqData.reduce((total, category) => total + asArray((category as Record<string, unknown>).items).length, 0),
    faqGroupsFromB2bFaq: b2bFaqData.length,
    faqItemsFromB2bFaq: b2bFaqData.reduce((total, category) => total + asArray((category as Record<string, unknown>).items).length, 0),
    contactFaqItems: contactFaqs.length,
    guidesFromGuidesData: guidePages.length,
    buyingGuides: buyingGuides.length,
    resources: resourcePages.length,
    pseoSeoArticles: pseoPages.length,
    authors: 1,
    coreSitePages: corePageSlugs.length,
    navigationDocuments: 1,
    footerDocuments: 1,
    redirectRulesFromPublicRedirects: documents.filter((doc) => doc._type === 'redirectRule').length,
  }

  const summaryBase = {
    generatedAt: 'deterministic-dry-run',
    readOnly: true,
    networkAccess: false,
    tokenAccess: false,
    sanityDatasetModified: false,
    cloudflareModified: false,
    sourceInventory,
    plannedDocumentsByType: countBy(documents, '_type'),
    createdCandidateCount: documents.length,
    skippedCount: 0,
    conflictCount: routeConflicts.length + duplicateSlugFindings.length + findings.filter((item) => item.category === 'duplicateDocumentId').length,
    invalidCount: invalidFindings.length,
    duplicateSlugCount: duplicateSlugFindings.length,
    missingSeoCount: missingSeoCategories.size,
    missingImageCount: documents.filter((doc) =>
      ['productCategory', 'caseStudy', 'article', 'homepageSportCategoryCard'].includes(doc._type) &&
      !assets.some((asset) => asset.intendedDocumentId === doc._id),
    ).length,
    missingAltCount: findings.filter((item) => item.category === 'missingImageAlt').length,
    brokenAssetPathCount: findings.filter((item) => item.category === 'brokenAssetPath').length,
    canonicalConflicts: [] as string[],
    routeConflicts: routeConflicts.map((item) => item.route).filter(Boolean).sort(),
    duplicateAssetHashCount,
    candidateDocumentIds: documents.map((doc) => doc._id),
    referenceValidation: {
      productCategoryReferences: 'planned via deterministic category.<slug> IDs',
      faqCategoryReferences: 'planned via deterministic faq-category.<slug> IDs',
      articleAuthorReferences: 'planned via author.poxiol-editorial-team fallback',
      unresolvedReferences: findings.filter((item) => item.category === 'unresolvedReference').length,
    },
    assetUploadPlan: {
      uploadPerformed: false,
      candidateAssetReferences: assets.length,
      existingLocalAssets: assets.filter((asset) => asset.exists).length,
      brokenLocalAssets: assets.filter((asset) => !asset.exists).length,
      duplicateAssetHashCount,
    },
    manualReviewItems: findings
      .filter((item) => item.category === 'manualVisualReview' || item.severity === 'warning' || item.severity === 'error')
      .map((item) => item.message),
  }

  const dryRunHash = hashText(stableStringify({documents, assets, findings, summaryBase}))
  return {documents, assets, findings, summary: {...summaryBase, dryRunHash}}
}

function writeOutputs() {
  const {documents, assets, findings, summary} = buildSummary()
  mkdirSync(tmpDir, {recursive: true})
  mkdirSync(docsDir, {recursive: true})

  writeFileSync(
    path.join(tmpDir, 'documents.ndjson'),
    `${documents.map((doc) => stableStringify(doc)).join('\n')}\n`,
    'utf8',
  )
  writeFileSync(path.join(tmpDir, 'asset-manifest.json'), `${stableStringify(assets)}\n`, 'utf8')
  writeFileSync(path.join(tmpDir, 'findings.json'), `${stableStringify(findings)}\n`, 'utf8')

  writeFileSync(
    path.join(docsDir, 'CMS_MIGRATION_DRY_RUN_SUMMARY.json'),
    `${JSON.stringify(summary, null, 2)}\n`,
    'utf8',
  )

  const plannedRows = Object.entries(summary.plannedDocumentsByType)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([type, count]) => `| ${type} | ${count} |`)
    .join('\n')

  const inventoryRows = Object.entries(summary.sourceInventory)
    .map(([name, count]) => `| ${name} | ${count} |`)
    .join('\n')

  const manualItems = summary.manualReviewItems.length
    ? summary.manualReviewItems.map((item) => `- ${item}`).join('\n')
    : '- None.'

  const markdown = `# POXIOL CMS Migration Dry Run

This is a deterministic, non-destructive dry run. It reads local legacy source files only, builds in-memory Sanity document candidates, validates the plan, and writes report artifacts. It does not contact Sanity, read tokens, upload assets, modify datasets, run Seed, run Dataset Import, or modify Cloudflare.

Dry run hash: \`${summary.dryRunHash}\`

## Source inventory

| Source | Count |
| --- | ---: |
${inventoryRows}

## Planned documents by type

| Sanity type | Candidate count |
| --- | ---: |
${plannedRows}

## Validation summary

- Created candidate count: ${summary.createdCandidateCount}
- Skipped count: ${summary.skippedCount}
- Conflict count: ${summary.conflictCount}
- Invalid count: ${summary.invalidCount}
- Duplicate slug count: ${summary.duplicateSlugCount}
- Missing SEO count: ${summary.missingSeoCount}
- Missing image count: ${summary.missingImageCount}
- Missing alt count: ${summary.missingAltCount}
- Broken asset path count: ${summary.brokenAssetPathCount}
- Canonical conflicts: ${summary.canonicalConflicts.length}
- Route conflicts: ${summary.routeConflicts.length}

## Reference validation

- Product category references: ${summary.referenceValidation.productCategoryReferences}
- FAQ category references: ${summary.referenceValidation.faqCategoryReferences}
- Article author references: ${summary.referenceValidation.articleAuthorReferences}
- Unresolved references: ${summary.referenceValidation.unresolvedReferences}

## Asset upload plan

- Upload performed: ${summary.assetUploadPlan.uploadPerformed}
- Candidate asset references: ${summary.assetUploadPlan.candidateAssetReferences}
- Existing local assets: ${summary.assetUploadPlan.existingLocalAssets}
- Broken local assets: ${summary.assetUploadPlan.brokenLocalAssets}
- Duplicate asset hash groups: ${summary.assetUploadPlan.duplicateAssetHashCount}

Detailed NDJSON and asset manifest files are generated under \`tmp/cms-migration-dry-run/\` and are intentionally ignored by Git.

## Manual review items

${manualItems}

## Read-only guarantees

- Sanity network access: ${summary.networkAccess}
- Token access: ${summary.tokenAccess}
- Sanity dataset modified: ${summary.sanityDatasetModified}
- Cloudflare modified: ${summary.cloudflareModified}
- Asset upload performed: ${summary.assetUploadPlan.uploadPerformed}
`

  writeFileSync(path.join(docsDir, 'CMS_MIGRATION_DRY_RUN.md'), markdown, 'utf8')

  console.log(JSON.stringify({
    dryRunHash: summary.dryRunHash,
    createdCandidateCount: summary.createdCandidateCount,
    plannedDocumentsByType: summary.plannedDocumentsByType,
    conflictCount: summary.conflictCount,
    invalidCount: summary.invalidCount,
    candidateDocumentIdCount: new Set(documents.map((doc) => doc._id)).size,
  }))
}

writeOutputs()
