# POXIOL Dual-Dimension Product System Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add one English-only product discovery system that lets international buyers browse POXIOL by twelve sports or three wearing scenarios and continue into a contextual inquiry path.

**Architecture:** A code-owned typed taxonomy in `lib/product-taxonomy.ts` is the discovery source of truth. The Products hub and hybrid homepage render that taxonomy directly; mature Basketball, Soccer and Baseball & Softball routes retain canonical ownership, while evidence-limited categories use qualified project-review CTAs. Existing inquiry sanitation remains the only URL-context boundary.

**Tech Stack:** Next.js 15 App Router, React 18, TypeScript 5, CSS Modules/Tailwind utility classes, Node 22 built-in test runner, static export to `out/`.

**Spec:** `docs/superpowers/specs/2026-08-29-poxiol-dual-dimension-product-system-design.md`

## Global Constraints

- Public sport order is exactly: Soccer, Basketball, Track & Field, Badminton, Volleyball, Baseball & Softball, Ice Hockey, American Football, Rugby, Tennis, Cricket, Golf.
- Public scenario order is exactly: Match Day, Warm-Up & Training, Off-Field & Travel.
- American Football and Rugby remain separate in labels, inquiry context and future SEO planning.
- Basketball, Soccer and Baseball & Softball retain their existing mature canonical routes.
- The other nine sports are project-review entries; do not invent specifications, minimum quantities, production times, evidence or delivery commitments.
- Visible public copy is English only.
- Use approved POXIOL media only; missing media uses code-native typography/geometric styling, never stock, third-party or broken-image placeholders.
- Do not create 36 sport-by-scenario pages or add project-review URLs to the sitemap.
- Do not write Sanity, deploy Preview/production, alter DNS, analytics, form endpoints or production data.
- Preserve and never stage unrelated mobile-inquiry/form work already dirty in the worktree.
- Follow strict RED → GREEN → REFACTOR for every production behavior.

## File Structure

- Create `lib/product-taxonomy.ts`: typed sports/scenarios, lookup functions and safe discovery inquiry URL builder.
- Create `components/products/ProductDiscovery.tsx`: Products hub sport and scenario rendering.
- Create `scripts/check-product-taxonomy.test.mts`: behavior-level taxonomy, lookup and inquiry URL checks.
- Create `scripts/check-product-taxonomy-output.mjs`: rendered Products/home/navigation/SEO checks.
- Modify `lib/v8/leads.ts`: make the qualification form accept the approved twelve sports plus Multi-Sport Teamwear and Other.
- Modify `lib/inquiry-context.ts`: derive the new canonical sport labels from supported product routes.
- Modify `scripts/check-inquiry-context.test.mjs`: update literal expectations and add Rugby/American Football separation coverage.
- Modify `app/products/page.tsx`: render the hub, SEO metadata, collection schema and FAQ without depending on CMS to expose taxonomy entries.
- Modify `lib/products-page.ts`: evidence-safe Products FAQs.
- Modify `lib/navigation.ts`: compact Products dropdown with two anchored discovery entries and two mature deep links.
- Modify `components/hybrid/HomepageHybrid.tsx`: add the dual-entry section after audience and use shared scenarios in the final range section.
- Modify `components/hybrid/HomepageHybrid.module.css`: responsive sport links and scenario cards.
- Modify `lib/hybrid/home.ts`: English-only discovery headings and qualification copy; remove the independently maintained range list.
- Modify `scripts/check-v8-homepage-output.mjs`: protect homepage taxonomy visibility, section order and contextual links.
- Do not modify `package.json`; run the new focused checks directly so its unrelated dirty changes remain untouched.

---

### Task 1: Shared taxonomy and safe inquiry context

**Files:**
- Create: `lib/product-taxonomy.ts`
- Create: `scripts/check-product-taxonomy.test.mts`
- Modify: `lib/v8/leads.ts:13-23`
- Modify: `lib/inquiry-context.ts:36-48`
- Modify: `scripts/check-inquiry-context.test.mjs:11-35`

**Interfaces:**
- Produces: `SPORT_CATEGORIES`, `WEARING_SCENARIOS`, `getSportCategory(id)`, `getScenario(id)`, `productDiscoveryInquiryHref({sport, scenario, source})`.
- Produces: `SportCategory`, `WearingScenario`, `SportContentStage`, `SportId`, `ScenarioId`.
- Consumes: `contextualInquiryHref()` and `PROJECT_SPORT_OPTIONS` as the existing sanitation boundary.

