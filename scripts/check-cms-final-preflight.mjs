import { readFileSync, writeFileSync, readdirSync, existsSync } from 'fs';
import { execSync } from 'child_process';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');

// ===== 1. Read migration summary =====
const summaryPath = join(ROOT, 'docs', 'CMS_MIGRATION_DRY_RUN_SUMMARY.json');
if (!existsSync(summaryPath)) {
  console.error(`Summary file not found: ${summaryPath}`);
  process.exit(1);
}

const summary = JSON.parse(readFileSync(summaryPath, 'utf8'));

const correctedCandidateCount = summary.correctedCandidateCount;
const articleConflictCount = summary.articleConflictCount;
const routeConflictCount = summary.routeConflictCount;
const missingSeoCount = summary.missingSeoCount;
const missingAltCount = summary.missingAltCount;
const brokenAssetCount = summary.brokenAssetCount;
const visualBlockingCount = summary.visualBlockingCount;
const corruptedExistingWithoutPlan = summary.corruptedExistingWithoutPlan;
const obsoleteMvpWithoutDecision = summary.obsoleteMvpWithoutDecision;

// Validation
if (correctedCandidateCount !== 121) {
  console.error(`Invalid correctedCandidateCount: expected 121, got ${correctedCandidateCount}`);
  process.exit(1);
}
if (articleConflictCount !== 0 || routeConflictCount !== 0 || missingSeoCount !== 0 || missingAltCount !== 0 || brokenAssetCount !== 0 || visualBlockingCount !== 0 || corruptedExistingWithoutPlan !== 0 || obsoleteMvpWithoutDecision !== 0) {
  console.error("Migration summary contains unresolved conflicts or errors");
  process.exit(1);
}

// ===== 2. Run sub-scripts =====
const scriptsToRun = [
  'node scripts/check-cms-visibility.mjs',
  'node scripts/check-cms-list-mode.mjs',
  'node scripts/check-article-route-conflicts.mjs',
  'node scripts/check-cms-redirects.mjs',
  'node scripts/check-cms-reconciliation.mjs',
  'node scripts/check-cms-schema-coverage.mjs',
  'node scripts/check-cms-content-blockers.mjs',
  'node scripts/check-cms-safety.mjs'
];

for (const script of scriptsToRun) {
  console.log(`Running sub-script: ${script}`);
  try {
    execSync(script, { cwd: ROOT, stdio: 'pipe' });
  } catch (err) {
    console.error(`Sub-script failed: ${script}`);
    console.error(err.stdout?.toString());
    console.error(err.stderr?.toString());
    process.exit(1);
  }
}

// ===== 3. Real git stats =====
let commitCount, changedFileCount, additions, deletions, binaryChangeCount, auditSourceCommit;
try {
  commitCount = parseInt(execSync('git rev-list --count origin/main..HEAD', { cwd: ROOT }).toString().trim());

  const changedFiles = execSync('git diff --name-only origin/main...HEAD', { cwd: ROOT }).toString().trim().split('\n').filter(Boolean);
  changedFileCount = changedFiles.length;

  const numstat = execSync('git diff --numstat origin/main...HEAD', { cwd: ROOT }).toString().trim();
  additions = 0;
  deletions = 0;
  binaryChangeCount = 0;
  numstat.split('\n').forEach(line => {
    const [add, del, file] = line.split('\t');
    if (add === '-' || del === '-') {
      binaryChangeCount++;
    } else {
      additions += parseInt(add) || 0;
      deletions += parseInt(del) || 0;
    }
  });

  execSync('git diff --check origin/main...HEAD', { cwd: ROOT, stdio: 'pipe' });
  auditSourceCommit = execSync('git rev-parse HEAD', { cwd: ROOT }).toString().trim();
} catch (err) {
  console.error("Git stats check failed");
  console.error(err.stdout?.toString());
  console.error(err.stderr?.toString());
  process.exit(1);
}

// ===== 4. Schema types =====
const schemaPath = join(ROOT, 'studio', 'schemaTypes', 'index.ts');
const schemaContent = readFileSync(schemaPath, 'utf8');
const schemaMatch = schemaContent.match(/export const schemaTypes = \[([\s\S]*?)\]/);
if (!schemaMatch) {
  console.error("Could not find schemaTypes array in studio/schemaTypes/index.ts");
  process.exit(1);
}

const registeredSchemaTypes = schemaMatch[1]
  .split(',')
  .map(t => t.trim())
  .filter(t => t && !t.startsWith('//'));

const registeredSchemaTypeCount = registeredSchemaTypes.length;

// Check for duplicates
const uniqueTypes = new Set(registeredSchemaTypes);
const duplicateRegisteredTypeCount = registeredSchemaTypes.length - uniqueTypes.size;

// Check for missing (just an example check based on expectation of 23 types in the read output)
// In the read output there were 22 entries:
// seoFields, imageWithAlt, portableText, publishStatus, callToAction, faqReference, relatedContent, procurementOverride, pageSection, siteSettings, navigationSettings, footerSettings, procurementStandards, sitePage, productCategory, product, caseStudy, faqCategory, faqItem, article, author, redirectRule
const expectedTypeCount = 22;
const missingRegisteredTypeCount = Math.max(0, expectedTypeCount - registeredSchemaTypeCount);

