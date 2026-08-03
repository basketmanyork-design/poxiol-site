import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import path from 'node:path';

const filename = 'googlec5c97eecb7db490b.html';
const expected = 'google-site-verification: googlec5c97eecb7db490b.html\n';
const sourcePath = path.join(process.cwd(), 'public', filename);
const outputPath = path.join(process.cwd(), 'out', filename);

const readExact = async (filePath, label) => {
  const content = await readFile(filePath, 'utf8');
  assert.equal(content, expected, `${label} content must match the locked GSC verification line exactly`);
  assert.doesNotMatch(content, /(?:CLOUDFLARE|SANITY|TOKEN|SECRET|PASSWORD|API[_-]?KEY)/i,
    `${label} must not contain environment-variable or credential names`);
};

await readExact(sourcePath, 'public verification file');
if (!process.argv.includes('--source-only')) {
  await readExact(outputPath, 'built verification file');
}

console.log(`GSC verification integrity PASS (${process.argv.includes('--source-only') ? 'source' : 'source + build output'})`);