- [ ] **Step 1: Write the failing taxonomy behavior test**

Create `scripts/check-product-taxonomy.test.mts` with literal expected values so the test does not compute its expectation from production data:

```ts
import assert from 'node:assert/strict'
import {test} from 'node:test'
import {
  SPORT_CATEGORIES,
  WEARING_SCENARIOS,
  getScenario,
  getSportCategory,
  productDiscoveryInquiryHref,
} from '../lib/product-taxonomy.ts'

const expectedSports = [
  'Soccer', 'Basketball', 'Track & Field', 'Badminton', 'Volleyball',
  'Baseball & Softball', 'Ice Hockey', 'American Football', 'Rugby',
  'Tennis', 'Cricket', 'Golf',
]
const expectedScenarios = ['Match Day', 'Warm-Up & Training', 'Off-Field & Travel']

test('buyers receive the approved sports and scenarios in owner order', () => {
  assert.deepEqual(SPORT_CATEGORIES.map(item => item.label), expectedSports)
  assert.deepEqual(WEARING_SCENARIOS.map(item => item.label), expectedScenarios)
  assert.equal(new Set(SPORT_CATEGORIES.map(item => item.id)).size, 12)
  assert.notEqual(getSportCategory('american-football')?.id, getSportCategory('rugby')?.id)
})

test('mature sports retain canonical pages and other sports require project review', () => {
  assert.equal(getSportCategory('soccer')?.href, '/products/soccer-jerseys/')
  assert.equal(getSportCategory('basketball')?.href, '/products/basketball-uniforms/')
  assert.equal(getSportCategory('baseball-softball')?.href, '/custom-baseball-softball-uniforms/')
  assert.equal(getSportCategory('cricket')?.contentStage, 'project-review')
})

test('a selected sport and scenario reaches the safe quote form with editable context', () => {
  const href = productDiscoveryInquiryHref({
    sport: 'rugby', scenario: 'warm-up-training', source: '/products/',
  })
  const url = new URL(href, 'https://www.poxiol.com')
  assert.equal(url.pathname, '/get-quote/')
  assert.equal(url.hash, '#quote-form')
  assert.deepEqual(Object.fromEntries(url.searchParams), {
    product: 'Rugby - Warm-Up & Training', sport: 'Rugby', source: '/products/',
  })
  assert.equal(productDiscoveryInquiryHref({sport: 'unknown', source: '/products/'}), '/products/')
  assert.equal(getScenario('unknown'), undefined)
})
```

Production change caught: missing/reordered categories, merged football/rugby, wrong canonical owner, unsafe or malformed quote context.

- [ ] **Step 2: Run the focused test and verify RED**

Run:

```powershell
node --no-warnings --experimental-strip-types --test scripts/check-product-taxonomy.test.mts
```

Expected: FAIL because `lib/product-taxonomy.ts` does not exist. A syntax or test-runner error is not an acceptable RED result.

- [ ] **Step 3: Implement the minimum typed taxonomy**

Create `lib/product-taxonomy.ts` with these exact contracts:

```ts
import {contextualInquiryHref, publicSourcePath} from './inquiry-context.ts'

export type SportContentStage = 'deep-page' | 'project-review'
export type SportId = 'soccer' | 'basketball' | 'track-field' | 'badminton' |
  'volleyball' | 'baseball-softball' | 'ice-hockey' | 'american-football' |
  'rugby' | 'tennis' | 'cricket' | 'golf'
export type ScenarioId = 'match-day' | 'warm-up-training' | 'off-field-travel'

export type SportCategory = {
  id: SportId
  label: string
  shortLabel: string
  description: string
  contentStage: SportContentStage
  href: string
  inquiryProduct: string
}

export type WearingScenario = {
  id: ScenarioId
  label: string
  description: string
  productGroups: readonly string[]
  inquiryProduct: string
}
```

Populate the arrays with this exact business copy and order:

