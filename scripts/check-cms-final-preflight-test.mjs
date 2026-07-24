import fs from 'fs';
import path from 'path';
import os from 'os';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');
const PREFLIGHT_SRC = path.join(ROOT, 'scripts', 'check-cms-final-preflight.mjs');

const VALID_SUMMARY = {
  correctedCandidateCount: 121,
  articleConflictCount: 0,
  routeConflictCount: 0,
  missingSeoCount: 0,
  missingAltCount: 0,
  brokenAssetCount: 0,
  visualBlockingCount: 0,
  corruptedExistingWithoutPlan: 0,
  obsoleteMvpWithoutDecision: 0
};

const VALID_SCHEMA = `
export const schemaTypes = [
  seoFields, imageWithAlt, portableText, publishStatus, callToAction, faqReference, relatedContent, procurementOverride, pageSection,
  siteSettings, navigationSettings, footerSettings, procurementStandards,
  sitePage, productCategory, product, caseStudy, faqCategory, faqItem, article, author, redirectRule
]
`;

const SUB_SCRIPTS = [
  'check-cms-visibility.mjs',
  'check-cms-list-mode.mjs',
  'check-article-route-conflicts.mjs',
  'check-cms-redirects.mjs',
  'check-cms-reconciliation.mjs',
  'check-cms-schema-coverage.mjs',
  'check-cms-content-blockers.mjs',
  'check-cms-safety.mjs'
];

function setupTempDir(name) {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), `cms-preflight-test-${name}-`));
  fs.mkdirSync(path.join(tmp, 'scripts'), { recursive: true });
  fs.mkdirSync(path.join(tmp, 'docs'), { recursive: true });
  fs.mkdirSync(path.join(tmp, 'studio', 'schemaTypes'), { recursive: true });
  fs.mkdirSync(path.join(tmp, '.github', 'workflows'), { recursive: true });

  fs.copyFileSync(PREFLIGHT_SRC, path.join(tmp, 'scripts', 'check-cms-final-preflight.mjs'));

  // Create valid fixtures
  fs.writeFileSync(path.join(tmp, 'docs', 'CMS_MIGRATION_DRY_RUN_SUMMARY.json'), JSON.stringify(VALID_SUMMARY));
  fs.writeFileSync(path.join(tmp, 'studio', 'schemaTypes', 'index.ts'), VALID_SCHEMA);

  for (const s of SUB_SCRIPTS) {
    fs.writeFileSync(path.join(tmp, 'scripts', s), 'process.exit(0);');
  }

  // Setup git
  try {
    execSync('git init', { cwd: tmp, stdio: 'ignore' });
    execSync('git config user.email "test@example.com"', { cwd: tmp, stdio: 'ignore' });
    execSync('git config user.name "Test"', { cwd: tmp, stdio: 'ignore' });
    fs.writeFileSync(path.join(tmp, 'README.md'), '# Test');
    execSync('git add .', { cwd: tmp, stdio: 'ignore' });
    execSync('git commit -m "initial"', { cwd: tmp, stdio: 'ignore' });
    execSync('git branch -m main', { cwd: tmp, stdio: 'ignore' });
    // Create origin/main as a branch to simulate remote
    execSync('git branch origin/main', { cwd: tmp, stdio: 'ignore' });
    // Add one commit to HEAD
    fs.appendFileSync(path.join(tmp, 'README.md'), '\nUpdate');
    execSync('git add .', { cwd: tmp, stdio: 'ignore' });
    execSync('git commit -m "update"', { cwd: tmp, stdio: 'ignore' });
  } catch (err) {
    console.error('Failed to setup git in temp dir', err);
  }

  return tmp;
}

function runPreflight(tmp) {
  try {
    execSync(`node scripts/check-cms-final-preflight.mjs`, { cwd: tmp, stdio: 'inherit' });
    return true;
  } catch (err) {
    return false;
  }
}

function cleanup(tmp) {
  fs.rmSync(tmp, { recursive: true, force: true });
}

let testsPassed = 0;
const totalTests = 8;

console.log(`Running ${totalTests} preflight self-tests...`);

