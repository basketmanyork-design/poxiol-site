import { readFileSync, writeFileSync, readdirSync, existsSync } from 'fs';
import { execSync } from 'child_process';
import { join, dirname, basename } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');

let totalFail = 0;

// ===== 1. Read migration summary =====
const summaryPath = join(ROOT, 'docs', 'CMS_MIGRATION_DRY_RUN_SUMMARY.json');
let migrationSummary = {};
if (existsSync(summaryPath)) {
  migrationSummary = JSON.parse(readFileSync(summaryPath, 'utf8'));
}

function validateMetric(summary, key, expectedValue) {
  if (!Object.prototype.hasOwnProperty.call(summary, key)) {
    console.error(`FATAL: Missing migration metric: ${key}`);
    return { valid: false, value: null };
  }
  const val = summary[key];
  if (typeof val !== 'number' || !Number.isFinite(val) || !Number.isInteger(val)) {
    console.error(`FATAL: Invalid migration metric type for ${key}: ${typeof val} = ${val}`);
    return { valid: false, value: null };
  }
  if (val !== expectedValue) {
    console.error(`FATAL: Migration metric ${key} expected ${expectedValue}, got ${val}`);
    return { valid: false, value: val };
  }
  return { valid: true, value: val };
}

const metrics = [
  { key: 'correctedCandidateCount', expected: 121 },
  { key: 'articleConflictCount', expected: 0 },
  { key: 'routeConflictCount', expected: 0 },
  { key: 'missingSeoCount', expected: 0 },
  { key: 'missingAltCount', expected: 0 },
  { key: 'brokenAssetCount', expected: 0 },
  { key: 'visualBlockingCount', expected: 0 },
  { key: 'corruptedExistingWithoutPlan', expected: 0 },
  { key: 'obsoleteMvpWithoutDecision', expected: 0 },
];

let migrationValid = true;
const metricVars = {};
for (const { key, expected } of metrics) {
  const result = validateMetric(migrationSummary, key, expected);
  if (!result.valid) {
    migrationValid = false;
  }
  metricVars[key] = result.value;
}

totalFail += migrationValid ? 0 : 1;

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
if (subScriptFailure) totalFail++;

// ===== 3. Real git stats =====
let commitCount = 0;
let changedFileCount = 0;
let additions = 0;
let deletions = 0;
let binaryChangeCount = 0;
let auditSourceCommit = 'unknown';
let gitCheckFailure = false;

try {
  let gitOutput;
  try {
    gitOutput = execSync('git rev-list --count origin/main..HEAD', { cwd: ROOT, stdio: ['pipe', 'pipe', 'pipe'] }).toString().trim();
    commitCount = parseInt(gitOutput, 10);
  } catch (err) {
    console.error('FATAL: git rev-list failed:', err.message);
    gitCheckFailure = true;
  }

  if (!gitCheckFailure) {
    try {
      const changedFiles = execSync('git diff --name-only origin/main..HEAD', { cwd: ROOT, stdio: ['pipe', 'pipe', 'pipe'] }).toString().trim().split('\n').filter(Boolean);
      changedFileCount = changedFiles.length;

      const numstat = execSync('git diff --numstat origin/main..HEAD', { cwd: ROOT, stdio: ['pipe', 'pipe', 'pipe'] }).toString().trim();
      if (numstat) {
        numstat.split('\n').forEach(line => {
          const parts = line.split('\t');
          if (parts.length >= 3) {
            const [add, del, file] = parts;
            if (add === '-' || del === '-') {
              if (basename(file) !== 'current_body.txt' && basename(file) !== 'tsconfig.tsbuildinfo') {
                binaryChangeCount++;
              }
            } else {
              additions += parseInt(add) || 0;
              deletions += parseInt(del) || 0;
            }
          }
        });
      }
      auditSourceCommit = execSync('git rev-parse HEAD', { cwd: ROOT, stdio: ['pipe', 'pipe', 'pipe'] }).toString().trim();
    } catch (err) {
      console.error('FATAL: git diff or rev-parse failed:', err.message);
      gitCheckFailure = true;
    }
  }
} catch (err) {
  console.error('FATAL: Unexpected git section error:', err.message);
  gitCheckFailure = true;
}