```ts
export const SPORT_CATEGORIES = [
  {id:'soccer',label:'Soccer',shortLabel:'Soccer Kits',description:'Review match, training and travel needs for a soccer program; final construction is confirmed during project review.',contentStage:'deep-page',href:'/products/soccer-jerseys/',inquiryProduct:'Soccer Teamwear Program'},
  {id:'basketball',label:'Basketball',shortLabel:'Basketball Uniforms',description:'Review uniforms and supporting teamwear for a basketball program; final construction is confirmed during project review.',contentStage:'deep-page',href:'/products/basketball-uniforms/',inquiryProduct:'Basketball Teamwear Program'},
  {id:'track-field',label:'Track & Field',shortLabel:'Track & Field',description:'Discuss competition, warm-up and travel apparel for a track and field program through project review.',contentStage:'project-review',href:'/products/',inquiryProduct:'Track & Field Teamwear Program'},
  {id:'badminton',label:'Badminton',shortLabel:'Badminton Teamwear',description:'Discuss competition, training and off-court apparel for a badminton program through project review.',contentStage:'project-review',href:'/products/',inquiryProduct:'Badminton Teamwear Program'},
  {id:'volleyball',label:'Volleyball',shortLabel:'Volleyball Uniforms',description:'Discuss match, training and travel apparel for a volleyball program through project review.',contentStage:'project-review',href:'/products/',inquiryProduct:'Volleyball Teamwear Program'},
  {id:'baseball-softball',label:'Baseball & Softball',shortLabel:'Baseball & Softball',description:'Review uniforms and supporting teamwear for a baseball or softball program; final construction is confirmed during project review.',contentStage:'deep-page',href:'/custom-baseball-softball-uniforms/',inquiryProduct:'Baseball & Softball Teamwear Program'},
  {id:'ice-hockey',label:'Ice Hockey',shortLabel:'Ice Hockey Teamwear',description:'Discuss match, warm-up and travel apparel for an ice hockey program through project review.',contentStage:'project-review',href:'/products/',inquiryProduct:'Ice Hockey Teamwear Program'},
  {id:'american-football',label:'American Football',shortLabel:'American Football',description:'Discuss game, training and travel apparel for an American football program through project review.',contentStage:'project-review',href:'/products/',inquiryProduct:'American Football Teamwear Program'},
  {id:'rugby',label:'Rugby',shortLabel:'Rugby Teamwear',description:'Discuss match, training and travel apparel for a rugby program through project review.',contentStage:'project-review',href:'/products/',inquiryProduct:'Rugby Teamwear Program'},
  {id:'tennis',label:'Tennis',shortLabel:'Tennis Teamwear',description:'Discuss competition, warm-up and off-court apparel for a tennis program through project review.',contentStage:'project-review',href:'/products/',inquiryProduct:'Tennis Teamwear Program'},
  {id:'cricket',label:'Cricket',shortLabel:'Cricket Teamwear',description:'Discuss match, training and travel apparel for a cricket program through project review.',contentStage:'project-review',href:'/products/',inquiryProduct:'Cricket Teamwear Program'},
  {id:'golf',label:'Golf',shortLabel:'Golf Teamwear',description:'Discuss competition, training and off-course apparel for a golf program through project review.',contentStage:'project-review',href:'/products/',inquiryProduct:'Golf Teamwear Program'},
] as const satisfies readonly SportCategory[]

export const WEARING_SCENARIOS = [
  {id:'match-day',label:'Match Day',description:'Competition uniforms and coordinated match components, confirmed for the selected sport and project.',productGroups:['Competition uniforms','Coordinated match components'],inquiryProduct:'Match Day Teamwear'},
  {id:'warm-up-training',label:'Warm-Up & Training',description:'Training tops, warm-up layers, tracksuits and practice apparel, confirmed during project review.',productGroups:['Training tops','Warm-up layers','Tracksuits','Practice apparel'],inquiryProduct:'Warm-Up & Training Teamwear'},
  {id:'off-field-travel',label:'Off-Field & Travel',description:'Hoodies, jackets, polos, travel sets and team accessories, confirmed during project review.',productGroups:['Hoodies','Jackets','Polos','Travel sets','Team accessories'],inquiryProduct:'Off-Field & Travel Teamwear'},
] as const satisfies readonly WearingScenario[]
```

Implement lookup functions that accept `string` and return `undefined` for unknown IDs. Implement the URL builder so it validates both IDs through the lookup functions and uses the existing public-path sanitizer:

```ts
export function productDiscoveryInquiryHref({sport: sportId, scenario: scenarioId, source = '/products/'}: {sport: string; scenario?: string; source?: string}) {
  const sport = getSportCategory(sportId)
  if (!sport) return '/products/'
  const scenario = scenarioId ? getScenario(scenarioId) : undefined
  if (scenarioId && !scenario) return '/products/'
  return contextualInquiryHref('/get-quote/', {
    product: scenario ? `${sport.label} - ${scenario.label}` : sport.inquiryProduct,
    sport: sport.label,
    style: '',
    source: publicSourcePath(source) || '/products/',
  })
}
```

