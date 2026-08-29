import assert from 'node:assert/strict';
import {test} from 'node:test';
import {pageContentHtml} from './helpers/page-content-html.mjs';

const fixture = '<main><header><nav><details><summary>Products</summary></details></nav></header><section><details><summary>Sample approval?</summary><p>Project-specific review.</p></details></section><footer><details><summary>Directory</summary></details></footer><script>"<summary>Hidden</summary>"</script></main>';
const questions = html => [...pageContentHtml(html).matchAll(/<summary\b[^>]*>([\s\S]*?)<\/summary>/gi)].map(m => m[1]);
test('FAQ extraction excludes shared navigation but retains real questions', () => {
  assert.deepEqual(questions(fixture), ['Sample approval?']);
});
test('FAQ equality still rejects a real schema mismatch', () => {
  assert.throws(() => assert.deepEqual(questions(fixture), ['Guaranteed delivery?']));
  assert.deepEqual(questions(fixture.replace('Sample approval?', 'Edited question?')), ['Edited question?']);
});
