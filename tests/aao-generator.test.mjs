import test from 'node:test'
import assert from 'node:assert/strict'
import {execFile} from 'node:child_process'
import {mkdtemp, readFile} from 'node:fs/promises'
import {tmpdir} from 'node:os'
import {join} from 'node:path'
import {fileURLToPath} from 'node:url'
import {promisify} from 'node:util'

const execFileAsync = promisify(execFile)

test('generates deterministic machine assets', async () => {
  const first = await mkdtemp(join(tmpdir(), 'poxiol-aao-first-'))
  const second = await mkdtemp(join(tmpdir(), 'poxiol-aao-second-'))
  const script = fileURLToPath(
    new URL('../scripts/generate-aao-assets.mjs', import.meta.url),
  )

  await execFileAsync(process.execPath, [script, first])
  await execFileAsync(process.execPath, [script, second])

  for (const file of [
    'poxiol-capabilities.json',
    'poxiol-rfq-schema.json',
    'poxiol-agent.json',
  ]) {
    const firstContent = await readFile(join(first, file), 'utf8')
    const secondContent = await readFile(join(second, file), 'utf8')
    assert.equal(firstContent, secondContent)
    assert.doesNotThrow(() => JSON.parse(firstContent))
  }
})
