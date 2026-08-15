import {existsSync, readFileSync, readdirSync} from 'fs'
import {join} from 'path'
import {fileURLToPath} from 'url'
import {canPublishProductionAsset} from '../lib/real-production/policy.ts'
import type {RealProductionAsset, RealProductionManifest} from '../lib/real-production/types.ts'

const ROOT = join(fileURLToPath(new URL('.', import.meta.url)), '..')
const MANIFEST_PATH = join(ROOT, 'content', 'product-visualization', 'assets.json')
const PUBLIC_ROOT = join(ROOT, 'public', 'product-visualization')

type ProductVisualizationAsset = {
  assetId: string
  publicFile: string
  packagePath: string
  classification: string
  generatedByAI: boolean
  thirdPartyLogoAudit: string
  allowedUse: string[]
  prohibitedUse: string[]
  category: string
  recommendedPages: string[]
  alt: string
  caption: string
}

const expected = [
  ['PV-HOME-001', 'POXIOL_HOME_BasketballHero.webp', ['/'], 'POXIOL black and neon green basketball uniform with jersey and matching shorts', 'POXIOL basketball uniform concept shown as a coordinated jersey and shorts set.'],
  ['PV-BASK-001', 'POXIOL_BASK_FullSet.webp', ['/products/basketball-uniforms/'], 'POXIOL black basketball jersey and shorts set with neon green lightning graphics and number 23', 'Basketball uniform visualization showing the matching jersey and shorts set.'],
  ['PV-BASK-002', 'POXIOL_BASK_JerseyFront.webp', ['/products/basketball-uniforms/'], 'Front view of black POXIOL basketball jersey with neon green lightning graphics and number 23', 'Front-view basketball jersey visualization.'],
  ['PV-BASK-003', 'POXIOL_BASK_JerseyBack.webp', ['/products/basketball-uniforms/'], 'Back view of black basketball jersey with neon green lightning graphics and number 23', 'Back-view basketball jersey visualization.'],
  ['PV-BASK-004', 'POXIOL_BASK_Shorts.webp', ['/products/basketball-uniforms/'], 'Black POXIOL basketball shorts with neon green lightning side graphics', 'Matching basketball shorts visualization.'],
  ['PV-BASK-005', 'POXIOL_BASK_RibbedCollar.webp', ['/products/basketball-uniforms/'], 'Close-up visualization of black ribbed V-neck basketball jersey collar', 'Close-up visualization of the ribbed V-neck construction.'],
  ['PV-BASK-006', 'POXIOL_BASK_RibbedArmhole.webp', ['/products/basketball-uniforms/'], 'Close-up visualization of ribbed basketball jersey armhole and mesh surface', 'Close-up visualization of the ribbed armhole and mesh surface.'],
  ['PV-BASK-007', 'POXIOL_BASK_NumberDetail.webp', ['/products/basketball-uniforms/'], 'Macro visualization of white number 23 on black basketball jersey fabric', 'Macro visualization of number placement on the jersey.'],
  ['PV-BASK-008', 'POXIOL_BASK_FrontBackComparison.webp', ['/products/basketball-uniforms/', '/sample-order/'], 'Front and back comparison of matching POXIOL basketball uniform set', 'Front-and-back comparison visualization for the same basketball uniform concept.'],
  ['PV-CUSTOM-001', 'POXIOL_CUSTOM_MockupToFinished.webp', ['/customization/', '/free-mockup/'], 'Basketball jersey design visualization transitioning from mockup to finished presentation', 'Concept-to-finished visualization for POXIOL customization.'],
  ['PV-SOCCER-001', 'POXIOL_SOCCER_FullSet.webp', ['/', '/school-teamwear/', '/club-teamwear-program/'], 'POXIOL black and neon green soccer kit with jersey shorts and socks', 'POXIOL soccer kit visualization showing jersey, shorts and socks.'],
  ['PV-BASEBALL-001', 'POXIOL_BASEBALL_FullSet.webp', ['/', '/school-teamwear/', '/club-teamwear-program/'], 'POXIOL black white and neon green baseball uniform set', 'POXIOL baseball uniform visualization showing jersey and matching pants.'],
  ['PV-BASK-009', 'POXIOL_BASK_MeshFabric.webp', ['/products/basketball-uniforms/'], 'Macro visualization of black perforated basketball jersey mesh fabric', 'Mesh fabric visualization for the basketball product detail section.'],
  ['PV-BASK-010', 'POXIOL_BASK_Waistband.webp', ['/products/basketball-uniforms/'], 'Close-up visualization of elastic waistband on black basketball shorts', 'Elastic waistband visualization for the basketball product detail section.'],
] as const

function invariant(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message)
}

