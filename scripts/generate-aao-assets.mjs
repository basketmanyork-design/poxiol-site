import {mkdir, writeFile} from 'node:fs/promises'
import {dirname, resolve} from 'node:path'
import {fileURLToPath} from 'node:url'

import {
  catalog,
  createAgentManifest,
  createCapabilityDocument,
  createRfqSchema,
  validateCatalog,
} from '../lib/aao/catalog.mjs'

const scriptDirectory = dirname(fileURLToPath(import.meta.url))
const projectRoot = resolve(scriptDirectory, '..')
const outputDirectory = resolve(
  process.argv[2] || resolve(projectRoot, 'public', '.well-known'),
)

const errors = validateCatalog(catalog)
if (errors.length) {
  throw new Error(`Invalid POXIOL AAO catalog:\n- ${errors.join('\n- ')}`)
}

const documents = [
  ['poxiol-capabilities.json', createCapabilityDocument(catalog)],
  ['poxiol-rfq-schema.json', createRfqSchema(catalog)],
  ['poxiol-agent.json', createAgentManifest(catalog)],
]

await mkdir(outputDirectory, {recursive: true})

for (const [filename, document] of documents) {
  await writeFile(
    resolve(outputDirectory, filename),
    `${JSON.stringify(document, null, 2)}\n`,
    'utf8',
  )
}

console.log(
  `[aao-assets] wrote ${documents.length} machine contracts to ${outputDirectory}`,
)
