import {spawnSync} from 'node:child_process'
import {existsSync} from 'node:fs'

const approvedEndpoint = 'https://formspree.io/f/xnpqqnol'
const keys = ['NEXT_PUBLIC_FORMSPREE_CONTACT_ENDPOINT', 'NEXT_PUBLIC_FORMSPREE_FREE_MOCKUP_ENDPOINT']
for (const key of keys) {
  if (process.env[key] !== approvedEndpoint) {
    console.error(`Prelaunch endpoint configuration rejected: ${key} must match the approved xnpqqnol form. Check inherited environment overrides.`)
    process.exit(1)
  }
}
console.log('Prelaunch endpoint configuration verified for the sales@poxiol.com account. This does not deploy or submit a form.')

const args = process.argv.slice(2)
if (args.length === 1 && args[0] === '--check-only') process.exit(0)
if (args.length) {
  console.error('Unsupported argument; use --check-only or npm run build:prelaunch.')
  process.exit(1)
}
const npmCli = process.env.npm_execpath
if (!npmCli || !existsSync(npmCli)) {
  console.error('Run this build through npm run build:prelaunch so the existing build pipeline is preserved.')
  process.exit(1)
}
for (const command of [[npmCli,'run','build'], ['scripts/check-inquiry-endpoint-output.test.mjs']]) {
  const environment = command[0] === npmCli ? {...process.env, POXIOL_DEPLOYMENT_ENV: 'local'} : process.env
  const result = spawnSync(process.execPath,command,{stdio:'inherit',env:environment})
  if (result.error) console.error(result.error.message)
  if (result.status !== 0) process.exit(result.status || 1)
}
console.log('Prelaunch build and five-page endpoint checks passed. Publishing and production acceptance remain separate.')
