import {defineCliConfig} from 'sanity/cli'

export default defineCliConfig({
  api: {
    projectId: 'oqpv1xbc',
    dataset: 'production',
  },
  // Records the intended host for tooling and newer CLI versions. Note that
  // sanity@3.37 does NOT read this key: its deploy action reads
  // project.studioHost from the API and, when it is empty, asks interactively
  // (see node_modules/sanity/lib/_chunks-cjs/deployAction.js). The hostname has
  // to be assigned once on the project record itself.
  deployment: {
    studioHost: 'poxiol-cms',
  },
})