invariant(existsSync(MANIFEST_PATH), 'Product visualization manifest is missing')
const assets = JSON.parse(readFileSync(MANIFEST_PATH, 'utf8')) as ProductVisualizationAsset[]
invariant(Array.isArray(assets), 'Product visualization manifest must be an array')
invariant(assets.length === expected.length, `Expected ${expected.length} product visualizations, received ${assets.length}`)

const byId = new Map(assets.map((asset) => [asset.assetId, asset]))
for (const [assetId, publicFile, pages, alt, caption] of expected) {
  const asset = byId.get(assetId)
  invariant(asset, `Missing approved visualization record: ${assetId}`)
  invariant(asset.publicFile === publicFile, `Unexpected public file for ${assetId}`)
  invariant(JSON.stringify(asset.recommendedPages) === JSON.stringify(pages), `Page mapping changed for ${assetId}`)
  invariant(asset.alt === alt, `Alt text changed for ${assetId}`)
  invariant(asset.caption === caption, `Caption changed for ${assetId}`)
  invariant(asset.classification === 'PRODUCT_VISUALIZATION', `Invalid classification for ${assetId}`)
  invariant(asset.generatedByAI === true, `generatedByAI must remain true for ${assetId}`)
  invariant(asset.thirdPartyLogoAudit === 'PASS_MANUAL_VISUAL_REVIEW', `Logo audit changed for ${assetId}`)
  invariant(asset.prohibitedUse.includes('real production proof'), `Real-production prohibition missing for ${assetId}`)
  invariant(asset.prohibitedUse.includes('real factory proof'), `Real-factory prohibition missing for ${assetId}`)
  invariant(asset.prohibitedUse.includes('real QC proof'), `Real-QC prohibition missing for ${assetId}`)
  invariant(asset.prohibitedUse.includes('real customer project proof'), `Customer-project prohibition missing for ${assetId}`)
}

invariant(existsSync(PUBLIC_ROOT), 'Product visualization public directory is missing')
const publicFiles = readdirSync(PUBLIC_ROOT, {withFileTypes: true})
  .filter((entry) => entry.isFile())
  .map((entry) => entry.name)
  .sort()
const expectedFiles = expected.map((record) => record[1]).sort()
invariant(JSON.stringify(publicFiles) === JSON.stringify(expectedFiles), 'Public visualization directory must contain exactly the 14 approved WebP files')
invariant(publicFiles.every((file) => file.endsWith('.webp')), 'Only approved WebP files may be published')

const forbiddenNames = [
  'poxiol_neon_apparel_workshop.png',
  'gloved_inspection_of_neon_basketball_jersey.png',
  'black_lightning_basketball_uniform_qc_flat_lay.png',
  'poxiol_basketball_jersey_packaging_set.png',
  'folded_black_basketball_uniform_set.png',
]
invariant(forbiddenNames.every((name) => !publicFiles.includes(name)), 'DO_NOT_USE asset found in public output')
invariant(publicFiles.every((name) => !name.startsWith('a_')), 'DO_NOT_USE catalog/grid asset found in public output')

const realManifest = JSON.parse(readFileSync(join(ROOT, 'content', 'real-production', 'manifest', 'assets.json'), 'utf8')) as RealProductionManifest
const visualizationNames = new Set(expectedFiles)
invariant(realManifest.assets.every((asset) => !visualizationNames.has(asset.filename)), 'Product visualization leaked into Real Production manifest')
invariant(realManifest.assets.every((asset) => asset.verificationStatus !== 'PRODUCT_VISUALIZATION'), 'Real Production manifest contains PRODUCT_VISUALIZATION')

const rejectedByProductionGate = {
  ...realManifest.assets[0],
  assetId: 'PV-GATE-TEST',
  verificationStatus: 'PRODUCT_VISUALIZATION',
} as RealProductionAsset
invariant(canPublishProductionAsset(rejectedByProductionGate) === false, 'Verified Media Gate must reject PRODUCT_VISUALIZATION')

const sourceExpectations = [
  ['components/v8/HomepageV8.tsx', 'PV-HOME-001'],
  ['components/v8/HomepageV8.tsx', 'PV-SOCCER-001'],
  ['components/v8/HomepageV8.tsx', 'PV-BASEBALL-001'],
  ['components/v8/BasketballV8LandingPage.tsx', 'BASKETBALL_VISUALIZATION_SEQUENCE'],
  ['app/customization/page.tsx', 'PV-CUSTOM-001'],
  ['app/free-mockup/page.tsx', 'PV-CUSTOM-001'],
  ['app/sample-order/page.tsx', 'PV-BASK-008'],
  ['components/v8/V8BuyerLandingPage.tsx', 'getProductVisualizationsForPage'],
] as const
for (const [file, token] of sourceExpectations) {
  const source = readFileSync(join(ROOT, ...file.split('/')), 'utf8')
  invariant(source.includes(token), `${file} is not wired to ${token}`)
}

console.log('POXIOL product visualization source checks passed')
