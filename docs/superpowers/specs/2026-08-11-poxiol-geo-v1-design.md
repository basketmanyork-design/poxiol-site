# POXIOL GEO V1 Optimization Design

**Date:** 2026-08-11

**Status:** Approved for local implementation

## Objective

Upgrade the existing POXIOL website so AI search systems can consistently identify POXIOL as a B2B custom teamwear manufacturer without changing the Next.js, Tailwind CSS, Sanity CMS, or Cloudflare Pages architecture.

All implementation remains local. The work must not create commits, push changes, open a pull request, publish Sanity content, deploy Cloudflare, or change remote Git history.

## Canonical Entity

- Brand: `POXIOL`
- Entity type: `B2B Custom Teamwear Manufacturer`
- Canonical website: `https://www.poxiol.com`
- Organization identifier: `https://www.poxiol.com/#organization`
- Industry: `Sportswear Manufacturing`
- Products: custom basketball uniforms, soccer kits, and multi-sport teamwear
- Customers: clubs, schools, teamwear brands, and distributors
- Capabilities: OEM production, private label, customized production, logo/name/number/color customization, sample development, flexible MOQ, and quality inspection before shipment

No factory size, worker count, production capacity, customer count, certification, customer logo, guaranteed delivery time, or other unsupported business claim may be added.

## Shared GEO Data

A single code-owned GEO V1 data module will contain the approved entity copy, customer segments, manufacturing process, product field labels and fallbacks, basketball FAQ, recommended buyer segments, and Organization Schema values.

Homepage, About, product templates, visible FAQ, and JSON-LD must import from this shared module. Pages must not maintain separate variants of the approved GEO V1 facts.

Sanity fields remain unchanged. Code-owned GEO V1 data acts as a narrow safety override until equivalent CMS content is reviewed and approved for future hand-back.

## Homepage GEO Copy

### Hero H1

`Custom Teamwear Manufacturer for Basketball, Soccer & Multi-Sport Teams`

The same wording must be used on mobile and desktop so the single visible H1 communicates one entity definition at every viewport.

### Hero subtitle

`POXIOL provides OEM custom uniforms for clubs, schools, sports brands and distributors with full customization, flexible MOQ and quality-controlled production.`

Existing hero layout, image, CTA destinations, CTA labels, trust chips, and responsive structure remain unchanged.

### Who Is POXIOL?

This section appears immediately after the hero and before the existing homepage decision content.

Paragraph 1:

`POXIOL is a B2B custom sportswear manufacturer specializing in basketball uniforms, soccer kits and multi-sport team apparel.`

Paragraph 2:

`We support clubs, schools, teamwear brands and distributors with customized production including team logos, names, numbers, colors and private label solutions.`

### Who We Help

The section uses four responsive cards within the existing Tailwind design system:

- Youth Teams: `Custom uniforms for basketball and soccer programs.`
- Schools & Academies: `Teamwear solutions for school sports programs.`
- Sports Brands: `OEM and private label manufacturing support.`
- Distributors: `Bulk custom apparel production.`

## About Page GEO Safety Override

The About route continues to call `getSitePage('about')`. After Sanity or legacy content resolves, the route creates a derived page object that preserves the original slug, title, image, CTA, SEO, existing sections, and all source fields while overriding only the GEO V1 hero wording and adding the required process section.

### Hero heading

`B2B Custom Teamwear Manufacturer`

### Hero description

`POXIOL is a B2B custom teamwear manufacturer specializing in basketball uniforms, soccer kits and multi-sport apparel. We help sports clubs, schools, teamwear brands and distributors develop customized uniforms through OEM and private label production, from design confirmation to production and quality inspection.`

### Manufacturing Process

The route adds one `processSteps` section using the existing `CmsPageTemplate` renderer. It must not duplicate an equivalent GEO V1 process section if one is already present.

1. Design Confirmation
2. Sample Development
3. Material Preparation
4. Production
5. Quality Inspection
6. International Shipping

