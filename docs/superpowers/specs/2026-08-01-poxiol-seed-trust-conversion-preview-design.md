# POXIOL Seed–Trust–Conversion Preview Design

## Purpose

Create a traceable, draft-only Preview payload for U.S. youth travel basketball club buyers without changing production publishing, URLs, analytics, static export, or the established POXIOL visual language.

## Release Boundary

- Git branch: `preview/poxiol-seed-trust-conversion-20260801`
- Base: `main` at `55f490a0e782dfce44a85ca9c3fa83588fdcc026`
- Production publish: prohibited
- Remote push and pull request: prohibited
- Sanity writes: existing Draft documents only, guarded by `_rev`
- Sanity Releases: prohibited
- Published document mutation: prohibited
- Production remains `output: "export"` and continues reading Published content.

## Verified Source Audit

| Content | Current source | Preview treatment |
| --- | --- | --- |
| `3,000+ Teams Served` | Hardcoded in `app/page.tsx`; repeated in `lib/home-data.ts` fallback | Remove from Preview code and replace with `Custom Teamwear Production Support` |
| `KIAN ink` / `EPSON print heads` | Published `faq-58b766260485677a` | Retain Published unchanged; use existing safe Draft `drafts.faq-58b766260485677a` |
| Homepage `15–25 Days` | Homepage Sanity Published and Draft content section | Update only `drafts.691b156d8e3f49bd` to the approved `7–12 working days after sample or artwork approval` wording |
| Homepage layout and fallback | `app/page.tsx`, `lib/home-data.ts`, `getHomepageContent()` | Extend existing homepage layout; do not replace it with a generic template |
| Basketball decision content | `product-category-basketball-mvp` Draft plus `SportsLandingPage` | Extend existing reference-driven decision sections and keep `/products/basketball-uniforms/` |
| Customization | `23e722da0b66490c` Published/Draft and generic `CmsPageTemplate` | Add Draft process blocks and render the five-step approval flow |
| Quality Control | `82ca7167e20342ac` Published/Draft and generic `CmsPageTemplate` | Add Draft QC process/evidence blocks and render buyer-verifiable checks |
| Projects | Existing `caseStudy` documents and legacy routes | Reuse only existing routes and factual fields; show neutral evidence placeholders where assets are missing |
| Inquiry forms | `ContactForm`, `FreeMockupForm`, CMS contact settings | Preserve uploads, Formspree, WhatsApp, mailto, UTM and success/error states |

## Architecture

### 1. Draft Content Payload

Patch only these existing drafts with optimistic revision guards:

- `drafts.691b156d8e3f49bd` — Homepage
- `drafts.23e722da0b66490c` — Customization
- `drafts.82ca7167e20342ac` — Quality Control
- `drafts.product-category-basketball-mvp` — Basketball Category
- `drafts.faq-58b766260485677a` — risk FAQ, only if its revision and safe neutral answer need normalization

Each read occurs immediately before its guarded patch. The implementation records document ID, before revision, after revision, changed field paths, and timestamp. No new documents or Release objects are created.

### 2. Frontend Rendering

Keep existing components and add focused, reusable presentation units:

- `TrustProcessSection`: steps such as Logo → Design Preview → Sample → Approval → Bulk Production.
- `BuyerEvidenceGrid`: youth/adult sizing, names/numbers, QC and team-based packing.
- `ProjectEvidenceCard`: renders verified case fields and an explicit “project evidence pending approval” state when imagery or buyer facts are unavailable.
- Existing `SportsLandingPage` continues to render CMS product, FAQ, guide and case references.
- Existing homepage layout remains intact and gains seed/trust/conversion sections through resolved CMS content and safe fallback values.
- Existing generic core-page renderer gains only the section variants required by Customization and QC.

No component may render CMS, resolver, draft, fallback or implementation terminology to buyers.

### 3. Content Data Flow

- Production: `NEXT_PUBLIC_CONTENT_SOURCE=sanity`, Published perspective, existing cache/CDN policy.
- Preview build: `NEXT_PUBLIC_CONTENT_SOURCE=sanity-preview`, Draft perspective, `useCdn: false`, server-only `SANITY_READ_TOKEN`, no-store request policy.
- Legacy: existing fallback data, updated only to remove unverified claims and provide equivalent safe modules.
- Sanity request failure: existing field-level legacy fallback remains active.
- Browser code never accesses `SANITY_READ_TOKEN`.