Return `/products/` when the sport is unknown.

- [ ] **Step 4: Expand form sports and route derivation**

Replace `PROJECT_SPORT_OPTIONS` with the twelve approved labels followed by `Multi-Sport Teamwear` and `Other`. Replace `Baseball / Softball` with `Baseball & Softball` and `Running / Training Wear` with `Track & Field`.

Update `contextFromPage()` route matching to derive `Baseball & Softball`, `Track & Field`, `Badminton`, `Rugby`, `Tennis`, `Cricket` and `Golf`, while preserving the existing supported routes. Match `american-football` before generic football-like patterns.

Update the literal Baseball expectation in `scripts/check-inquiry-context.test.mjs` and add:

```js
test('American Football and Rugby remain distinct inquiry sports', () => {
  assert.equal(call('contextFromPage', '/custom-american-football-uniforms/', '').sport, 'American Football')
  assert.equal(call('contextFromPage', '/custom-rugby-uniforms/', '').sport, 'Rugby')
})
```

- [ ] **Step 5: Run GREEN checks**

Run:

```powershell
node --no-warnings --experimental-strip-types --test scripts/check-product-taxonomy.test.mts
node --experimental-strip-types scripts/check-inquiry-context.test.mjs
node scripts/check-inquiry-context-forms.test.mjs
```

Expected: all tests PASS with no warnings from application code.

- [ ] **Step 6: Commit only Task 1 files**

```powershell
git add -- lib/product-taxonomy.ts lib/v8/leads.ts lib/inquiry-context.ts scripts/check-product-taxonomy.test.mts scripts/check-inquiry-context.test.mjs
git diff --cached --check
git commit -m "feat: add dual-dimension product taxonomy"
```

---

### Task 2: Products hub, compact navigation and SEO

**Files:**
- Create: `components/products/ProductDiscovery.tsx`
- Create: `scripts/check-product-taxonomy-output.mjs`
- Modify: `app/products/page.tsx:1-67`
- Modify: `lib/products-page.ts:11-29`
- Modify: `lib/navigation.ts:14-23`

**Interfaces:**
- Consumes: `SPORT_CATEGORIES`, `WEARING_SCENARIOS`, `productDiscoveryInquiryHref()` from Task 1.
- Produces: `ProductDiscovery()` server component with `#sports` and `#scenarios` anchors.
- Produces: static `/products/` output with one H1, twelve sports, three scenarios and qualified inquiry links.

- [ ] **Step 1: Write the failing Products output test**

Create `scripts/check-product-taxonomy-output.mjs`. It must read rendered HTML rather than grep source:

```js
import assert from 'node:assert/strict'
import {readFileSync} from 'node:fs'

const html = readFileSync('out/products/index.html', 'utf8')
const visible = html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, ' ')
  .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, ' ')
  .replace(/<[^>]+>/g, ' ').replace(/&amp;/g, '&').replace(/\s+/g, ' ').trim()
const sports = ['Soccer','Basketball','Track & Field','Badminton','Volleyball','Baseball & Softball','Ice Hockey','American Football','Rugby','Tennis','Cricket','Golf']
const scenarios = ['Match Day','Warm-Up & Training','Off-Field & Travel']

assert.equal((html.match(/<h1\b/gi) || []).length, 1)
assert.match(visible, /Browse by Sport/)
assert.match(visible, /Browse by Wearing Scenario/)
for (const label of [...sports, ...scenarios]) assert.match(visible, new RegExp(label.replace(/[&]/g, '&(?:amp;)?')))
assert.match(visible, /Product construction, material, quantity and timing are confirmed after the project brief is reviewed\./)
assert.doesNotMatch(visible, /Nike|Adidas|Puma|Under Armour/i)

for (const id of ['sports', 'scenarios']) assert.match(html, new RegExp(`id="${id}"`))
for (const href of ['/products/basketball-uniforms/','/products/soccer-jerseys/','/custom-baseball-softball-uniforms/']) {
  assert.ok(html.includes(`href="${href}"`), `Missing mature link ${href}`)
}

const quoteLinks = [...html.matchAll(/<a\b[^>]*href="([^"]+)"/gi)]
  .map(match => new URL(match[1].replace(/&amp;/g, '&'), 'https://www.poxiol.com'))
  .filter(url => url.pathname === '/get-quote/' && url.searchParams.get('source') === '/products/')
assert.ok(quoteLinks.some(url => url.searchParams.get('sport') === 'Rugby'))
assert.ok(quoteLinks.some(url => url.searchParams.get('sport') === 'American Football'))

console.log('POXIOL dual-dimension Products output checks passed.')
```

