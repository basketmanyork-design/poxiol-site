import assert from 'node:assert/strict'
import {readFileSync} from 'node:fs'

const home = readFileSync('components/v8/HomepageV8.tsx', 'utf8')
assert.match(home, /MockupToFinished/)
assert.match(home, /SampleInspectionProof/)
assert.match(home, /PackingProof/)
assert.match(home, /getHeroProductionAsset/)

const basketball = readFileSync('components/v8/BasketballV8LandingPage.tsx', 'utf8')
for (const component of ['RealProductGallery', 'MockupToFinished', 'SampleInspectionProof', 'QCProofGallery', 'PackingProof']) assert.match(basketball, new RegExp(component))
assert.match(basketball, /ProductSchema/)
assert.match(basketball, /FAQSchema/)
assert.match(basketball, /getV8ProductionAssetsForSample/)

const authority = readFileSync('components/v8/V8AuthorityPage.tsx', 'utf8')
assert.match(authority, /ManufacturingProof/)
assert.match(authority, /QCProofGallery/)
assert.match(authority, /RealProductGallery/)
assert.match(authority, /PageJsonLd/)

const buyers = readFileSync('components/v8/V8BuyerLandingPage.tsx', 'utf8')
assert.match(buyers, /getV8ProductionAssetsForPage/)
assert.match(buyers, /RealProductGallery/)
assert.match(buyers, /BreadcrumbSchema/)

const customization = readFileSync('app/customization/page.tsx', 'utf8')
assert.match(customization, /MockupToFinished/)
assert.match(customization, /getV8ProductionAssetsForPage/)
assert.match(customization, /cmsProductionMediaToV8Assets\(page\.productionMedia\)/, 'Customization must reuse its existing optional CMS media set')
assert.match(customization, /metadataFromCmsPage/)

const basketballPage = readFileSync('app/products/basketball-uniforms/page.tsx', 'utf8')
assert.match(basketballPage, /const slug = "products\/basketball-uniforms"/)
assert.match(basketballPage, /alternates:\s*\{ canonical: pageData \? "https:\/\/www\.poxiol\.com\/" \+ pageData\.slug/)

console.log('Real Production page wiring checks passed')
