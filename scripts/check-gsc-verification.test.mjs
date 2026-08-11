import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import path from 'node:path';

const filename = 'googlec5c97eecb7db490b.html';
const expected = 'google-site-verification: googlec5c97eecb7db490b.html\n';
const sourcePath = path.join(process.cwd(), 'public', filename);
const outputPath = path.join(process.cwd(), 'out', filename);
const rewrite = `/${filename} /googlec5c97eecb7db490b 200`;

const readExact = async (filePath, label) => {
  const content = await readFile(filePath, 'utf8');
  const normalizedContent = content.replace(/\r\n/g, '\n');
  assert.equal(normalizedContent, expected, `${label} content must match the locked GSC verification line exactly`);
  assert.doesNotMatch(content, /(?:CLOUDFLARE|SANITY|TOKEN|SECRET|PASSWORD|API[_-]?KEY)/i,
    `${label} must not contain environment-variable or credential names`);
};

await readExact(sourcePath, 'public verification file');
const sourceRedirects = await readFile(path.join(process.cwd(), 'public', '_redirects'), 'utf8');
assert.ok(sourceRedirects.split(/\r?\n/).includes(rewrite), 'public redirects must preserve the exact .html verification URL with a static 200 rewrite');
if (!process.argv.includes('--source-only')) {
  await readExact(outputPath, 'built verification file');
  const outputRedirects = await readFile(path.join(process.cwd(), 'out', '_redirects'), 'utf8');
  assert.ok(outputRedirects.split(/\r?\n/).includes(rewrite), 'built redirects must preserve the exact .html verification URL with a static 200 rewrite');
}

console.log(`GSC verification integrity PASS (${process.argv.includes('--source-only') ? 'source' : 'source + build output'})`);
