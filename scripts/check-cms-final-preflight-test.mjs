import { readFileSync, writeFileSync, mkdirSync, rmSync, existsSync } from 'fs';
import { execSync } from 'child_process';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const PREFLIGHT_PATH = join(ROOT, 'scripts', 'check-cms-final-preflight.mjs');

const EXPECTED_TYPES = [
  'seoFields', 'imageWithAlt', 'portableText', 'publishStatus', 'callToAction',
  'faqReference', 'relatedContent', 'procurementOverride', 'pageSection',
  'siteSettings', 'navigationSettings', 'footerSettings', 'procurementStandards',
  'sitePage', 'productCategory', 'product', 'caseStudy', 'faqCategory',
  'faqItem', 'article', 'author', 'redirectRule'
];

const baseSetup = (tmpDir) => {
  const docsDir = join(tmpDir, 'docs');
  mkdirSync(docsDir, { recursive: true });
  writeFileSync(join(docsDir, 'CMS_MIGRATION_DRY_RUN_SUMMARY.json'), JSON.stringify({
    correctedCandidateCount: 121,
    articleConflictCount: 0,
    routeConflictCount: 0,
    missingSeoCount: 0,
    missingAltCount: 0,
    brokenAssetCount: 0,
    visualBlockingCount: 0,
    corruptedExistingWithoutPlan: 0,
    obsoleteMvpWithoutDecision: 0
  }));
  const studioDir = join(tmpDir, 'studio', 'schemaTypes');
  mkdirSync(studioDir, { recursive: true });
  writeFileSync(join(studioDir, 'index.ts'), `export const schemaTypes = [${EXPECTED_TYPES.map(t => `'${t}'`).join(', ')}]`);
  const scriptsDir = join(tmpDir, 'scripts');
  mkdirSync(scriptsDir, { recursive: true });
  const subScripts = [
    'check-cms-visibility.mjs', 'check-cms-list-mode.mjs', 'check-article-route-conflicts.mjs',
    'check-cms-redirects.mjs', 'check-cms-reconciliation.mjs', 'check-cms-schema-coverage.mjs',
    'check-cms-content-blockers.mjs', 'check-cms-safety.mjs'
  ];
  subScripts.forEach(s => writeFileSync(join(scriptsDir, s), 'process.exit(0)'));
};

const tests = [
  { name: "1. Valid environment", setup: (tmpDir) => baseSetup(tmpDir), expectedExitCode: 0 },
  {
    name: "2. Invalid correctedCandidateCount",
    setup: (tmpDir) => {
      baseSetup(tmpDir);
      writeFileSync(join(tmpDir, 'docs', 'CMS_MIGRATION_DRY_RUN_SUMMARY.json'), JSON.stringify({ correctedCandidateCount: 120 }));
    },
    expectedExitCode: 1
  },
  {
    name: "3. Article conflict",
    setup: (tmpDir) => {
      baseSetup(tmpDir);
      writeFileSync(join(tmpDir, 'docs', 'CMS_MIGRATION_DRY_RUN_SUMMARY.json'), JSON.stringify({ correctedCandidateCount: 121, articleConflictCount: 1 }));
    },
    expectedExitCode: 1
  },
  {
    name: "4. Route conflict",
    setup: (tmpDir) => {
      baseSetup(tmpDir);
      writeFileSync(join(tmpDir, 'docs', 'CMS_MIGRATION_DRY_RUN_SUMMARY.json'), JSON.stringify({ correctedCandidateCount: 121, routeConflictCount: 1 }));
    },
    expectedExitCode: 1
  },
  {
    name: "5. Sub-script failure",
    setup: (tmpDir) => {
      baseSetup(tmpDir);
      writeFileSync(join(tmpDir, 'scripts', 'check-cms-visibility.mjs'), 'process.exit(1)');
    },
    expectedExitCode: 1
  },
  {
    name: "6. Missing schema type",
    setup: (tmpDir) => {
      baseSetup(tmpDir);
      writeFileSync(join(tmpDir, 'studio', 'schemaTypes', 'index.ts'), `export const schemaTypes = ['article']`);
    },
    expectedExitCode: 1
  },
  {
    name: "7. Duplicate schema type",
    setup: (tmpDir) => {
      baseSetup(tmpDir);
      writeFileSync(join(tmpDir, 'studio', 'schemaTypes', 'index.ts'), `export const schemaTypes = [${EXPECTED_TYPES.map(t => `'${t}'`).join(', ')}, 'article']`);
    },
    expectedExitCode: 1
  },
  {
    name: "8. Binary change",
    setup: (tmpDir) => {
      baseSetup(tmpDir);
    },
    triggerBinary: true,
    expectedExitCode: 1
  },
  {
    name: "9. Sanity write call",
    setup: (tmpDir) => {
      baseSetup(tmpDir);
      const libDir = join(tmpDir, 'lib', 'sanity');
      mkdirSync(libDir, { recursive: true });
      writeFileSync(join(libDir, 'test.ts'), 'client.create({ _type: "test" })');
    },
    expectedExitCode: 1
  },
  {
    name: "10. Cloudflare write call",
    setup: (tmpDir) => {
      baseSetup(tmpDir);
      writeFileSync(join(tmpDir, 'scripts', 'deploy.mjs'), "fetch('https://api.cloudflare.com/v4/deploy', { method: 'POST' });");
    },
    expectedExitCode: 1
  },
  {
    name: "11. Committed secret",
    setup: (tmpDir) => {
      baseSetup(tmpDir);
      writeFileSync(join(tmpDir, 'scripts', 'leak.mjs'), 'const sk = "sk_12345678901234567890123456789012";');
    },
    expectedExitCode: 1
  },
  {
    name: "12. Unsafe workflow permission",
    setup: (tmpDir) => {
      baseSetup(tmpDir);
      const wfDir = join(tmpDir, '.github', 'workflows');
      mkdirSync(wfDir, { recursive: true });
      writeFileSync(join(wfDir, 'leak.yml'), 'permissions: write-all');
    },
    expectedExitCode: 1
  },
  {
    name: "13. Harmless process.env token reference",
    setup: (tmpDir) => {
      baseSetup(tmpDir);
      const libDir = join(tmpDir, 'lib', 'sanity');
      mkdirSync(libDir, { recursive: true });
      writeFileSync(join(libDir, 'safe.ts'), `const token = process.env.TOKEN;`);
    },
    expectedExitCode: 0
  },
  {
    name: "14. Detection rule/test string itself (excluded files)",
    setup: (tmpDir) => {
      baseSetup(tmpDir);
      writeFileSync(join(tmpDir, 'scripts', 'check-cms-safety.mjs'), 'process.exit(0); // client.create() sk_12345678901234567890123456789012');
    },
    expectedExitCode: 0
  }
];

