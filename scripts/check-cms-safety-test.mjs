#!/usr/bin/env node
import assert from 'node:assert/strict'
import {execFileSync, spawnSync} from 'node:child_process'
import {mkdtempSync, mkdirSync, rmSync, writeFileSync} from 'node:fs'
import {tmpdir} from 'node:os'
import {dirname, join} from 'node:path'
import {fileURLToPath} from 'node:url'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const CHECKER = join(ROOT, 'scripts', 'check-cms-safety.mjs')
const knownMojibake = `${String.fromCharCode(0x9225)}?`

function createRepo(files) {
  const repo = mkdtempSync(join(tmpdir(), 'poxiol-cms-safety-'))
  const git = (args) => execFileSync('git', args, {cwd: repo, stdio: 'ignore'})
  git(['init'])
  git(['config', 'user.email', 'test@example.com'])
  git(['config', 'user.name', 'POXIOL Test'])
  writeFileSync(join(repo, 'baseline.txt'), 'baseline\n')
  git(['add', '.'])
  git(['commit', '-m', 'baseline'])
  git(['branch', 'origin/main'])

  for (const [path, content] of Object.entries(files)) {
    const fullPath = join(repo, path)
    mkdirSync(dirname(fullPath), {recursive: true})
    writeFileSync(fullPath, content)
  }
  git(['add', '.'])
  git(['commit', '-m', 'fixture'])
  return repo
}

function runChecker(repo) {
  return spawnSync(process.execPath, [CHECKER], {
    cwd: repo,
    encoding: 'utf8',
    env: {...process.env, GIT_EXE: 'git'},
  })
}

let repo
try {
  repo = createRepo({
    'POXIOL_V9_0_Site_Truth_Architecture_Audit.md': `Known source finding: ${knownMojibake}\n`,
    'docs/v9-1/sanity-before.ndjson': `{"title":"Buyer ${knownMojibake} Region"}\n`,
  })
  const evidenceResult = runChecker(repo)
  assert.equal(
    evidenceResult.status,
    0,
    `Known audit evidence must remain byte-faithful.\n${evidenceResult.stderr}`,
  )
} finally {
  if (repo) rmSync(repo, {recursive: true, force: true})
}

try {
  repo = createRepo({'content/unsafe.md': `Public copy ${knownMojibake} must fail\n`})
  const publicResult = runChecker(repo)
  assert.equal(publicResult.status, 1, 'Mojibake outside the exact evidence allowlist must fail')
  assert.match(publicResult.stderr, /content\/unsafe\.md: suspicious mojibake/)
} finally {
  if (repo) rmSync(repo, {recursive: true, force: true})
}

console.log('cms safety evidence-allowlist tests passed')
