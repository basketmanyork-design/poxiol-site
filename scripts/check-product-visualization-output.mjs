import {readFileSync} from 'fs'
import {join} from 'path'
import {fileURLToPath} from 'url'

const ROOT = join(fileURLToPath(new URL('.', import.meta.url)), '..')

function htmlFor(route) {
  return readFileSync(route === '/' ? join(ROOT, 'out', 'index.html') : join(ROOT, 'out', route, 'index.html'), 'utf8')
}

function invariant(condition, message) {
  if (!condition) throw new Error(message)
}

const required = new Map([
  ['/', [
    ['poxiol-teamwear-hero-poxiol-only-v2.png', 'Illustrative POXIOL-branded basketball, football, and warm-up teamwear configurations', 'Illustrative teamwear configuration'],
  ]],
  ['products/basketball-uniforms', [
    ['POXIOL_BASK_FullSet.webp', 'POXIOL black basketball jersey and shorts set with neon green lightning graphics and number 23', 'Basketball uniform visualization showing the matching jersey and shorts set.'],
    ['POXIOL_BASK_JerseyFront.webp', 'Front view of black POXIOL basketball jersey with neon green lightning graphics and number 23', 'Front-view basketball jersey visualization.'],
    ['POXIOL_BASK_JerseyBack.webp', 'Back view of black basketball jersey with neon green lightning graphics and number 23', 'Back-view basketball jersey visualization.'],
    ['POXIOL_BASK_Shorts.webp', 'Black POXIOL basketball shorts with neon green lightning side graphics', 'Matching basketball shorts visualization.'],
    ['POXIOL_BASK_RibbedCollar.webp', 'Close-up visualization of black ribbed V-neck basketball jersey collar', 'Close-up visualization of the ribbed V-neck construction.'],
    ['POXIOL_BASK_RibbedArmhole.webp', 'Close-up visualization of ribbed basketball jersey armhole and mesh surface', 'Close-up visualization of the ribbed armhole and mesh surface.'],
    ['POXIOL_BASK_MeshFabric.webp', 'Macro visualization of black perforated basketball jersey mesh fabric', 'Mesh fabric visualization for the basketball product detail section.'],
    ['POXIOL_BASK_NumberDetail.webp', 'Macro visualization of white number 23 on black basketball jersey fabric', 'Macro visualization of number placement on the jersey.'],
    ['POXIOL_BASK_Waistband.webp', 'Close-up visualization of elastic waistband on black basketball shorts', 'Elastic waistband visualization for the basketball product detail section.'],
  ]],
  ['products/soccer-jerseys', [
    ['POXIOL_SOCCER_FullSet.webp', 'POXIOL black and neon green soccer kit with jersey shorts and socks', 'POXIOL soccer kit visualization showing jersey, shorts and socks.'],
  ]],
  ['custom-baseball-softball-uniforms', [
    ['POXIOL_BASEBALL_FullSet.webp', 'POXIOL black white and neon green baseball uniform set', 'POXIOL baseball uniform visualization showing jersey and matching pants.'],
  ]],
  ['customization', [['POXIOL_CUSTOM_MockupToFinished.webp', 'Basketball jersey design visualization transitioning from mockup to finished presentation', 'Concept-to-finished visualization for POXIOL customization.']]],
  ['free-mockup', [['POXIOL_CUSTOM_MockupToFinished.webp', 'Basketball jersey design visualization transitioning from mockup to finished presentation', 'Concept-to-finished visualization for POXIOL customization.']]],
  ['sample-order', [['POXIOL_BASK_FrontBackComparison.webp', 'Front and back comparison of matching POXIOL basketball uniform set', 'Front-and-back comparison visualization for the same basketball uniform concept.']]],
  ['school-teamwear', [
    ['POXIOL_SOCCER_FullSet.webp', 'POXIOL black and neon green soccer kit with jersey shorts and socks', 'POXIOL soccer kit visualization showing jersey, shorts and socks.'],
    ['POXIOL_BASEBALL_FullSet.webp', 'POXIOL black white and neon green baseball uniform set', 'POXIOL baseball uniform visualization showing jersey and matching pants.'],
  ]],
  ['club-teamwear-program', [
    ['POXIOL_SOCCER_FullSet.webp', 'POXIOL black and neon green soccer kit with jersey shorts and socks', 'POXIOL soccer kit visualization showing jersey, shorts and socks.'],
    ['POXIOL_BASEBALL_FullSet.webp', 'POXIOL black white and neon green baseball uniform set', 'POXIOL baseball uniform visualization showing jersey and matching pants.'],
  ]],
])

for (const [route, assets] of required) {
  const html = htmlFor(route)
  invariant(html.includes(route === '/' ? 'Illustrative teamwear configuration' : 'Product visualization'), `${route} is missing the visualization disclosure`)
  for (const [file, alt, caption] of assets) {
    invariant(html.includes(route === '/' ? `/images/${file}` : `/product-visualization/${file}`), `${route} is missing ${file}`)
    invariant(html.includes(alt), `${route} changed the approved alt for ${file}`)
    invariant(html.includes(caption), `${route} changed the approved caption for ${file}`)
  }
}

for (const route of ['factory', 'manufacturing', 'quality-control-process']) {
  invariant(!htmlFor(route).includes('/product-visualization/'), `${route} must not use product visualization as production evidence`)
}

console.log('POXIOL product visualization output checks passed')