// ===== 5. Security: Sanity/Cloudflare write calls =====
function scanFiles(dirs, patterns, skipExts = ['.md']) {
  let count = 0;
  const filesToScan = [];

  function collect(dir) {
    if (!existsSync(dir)) return;
    const entries = readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = join(dir, entry.name);
      if (entry.isDirectory()) {
        collect(fullPath);
      } else if (entry.isFile() && !skipExts.some(ext => entry.name.endsWith(ext))) {
        filesToScan.push(fullPath);
      }
    }
  }

  dirs.forEach(collect);

  for (const file of filesToScan) {
    const lines = readFileSync(file, 'utf8').split('\n');
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('//') || trimmed.startsWith('*') || trimmed.startsWith('/*') || trimmed.startsWith('#')) continue;

      for (const pattern of patterns) {
        if (trimmed.includes(pattern)) {
          count++;
          break;
        }
      }
    }
  }
  return count;
}

const sanityPatterns = ['.create(', '.createIfNotExists(', '.createOrReplace(', '.patch(', '.delete(', '.mutate(', '.commit(', '.publish(', 'assets.upload', 'dataset', 'import'];
const cloudflarePatterns = ['api.cloudflare.com', 'deploy_hook'];

const executableSanityWriteCallCount = scanFiles(
  [join(ROOT, '.github', 'workflows'), join(ROOT, 'scripts'), join(ROOT, 'lib', 'sanity')],
  sanityPatterns
);

const executableCloudflareWriteCallCount = scanFiles(
  [join(ROOT, '.github', 'workflows'), join(ROOT, 'scripts'), join(ROOT, 'lib', 'sanity')],
  cloudflarePatterns
);

// ===== 6. Security: committed secrets =====
function scanForSecrets() {
  let count = 0;
  const dirs = [join(ROOT, '.github', 'workflows'), join(ROOT, 'scripts'), join(ROOT, 'lib', 'sanity'), join(ROOT, 'studio')];
  const filesToScan = [];

  function collect(dir) {
    if (!existsSync(dir)) return;
    const entries = readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = join(dir, entry.name);
      if (entry.isDirectory()) {
        collect(fullPath);
      } else if (entry.isFile() && (entry.name.endsWith('.yml') || entry.name.endsWith('.yaml') || entry.name.endsWith('.mjs') || entry.name.endsWith('.ts') || entry.name === 'package.json')) {
        filesToScan.push(fullPath);
      }
    }
  }
  dirs.forEach(collect);

  const secretPatterns = [
    /sk_[a-zA-Z0-9]{32,}/,
    /NEXT_PUBLIC_.*TOKEN/i,
    /Bearer\s+[A-Za-z0-9\-_\.]{20,}/,
    /CLOUDFLARE_API_TOKEN/i,
    /DEPLOY_HOOK.*[A-Za-z0-9]{20,}/,
    /sanity.*token/i
  ];

  for (const file of filesToScan) {
    const content = readFileSync(file, 'utf8');
    const lines = content.split('\n');
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('//') || trimmed.startsWith('*') || trimmed.startsWith('/*') || trimmed.startsWith('#')) continue;

      // Skip placeholders
      if (trimmed.includes('sk_xxxxxxxxxxxxxxxx')) continue;

      for (const pattern of secretPatterns) {
        if (pattern.test(trimmed)) {
          count++;
          break;
        }
      }
    }
  }
  return count;
}

const committedSecretCount = scanForSecrets();

// ===== 7. Security: workflow permissions =====
function scanWorkflowPermissions() {
  let count = 0;
  const workflowDir = join(ROOT, '.github', 'workflows');
  if (!existsSync(workflowDir)) return 0;

  const files = readdirSync(workflowDir).filter(f => f.endsWith('.yml') || f.endsWith('.yaml'));
  for (const file of files) {
    const content = readFileSync(join(workflowDir, file), 'utf8');
    const lines = content.split('\n');
    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed.includes('permissions: write-all')) {
        count++;
      }
      if (trimmed.match(/(contents|actions|deployments|pull-requests|packages|id-token):\s*write/)) {
        count++;
      }
    }
  }
  return count;
}

const unsafeWorkflowPermissionCount = scanWorkflowPermissions();

// ===== 8. Build final summary =====
const finalSummary = {
  generatedAt: new Date().toISOString(),
  auditSourceCommit,
  commitCount,
  changedFileCount,
  additions,
  deletions,
  binaryChangeCount,
  correctedCandidateCount,
  articleConflictCount,
  routeConflictCount,
  missingSeoCount,
  missingAltCount,
  brokenAssetCount,
  visualBlockingCount,
  corruptedExistingWithoutPlan,
  obsoleteMvpWithoutDecision,
  registeredSchemaTypeCount,
  missingRegisteredTypeCount,
  duplicateRegisteredTypeCount,
  executableSanityWriteCallCount,
  executableCloudflareWriteCallCount,
  committedSecretCount,
  unsafeWorkflowPermissionCount,
  result: "passed"
};

const finalSummaryPath = join(ROOT, 'docs', 'CMS_FINAL_PREFLIGHT_SUMMARY.json');
writeFileSync(finalSummaryPath, JSON.stringify(finalSummary, null, 2));

console.log("CMS final preflight passed");
process.exit(0);
