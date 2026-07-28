import {readFileSync, writeFileSync} from 'node:fs'
import {pathToFileURL} from 'node:url'

const defaultSupportedTypes = [
  'siteSettings',
  'procurementStandards',
  'navigationSettings',
  'footerSettings',
  'analyticsSettings',
  'sitePage',
  'productCategory',
  'product',
  'faqCategory',
  'faqItem',
  'caseStudy',
  'article',
  'author',
  'redirectRule',
]

const defaultSingletonTypes = [
  'siteSettings',
  'procurementStandards',
  'navigationSettings',
  'footerSettings',
  'analyticsSettings',
]

const seoTypes = new Set(['sitePage', 'productCategory', 'product', 'caseStudy', 'article'])
const slugTypes = new Set(['sitePage', 'productCategory', 'product', 'faqCategory', 'caseStudy', 'article', 'author'])
const titleFields = {
  siteSettings: ['brandName'],
  sitePage: ['internalName', 'heroHeading'],
  productCategory: ['categoryName'],
  product: ['productName'],
  faqCategory: ['title', 'name'],
  faqItem: ['question'],
  caseStudy: ['projectTitle', 'title'],
  article: ['title'],
  author: ['name'],
  redirectRule: ['sourcePath'],
}

function isDraft(document) {
  return document?._id?.startsWith('drafts.')
}

function publishedId(id) {
  return id?.startsWith('drafts.') ? id.slice('drafts.'.length) : id
}

function hasText(value) {
  return typeof value === 'string' && value.trim().length > 0
}

function walk(value, visit, trail = '$') {
  if (!value || typeof value !== 'object') return
  visit(value, trail)
  if (Array.isArray(value)) {
    value.forEach((entry, index) => walk(entry, visit, `${trail}[${index}]`))
    return
  }
  for (const [key, entry] of Object.entries(value)) {
    walk(entry, visit, `${trail}.${key}`)
  }
}

function missingImageAltFor(document) {
  const missing = []
  walk(document, (value, trail) => {
    if (!value.asset?._ref) return
    if (!hasText(value.altText) && !hasText(value.alt)) {
      missing.push({documentId: document._id, type: document._type, field: trail})
    }
  })
  return missing
}

function referencesFor(document) {
  const references = []
  walk(document, (value, trail) => {
    if (hasText(value._ref)) references.push({documentId: document._id, type: document._type, field: trail, ref: value._ref})
  })
  return references
}

export function auditDocuments(documents, options = {}) {
  const supportedTypes = new Set(options.supportedTypes || defaultSupportedTypes)
  const singletonTypes = new Set(options.singletonTypes || defaultSingletonTypes)
  const contentDocuments = documents.filter((document) => !document._type?.startsWith('sanity.'))
  const publishedDocuments = contentDocuments.filter((document) => !isDraft(document))
  const ids = new Set(documents.flatMap((document) => [document._id, publishedId(document._id)]).filter(Boolean))

  const types = {}
  for (const document of contentDocuments) {
    types[document._type] ||= {published: 0, drafts: 0}
    types[document._type][isDraft(document) ? 'drafts' : 'published'] += 1
  }

  const duplicateSlugs = []
  const slugGroups = new Map()
  for (const document of publishedDocuments) {
    const slug = document.slug?.current
    if (!hasText(slug)) continue
    const key = `${document._type}:${slug.trim().toLowerCase()}`
    slugGroups.set(key, [...(slugGroups.get(key) || []), document._id])
  }
  for (const [key, documentIds] of slugGroups) {
    if (documentIds.length < 2) continue
    const separator = key.indexOf(':')
    duplicateSlugs.push({
      type: key.slice(0, separator),
      slug: key.slice(separator + 1),
      count: documentIds.length,
      documentIds: documentIds.sort(),
    })
  }

  const missingTitles = []
  const missingSlugs = []
  const missingSeo = []
  const missingImageAlt = []
  const brokenReferences = []

  for (const document of publishedDocuments) {
    const possibleTitles = titleFields[document._type]
    if (possibleTitles && !possibleTitles.some((field) => hasText(document[field]))) {
      missingTitles.push({documentId: document._id, type: document._type})
    }
    if (slugTypes.has(document._type) && !hasText(document.slug?.current)) {
      missingSlugs.push({documentId: document._id, type: document._type})
    }
    if (seoTypes.has(document._type)) {
      for (const field of ['seoTitle', 'metaDescription']) {
        if (!hasText(document.seo?.[field])) {
          missingSeo.push({documentId: document._id, type: document._type, field})
        }
      }
    }
    missingImageAlt.push(...missingImageAltFor(document))
    for (const reference of referencesFor(document)) {
      if (!ids.has(reference.ref) && !ids.has(publishedId(reference.ref))) {
        brokenReferences.push(reference)
      }
    }
  }

  const duplicateSingletons = []
  for (const type of singletonTypes) {
    const count = publishedDocuments.filter((document) => document._type === type).length
    if (count > 1) duplicateSingletons.push({type, count})
  }

  return {
    totalDocuments: documents.length,
    businessDocuments: contentDocuments.length,
    types: Object.fromEntries(Object.entries(types).sort(([a], [b]) => a.localeCompare(b))),
    unknownTypes: [...new Set(contentDocuments.map((document) => document._type).filter((type) => !supportedTypes.has(type)))].sort(),
    duplicateSingletons,
    duplicateSlugs,
    missingTitles,
    missingSlugs,
    missingSeo,
    missingImageAlt,
    brokenReferences,
  }
}

