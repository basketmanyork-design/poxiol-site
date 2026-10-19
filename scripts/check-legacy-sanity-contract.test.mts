import assert from 'node:assert/strict'
import test from 'node:test'
import {readFileSync} from 'node:fs'

import {safeLegacyContent, validateLegacyPublicDocument} from '../lib/sanity/legacy-contract.ts'

test('article summary contract is limited to the evaluation checklist card', () => {
  const contract = JSON.parse(readFileSync(new URL('../content/cms/legacy-public-contract.json', import.meta.url), 'utf8'))
  const query = readFileSync(new URL('../lib/sanity/queries.ts', import.meta.url), 'utf8')
  const mapping = readFileSync(new URL('../lib/sanity/content.ts', import.meta.url), 'utf8')

  assert.ok(contract.article.includes('summary'))
  assert.match(query, /const articleProjection = `[\s\S]*?\bsummary,\s*\n\s*excerpt,/)
  assert.match(mapping, /article\.slug === 'teamwear-manufacturer-evaluation-checklist'\s*\?\s*article\.summary \|\| article\.excerpt/)
  assert.match(mapping, /:\s*article\.excerpt \|\| fallback\?\.intro \|\| body \|\| article\.title/)
})

test('accepts the published legacy site settings shape', () => {
  const result = validateLegacyPublicDocument('siteSettings', {
    _type: 'siteSettings',
    contactInfo: {publicEmail: 'sales@poxiol.com'},
  })

  assert.equal(result.ok, true)
})

test('rejects private or unrecognized fields from public adaptation', () => {
  const result = validateLegacyPublicDocument('siteSettings', {
    _type: 'siteSettings',
    apiKey: 'secret',
  })

  assert.deepEqual(result, {ok: false, issues: ['forbidden-field:apiKey']})
})

test('recursively rejects sensitive fields with stable sorted issue codes', () => {
  const result = validateLegacyPublicDocument('sitePage', {
    contentSections: [{recipient: 'private@example.com'}],
    passwordResetToken: 'private',
  })

  assert.deepEqual(result, {
    ok: false,
    issues: ['forbidden-field:passwordResetToken', 'forbidden-field:recipient'],
  })
})

test('optional invalid content falls back and required invalid content fails closed', () => {
  const originalWarn = console.warn
  console.warn = () => undefined
  try {
    assert.deepEqual(
      safeLegacyContent('article', {apiKey: 'private'}, {title: 'Fallback'}),
      {title: 'Fallback'},
    )
    assert.throws(
      () => safeLegacyContent('siteSettings', {apiKey: 'private'}, {}, {required: true}),
      /SANITY_PUBLIC_CONTRACT_REQUIRED:siteSettings:forbidden-field:apiKey/,
    )
  } finally {
    console.warn = originalWarn
  }
})
