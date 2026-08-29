import assert from 'node:assert/strict';
import {readdirSync, readFileSync} from 'node:fs';
import path from 'node:path';
import {test} from 'node:test';

const CJK_IDEOGRAPH = /[\u3400-\u4DBF\u4E00-\u9FFF\uF900-\uFAFF]/u;

function htmlFiles(directory) {
  return readdirSync(directory, {withFileTypes: true}).flatMap((entry) => {
    const target = path.join(directory, entry.name);
    return entry.isDirectory() ? htmlFiles(target) : entry.name.endsWith('.html') ? [target] : [];
  });
}

test('English-only detector covers common and compatibility Chinese ideographs', () => {
  assert.equal(CJK_IDEOGRAPH.test('Choose file'), false);
  assert.equal(CJK_IDEOGRAPH.test('选择文件'), true);
  assert.equal(CJK_IDEOGRAPH.test('Deadline 年/月/日'), true);
  assert.equal(CJK_IDEOGRAPH.test('\uFA11'), true);
});

test('every rendered HTML page is free of Chinese ideographs', () => {
  const outputDirectory = path.resolve('out');
  const files = htmlFiles(outputDirectory);
  assert.ok(files.length > 0, 'Expected a static site build in out/');

  const violations = files.flatMap((file) => {
    const html = readFileSync(file, 'utf8');
    const match = html.match(CJK_IDEOGRAPH);
    return match ? [`${path.relative(outputDirectory, file)}: ${match[0]}`] : [];
  });

  assert.deepEqual(violations, [], `Chinese text is not allowed in public HTML:\n${violations.join('\n')}`);
});