async function run() {
  let passed = 0;
  for (const test of tests) {
    console.log(`Running test: ${test.name}`);
    const tmpDir = join(ROOT, 'tmp', `test-${Date.now()}-${Math.random().toString(36).slice(2)}`);
    mkdirSync(tmpDir, { recursive: true });
    writeFileSync(join(tmpDir, 'package.json'), '{}');

    try {
      test.setup(tmpDir);
      const tmpScriptsDir = join(tmpDir, 'scripts');
      if (!existsSync(tmpScriptsDir)) mkdirSync(tmpScriptsDir, { recursive: true });
      writeFileSync(join(tmpScriptsDir, 'check-cms-final-preflight.mjs'), readFileSync(PREFLIGHT_PATH, 'utf8'));

      try {
        execSync('git init', { cwd: tmpDir, stdio: 'ignore' });
        execSync('git config user.email "test@example.com"', { cwd: tmpDir });
        execSync('git config user.name "Test"', { cwd: tmpDir });
        execSync('git add .', { cwd: tmpDir });
        execSync('git commit -m "initial"', { cwd: tmpDir });
        execSync('git branch -M main', { cwd: tmpDir });
        execSync('git branch -f origin/main main', { cwd: tmpDir });
        
        // Ensure feature branch for divergence
        execSync('git checkout -b feature', { cwd: tmpDir });

        if (test.triggerBinary) {
          const binFile = join(tmpDir, 'image.png');
          // Use a more complex buffer to ensure git treats it as binary
          const buffer = Buffer.alloc(1024);
          for (let i = 0; i < 1024; i++) buffer[i] = Math.floor(Math.random() * 256);
          writeFileSync(binFile, buffer);
          execSync('git add image.png', { cwd: tmpDir });
          execSync('git commit -m "add binary"', { cwd: tmpDir });
        }
      } catch (e) {
        // console.error(`  Git setup failed: ${e.message}`);
      }

      let exitCode = 0;
      let stdout = '';
      let stderr = '';
      try {
        const output = execSync(`node scripts/check-cms-final-preflight.mjs`, { cwd: tmpDir, stdio: 'pipe' });
        stdout = output.toString();
      } catch (err) {
        exitCode = err.status || 1;
        stdout = err.stdout ? err.stdout.toString() : '';
        stderr = err.stderr ? err.stderr.toString() : '';
      }

      if (exitCode !== test.expectedExitCode) {
        console.error(`  FAILED: expected ${test.expectedExitCode}, got ${exitCode}`);
        console.error(`  STDOUT: ${stdout}`);
        console.error(`  STDERR: ${stderr}`);
      } else {
        console.log(`  PASSED`);
        passed++;
      }
    } catch (err) {
      console.error(`  ERROR: ${err.message}`);
    } finally {
      if (existsSync(tmpDir)) rmSync(tmpDir, { recursive: true, force: true });
    }
  }
  console.log(`\nAll preflight self-tests completed (${passed}/${tests.length})`);
  process.exit(passed === tests.length ? 0 : 1);
}
run();