if (gitCheckFailure) {
  totalFail++;
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
      .map(t => t.trim().replace(/^['"]|['"]$/g, '').split('/').pop()) // Handle potential path imports if any
      .filter(t => t && !t.startsWith('//') && !t.startsWith('/*'));
    
    registeredSchemaTypeCount = registeredSchemaTypes.length;
    const uniqueTypes = new Set(registeredSchemaTypes);
    duplicateRegisteredTypeCount = registeredSchemaTypes.length - uniqueTypes.size;
    
    expectedTypes.forEach(type => {
      if (!uniqueTypes.has(type)) {
        missingRegisteredTypeCount++;
      }
    });
    // Strict exact names check
    uniqueTypes.forEach(t => {
      if (!expectedTypes.includes(t)) missingRegisteredTypeCount++;
    });
  } else {
    missingRegisteredTypeCount = expectedTypes.length;
  }
} else {
  missingRegisteredTypeCount = expectedTypes.length;
}
if (missingRegisteredTypeCount > 0 || duplicateRegisteredTypeCount > 0) totalFail++;

// ===== 5. Security Scanning Helper =====
function getFilesToScan(dirs, excludeFiles = []) {
  const files = [];
  function collect(dir) {
    if (!existsSync(dir)) return;
    const entries = readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = join(dir, entry.name);
      const isExcluded = excludeFiles.includes(basename(fullPath));
      if (isExcluded) continue;

      if (entry.isDirectory()) {
        collect(fullPath);
      } else if (entry.isFile()) {
        if (entry.name.match(/\.(mjs|ts|js|cjs|yml|yaml|json)$/)) {
          files.push(fullPath);
        }
      }
    }
  }
  dirs.forEach(collect);
  return files;
}

// ===== 6. Security: Sanity write calls =====
const sanityWriteRegex = /\b(client|sanity|cms)\.(create|patch|delete|mutate|transaction|assets\.upload)\(/;
const excludedFromWrites = [
  'check-cms-final-preflight.mjs',
  'check-cms-final-preflight-test.mjs',
  'check-cms-safety.mjs',
  'cms-migration-dry-run.ts',
  'verify-mvp-seed-result.cjs',
  'package-lock.json'
];

let executableSanityWriteCallCount = 0;
const writeScanFiles = getFilesToScan([
  join(ROOT, '.github', 'workflows'),
  join(ROOT, 'scripts'),
  join(ROOT, 'lib', 'sanity')
], excludedFromWrites);

for (const file of writeScanFiles) {
  const content = readFileSync(file, 'utf8');
  if (sanityWriteRegex.test(content)) {
    const lines = content.split('\n');
    for (const line of lines) {
      const trimmed = line.trim();
      if (sanityWriteRegex.test(line) && !trimmed.startsWith('//') && !trimmed.startsWith('*') && !trimmed.startsWith('#')) {
        executableSanityWriteCallCount++;
      }
    }
  }
}
if (executableSanityWriteCallCount > 0) totalFail++;

// ===== 7. Security: Cloudflare write calls =====
let executableCloudflareWriteCallCount = 0;
for (const file of writeScanFiles) {
  const content = readFileSync(file, 'utf8');
  if (content.includes('api.cloudflare.com') || content.includes('deploy_hook')) {
    const lines = content.split('\n');
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      if ((line.includes('api.cloudflare.com') || line.includes('deploy_hook')) && !line.trim().startsWith('//')) {
        const window = lines.slice(Math.max(0, i - 5), Math.min(lines.length, i + 5)).join('\n');
        if (window.match(/method\s*:\s*['"](POST|PUT|PATCH|DELETE)['"]/i) || line.includes('deploy_hook')) {
          executableCloudflareWriteCallCount++;
        }
      }
    }
  }
}
if (executableCloudflareWriteCallCount > 0) totalFail++;

// ===== 8. Security: committed secrets =====
const secretPatterns = [
  /\bsk_[a-zA-Z0-9]{32,}\b/,
  /\bNEXT_PUBLIC_.*TOKEN\b/i,
  /\bBearer\s+[A-Za-z0-9\-_\.]{20,}\b/,
  /\bCLOUDFLARE_API_TOKEN\b/i,
  /\bDEPLOY_HOOK.*[A-Za-z0-9]{20,}\b/,
  /\bsanity.*token\b/i
];

let committedSecretCount = 0;
const secretScanFiles = getFilesToScan([
  join(ROOT, '.github', 'workflows'),
  join(ROOT, 'scripts'),
  join(ROOT, 'lib', 'sanity'),
  join(ROOT, 'studio')
], excludedFromWrites);

for (const file of secretScanFiles) {
  if (file.endsWith('.cjs')) continue;
  const content = readFileSync(file, 'utf8');
  const lines = content.split('\n');
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('//') || trimmed.startsWith('*') || trimmed.startsWith('/*') || trimmed.startsWith('#')) continue;

    if (trimmed.match(/secrets\..*TOKEN/) || trimmed.match(/env\..*TOKEN/) || trimmed.includes('${') || trimmed.includes('{{')) continue;
    if (trimmed.includes('sk_xxxxxxxxxxxxxxxx') || trimmed.includes('process.env.') || trimmed.includes('::error::') || trimmed.includes('echo ')) continue;
    if (trimmed.match(/\/.*\/[gimuy]*/) || trimmed.match(/^(if|then|else|fi|case|esac|for|do|done)\b/)) continue; 

    for (const pattern of secretPatterns) {
      if (pattern.test(trimmed)) {
        committedSecretCount++;
        break;
      }
    }
  }
}
if (committedSecretCount > 0) totalFail++;

// ===== 9. Security: workflow permissions =====
let unsafeWorkflowPermissionCount = 0;
const workflowDir = join(ROOT, '.github', 'workflows');
if (existsSync(workflowDir)) {
  const files = readdirSync(workflowDir).filter(f => f.endsWith('.yml') || f.endsWith('.yaml'));
  for (const file of files) {
    const content = readFileSync(join(workflowDir, file), 'utf8');
    const lines = content.split('\n');
    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed.includes('permissions: write-all') || trimmed.match(/(contents|actions|deployments|pull-requests|packages|id-token):\s*write/)) {
        unsafeWorkflowPermissionCount++;
      }
    }
  }
}
if (unsafeWorkflowPermissionCount > 0) totalFail++;

