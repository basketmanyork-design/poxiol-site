import test from 'node:test'
import assert from 'node:assert/strict'
import {readFileSync} from 'node:fs'

test('Sanity article mapping preserves Portable Text blocks and the template renders normalized nodes', () => {
  const content = readFileSync(new URL('../lib/sanity/content.ts', import.meta.url), 'utf8')
  const types = readFileSync(new URL('../lib/cms/types.ts', import.meta.url), 'utf8')
  const template = readFileSync(new URL('../components/cms/ArticleTemplate.tsx', import.meta.url), 'utf8')

  assert.match(types, /bodyBlocks\?:\s*CmsPortableTextNode\[\]/)
  assert.match(content, /bodyBlocks:\s*Array\.isArray\(article\.body\)/)
  assert.match(template, /normalizePortableText\(article\.bodyBlocks/)
  assert.match(template, /node\.kind === 'table'/)
  assert.match(template, /node\.kind === 'callout'/)
  assert.match(template, /author:\s*article\.author \? \{'@type': 'Organization'/)
  assert.match(template, /reviewedBy:\s*article\.reviewedBy \? \{'@type': 'Organization'/)
})
