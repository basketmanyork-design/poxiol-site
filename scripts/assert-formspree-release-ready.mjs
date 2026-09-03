const approvedProductionEndpoint = 'https://formspree.io/f/xnpqqnol'
const retiredEndpoint = 'https://formspree.io/f/xqernqlv'
const configuredEndpoint = process.env.NEXT_PUBLIC_FORMSPREE_CONTACT_ENDPOINT

const isCloudflareProduction = process.env.CF_PAGES === '1'
  && (!process.env.CF_PAGES_BRANCH || process.env.CF_PAGES_BRANCH === 'main')
const isCloudflarePreview = process.env.CF_PAGES === '1'
  && Boolean(process.env.CF_PAGES_BRANCH)
  && process.env.CF_PAGES_BRANCH !== 'main'
const isProduction = process.env.POXIOL_DEPLOYMENT_ENV === 'production' || isCloudflareProduction
const isPreview = process.env.POXIOL_DEPLOYMENT_ENV === 'preview' || isCloudflarePreview

if (isProduction) {
  if (configuredEndpoint !== approvedProductionEndpoint) {
    console.error('Production Formspree endpoint rejected: the approved endpoint is required.')
    process.exit(1)
  }

  console.log('Production Formspree endpoint verified.')
  process.exit(0)
}

if (isPreview) {
  if (configuredEndpoint === approvedProductionEndpoint || configuredEndpoint === retiredEndpoint) {
    console.error('Preview Formspree endpoint rejected: Production and retired endpoints are forbidden.')
    process.exit(1)
  }

  if (!configuredEndpoint) {
    console.log('Preview Formspree endpoint is absent; inquiry forms fail closed.')
    process.exit(0)
  }

  console.log('Preview Formspree endpoint is isolated from Production.')
  process.exit(0)
}

if (configuredEndpoint === retiredEndpoint) {
  console.error('Non-Production Formspree endpoint rejected: the retired endpoint is forbidden.')
  process.exit(1)
}

console.log(configuredEndpoint
  ? 'Non-Production Formspree endpoint accepted.'
  : 'Formspree endpoint is absent; inquiry forms fail closed.')
