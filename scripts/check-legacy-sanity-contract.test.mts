import assert from 'node:assert/strict'
import test from 'node:test'

import {safeLegacyContent, validateLegacyPublicDocument} from '../lib/sanity/legacy-contract.ts'

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
