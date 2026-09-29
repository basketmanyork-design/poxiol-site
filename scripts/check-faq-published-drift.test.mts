import assert from 'node:assert/strict'
import {readFile} from 'node:fs/promises'
import path from 'node:path'
import test from 'node:test'

const OUTPUT_DIRECTORY = path.resolve(process.env.POXIOL_OUTPUT_DIR ?? 'out')
const FAQ_FILE = path.join(OUTPUT_DIRECTORY, 'faq', 'index.html')

const REMOVED_DUPLICATES = [
  'How is sample timing confirmed?',
  'What information should I send for a quote?',
  'What happens after I submit a free mockup request?',
  'Can distributors reorder the same design later?',
  'Does POXIOL support OEM sportswear manufacturing?',
  'Does POXIOL support ODM teamwear?',
  'Can POXIOL make private label teamwear?',
]

const APPROVED_NEW_FAQS = new Map([
  [
    'Who can request support from POXIOL?',
    'Sports clubs, schools, academies, amateur teams, sportswear brands, distributors, custom retailers and event organizers can submit a project inquiry to POXIOL.',
  ],
  [
    'How is international delivery timing confirmed?',
    'Shipping method, freight assumptions and delivery timing are confirmed according to the destination and project requirements.',
  ],
])

function decodeHtml(value: string) {
  return value
    .replaceAll('&amp;', '&')
    .replaceAll('&quot;', '"')
    .replaceAll('&#x27;', "'")
    .replaceAll('&#39;', "'")
    .replaceAll('&lt;', '<')
    .replaceAll('&gt;', '>')
    .replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(Number(code)))
    .replace(/&#x([0-9a-f]+);/gi, (_, code) => String.fromCodePoint(Number.parseInt(code, 16)))
}

function normalizeQuestion(value: string) {
  return value.trim().toLowerCase()
}

function faqSchemas(html: string) {
  return [...html.matchAll(/<script\b[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi)]
    .map(([, json]) => JSON.parse(json))
    .filter((schema) => schema?.['@type'] === 'FAQPage')
}

function visibleQuestions(html: string) {
  return [...html.matchAll(/<h3\b[^>]*class="[^"]*group-hover:text-lime-400[^"]*"[^>]*>([\s\S]*?)<\/h3>/gi)]
    .map(([, content]) => decodeHtml(content.replace(/<[^>]*>/g, '').trim()))
}

test('Published FAQ output keeps one visible and schema entry per normalized buyer question', async () => {
  const html = await readFile(FAQ_FILE, 'utf8')
  const schemas = faqSchemas(html)
  assert.equal(schemas.length, 1, 'FAQ page must emit exactly one FAQPage schema')

  const entities = schemas[0].mainEntity
  assert.ok(Array.isArray(entities), 'FAQPage mainEntity must be an array')
  assert.equal(entities.length, 51, 'FAQPage must contain exactly 51 approved unique questions')

  const schemaQuestions = entities.map((entity: {name?: string}) => entity.name ?? '')
  const visible = visibleQuestions(html)
  assert.equal(visible.length, 51, 'FAQ page must render exactly 51 visible questions')
  assert.deepEqual(visible, schemaQuestions, 'visible and schema question order must match')

  const normalized = schemaQuestions.map(normalizeQuestion)
  assert.equal(new Set(normalized).size, 51, 'normalized questions must be globally unique')
  for (const question of REMOVED_DUPLICATES) {
    assert.equal(normalized.filter((value: string) => value === normalizeQuestion(question)).length, 1, `${question} must be preserved once`)
  }

  const answerByQuestion = new Map(entities.map((entity: {name?: string; acceptedAnswer?: {text?: string}}) => [entity.name, entity.acceptedAnswer?.text]))
  for (const [question, answer] of APPROVED_NEW_FAQS) {
    assert.equal(answerByQuestion.get(question), answer, `${question} must use the approved answer`)
  }
})
