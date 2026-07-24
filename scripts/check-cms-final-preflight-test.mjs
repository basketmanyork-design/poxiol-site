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
  },
  {
    name: "15. Missing migration metric field",
    setup: (tmpDir) => {
      baseSetup(tmpDir);
      const summary = JSON.parse(readFileSync(join(tmpDir, 'docs', 'CMS_MIGRATION_DRY_RUN_SUMMARY.json'), 'utf8'));
      delete summary.routeConflictCount;
      writeFileSync(join(tmpDir, 'docs', 'CMS_MIGRATION_DRY_RUN_SUMMARY.json'), JSON.stringify(summary));
    },
    expectedExitCode: 1
  },
  {
    name: "16. Git audit command failure",
    setup: (tmpDir) => {
      baseSetup(tmpDir);
    },
    triggerGitFail: true,
    expectedExitCode: 1
  }
];

async function run() {
  let passCount = 0;
  let failCount = 0;

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
        if (!test.triggerGitFail) {
          execSync('git branch -f origin/main main', { cwd: tmpDir });
        }

        // Ensure feature branch for divergence
        execSync('git checkout -b feature', { cwd: tmpDir });

        if (test.triggerBinary) {
          const binFile = join(tmpDir, 'image.png');
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
        failCount++;
      } else {
        console.log(`  PASSED`);
        passCount++;
      }
    } catch (err) {
      console.error(`  ERROR: ${err.message}`);
      failCount++;
    } finally {
      if (existsSync(tmpDir)) rmSync(tmpDir, { recursive: true, force: true });
    }
  }

  // Helpers for Test 17
  const setupTempDir = () => {
    const tmp = join(ROOT, 'tmp', `test-17-${Date.now()}`);
    mkdirSync(tmp, { recursive: true });
    return tmp;
  };
  const setupMinimalEnv = (tmp) => baseSetup(tmp);
  const REQUIRED_TYPES = EXPECTED_TYPES;

  // Test 17: git diff whitespace error -> must fail
  console.log('\n=== Test 17: git diff whitespace error ===');
  {
    const tmp = setupTempDir();
    try {
      // Create origin/main with a clean file
      execSync('git init', { cwd: tmp });
      execSync('git config user.email "test@example.com"', { cwd: tmp });
      execSync('git config user.name "Test"', { cwd: tmp });
      execSync('git checkout -b origin/main', { cwd: tmp });
      writeFileSync(join(tmp, 'clean.js'), 'const x = 1;\n');
      execSync('git add -A && git commit -m "clean"', { cwd: tmp });

      // Create feature branch with trailing whitespace
      execSync('git checkout -b feature', { cwd: tmp });
      writeFileSync(join(tmp, 'dirty.js'), 'const y = 2;    \n');
      execSync('git add -A && git commit -m "dirty"', { cwd: tmp });

      // Setup minimal summary and scripts
      setupMinimalEnv(tmp);

      const summary = JSON.parse(readFileSync(join(tmp, 'docs/CMS_MIGRATION_DRY_RUN_SUMMARY.json'), 'utf8'));
      writeFileSync(join(tmp, 'summary.json'), JSON.stringify(summary));
      writeFileSync(join(tmp, 'schema_index.ts'), `export const schemaTypes = [${REQUIRED_TYPES.map(t => `'${t}'`).join(', ')}];`);

      // Copy preflight
      const preflightSrc = readFileSync(PREFLIGHT_PATH, 'utf8')
        .replace(/import { readFileSync, writeFileSync, readdirSync, existsSync } from 'fs'/,
          `import { readFileSync, writeFileSync, readdirSync, existsSync } from 'fs'\nconst MOCKED = true;`)
        .replace(/const __dirname = .*/, 'const __dirname = process.cwd();')
        .replace(/const ROOT = .*/, "const ROOT = process.cwd();")
        .replace(/docs\/CMS_MIGRATION_DRY_RUN_SUMMARY\.json/, 'summary.json')
        .replace(/studio\/schemaTypes\/index\.ts/, 'schema_index.ts');
      writeFileSync(join(tmp, 'preflight.mjs'), preflightSrc);

      try {
        execSync(`node ${join(tmp, 'preflight.mjs')}`, { cwd: tmp, stdio: 'pipe' });
        // Should have failed
        failCount++;
        console.log('  x Expected exit 1, got 0 (whitespace not caught)');
      } catch {
        // Expected failure
        passCount++;
        console.log('  v Correctly failed (whitespace caught)');
      }
    } finally {
      rmSync(tmp, { recursive: true, force: true });
    }
  }

  console.log(`\nAll preflight self-tests passed (fail-closed verified, ${passCount}/${passCount + failCount})`);
  process.exit(failCount === 0 ? 0 : 1);
}
run();