Production change caught: a Products render that omits a dimension, merges sports, drops contextual CTAs, breaks canonical links or publishes prohibited brand text.

- [ ] **Step 2: Run the output check and verify RED**

Run:

```powershell
node scripts/check-product-taxonomy-output.mjs
```

Expected: FAIL against the current `out/products/index.html` because `Browse by Wearing Scenario` and the complete taxonomy are absent.

- [ ] **Step 3: Implement the Products discovery component**

Create `components/products/ProductDiscovery.tsx` as a server component using this composition (utility-class details may wrap, but labels, href behavior and semantic elements are fixed):

```tsx
import Link from 'next/link'
import {SPORT_CATEGORIES, WEARING_SCENARIOS, productDiscoveryInquiryHref} from '@/lib/product-taxonomy'

const qualification = 'Product construction, material, quantity and timing are confirmed after the project brief is reviewed.'

export function ProductDiscovery() {
  return <>
    <section id="sports" className="scroll-mt-24 bg-[#0a0a0a] px-5 py-20 text-white md:px-10 xl:px-20" aria-labelledby="sports-title">
      <div className="mx-auto max-w-7xl">
        <p className="text-xs font-black uppercase tracking-[.2em] text-[#b6ff00]">Browse by sport</p>
        <h2 id="sports-title" className="mt-3 text-4xl font-black uppercase md:text-6xl">Start with the sport you serve</h2>
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {SPORT_CATEGORIES.map((sport,index) => {
            const href = sport.contentStage === 'deep-page' ? sport.href : productDiscoveryInquiryHref({sport:sport.id,source:'/products/'})
            const cta = sport.contentStage === 'deep-page' ? 'View Product Details' : 'Discuss This Sport Program'
            return <article key={sport.id} className="flex min-h-72 flex-col justify-between overflow-hidden rounded-3xl border border-white/15 bg-gradient-to-br from-white/10 to-transparent p-6">
              <div><span aria-hidden="true" className="text-5xl font-black text-white/10">{String(index+1).padStart(2,'0')}</span><h3 className="mt-6 text-2xl font-black uppercase">{sport.label}</h3><p className="mt-4 leading-7 text-neutral-300">{sport.description}</p></div>
              <Link href={href} className="mt-8 font-black uppercase tracking-wide text-[#b6ff00]">{cta} <span aria-hidden="true">→</span></Link>
            </article>
          })}
        </div>
      </div>
    </section>
    <section id="scenarios" className="scroll-mt-24 bg-white px-5 py-20 text-neutral-950 md:px-10 xl:px-20" aria-labelledby="scenarios-title">
      <div className="mx-auto max-w-7xl">
        <p className="text-xs font-black uppercase tracking-[.2em] text-[#356000]">Browse by wearing scenario</p>
        <h2 id="scenarios-title" className="mt-3 text-4xl font-black uppercase md:text-6xl">Choose how the range will be worn</h2>
        <div className="mt-12 grid gap-5 lg:grid-cols-3">
          {WEARING_SCENARIOS.map(scenario => <article key={scenario.id} className="rounded-3xl border border-neutral-200 bg-neutral-50 p-6">
            <h3 className="text-2xl font-black uppercase">{scenario.label}</h3><p className="mt-4 leading-7 text-neutral-700">{scenario.description}</p>
            <ul className="mt-6 flex flex-wrap gap-2" aria-label={`${scenario.label} sports`}>
              {SPORT_CATEGORIES.map(sport => <li key={sport.id}><Link className="inline-flex min-h-11 items-center rounded-full border border-neutral-300 px-3 py-2 text-sm font-bold" href={productDiscoveryInquiryHref({sport:sport.id,scenario:scenario.id,source:'/products/'})}>{sport.label}</Link></li>)}
            </ul>
          </article>)}
        </div>
        <p className="mt-8 border-l-4 border-[#b6ff00] pl-4 font-bold">{qualification}</p>
      </div>
    </section>
  </>
}
```

Required behavior:

