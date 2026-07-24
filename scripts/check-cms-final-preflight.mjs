import { readFileSync, writeFileSync, readdirSync, existsSync } from 'fs';
import { execSync } from 'child_process';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');

// ===== 1. Read migration summary =====
const summaryPath = join(ROOT, 'docs', 'CMS_MIGRATION_DRY_RUN_SUMMARY.json');
let migrationSummary = {};
if (existsSync(summaryPath)) {
  migrationSummary = JSON.parse(readFileSync(summaryPath, 'utf8'));
}

const correctedCandidateCount = migrationSummary.correctedCandidateCount || 0;
const articleConflictCount = migrationSummary.articleConflictCount || 0;
const routeConflictCount = migrationSummary.routeConflictCount || 0;
const missingSeoCount = migrationSummary.missingSeoCount || 0;
const missingAltCount = migrationSummary.missingAltCount || 0;
const brokenAssetCount = migrationSummary.brokenAssetCount || 0;
const visualBlockingCount = migrationSummary.visualBlockingCount || 0;
const corruptedExistingWithoutPlan = migrationSummary.corruptedExistingWithoutPlan || 0;
const obsoleteMvpWithoutDecision = migrationSummary.obsoleteMvpWithoutDecision || 0;

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

let subScriptFailure = false;
for (const script of scriptsToRun) {
  try {
    execSync(script, { cwd: ROOT, stdio: 'ignore' });
  } catch (err) {
    subScriptFailure = true;
  }
}

// ===== 3. Real git stats =====
let commitCount = 0;
let changedFileCount = 0;
let additions = 0;
let deletions = 0;
let binaryChangeCount = 0;
let auditSourceCommit = 'unknown';

try {
  commitCount = parseInt(execSync('git rev-list --count origin/main..HEAD', { cwd: ROOT }).toString().trim()) || 0;
  const changedFiles = execSync('git diff --name-only origin/main...HEAD', { cwd: ROOT }).toString().trim().split('\n').filter(Boolean);
  changedFileCount = changedFiles.length;

  const numstat = execSync('git diff --numstat origin/main...HEAD', { cwd: ROOT }).toString().trim();
  if (numstat) {
    numstat.split('\n').forEach(line => {
      const [add, del, file] = line.split('\t');
      if (add === '-' || del === '-') {
        binaryChangeCount++;
      } else {
        additions += parseInt(add) || 0;
        deletions += parseInt(del) || 0;
      }
    });
  }
  auditSourceCommit = execSync('git rev-parse HEAD', { cwd: ROOT }).toString().trim();
} catch (err) {
  // Git might not be available in some test envs, but we'll try
}

// ===== 4. Schema types =====
const expectedTypes = [
  'seoFields', 'imageWithAlt', 'portableText', 'publishStatus', 'callToAction',
  'faqReference', 'relatedContent', 'procurementOverride', 'pageSection',
  'siteSettings', 'navigationSettings', 'footerSettings', 'procurementStandards',
  'sitePage', 'productCategory', 'product', 'caseStudy', 'faqCategory',
  'faqItem', 'article', 'author', 'redirectRule'
];

const schemaPath = join(ROOT, 'studio', 'schemaTypes', 'index.ts');
let registeredSchemaTypeCount = 0;
let missingRegisteredTypeCount = 0;
let duplicateRegisteredTypeCount = 0;

