# POXIOL Existing Sanity Draft Reconciliation

This report records the existing production dataset state from the prior read-only audit supplied for Checkpoint C. This checkpoint does not query Sanity, read tokens, create documents, patch documents, delete drafts, publish, upload assets, run Seed, run Dataset Import, deploy schema, deploy Studio, or modify Cloudflare.

Project: `oqpv1xbc`
Dataset: `production`

## Existing Draft Inventory

| Type | Draft count |
| --- | ---: |
| article | 1 |
| author | 1 |
| caseStudy | 6 |
| faqCategory | 9 |
| faqItem | 34 |
| procurementStandards | 1 |
| product | 2 |
| productCategory | 2 |
| siteSettings | 1 |

Total existing business drafts: 57

## Existing Published Inventory

Published business document count: 0

## Matching Rules

- Singleton: fixed ID match.
- Product Category: normalized slug.
- Product: normalized slug.
- Article: slug + articleType.
- FAQ Category: normalized slug.
- FAQ Item: normalized question text hash.
- Case Study: slug first, then legacy source key, then normalized title/country/product.
- Author: normalized name.

## Processing Classification

- reuse_existing_draft: 2
- update_existing_draft: 40
- create_new_draft: 79
- duplicate_existing: 0
- obsolete_mvp_candidate: 10
- corrupted_existing: 5
- corruptedExistingWithoutPlan: 0
- obsoleteMvpWithoutDecision: 0
- manual_review: 19

## Existing Data Problems

- 5 caseStudy draft titles contain `U+9225? mojibake marker`.
- The same 5 caseStudy drafts are missing valid slug values.
- These are marked only. No draft was discarded, patched, deleted, or published.

## Corrupted Case Study Draft Plan

- Corrupted draft group 1: formal candidate `caseStudy.usa-basketball-academy-uniform-program`; correct title `USA Basketball Academy Uniform Program`; correct slug `usa-basketball-academy-uniform-program`; classification `update_existing_draft`; future action: fix mojibake title and missing slug during approved draft migration only; current action: no Patch.
- Corrupted draft group 2: formal candidate `caseStudy.australia-soccer-club-home-away-kit-launch`; correct title `Australia Soccer Club Home and Away Kit Launch`; correct slug `australia-soccer-club-home-away-kit-launch`; classification `update_existing_draft`; future action: fix mojibake title and missing slug during approved draft migration only; current action: no Patch.
- Corrupted draft group 3: formal candidate `caseStudy.canada-school-multi-sport-teamwear-rollout`; correct title `Canada School Multi-sport Teamwear Rollout`; correct slug `canada-school-multi-sport-teamwear-rollout`; classification `update_existing_draft`; future action: fix mojibake title and missing slug during approved draft migration only; current action: no Patch.
- Corrupted draft group 4: formal candidate `caseStudy.middle-east-club-event-fast-turnaround-program`; correct title `Middle East Club Event Fast-turnaround Program`; correct slug `middle-east-club-event-fast-turnaround-program`; classification `update_existing_draft`; future action: fix mojibake title and missing slug during approved draft migration only; current action: no Patch.
- Corrupted draft group 5: formal candidate `caseStudy.distributor-private-label-teamwear-supply-program`; correct title `Distributor Private Label Teamwear Supply Program`; correct slug `distributor-private-label-teamwear-supply-program`; classification `update_existing_draft`; future action: fix mojibake title and missing slug during approved draft migration only; current action: no Patch.

corruptedExistingWithoutPlan: 0

## MVP Draft Review

- `article-mvp`: replaced by formal candidate key: manual article/author/case-study candidate review; duplicates formal candidate: false; independent valid content: false; recommended action: replace_then_discard; restriction: Only discard after backup, draft import, Preview acceptance, and explicit human approval.; current action: none; automatic operation forbidden
- `author-mvp`: replaced by formal candidate key: manual article/author/case-study candidate review; duplicates formal candidate: false; independent valid content: false; recommended action: replace_then_discard; restriction: Only discard after backup, draft import, Preview acceptance, and explicit human approval.; current action: none; automatic operation forbidden
- `case-study-mvp`: replaced by formal candidate key: manual article/author/case-study candidate review; duplicates formal candidate: false; independent valid content: false; recommended action: replace_then_discard; restriction: Only discard after backup, draft import, Preview acceptance, and explicit human approval.; current action: none; automatic operation forbidden
- `product-basketball-mvp`: replaced by formal candidate key: product-or-category basketball formal candidate; duplicates formal candidate: true; independent valid content: false; recommended action: merge_then_discard; restriction: Only discard after backup, draft import, Preview acceptance, and explicit human approval.; current action: none; automatic operation forbidden
- `product-soccer-mvp`: replaced by formal candidate key: product-or-category soccer formal candidate; duplicates formal candidate: true; independent valid content: false; recommended action: merge_then_discard; restriction: Only discard after backup, draft import, Preview acceptance, and explicit human approval.; current action: none; automatic operation forbidden
- `product-category-basketball-mvp`: replaced by formal candidate key: product-or-category basketball formal candidate; duplicates formal candidate: true; independent valid content: false; recommended action: merge_then_discard; restriction: Only discard after backup, draft import, Preview acceptance, and explicit human approval.; current action: none; automatic operation forbidden
- `product-category-soccer-mvp`: replaced by formal candidate key: product-or-category soccer formal candidate; duplicates formal candidate: true; independent valid content: false; recommended action: merge_then_discard; restriction: Only discard after backup, draft import, Preview acceptance, and explicit human approval.; current action: none; automatic operation forbidden
- `faq-moq-mvp`: replaced by formal candidate key: faq formal candidate; duplicates formal candidate: true; independent valid content: false; recommended action: merge_then_discard; restriction: Only discard after backup, draft import, Preview acceptance, and explicit human approval.; current action: none; automatic operation forbidden
- `faq-sample-mvp`: replaced by formal candidate key: faq formal candidate; duplicates formal candidate: true; independent valid content: false; recommended action: merge_then_discard; restriction: Only discard after backup, draft import, Preview acceptance, and explicit human approval.; current action: none; automatic operation forbidden
- `faq-shipping-mvp`: replaced by formal candidate key: faq formal candidate; duplicates formal candidate: true; independent valid content: false; recommended action: merge_then_discard; restriction: Only discard after backup, draft import, Preview acceptance, and explicit human approval.; current action: none; automatic operation forbidden

## Schema Registry Status

Sanity project `oqpv1xbc` currently has a hosted Studio, but Schema Registry has not been confirmed as deployed for this local schema. Do not use MCP schema deployment for this repository. After explicit future approval, schema deployment should be performed from the approved local Studio commit with:

```bash
npx sanity@latest schema deploy
```

Before importing content, confirm Schema Registry can read the schema, Studio is built from the approved commit, every planned type is registered, and Studio/GROQ/frontend fields match.
