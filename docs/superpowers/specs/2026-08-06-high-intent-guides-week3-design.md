# POXIOL Week 3 High-Intent Guides Design

## Scope

Week 3 consists of three page deliverables and one internal-linking deliverable: upgrade the existing `/certificates-testing/` page, add two controlled resource guides at `/resources/custom-basketball-uniform-manufacturer-guide/` and `/resources/custom-soccer-kits-wholesale-guide/`, and connect the three topic clusters through focused links in Resources, relevant Products, FAQ, Factory and Quality pages.

## Architecture

The existing Certificates page remains its canonical route and receives evidence-tiered content. The two new guides are static code-driven entries merged into the existing `app/resources/[slug]/page.tsx` Resolver; no second route, CMS, or content system is introduced. A shared procurement-guide data model supplies visible sections and the Article, BreadcrumbList, and FAQPage schemas from the same FAQ data.

Static entries are limited to the two approved slugs and take precedence over Sanity lookup for those slugs. Resources listing merges static entries with Sanity resources by slug, with deterministic de-duplication. No Sanity mutation is performed in this phase.

## Content and evidence rules

Each page has one visible H1, a direct 30-second answer, buyer decision context, conditional comparisons, cost/timing/quality factors, supplier questions, sample/evidence checks, inquiry inputs, 3–6 FAQs, relevant internal links, and an intent-matched CTA. Claims remain conditional and evidence-labeled; no unverified certificates, tests, prices, fixed lead times, customer results, capacity, brands, teams, leagues or numeric claims are introduced.

Certificates evidence uses three explicit tiers: currently verified evidence; project/order-dependent confirmation; and items requiring the buyer's market, product, and testing requirements before confirmation.

## Testing and delivery

TDD contracts first assert the current failures: certificates evidence tiers are absent; the two guide slugs do not resolve as canonical pages; Resources lacks their entries; H1, canonical, required schemas, and semantic links are absent. After implementation, the full existing gates plus Week 3 content, SEO, link, risk, browser, OpenNext, Wrangler, and Sanity read-only checks must pass before PR and controlled publish.