### 4. Page Scope

#### Homepage

- H1: `Custom Basketball Uniforms for Growing Youth Clubs`
- Supporting statement: `Start with 1 Sample. Scale from One Roster to Every Team in Your Program.`
- CTAs: `Get a Free Mockup` and `Start with 1 Sample`
- Sections: One Club, Multiple Teams; Logo → Mockup → Sample; Youth and Adult Size Breakdown; Names and Numbers Check; Real Sample Evidence; Quality Control; Team-Based Packing; Projects; WhatsApp and inquiry CTA.
- Replace the unverified team-count metric with `Custom Teamwear Production Support`.

#### Basketball Uniforms

- Preserve route and existing decision-page structure.
- Add multi-team program procurement, mixed youth/adult sizes, personalization checks, mockup/sample approval, fabric/process guidance, QC/packing, verified references and dual conversion CTAs.

#### Customization

- Render Logo → Design Preview → Sample → Approval → Bulk Production as a CMS-driven process.

#### Quality Control

- Render fabric, print, size, logo, player-detail, color, finished-garment, team-packing and pre-shipment checks.

#### Projects

- Only existing case routes and verified local fields may be shown.
- Missing imagery, buyer authorization, order quantity or results produce a neutral placeholder and a report item, never an invented claim.

#### Free Mockup and Contact

- Preserve Logo File, Reference Design and Size Chart / Tech Pack upload behavior in the current public form.
- Preserve Formspree request construction, UTM fields, WhatsApp, mailto and success/error handling.
- Do not submit a real inquiry during validation.

## SEO, AEO and GEO Integrity

- Preserve canonical URLs and route structure.
- Use existing `generateMetadata` resolvers.
- Keep one visible H1 per page and logical H2/H3 hierarchy.
- Keep procurement standards as visible HTML.
- Visible FAQ content and FAQPage JSON-LD use the same resolved array.
- Preserve Organization, WebSite, Product, Service, FAQPage and BreadcrumbList schemas where currently applicable.
- New visible images require useful alt text; missing evidence images render no broken `<img>`.
- Sitemap includes Published/indexable routes only; Draft content does not add routes.
- Robots and `llms.txt` remain valid.

## Safety Rules

- Prohibit third-party brands, professional league names/logos and official partnership implications in the Preview output.
- Prohibit invented clients, order counts, certifications, test reports, manufacturing equipment and result metrics.
- Prohibit `3,000+ Teams Served`, `KIAN ink`, `EPSON print heads`, and the Homepage `15–25 Days` wording in Preview HTML and JSON-LD.
- Approved procurement values remain: MOQ 1 set, sample production 2–3 working days after mockup approval, bulk production 7–12 working days after sample or artwork approval, inspection before shipment, size tolerance ±2 cm.

## Testing Strategy

Write failing contract tests before production edits. Tests cover:

1. Preview copy and forbidden-claim absence.
2. Draft document ID allowlist and Revision Guard enforcement.
3. Homepage/Basketball/Customization/QC section rendering contracts.
4. Projects placeholder behavior when evidence assets are missing.
5. ContactForm file inputs, Formspree attachments, UTM, WhatsApp and mailto contracts.
6. Metadata, canonical, JSON-LD, sitemap, robots and `llms.txt` integrity.
7. Analytics loader and event contracts remain unchanged.
8. Browser bundle does not contain `SANITY_READ_TOKEN` or any credential value.

Final verification runs TypeScript, Next.js build in `sanity-preview`, Studio TypeScript, schema validation, Studio build, lint/test where available, `git diff --check`, static HTML scans, rendered-page scans and local browser smoke tests.

## Preview Delivery

The payload is delivered as:

- Local branch and full commit hash.
- Draft document ID and revision ledger.
- Local Preview command using environment variables without printing token values.
- `docs/POXIOL_SEED_TRUST_CONVERSION_SOURCE_AUDIT.md`.
- `docs/POXIOL_SEED_TRUST_CONVERSION_PREVIEW_VALIDATION.md`.
- Missing-evidence asset list.

No remote branch, PR, Cloudflare deployment or Production/Sanity publish occurs.
