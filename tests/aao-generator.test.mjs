import test from 'node:test'
import assert from 'node:assert/strict'
import {execFile} from 'node:child_process'
import {mkdtemp, readFile} from 'node:fs/promises'
import {tmpdir} from 'node:os'
import {join} from 'node:path'
import {fileURLToPath} from 'node:url'
import {promisify} from 'node:util'

const execFileAsync = promisify(execFile)

test('generates deterministic safe machine assets with qualified MOQ semantics', async () => {
  const first = await mkdtemp(join(tmpdir(), 'poxiol-aao-first-'))
  const second = await mkdtemp(join(tmpdir(), 'poxiol-aao-second-'))
  const script = fileURLToPath(new URL('../scripts/generate-aao-assets.mjs', import.meta.url))

  await execFileAsync(process.execPath, [script, first])
  await execFileAsync(process.execPath, [script, second])

  const files = ['poxiol-capabilities.json', 'poxiol-rfq-schema.json', 'poxiol-agent.json']
  const generated = {}
  for (const file of files) {
    const firstContent = await readFile(join(first, file), 'utf8')
    const secondContent = await readFile(join(second, file), 'utf8')
    assert.equal(firstContent, secondContent)
    generated[file] = JSON.parse(firstContent)
    assert.doesNotMatch(firstContent, /secret|token/i)
    assert.doesNotMatch(firstContent, /https:\/\/poxiol\.com/)
  }

  const capability = generated['poxiol-capabilities.json']
  assert.equal(capability.procurement.sampleMinimumOrder.value, 1)
  assert.equal(capability.procurement.bulkMinimumOrder.fixedValueAvailable, false)
  assert.equal('minimumOrder' in capability.procurement, false)
})