if (existsSync(schemaPath)) {
  const schemaContent = readFileSync(schemaPath, 'utf8');
  const schemaMatch = schemaContent.match(/export const schemaTypes = \[([\s\S]*?)\]/);
  if (schemaMatch) {
    const registeredSchemaTypes = schemaMatch[1]
      .split(',')
      .map(t => t.trim().replace(/^['"]|['"]$/g, ''))
      .filter(t => t && !t.startsWith('//') && !t.startsWith('/*'));
    
    registeredSchemaTypeCount = registeredSchemaTypes.length;
    const uniqueTypes = new Set(registeredSchemaTypes);
    duplicateRegisteredTypeCount = registeredSchemaTypes.length - uniqueTypes.size;
    
    expectedTypes.forEach(type => {
      if (!uniqueTypes.has(type)) {
        missingRegisteredTypeCount++;
      }
    });
  } else {
    missingRegisteredTypeCount = expectedTypes.length;
  }
} else {
  missingRegisteredTypeCount = expectedTypes.length;
}

// ===== 5. Security: Sanity/Cloudflare write calls =====
function scanFiles(dirs, patterns, excludeFiles = []) {
  let count = 0;
  const filesToScan = [];

  function collect(dir) {
    if (!existsSync(dir)) return;
    const entries = readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = join(dir, entry.name);
      if (entry.isDirectory()) {
        collect(fullPath);
      } else if (entry.isFile()) {
        const isExcluded = excludeFiles.some(ex => fullPath.includes(ex));
        if (!isExcluded && (entry.name.endsWith('.mjs') || entry.name.endsWith('.ts') || entry.name.endsWith('.js') || entry.name.endsWith('.yml') || entry.name.endsWith('.yaml'))) {
          filesToScan.push(fullPath);
        }
      }
    }
  }

  dirs.forEach(collect);

  for (const file of filesToScan) {
    const content = readFileSync(file, 'utf8');
    const lines = content.split('\n');
    for (const line of lines) {
      const trimmed = line.trim();
      // Exclude comments
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

const selfScripts = ['check-cms-final-preflight.mjs', 'check-cms-final-preflight-test.mjs'];
const sanityPatterns = ['.create(', '.createIfNotExists(', '.createOrReplace(', '.patch(', '.delete(', '.mutate(', '.commit(', '.publish(', 'assets.upload'];
const cloudflarePatterns = ['api.cloudflare.com', 'deploy_hook'];

const executableSanityWriteCallCount = scanFiles(
  [join(ROOT, '.github', 'workflows'), join(ROOT, 'scripts'), join(ROOT, 'lib', 'sanity')],
  sanityPatterns,
  selfScripts
);

const executableCloudflareWriteCallCount = scanFiles(
  [join(ROOT, '.github', 'workflows'), join(ROOT, 'scripts'), join(ROOT, 'lib', 'sanity')],
  cloudflarePatterns,
  selfScripts
);

// ===== 6. Security: committed secrets =====
function scanForSecrets(excludeFiles = []) {
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
      } else if (entry.isFile()) {
        const isExcluded = excludeFiles.some(ex => fullPath.includes(ex));
        if (!isExcluded && (entry.name.endsWith('.yml') || entry.name.endsWith('.yaml') || entry.name.endsWith('.mjs') || entry.name.endsWith('.ts') || entry.name === 'package.json')) {
          filesToScan.push(fullPath);
        }
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

      // Strict exclusion of placeholders and env var names
      if (trimmed.includes('sk_xxxxxxxxxxxxxxxx')) continue;
      if (trimmed.includes('process.env.')) continue;
      if (trimmed.includes('"${')) continue; // likely interpolation of env vars

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

const committedSecretCount = scanForSecrets(selfScripts);

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
const securityMetrics = [
  executableSanityWriteCallCount,
  executableCloudflareWriteCallCount,
  committedSecretCount,
  unsafeWorkflowPermissionCount,
  duplicateRegisteredTypeCount,
  missingRegisteredTypeCount
];

const migrationMetrics = [
  articleConflictCount,
  routeConflictCount,
  missingSeoCount,
  missingAltCount,
  brokenAssetCount,
  visualBlockingCount,
  corruptedExistingWithoutPlan,
  obsoleteMvpWithoutDecision
];

const anySecurityFail = securityMetrics.some(m => m > 0);
const anyMigrationFail = migrationMetrics.some(m => m > 0);
const totalFail = anySecurityFail || anyMigrationFail || subScriptFailure || correctedCandidateCount !== 121;

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
  result: totalFail ? "failed" : "passed"
};

const finalSummaryPath = join(ROOT, 'docs', 'CMS_FINAL_PREFLIGHT_SUMMARY.json');
writeFileSync(finalSummaryPath, JSON.stringify(finalSummary, null, 2));

if (totalFail) {
  console.error("CMS final preflight FAILED");
  if (correctedCandidateCount !== 121) console.error(`- Invalid correctedCandidateCount: ${correctedCandidateCount} (expected 121)`);
  if (anyMigrationFail) console.error("- Unresolved migration conflicts or errors");
  if (anySecurityFail) console.error("- Security or integrity metrics > 0");
  if (subScriptFailure) console.error("- One or more sub-scripts failed");
  process.exit(1);
}

console.log("CMS final preflight passed");
process.exit(0);
