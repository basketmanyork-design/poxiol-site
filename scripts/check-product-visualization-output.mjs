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
  invariant(html.includes('Product visualization'), `${route} is missing the visualization disclosure`)
  for (const [file, alt, caption] of assets) {
    invariant(html.includes(`/product-visualization/${file}`), `${route} is missing ${file}`)
    invariant(html.includes(alt), `${route} changed the approved alt for ${file}`)
    invariant(html.includes(caption), `${route} changed the approved caption for ${file}`)
  }
}

const home=htmlFor('/')
invariant(home.includes('Product design illustrations — specifications are confirmed for each project.'), 'Homepage design images need an explicit non-proof disclosure')
for (const slug of ['soccer','basketball','baseball','training','running-track','warm-up']) {
  invariant(home.includes(`/website-optimization/${slug}-800.webp`), `Homepage is missing the supplied ${slug} card derivative`)
}
invariant(home.includes('poxiol-teamwear-range-banner-2x1.webp'), 'Homepage is missing the supplied hero poster')

for (const route of ['factory', 'manufacturing', 'quality-control-process']) {
  invariant(!htmlFor(route).includes('/product-visualization/'), `${route} must not use product visualization as production evidence`)
}

const productFamilyContracts=[
  {
    route:'products/running-track-uniforms',
    url:'https://www.poxiol.com/products/running-track-uniforms/',
    title:'Running & Track Uniforms for Teams | POXIOL',
    h1:'Running & Track Uniforms',
    meta:'Plan custom running and track uniforms for clubs, schools or sportswear brands. Review singlet and shorts options, fit, artwork, quantity and delivery needs.',
    answer:'Running and track uniform planning starts with the garment set, fit, artwork, quantity and required in-hand date. POXIOL reviews these inputs for the specific project rather than presenting one fixed specification for every buyer.',
    query:'product=Running+%26+Track+Uniforms&amp;source=%2Fproducts%2Frunning-track-uniforms%2F',
    copy:['Plan a running and track uniform brief','Garment set','Start with a running singlet and shorts. Tell us whether you need the full set or selected pieces.','Fit and sizing','Share the size range, athlete or customer profile, and any existing size chart that should be reviewed.','Artwork and color','Provide logos, names, numbers, color references or a design direction. Decoration is reviewed with the selected fabric and construction.','Singlet, shorts or coordinated set'],
  },
  {
    route:'products/warm-up-wear',
    url:'https://www.poxiol.com/products/warm-up-wear/',
    title:'Warm-Up Wear and Team Tracksuits | POXIOL',
    h1:'Warm-Up Wear',
    meta:'Plan custom warm-up wear for teams, clubs, schools or sportswear brands. Review jacket and trouser configuration, fit, branding, quantity and delivery needs.',
    answer:'Warm-up wear planning starts with the jacket-and-trouser configuration, fit, branding, quantity and required in-hand date. POXIOL reviews these inputs for the specific project rather than presenting one fixed specification for every buyer.',
    query:'product=Warm-Up+Wear&amp;source=%2Fproducts%2Fwarm-up-wear%2F',
    copy:['Plan a warm-up wear brief','Set configuration','Start with a warm-up jacket and trousers. Tell us whether you need a coordinated set or selected pieces.','Fit and sizing','Share the size range, wearer profile, and any existing size chart that should be reviewed.','Branding and color','Provide logos, labels, color references or a design direction for project review.','Jacket, trousers or coordinated set'],
  },
]

const sharedProductFamilyCopy=[
  'What to include in your inquiry',
  'A useful project brief helps POXIOL review the request without filling gaps with assumptions.',
  'How the project review works',
  '1. Brief review',
  'We review the product type, intended use, quantity, size information, artwork status, destination and required in-hand date.',
  '2. Planning confirmation',
  'Product configuration, material direction, decoration, sizing and timing are discussed for the specific project.',
  '3. Next-step decision',
  'After the open points are identified, you can decide whether to continue with a mockup, sample discussion or quote.',
  'Discuss This Product',
  'Request a Free Mockup',
  'View fabric references',
  'Discuss sizing for this product',
  'POXIOL product design illustration — construction and materials are confirmed for each project.',
]

for (const contract of productFamilyContracts) {
  const html=htmlFor(contract.route)
  const decoded=html.replaceAll('&amp;','&').replaceAll('&#x27;',"'").replaceAll('&quot;','"')
  invariant((html.match(/<h1\b/gi)||[]).length===1, `${contract.route} must render exactly one H1`)
  invariant(decoded.includes(`<title>${contract.title}</title>`), `${contract.route} changed the approved title`)
  invariant(decoded.includes(`name="description" content="${contract.meta}"`), `${contract.route} changed the approved meta description`)
  invariant(decoded.includes(`rel="canonical" href="${contract.url}"`), `${contract.route} changed the self-canonical`)
  invariant(decoded.includes(`>${contract.h1}</h1>`), `${contract.route} changed the approved H1`)
  for (const copy of [...contract.copy,contract.answer,...sharedProductFamilyCopy]) invariant(decoded.includes(copy), `${contract.route} is missing approved copy: ${copy}`)
  invariant(html.includes(contract.query), `${contract.route} changed the approved inquiry context`)

  const jsonLd=[...html.matchAll(/<script\b[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)].map(match=>JSON.parse(match[1]))
  invariant(jsonLd.length===1, `${contract.route} must render exactly one JSON-LD script`)
  const graph=jsonLd[0]?.['@graph']
  invariant(Array.isArray(graph)&&graph.length===2, `${contract.route} JSON-LD must contain exactly two graph nodes`)
  invariant(graph.map(node=>node['@type']).sort().join('|')==='BreadcrumbList|Service', `${contract.route} JSON-LD changed the approved graph types`)
  const service=graph.find(node=>node['@type']==='Service')
  invariant(service?.description===contract.answer, `${contract.route} Service description must match visible approved copy`)
  invariant(service?.name===contract.h1&&service?.url===contract.url, `${contract.route} Service identity changed`)
  invariant(JSON.stringify(service?.provider)==='{"@type":"Organization","name":"POXIOL","url":"https://www.poxiol.com/"}', `${contract.route} Service provider changed`)
  const serialized=JSON.stringify(jsonLd[0])
  for (const forbidden of ['Product','Offer','OfferCatalog','FAQPage','Review','AggregateRating','areaServed','price','availability','MOQ','leadTime']) invariant(!serialized.includes(`"${forbidden}"`), `${contract.route} JSON-LD exposes forbidden field or type ${forbidden}`)
}

console.log('POXIOL product visualization output checks passed')
