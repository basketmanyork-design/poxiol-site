# POXIOL Buyer Decision Clarity Design

Date: 2026-08-05
Status: Approved for inline execution by the task brief
Production baseline: `6ae232183dda15871df8265015432d5e07192333`

## Objective

Make the public site answer nine buyer questions without requiring a visitor to assemble the answer across many pages: who POXIOL is, what it supplies, whether the product and process are credible, how pricing is formed, how quality is checked, how production/shipping/issues are handled, what evidence exists, why POXIOL is trustworthy, and what action to take next.

The implementation must not invent prices, capacity, years in business, customers, results, certifications, refund policies, delivery guarantees, or case-study evidence.

## Baseline

- Production sitemap: 91 URLs; HTTP, canonical, H1, JSON-LD, image and UTF-8 audits currently pass.
- Homepage H1 is basketball-specific, so the brand appears narrower than its actual multi-sport offer.
- Pricing inputs and quote contents are not presented as one buyer-facing decision module.
- Quality checks exist, but post-delivery issue reporting and written resolution steps are not consolidated.
- No `/shipping-after-sales/` route exists.
- Projects mix legacy case-study records with incomplete evidence metadata. Missing `realOrExample` and `evidenceStatus` currently fall back to `example`, but buyer authorization and evidence notes are not modeled.
- About and Manufacturing expose unsupported `15+ years`, `30,000+ units monthly`, and `50+ countries` claims through Published content or fallback rows.
- A public FAQ asserts that slow sample production may indicate subcontracting; this is not supported and must be neutralized.
- CTA labels include `Talk to POXIOL`, `Request Quote`, `Start Custom Order`, and `Start My Request` in addition to the desired labels.
- Forms, upload fields, GA4/UTM, Formspree, WhatsApp and mailto are working and must be preserved.

## Approaches Considered

### A. Broad CMS-first rewrite

Patch every related site page, FAQ and case-study Draft, then publish all of them. This gives editors maximum ownership but creates a large Revision Guard and review surface across dozens of existing Drafts, some of which contain unrelated edits. Rejected as unnecessarily risky.

### B. Code-only normalization

Render all decision content from code and sanitize CMS output at runtime. This is safest for deployment but disconnects important commercial content from the existing editorial model. Rejected as the sole approach.

### C. Hybrid safety layer — selected

Use focused code modules, templates, schema guards and tests for long-lived invariants, while applying narrowly scoped Draft patches only where the CMS is the authoritative page source. This keeps the public output safe even when older CMS data exists, limits write scope, and preserves editorial ownership for key brand pages.

## Architecture

### 1. Shared buyer-decision content

Create a typed code module for:

- homepage decision sequence;
- pricing factors and quote expectations;
- quality and issue-reporting steps;
- shipping/after-sales content;
- the ten buyer FAQs;
- approved CTA labels;
- evidence-status labels and neutral placeholders.

The module contains only evidence-backed or conditional wording. It does not contain fixed prices, customer results, capacity or refund promises.

### 2. Homepage composition

Keep the existing Sanity resolver and media, but normalize the brand-level identity and render an explicit sequence:

1. Who We Are
2. What We Make
3. How Pricing Works
4. Sample and Quality Approval
5. Production and Shipping
6. Project Evidence
7. Why POXIOL
8. Final CTA

The H1 becomes `Factory-Direct Custom Teamwear for Clubs, Schools and Sportswear Brands`. The product list explicitly includes basketball uniforms, soccer kits, training wear and private-label teamwear. The basketball product page remains basketball-specific.

### 3. Pricing and issue handling

`How Pricing Works` lists the seven permitted quote inputs and explains that the buyer receives an itemized quotation. Sample fees, shipping and assumptions are confirmed before payment. No public timing promise is added unless supported by current verified content.

The issue workflow requests an order reference, affected quantity, clear photos/videos and package labels, then compares the issue against approved records and confirms a project-specific resolution in writing. It does not promise refunds, replacements or compensation.

### 4. Shipping/after-sales page

Add a code-owned `/shipping-after-sales/` page using the shared content module. It receives one visible H1, self-canonical metadata, breadcrumb JSON-LD, sitemap inclusion, production planning, shipping selection, destination confirmation, tracking updates, conditional customs/duties wording, delivery reporting, issue review and a contact CTA.

