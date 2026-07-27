import {createHash} from 'node:crypto'
import {existsSync, readFileSync, writeFileSync} from 'node:fs'
import path from 'node:path'
import {fileURLToPath, pathToFileURL} from 'node:url'
import {auditDocuments} from './audit-sanity-export.mjs'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const singletonIds = new Map([
  ['siteSettings', 'siteSettings'],
  ['navigationSettings', 'navigationSettings'],
  ['footerSettings', 'footerSettings'],
  ['procurementStandards', 'procurementStandards'],
  ['analyticsSettings', 'analyticsSettings'],
])
const supportedTypes = new Set([
  'siteSettings', 'navigationSettings', 'footerSettings', 'procurementStandards', 'analyticsSettings',
  'sitePage', 'productCategory', 'product', 'faqCategory', 'faqItem', 'caseStudy', 'article', 'author', 'redirectRule',
])
const forbiddenDocumentKeys = new Set(['token', 'apiToken', 'privateKey', 'clientSecret', 'authorization'])

function valueAfter(args, name) {
  const index = args.indexOf(name)
  return index >= 0 ? args[index + 1] : undefined
}

export function parseArgs(args) {
  const apply = args.includes('--apply')
  const options = {
    apply,
    dryRun: !apply || args.includes('--dry-run'),
    draftOnly: args.includes('--draft-only'),
    allowUpdate: args.includes('--allow-update'),
    type: valueAfter(args, '--type') || '',
    limit: Number(valueAfter(args, '--limit') || 0),
    resume: valueAfter(args, '--resume') || '',
    report: valueAfter(args, '--report') || path.join(root, 'docs', 'SANITY_MIGRATION_DRY_RUN.md'),
    rollbackManifest: valueAfter(args, '--rollback-manifest') || '',
    input: valueAfter(args, '--input') || path.join(root, 'tmp', 'cms-migration-dry-run', 'candidates.ndjson'),
    existingExport: valueAfter(args, '--existing-export') || '',
    backupSha: valueAfter(args, '--backup-sha') || '',
  }
  if (!Number.isInteger(options.limit) || options.limit < 0) throw new Error('--limit must be a non-negative integer')
  if (apply && args.includes('--dry-run')) throw new Error('--apply and --dry-run are mutually exclusive')
  if (apply && !options.draftOnly) throw new Error('--apply requires --draft-only')
  if (apply && !options.existingExport) throw new Error('--apply requires --existing-export from a verified pre-write backup')
  if (apply && !/^[a-f0-9]{64}$/i.test(options.backupSha)) throw new Error('--apply requires --backup-sha with a verified SHA-256')
  return options
}

function readNdjson(file) {
  if (!file || !existsSync(file)) return []
  return readFileSync(file, 'utf8').split(/\r?\n/).filter(Boolean).map((line) => JSON.parse(line))
}

function normalized(value) {
  return String(value || '').trim().toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim()
}

function publishedId(id) {
  return String(id || '').replace(/^drafts\./, '')
}

function normalizeFaqCategorySlug(value) {
  return normalized(value).replace(/^faq /, '').replace(/ legacy$/, '')
}

function candidateSlug(candidate) {
  const value = candidate.slug?.current || candidate.slug
  return candidate.type === 'faqCategory' ? normalizeFaqCategorySlug(value) : normalized(value)
}

function documentSlug(document) {
  const value = document.slug?.current || document.slug
  return document._type === 'faqCategory' ? normalizeFaqCategorySlug(value) : normalized(value)
}

function stableMatch(candidate, document) {
  if (candidate.type !== document._type) return false
  const singletonId = singletonIds.get(candidate.type)
  if (singletonId) return publishedId(document._id) === singletonId
  const slug = candidateSlug(candidate)
  if (slug) return documentSlug(document) === slug
  if (candidate.type === 'faqItem') return normalized(candidate.fields?.question || candidate.title) === normalized(document.question)
  if (candidate.type === 'author') return normalized(candidate.fields?.name || candidate.title) === normalized(document.name)
  if (candidate.type === 'redirectRule') return normalized(candidate.fields?.sourcePath || candidate.route) === normalized(document.sourcePath)
  return false
}

function resumeKeysFrom(file) {
  if (!file || !existsSync(file)) return new Set()
  const parsed = JSON.parse(readFileSync(file, 'utf8'))
  return new Set((parsed.items || []).filter((item) => item.status === 'success').map((item) => item.candidateKey))
}

