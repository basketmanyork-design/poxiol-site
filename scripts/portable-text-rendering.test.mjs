import test from 'node:test'
import assert from 'node:assert/strict'
import {normalizePortableText} from '../lib/cms/portableText.ts'

test('Portable Text preserves headings, lists, tables and warning callouts for rendering', () => {
  const result = normalizePortableText([
    {_key: 'h', _type: 'block', style: 'h2', children: [{_type: 'span', text: 'Direct Answer'}]},
    {_key: 'p', _type: 'block', style: 'normal', children: [{_type: 'span', text: 'Buyer-facing answer.'}]},
    {_key: 'l1', _type: 'block', style: 'normal', listItem: 'bullet', children: [{_type: 'span', text: 'First check'}]},
    {_key: 'l2', _type: 'block', style: 'normal', listItem: 'bullet', children: [{_type: 'span', text: 'Second check'}]},
    {
      _key: 't',
      _type: 'tableBlock',
      caption: 'Specifications',
      rows: [
        {_key: 'r1', cells: ['Item', 'Standard']},
        {_key: 'r2', cells: ['Sample MOQ', '1 set']},
      ],
    },
    {_key: 'c', _type: 'callout', tone: 'warning', title: 'Risk', body: 'Confirm approvals.'},
  ])

  assert.deepEqual(result.map((node) => node.kind), ['heading', 'paragraph', 'list', 'table', 'callout'])
  assert.deepEqual(result[2], {kind: 'list', key: 'l1', ordered: false, items: ['First check', 'Second check']})
  assert.deepEqual(result[3], {
    kind: 'table',
    key: 't',
    caption: 'Specifications',
    rows: [['Item', 'Standard'], ['Sample MOQ', '1 set']],
  })
  assert.deepEqual(result[4], {
    kind: 'callout',
    key: 'c',
    tone: 'warning',
    title: 'Risk',
    body: 'Confirm approvals.',
  })
})