Verified timing may state bulk production commonly takes 7–12 working days after approval and express delivery commonly takes 3–7 business days depending on destination and carrier. No Air/Sea or Incoterms promise is added without source evidence.

### 5. Evidence model

Extend the case-study schema and CMS type with:

- evidence status;
- buyer authorization status;
- approved-image status;
- evidence note;
- verified process;
- verifiable result statement.

The mapper treats any record without both public evidence and buyer authorization as an `Example Scenario`, suppresses unsupported result/testimonial claims, and uses `Project imagery pending verification` when no approved public image is available. Existing records are not mutated or published in this task.

### 6. FAQ single source

Expose the ten decision FAQs from one resolver result. The visible FAQ page and `FAQPage` JSON-LD are generated from the same resolved groups. The homepage uses the same decision FAQ subset. The unsupported subcontracting statement is replaced with neutral sample-planning language.

### 7. CTA normalization

Normalize navigational actions without changing their destinations or analytics behavior:

- Primary: `Get a Free Mockup`
- Secondary: `Talk to a Teamwear Specialist`
- Product tertiary: `Start with 1 Sample`

Form-submit labels remain task-specific where changing them would reduce clarity. All WhatsApp, mailto, Formspree, upload and tracking attributes remain intact.

## CMS Write Boundary

Candidate task Drafts are limited to:

- existing `drafts.67d89e7018894286` — Manufacturing;
- existing `drafts.a01d7979a987463a` — About;
- existing `drafts.d17c91e8e04842c4` — Contact, to remove unsupported response timing and the unverified brand-domain email.

Homepage brand positioning, the buyer-decision sequence and the Quality Control issue workflow are implemented in the code-owned safety layer. No new Draft is created merely to duplicate those deterministic safeguards.

Every mutation uses the freshly read Draft or Published revision as `ifRevisionID`. Published writes remain zero until Preview, CI, merge and Production code deployment pass. Sanity Release remains zero. No FAQ, case-study, asset or unrelated Draft is published.

If write access is unavailable, code delivery continues and the workflow stops precisely at the Sanity publish boundary.

## Data Flow

1. Build selects Published or Draft perspective through the existing server-only Sanity request policy.
2. `getHomepageContent`, `getSitePage`, `getFaqGroups` and `getProjects` map CMS content into typed public models.
3. The buyer-decision safety layer normalizes unsupported claims, CTA labels and evidence status.
4. React pages render visible content and JSON-LD from the same resolved objects.
5. Static export and audits validate the exact rendered HTML before any publish or deployment step.

## Error and Safety Handling

- Missing CMS content falls back to safe code-owned content.
- Draft Preview must prove `perspective=drafts`, `useCdn=false` and real Sanity resolution rather than fallback.
- Revision mismatch aborts all remaining mutations or publishes.
- Missing evidence produces a neutral placeholder, never synthetic proof.
- Risk scans block unsupported claims and unauthorized third-party names.
- Existing Cloudflare Pages Git integration remains unchanged; Workers Builds are not restored.

## Testing Strategy

Start with a failing buyer-decision integrity test that checks homepage decision sections, the new shipping page, CTA labels, unsupported claims, evidence labels, FAQ/JSON-LD source consistency, sitemap inclusion, token isolation, canonical and H1 rules.

Then run the existing unit/contracts suite, Published and real Draft Preview builds, Studio type/schema/build checks, analytics, sitemap/canonical/H1/JSON-LD, UTF-8, risk, broken-image and browser checks. Forms and link targets are asserted without submitting a real inquiry.

## Success Criteria

- The nine buyer questions have explicit, visible answers.
- Homepage is brand-level; basketball landing remains vertical.
- No unsupported strong claim or supplier accusation remains public.
- `/shipping-after-sales/` is indexable and technically valid.
- Projects cannot be represented as verified without required evidence and authorization.
- CTA vocabulary is consistent without breaking destinations or tracking.
- Published writes occur only after all Preview and code gates pass, and only for the locked task Draft set.
- Production audits remain zero for canonical/H1/JSON-LD, risk terms, mojibake and broken images.

## Explicit Gaps

- Buyer-authorized project photos and public result evidence.
- Internal source records for years in business and monthly capacity.
- Written refund, replacement, compensation and claim-window policies.
- Written customs/duties and Incoterms responsibility policy.
- Verified brand-domain email; existing `@basketman.cn` address remains in use until operations provides a replacement.