export function buildMigrationPlan(candidates, existingDocuments, options) {
  const filtered = candidates
    .filter((candidate) => !options.type || candidate.type === options.type)
    .filter((candidate) => !options.resumeKeys.has(candidate.candidateKey))
    .slice(0, options.limit || undefined)

  const items = filtered.map((candidate) => {
    const warnings = []
    if (!candidate.candidateKey || !candidate.type) {
      return {candidateKey: candidate.candidateKey || 'missing', type: candidate.type || 'missing', action: 'invalid', reason: 'missing candidateKey or type', warnings, status: 'planned'}
    }
    if (!supportedTypes.has(candidate.type)) {
      return {candidateKey: candidate.candidateKey, type: candidate.type, slug: candidate.slug || null, action: 'invalid', reason: 'unsupported schema type', warnings, status: 'planned'}
    }
    const ordinaryHasStableMatch = singletonIds.has(candidate.type) || candidateSlug(candidate) || candidate.type === 'faqItem' || candidate.type === 'author' || candidate.type === 'redirectRule'
    if (!ordinaryHasStableMatch) {
      return {candidateKey: candidate.candidateKey, type: candidate.type, slug: candidate.slug || null, action: 'invalid', reason: 'missing stable match key', warnings, status: 'planned'}
    }
    const matches = existingDocuments.filter((document) => stableMatch(candidate, document))
    const targetIds = [...new Set(matches.map((document) => publishedId(document._id)))]
    if (targetIds.length > 1) {
      return {candidateKey: candidate.candidateKey, type: candidate.type, slug: candidate.slug || null, action: 'conflict', reason: 'multiple existing documents match', warnings, targetIds, status: 'planned'}
    }
    if (targetIds.length === 1) {
      const draftId = matches.find((document) => String(document._id).startsWith('drafts.'))?._id || null
      if (candidate.allowUpdate === true && candidate.document && draftId) {
        return {candidateKey: candidate.candidateKey, type: candidate.type, slug: candidate.slug || null, action: 'update', reason: 'explicit candidate update allowed for existing draft', warnings, targetId: draftId, status: 'planned'}
      }
      return {candidateKey: candidate.candidateKey, type: candidate.type, slug: candidate.slug || null, action: 'skip', reason: 'matching document already exists', warnings, targetId: targetIds[0], status: 'planned'}
    }
    if (!candidate.document) warnings.push('approvedDocumentMissing: apply will refuse this candidate until a schema-valid document payload is supplied')
    return {candidateKey: candidate.candidateKey, type: candidate.type, slug: candidate.slug || null, action: 'create', reason: 'no matching document found', warnings, status: 'planned'}
  })

  const summary = {total: items.length, create: 0, update: 0, skip: 0, conflict: 0, invalid: 0}
  for (const item of items) summary[item.action] += 1
  return {summary, items}
}

function containsForbiddenData(value, trail = '') {
  if (!value || typeof value !== 'object') return null
  for (const [key, child] of Object.entries(value)) {
    const next = trail ? `${trail}.${key}` : key
    if (forbiddenDocumentKeys.has(key)) return next
    const nested = containsForbiddenData(child, next)
    if (nested) return nested
  }
  return null
}

function draftIdFor(candidateKey) {
  return `drafts.legacy-${createHash('sha256').update(candidateKey).digest('hex').slice(0, 32)}`
}

async function applyPlan(plan, candidates, options) {
  if (plan.summary.conflict || plan.summary.invalid) throw new Error('apply blocked: conflicts or invalid candidates exist')
  const writable = plan.items.filter((item) => item.action === 'create' || item.action === 'update')
  const byKey = new Map(candidates.map((candidate) => [candidate.candidateKey, candidate]))
  for (const item of writable) {
    const candidate = byKey.get(item.candidateKey)
    if (!candidate?.document) throw new Error(`apply blocked: ${item.candidateKey} has no approved document payload`)
    const forbidden = containsForbiddenData(candidate.document)
    if (forbidden) throw new Error(`apply blocked: forbidden credential-like field ${forbidden}`)
    if (candidate.document._type && candidate.document._type !== candidate.type) throw new Error(`apply blocked: type mismatch for ${item.candidateKey}`)
  }
  if (plan.summary.update && !options.allowUpdate) throw new Error('apply blocked: planned updates require --allow-update')
  const token = process.env.SANITY_AUTH_TOKEN
  if (!token) throw new Error('apply blocked: SANITY_AUTH_TOKEN is not configured')

  const endpoint = 'https://oqpv1xbc.api.sanity.io/v2024-01-01/data/mutate/production?returnIds=true&visibility=async'
  const rollback = {generatedAt: new Date().toISOString(), backupSha256: options.backupSha, createdDraftIds: [], updatedDraftIds: [], automaticRollbackPerformed: false}
  for (const item of writable) {
    const candidate = byKey.get(item.candidateKey)
    const document = {...candidate.document, _type: candidate.type}
    let mutation
    if (item.action === 'create') {
      const id = draftIdFor(item.candidateKey)
      mutation = {createIfNotExists: {...document, _id: id}}
      item.targetId = id
    } else {
      mutation = {patch: {id: item.targetId, set: document}}
    }
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {Authorization: `Bearer ${token}`, 'Content-Type': 'application/json'},
      body: JSON.stringify({mutations: [mutation]}),
    })
    if (!response.ok) throw new Error(`Sanity mutation failed for ${item.candidateKey} with HTTP ${response.status}`)
    item.status = 'success'
    if (item.action === 'create') rollback.createdDraftIds.push(item.targetId)
    else rollback.updatedDraftIds.push(item.targetId)
  }
  if (options.rollbackManifest) writeFileSync(options.rollbackManifest, `${JSON.stringify(rollback, null, 2)}\n`, 'utf8')
  return rollback
}

