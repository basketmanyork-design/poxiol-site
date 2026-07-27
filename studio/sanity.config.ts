import {defineConfig, definePlugin} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schemaTypes'
import {deskStructure} from './deskStructure'
import {AnalyticsOperationsTool} from './components/AnalyticsOperationsTool'

const analyticsOperations = definePlugin({
  name: 'analytics-operations',
  tools: [{name: 'analytics-operations', title: 'Analytics Operations', component: AnalyticsOperationsTool}],
})

export default defineConfig({
  name: 'poxiol-cms',
  title: 'POXIOL CMS',
  projectId: 'oqpv1xbc',
  dataset: 'production',
  plugins: [
    structureTool({structure: deskStructure}),
    visionTool(),
    analyticsOperations(),
  ],
  schema: {types: schemaTypes},
})