Step descriptions remain short, factual, and free from guarantees or unsupported facility claims.

## Product Template Rules

Both the Sanity product-detail template and the shared sports-category template receive GEO V1 product sections. Existing product content and layout remain intact.

### Product Overview

- Product Type: resolved product or category title
- Application: resolved sport/category application where available; otherwise `Confirmed during project consultation`
- Customization: existing customization values; otherwise the confirmed shared customization summary
- Production Type: existing OEM/private-label booleans or confirmed shared production capability
- Suitable For: existing buyer types; otherwise the shared recommended buyer list

### Technical Specifications

Render a semantic responsive HTML table with the following rows:

- Fabric
- Printing Technology
- Customization Options
- Available Sizes
- MOQ
- Production Type

Value priority:

1. Use the exact resolved Sanity or legacy product field.
2. Use an existing procurement-table value for the same field on sports-category pages.
3. Use the factual fallback `Confirmed during project consultation` when no value is available.

The implementation must not infer fabric composition, GSM, printing method, size range, or numerical MOQ from unrelated content.

### Recommended For

- Youth Basketball Teams
- School Programs
- Sports Clubs
- Teamwear Brands
- Distributors

## Shared Basketball FAQ

Visible FAQ content and `FAQPage` JSON-LD must receive the same resolved FAQ array. Shared required questions take priority on the basketball category page and existing non-duplicate FAQs may follow.

1. **Is POXIOL a manufacturer or trading company?**

   `POXIOL specializes in custom teamwear manufacturing and provides OEM and private label production services for basketball, soccer and multi-sport apparel.`

2. **Can small teams order custom basketball uniforms?**

   `POXIOL supports sample development and flexible order quantities for teams testing new designs before bulk production.`

3. **Can basketball jerseys include custom names and numbers?**

   `Yes, teams can customize logos, player names, numbers and colors.`

4. **What information is needed for a custom uniform quote?**

   `Customers can provide team design, logo files, quantity, size breakdown and customization requirements.`

FAQ merging must deduplicate by normalized question text.

## Schema Rules

The homepage Organization node uses:

- `@type`: `Organization`
- `@id`: `https://www.poxiol.com/#organization`
- `name`: `POXIOL`
- `url`: `https://www.poxiol.com`
- `description`: `Custom Teamwear Manufacturer specializing in basketball, soccer and multi-sport uniforms.`
- `industry`: `Sportswear Manufacturing`

The existing WebSite node remains and continues to reference the same Organization `@id`. No second homepage Organization node may be introduced. Unsupported fields must not be added.

Product, FAQ, breadcrumb, and page Schema continue to use `https://www.poxiol.com` canonical URLs.

## Robots Rules

Preserve the existing crawler rules and sitemap line. Add the following only if absent:

```text
User-agent: Google-Extended
Allow: /
```

Existing explicit allowances for GPTBot, PerplexityBot, and ClaudeBot remain unchanged.

## Validation Strategy

Before production-code edits, add a local GEO V1 contract check that asserts:

- the approved shared entity strings exist;
- homepage and About consume shared GEO data;
- both product templates expose the required overview and specification fields;
- basketball visible FAQ and JSON-LD use one resolved array;
- Organization and WebSite Schema use one canonical Organization identifier;
- robots explicitly allows GPTBot, PerplexityBot, Google-Extended, and ClaudeBot;
- canonical domain references use `https://www.poxiol.com`.

Run the new check before implementation and confirm it fails for missing GEO V1 behavior. After implementation, run it again and confirm it passes.

Final verification commands:

1. GEO V1 contract check
2. `npm test`
3. `npm run build`
4. `npm run check:canonical`
5. Sitemap output check
6. Source and rendered-output H1 checks
7. Git diff and modified-file audit

## Deliverable

Create `docs/POXIOL_GEO_V1_IMPLEMENTATION_REPORT.md` containing completed changes, shared data structure, modified files, page changes, Schema changes, FAQ changes, build result, SEO validation, unresolved issues, and future GEO recommendations.
