import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schemaTypes'
import {deskStructure} from './deskStructure'

export default defineConfig({
  name: 'poxiol-cms',
  title: 'POXIOL CMS',
  projectId: 'oqpv1xbc',
  dataset: 'production',
  plugins: [
    structureTool({structure: deskStructure}),
    visionTool(),
  ],
  schema: {types: schemaTypes},
})