// 1. Normal pass
{
  const tmp = setupTempDir('pass');
  if (runPreflight(tmp)) {
    console.log('Test 1 Passed: Normal pass');
    testsPassed++;
  } else {
    console.error('Test 1 Failed: Should have passed');
  }
  cleanup(tmp);
}

// 2. articleConflictCount=1
{
  const tmp = setupTempDir('conflict');
  const summary = { ...VALID_SUMMARY, articleConflictCount: 1 };
  fs.writeFileSync(path.join(tmp, 'docs', 'CMS_MIGRATION_DRY_RUN_SUMMARY.json'), JSON.stringify(summary));
  if (!runPreflight(tmp)) {
    console.log('Test 2 Passed: articleConflictCount=1 fails');
    testsPassed++;
  } else {
    console.error('Test 2 Failed: Should have failed');
  }
  cleanup(tmp);
}

// 3. correctedCandidateCount=120
{
  const tmp = setupTempDir('count');
  const summary = { ...VALID_SUMMARY, correctedCandidateCount: 120 };
  fs.writeFileSync(path.join(tmp, 'docs', 'CMS_MIGRATION_DRY_RUN_SUMMARY.json'), JSON.stringify(summary));
  if (!runPreflight(tmp)) {
    console.log('Test 3 Passed: correctedCandidateCount=120 fails');
    testsPassed++;
  } else {
    console.error('Test 3 Failed: Should have failed');
  }
  cleanup(tmp);
}

// 4. routeConflictCount=1
{
  const tmp = setupTempDir('route');
  const summary = { ...VALID_SUMMARY, routeConflictCount: 1 };
  fs.writeFileSync(path.join(tmp, 'docs', 'CMS_MIGRATION_DRY_RUN_SUMMARY.json'), JSON.stringify(summary));
  if (!runPreflight(tmp)) {
    console.log('Test 4 Passed: routeConflictCount=1 fails');
    testsPassed++;
  } else {
    console.error('Test 4 Failed: Should have failed');
  }
  cleanup(tmp);
}

// 5. Missing Schema Type (sitePage removed)
{
  const tmp = setupTempDir('schema');
  const schema = VALID_SCHEMA.replace('sitePage,', '');
  fs.writeFileSync(path.join(tmp, 'studio', 'schemaTypes', 'index.ts'), schema);
  if (!runPreflight(tmp)) {
    console.log('Test 5 Passed: Missing sitePage fails');
    testsPassed++;
  } else {
    console.error('Test 5 Failed: Should have failed');
  }
  cleanup(tmp);
}

// 6. Sub-script failure
{
  const tmp = setupTempDir('subscript');
  fs.writeFileSync(path.join(tmp, 'scripts', 'check-cms-visibility.mjs'), 'process.exit(1);');
  if (!runPreflight(tmp)) {
    console.log('Test 6 Passed: Sub-script failure fails');
    testsPassed++;
  } else {
    console.error('Test 6 Failed: Should have failed');
  }
  cleanup(tmp);
}

// 7. Binary change detected
{
  const tmp = setupTempDir('binary');
  // Create a "binary" file change
  fs.writeFileSync(path.join(tmp, 'image.png'), Buffer.from([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A]));
  execSync('git add image.png', { cwd: tmp, stdio: 'ignore' });
  execSync('git commit -m "add binary"', { cwd: tmp, stdio: 'ignore' });

  if (!runPreflight(tmp)) {
    console.log('Test 7 Passed: Binary change detected fails');
    testsPassed++;
  } else {
    console.error('Test 7 Failed: Should have failed');
  }
  cleanup(tmp);
}

// 8. Sanity write call detected
{
  const tmp = setupTempDir('security');
  fs.writeFileSync(path.join(tmp, 'scripts', 'bad-script.mjs'), 'client.patch("id").commit();');
  if (!runPreflight(tmp)) {
    console.log('Test 8 Passed: Sanity write call detected fails');
    testsPassed++;
  } else {
    console.error('Test 8 Failed: Should have failed');
  }
  cleanup(tmp);
}

if (testsPassed === totalTests) {
  console.log("All preflight self-tests passed (fail-closed verified)");
  process.exit(0);
} else {
  console.error(`Only ${testsPassed}/${totalTests} tests passed`);
  process.exit(1);
}