- a `section#sports` with `scroll-mt-24`, one `<article>` per sport, label, restrained description and stage-aware CTA;
- mature CTA label `View Product Details` to the canonical `href`;
- project-review CTA label `Discuss This Sport Program` using `productDiscoveryInquiryHref({sport: item.id, source: '/products/'})`;
- a `section#scenarios` with three panels;
- each scenario panel contains twelve ordinary links created with `productDiscoveryInquiryHref({sport, scenario, source: '/products/'})`;
- the visible shared qualification line from the spec.

Use only black/white/POXIOL green code-native styling. The sport entries without approved imagery use a numbered typographic background and contain no `<img>`.

- [ ] **Step 4: Replace CMS-dependent discovery on `/products/`**

Update `app/products/page.tsx` to:

- remove `getProductCategories()` and category image rendering;
- render `ProductDiscovery` below a black hero;
- use title `Custom Teamwear by Sport & Wearing Scenario | POXIOL`;
- use an evidence-safe description naming multi-sport discovery and project review;
- build `CollectionPageSchema.items` from the three mature `SPORT_CATEGORIES` only;
- retain Breadcrumb and FAQ schema/visible FAQ parity;
- keep the wholesale/sample CTA section without altering its commercial commitments.

Update `productsFaqs[0].answer` to list all twelve sports and state that product construction is confirmed per project. Keep three unique FAQ IDs.

- [ ] **Step 5: Make Products navigation compact**

Replace only the Products children in `lib/navigation.ts` with this order:

```ts
children: [
  {label: 'All Products', href: '/products/'},
  {label: 'Browse by Sport', href: '/products/#sports'},
  {label: 'Browse by Wearing Scenario', href: '/products/#scenarios'},
  {label: 'Basketball Uniforms', href: '/products/basketball-uniforms/'},
  {label: 'Soccer Kits', href: '/products/soccer-jerseys/'},
]
```

Do not add the twelve sports to the header and do not modify `MobileMenu.tsx` because it already consumes `HEADER_NAV` and contains unrelated dirty work.

- [ ] **Step 6: Build the static site and verify GREEN**

Run:

```powershell
npx next build
node scripts/check-product-taxonomy-output.mjs
node --no-warnings --experimental-strip-types scripts/check-core-sports-v1.test.mts --output
node --no-warnings --experimental-strip-types scripts/check-core-sports-post-launch-cleanup.test.mts --output
```

Expected: Next build exits 0; the new Products output check passes; mature canonical owner checks pass.

- [ ] **Step 7: Commit only Task 2 files**

```powershell
git add -- components/products/ProductDiscovery.tsx app/products/page.tsx lib/products-page.ts lib/navigation.ts scripts/check-product-taxonomy-output.mjs
git diff --cached --check
git commit -m "feat: build dual-dimension product hub"
```

---

### Task 3: Homepage dual-entry discovery

**Files:**
- Modify: `components/hybrid/HomepageHybrid.tsx:1-146`
- Modify: `components/hybrid/HomepageHybrid.module.css:1-88`
- Modify: `lib/hybrid/home.ts:1-58`
- Modify: `scripts/check-v8-homepage-output.mjs:1-45`

**Interfaces:**
- Consumes: `SPORT_CATEGORIES`, `WEARING_SCENARIOS`, `productDiscoveryInquiryHref()` from Task 1.
- Produces: `#product-discovery` between audience and buyer-risk sections.
- Produces: end-of-page range cards driven by `WEARING_SCENARIOS`, not a separate hard-coded range array.

- [ ] **Step 1: Extend the homepage output test before changing the component**

Add these assertions to `scripts/check-v8-homepage-output.mjs`:

```js
for (const label of ['Soccer','Basketball','Track & Field','Badminton','Volleyball','Baseball & Softball','Ice Hockey','American Football','Rugby','Tennis','Cricket','Golf']) {
  assert.match(visibleText, new RegExp(label.replace(/[&]/g, '&')))
}
for (const label of ['Match Day','Warm-Up & Training','Off-Field & Travel']) assert.match(visibleText, new RegExp(label.replace(/[&]/g, '&')))
assert.match(visibleText, /Find the Right Teamwear Starting Point/)
assert.match(html, /id="product-discovery"/)
assert.ok(html.indexOf('hybrid-audience-title') < html.indexOf('product-discovery'))
assert.ok(html.indexOf('product-discovery') < html.indexOf('hybrid-risks-title'))
assert.match(html, /href="\/products\/#sports"/)
assert.match(html, /href="\/products\/#scenarios"/)
```

Production change caught: removal of either dimension, incorrect section order, or broken hub entry anchors.

- [ ] **Step 2: Run the homepage output check and verify RED**