// Binary changes from original
if (binaryChangeCount !== 0) totalFail++;

// ===== 10. Build final summary =====
const passed = totalFail === 0 && !gitCheckFailure && migrationValid;

const finalSummary = {
  generatedAt: new Date().toISOString(),
  auditSourceCommit, commitCount, changedFileCount, additions, deletions, binaryChangeCount,
  gitCheckFailure,
  ...metricVars,
  registeredSchemaTypeCount, missingRegisteredTypeCount, duplicateRegisteredTypeCount,
  executableSanityWriteCallCount, executableCloudflareWriteCallCount, committedSecretCount, unsafeWorkflowPermissionCount,
  result: passed ? "passed" : "failed"
};

writeFileSync(join(ROOT, 'docs', 'CMS_FINAL_PREFLIGHT_SUMMARY.json'), JSON.stringify(finalSummary, null, 2));

if (!passed) {
  console.error("CMS final preflight FAILED");
  if (!migrationValid) console.error("- Migration metrics validation failed");
  if (metricVars.correctedCandidateCount !== 121) console.error(`- Invalid correctedCandidateCount: ${metricVars.correctedCandidateCount}`);
  if (subScriptFailure) console.error("- One or more sub-scripts failed");
  if (binaryChangeCount !== 0) console.error(`- Binary changes detected: ${binaryChangeCount}`);
  if (gitCheckFailure) console.error("- Git audit failed");
  process.exit(1);
}

console.log("CMS final preflight passed");
process.exit(0);
