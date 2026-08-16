# POXIOL Core Sports V1 Implementation Plan

## Scope

Establish Basketball, Soccer and Baseball as the only first-stage core sports without deleting or redirecting non-core pages. Upgrade the three owner URLs, homepage hierarchy, navigation, buyer-page context, internal links, AI-readable facts, analytics dimensions and public verified-evidence behavior.

## Planned files

- Shared data/types: `lib/core-sports.ts`
- Shared pillar UI: `components/core-sports/CoreSportLandingPage.tsx` and small reusable section components only where existing V8 components are insufficient
- Route adapters: basketball, soccer and existing baseball route page files
- Existing V8 data/compositions: homepage, buyer pages, FAQ and applicable component files
- SEO/navigation: sitemap, navigation, structured data or shared entity sources only when required
- AI/GEO: public AI summary/brand and llms sources only when factual consistency requires it
- Tests: a Core Sports source/output guard plus updates to existing guards where output behavior changes
- Reports: three required root documents and final audit report updates

## Shared data design

Each core sport record owns:

- id, label, priority and canonical path
- unique SEO title, description and H1
- primary/secondary keywords
- product system and buyer-fit cards
- customization, sample, production, QC, reorder and private-label facts
- intent-specific CTAs
- FAQs used by both visible UI and FAQPage JSON-LD
- approved PRODUCT_VISUALIZATION ids
- verified evidence page id (never bypassing the real-production policy)
- analytics sport and product-category values

## Component reuse

- Reuse `V8Hero`, `BuyerProblems`, `SolutionCards`, `DesignJourney`, `SampleApproval`, `ManufacturingTimeline`, `QualityControl`, `FAQSection`, `FinalCTA`, Product Visualization components and Real Production components.
- Keep Basketball-specific verified detail presentation where it already adds value.
- Use one configurable core-sport composition for Soccer and Baseball; avoid copied page implementations.
- Preserve CMS takeover by merging only approved code-owned core facts and retaining existing fields.

## Test-first sequence

1. Add source/output assertions for URL ownership, unique metadata/H1, basketball 301, sitemap ownership, no basketball residue on Soccer, complete Baseball scope, FAQ/schema single source, core navigation, buyer links, analytics dimensions, asset classifications and hidden zero-evidence behavior.
2. Run the new test and record the expected RED result.
3. Implement shared data and page composition.
4. Run focused checks until GREEN.
5. Run all V8, TypeScript, test, build, CMS, Studio, SEO, Legacy, Product Visualization and Real Production checks.
6. Build Preview and validate 1440/1280/390/375/360.

## Rollback

- All work remains isolated on `feature/core-sports-basketball-soccer-baseball-v1`.
- Before commit: revert only the listed Core Sports files with targeted patches.
- After commit but before merge: abandon the feature branch/PR; `main` remains unchanged.
- No data, CMS, remote history or Production environment is modified.

## Execution checkpoints

- Phase A: audit and URL/keyword map complete.
- Phase B: basketball consolidation and safety.
- Phase C: soccer commercial upgrade.
- Phase D: baseball commercial upgrade at the retained URL.
- Phase E: homepage/navigation hierarchy.
- Phase F: buyer/internal links and analytics.
- Phase G/H: guide and asset gap documentation.
- Phase I: full validation, commit, push, Preview and PR; stop before merge.