function markdownReport(report) {
  const rows = report.items.map((item) => `| ${item.candidateKey} | ${item.type} | ${item.slug || ''} | ${item.action} | ${item.reason} | ${item.warnings.join('; ')} |`).join('\n')
  return `# Sanity Migration Dry Run\n\nThis report is generated by a default-read-only migration tool. No Dataset Import, Seed, delete, publish or asset upload operation is implemented.\n\n- Mode: ${report.mode}\n- Existing export supplied: ${report.existingExportSupplied}\n- Total candidates: ${report.summary.total}\n- Create: ${report.summary.create}\n- Update: ${report.summary.update}\n- Skip: ${report.summary.skip}\n- Conflict: ${report.summary.conflict}\n- Invalid: ${report.summary.invalid}\n- Dataset modified: ${report.datasetModified}\n- Existing published documents: ${report.existingInventory?.publishedDocuments ?? 'not supplied'}\n- Existing draft documents: ${report.existingInventory?.draftDocuments ?? 'not supplied'}\n- Missing published SEO fields: ${report.existingInventory?.missingSeo ?? 'not supplied'}\n- Missing published image alt fields: ${report.existingInventory?.missingImageAlt ?? 'not supplied'}\n- Broken published references: ${report.existingInventory?.brokenReferences ?? 'not supplied'}\n- Unknown document types: ${report.existingInventory?.unknownTypes ?? 'not supplied'}\n\n| candidateKey | type | slug | action | reason | warnings |\n| --- | --- | --- | --- | --- | --- |\n${rows}\n`
}

function writeReport(file, report) {
  const content = file.toLowerCase().endsWith('.json') ? `${JSON.stringify(report, null, 2)}\n` : markdownReport(report)
  writeFileSync(file, content, 'utf8')
}

async function main() {
  const options = parseArgs(process.argv.slice(2))
  if (!existsSync(options.input)) throw new Error(`candidate plan not found: ${options.input}`)
  const candidates = readNdjson(options.input)
  const existingDocuments = options.existingExport ? readNdjson(options.existingExport) : []
  const resumeKeys = resumeKeysFrom(options.resume)
  const plan = buildMigrationPlan(candidates, existingDocuments, {...options, resumeKeys})
  const report = {
    generatedAt: options.apply ? new Date().toISOString() : 'deterministic-dry-run',
    mode: options.apply ? 'apply-draft-only' : 'dry-run',
    draftOnly: options.draftOnly,
    existingExportSupplied: Boolean(options.existingExport),
    backupShaVerified: /^[a-f0-9]{64}$/i.test(options.backupSha),
    datasetModified: false,
    existingInventory: null,
    summary: plan.summary,
    items: plan.items,
  }
  if (existingDocuments.length) {
    const inventory = auditDocuments(existingDocuments)
    const business = Object.values(inventory.types).reduce((sum, counts) => sum + counts.published + counts.drafts, 0)
    report.existingInventory = {
      businessDocuments: business,
      publishedDocuments: Object.values(inventory.types).reduce((sum, counts) => sum + counts.published, 0),
      draftDocuments: Object.values(inventory.types).reduce((sum, counts) => sum + counts.drafts, 0),
      missingSeo: inventory.missingSeo.length,
      missingImageAlt: inventory.missingImageAlt.length,
      brokenReferences: inventory.brokenReferences.length,
      unknownTypes: inventory.unknownTypes.length,
    }
  }
  if (options.apply) {
    await applyPlan(plan, candidates, options)
    report.datasetModified = plan.items.some((item) => item.status === 'success')
  }
  writeReport(options.report, report)
  console.log(JSON.stringify({mode: report.mode, summary: report.summary, datasetModified: report.datasetModified, report: options.report}))
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((error) => {
    console.error(error.message)
    process.exitCode = 1
  })
}