Run:

```powershell
node scripts/check-v8-homepage-output.mjs
```

Expected: FAIL because `#product-discovery` and its two dimensions are absent from the current build.

- [ ] **Step 3: Add evidence-safe homepage discovery copy**

In `lib/hybrid/home.ts`, add:

```ts
productDiscovery: {
  eyebrow: 'Product discovery',
  title: 'Find the Right Teamwear Starting Point',
  body: 'Start with the sport you serve or the way the team will wear the range. Product construction and project planning are confirmed after the brief is reviewed.',
  sportCta: 'Browse by Sport',
  scenarioCta: 'Browse by Wearing Scenario',
  fullCta: 'View the Full Product System',
},
```

Remove the `range` array so taxonomy links are not maintained twice.

- [ ] **Step 4: Render both homepage dimensions from the shared taxonomy**

Import `SPORT_CATEGORIES` and `WEARING_SCENARIOS` in `HomepageHybrid.tsx`. Immediately after the audience section, render `section#product-discovery` with:

- heading/copy from `home.productDiscovery`;
- buttons to `/products/#sports` and `/products/#scenarios`;
- all twelve sport labels as normal links: mature sports use their canonical `href`; project-review sports point to `/products/#sports` so the buyer sees qualification before inquiry;
- three larger scenario links to `/products/#scenarios`;
- one `/products/` link labeled `View the Full Product System`.

In the existing dark range section, map `WEARING_SCENARIOS` into three cards linking to `/products/#scenarios`; do not duplicate twelve sport cards there.

Use this exact data flow so the homepage does not copy taxonomy values:

```tsx
import {SPORT_CATEGORIES, WEARING_SCENARIOS} from '@/lib/product-taxonomy'

<section id="product-discovery" className={`${styles.section} ${styles.light}`} aria-labelledby="product-discovery-title">
  <div className={styles.container}>
    <p className={styles.eyebrow}>{home.productDiscovery.eyebrow}</p>
    <h2 id="product-discovery-title">{home.productDiscovery.title}</h2>
    <p className={styles.lead}>{home.productDiscovery.body}</p>
    <div className={styles.discoveryActions}>
      <Link className={styles.primary} href="/products/#sports">{home.productDiscovery.sportCta}</Link>
      <Link className={styles.secondaryDark} href="/products/#scenarios">{home.productDiscovery.scenarioCta}</Link>
    </div>
    <div className={styles.sportLinks} aria-label="Browse POXIOL teamwear by sport">
      {SPORT_CATEGORIES.map(sport => <Link key={sport.id} className={styles.sportLink} href={sport.contentStage === 'deep-page' ? sport.href : '/products/#sports'}>{sport.label}</Link>)}
    </div>
    <div className={styles.scenarioGrid}>
      {WEARING_SCENARIOS.map(scenario => <Link key={scenario.id} className={styles.scenarioLink} href="/products/#scenarios">{scenario.label}</Link>)}
    </div>
    <Link className={styles.fullSystemLink} href="/products/">{home.productDiscovery.fullCta}</Link>
  </div>
</section>
```

Add `.secondaryDark` as the light-section counterpart of `.secondary`, and `.fullSystemLink` as an underlined, bold text link with a visible `:focus-visible` outline.

- [ ] **Step 5: Add responsive CSS without changing global design tokens**

Add focused classes for:

```css
.discoveryActions { display: flex; flex-wrap: wrap; gap: .75rem; margin-block: 1.5rem; }
.sportLinks { display: flex; flex-wrap: wrap; gap: .625rem; margin: 2rem 0; }
.sportLink { min-height: 2.75rem; display: inline-flex; align-items: center; padding: .65rem 1rem; border: 1px solid currentColor; border-radius: 999px; color: inherit; font-weight: 700; text-decoration: none; }
.scenarioGrid { display: grid; grid-template-columns: repeat(3, minmax(0,1fr)); gap: 1rem; }
.scenarioLink { min-height: 8rem; display: flex; align-items: flex-end; padding: 1.25rem; border: 1px solid var(--line,#d9ded5); color: inherit; font-weight: 800; text-decoration: none; }
```

At `max-width: 48rem`, make `.scenarioGrid` one column. At `max-width: 32rem`, make `.discoveryActions` a grid and its links full width. Preserve visible focus states by adding `:focus-visible` outlines using `var(--accent-dark, #356000)`.

- [ ] **Step 6: Rebuild and verify GREEN**

Run:

```powershell
npx next build
node scripts/check-v8-homepage-output.mjs
node scripts/check-product-taxonomy-output.mjs
node --test scripts/check-english-only-output.test.mjs
```

Expected: all commands PASS; homepage renders one H1 and both dimensions; all output is free of CJK ideographs.

- [ ] **Step 7: Commit only Task 3 files**

```powershell
git add -- components/hybrid/HomepageHybrid.tsx components/hybrid/HomepageHybrid.module.css lib/hybrid/home.ts scripts/check-v8-homepage-output.mjs
git diff --cached --check
git commit -m "feat: add homepage product discovery"
```

---

### Task 4: Regression, responsive and inquiry-path acceptance

**Files:**
- Modify only if a failing check identifies a scoped defect in Task 1-3 files.
- Record: `construction/acceptance/dual-dimension-product-system.md`

**Interfaces:**
- Consumes: complete static output in `out/` and the current locked local review server.
- Produces: a concise acceptance record containing commands, results, reviewed routes, unresolved risks and the production no-go status.

- [ ] **Step 1: Run focused source and inquiry regression checks**

```powershell
node --no-warnings --experimental-strip-types --test scripts/check-product-taxonomy.test.mts
node --experimental-strip-types scripts/check-inquiry-context.test.mjs
node scripts/check-inquiry-context-forms.test.mjs
node scripts/check-mobile-inquiry-ctas.test.mjs
node --no-warnings --experimental-strip-types --test scripts/check-mobile-inquiry-visibility.test.mts
```

Expected: all PASS. If a failure comes from pre-existing dirty mobile work rather than this feature, record it and do not alter or stage those files without proving overlap.

- [ ] **Step 2: Run full construction-compatible build and output checks**

```powershell
npx next build
node scripts/check-product-taxonomy-output.mjs
node scripts/check-v8-homepage-output.mjs
node --test scripts/check-english-only-output.test.mjs
node --no-warnings --experimental-strip-types scripts/check-core-sports-v1.test.mts --output
node scripts/check-product-visualization-output.mjs
```

Expected: all PASS with exit code 0. Do not use a release command that bypasses legal/analytics owner gates.

- [ ] **Step 3: Start the locked local review server**

Run the repository's existing local review command against the newly generated `out/` directory:

```powershell
npm run serve:locked-review
```

Keep the returned session ID for browser checks. Do not start a Cloudflare Preview or deploy.

- [ ] **Step 4: Review desktop and mobile behavior in the browser**

Inspect `/` and `/products/` at 1440×900 and 390×844. Verify:

- no horizontal overflow;
- sport labels are not truncated;
- the homepage discovery appears after audience and before buyer risks;
- the Products header menu contains only five children;
- `#sports` and `#scenarios` scroll to visible headings below the fixed header;
- scenario cards stack on mobile;
- no prohibited third-party marks/images appear;
- keyboard focus remains visible.

Capture screenshots under `construction/visual-reviews/dual-dimension/` only if the directory is not part of unrelated review work; otherwise use a new uniquely named subdirectory.

- [ ] **Step 5: Click through inquiry context without submitting**

From `/products/#scenarios`, choose Rugby → Warm-Up & Training and American Football → Match Day. Verify each reaches `/get-quote/#quote-form` with:

- editable product reference;
- correct, distinct sport value;
- source `/products/`;
- no personal or external-origin query data.

Do not submit a real Formspree inquiry during this acceptance.

- [ ] **Step 6: Record acceptance**

Create `construction/acceptance/dual-dimension-product-system.md` with:

```markdown
# Dual-Dimension Product System Acceptance

- Date: 2026-08-29
- Environment: local construction worktree
- Routes: `/`, `/products/`, `/get-quote/`
- Taxonomy: 12 sports / 3 scenarios
- Inquiry checks: Rugby and American Football remain distinct
- Public media: POXIOL-approved or code-native only
- Automated checks: list each command and exit result
- Responsive review: 1440×900 and 390×844
- Deployment: not performed
- Status: PREVIEW-READY / PRODUCTION NO-GO
- Remaining owner gates: use `docs/operations/owner-gates.md` as the source of truth
```

- [ ] **Step 7: Commit the acceptance record and any proven scoped fixes**

```powershell
git add -- construction/acceptance/dual-dimension-product-system.md
git diff --cached --check
git commit -m "docs: record product discovery acceptance"
```

Before the commit, inspect `git status --short` and verify that unrelated dirty mobile inquiry/form files are not staged.