export function renderMarkdown(summary, metadata = {}) {
  const rows = Object.entries(summary.types)
    .map(([type, counts]) => `| ${type} | ${counts.published} | ${counts.drafts} |`)
    .join('\n')
  const value = (items) => items.length
  return `# Sanity Production Inventory

Generated from a verified read-only export of the production dataset.

- Project: \`${metadata.projectId || 'oqpv1xbc'}\`
- Dataset: \`${metadata.dataset || 'production'}\`
- Exported at: ${metadata.exportedAt || 'not recorded'}
- Total documents including assets: ${summary.totalDocuments}
- Business documents including draft variants: ${summary.businessDocuments}

| Type | Published | Drafts |
| --- | ---: | ---: |
${rows}

## Integrity summary

- Unknown document types: ${value(summary.unknownTypes)}
- Duplicate published singletons: ${value(summary.duplicateSingletons)}
- Duplicate published slugs: ${value(summary.duplicateSlugs)}
- Missing published titles: ${value(summary.missingTitles)}
- Missing published slugs: ${value(summary.missingSlugs)}
- Missing published SEO fields: ${value(summary.missingSeo)}
- Missing published image alt fields: ${value(summary.missingImageAlt)}
- Broken published references: ${value(summary.brokenReferences)}

The inventory contains identifiers and counts only. It intentionally omits tokens, credentials, customer PII, document bodies and private contact data.
`
}

function valueFor(name) {
  const index = process.argv.indexOf(name)
  return index >= 0 ? process.argv[index + 1] : undefined
}

async function main() {
  const input = valueFor('--input')
  if (!input) throw new Error('Usage: node scripts/audit-sanity-export.mjs --input <data.ndjson> [--json <path>] [--markdown <path>]')
  const documents = readFileSync(input, 'utf8')
    .split(/\r?\n/)
    .filter(Boolean)
    .map((line) => JSON.parse(line))
  const summary = auditDocuments(documents)
  const jsonPath = valueFor('--json')
  const markdownPath = valueFor('--markdown')
  if (jsonPath) writeFileSync(jsonPath, `${JSON.stringify(summary, null, 2)}\n`, 'utf8')
  if (markdownPath) {
    writeFileSync(markdownPath, renderMarkdown(summary, {
      projectId: valueFor('--project') || 'oqpv1xbc',
      dataset: valueFor('--dataset') || 'production',
      exportedAt: valueFor('--exported-at'),
    }), 'utf8')
  }
  console.log(JSON.stringify({
    totalDocuments: summary.totalDocuments,
    businessDocuments: summary.businessDocuments,
    types: summary.types,
    unknownTypes: summary.unknownTypes.length,
    duplicateSingletons: summary.duplicateSingletons.length,
    duplicateSlugs: summary.duplicateSlugs.length,
    missingTitles: summary.missingTitles.length,
    missingSlugs: summary.missingSlugs.length,
    missingSeo: summary.missingSeo.length,
    missingImageAlt: summary.missingImageAlt.length,
    brokenReferences: summary.brokenReferences.length,
  }))
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((error) => {
    console.error(error.message)
    process.exitCode = 1
  })
}
