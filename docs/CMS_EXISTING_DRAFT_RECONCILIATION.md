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
- create_new_draft: 80
- duplicate_existing: 0
- obsolete_mvp_candidate: 10
- corrupted_existing: 5
- manual_review: 25

## Existing Data Problems

- 5 caseStudy draft titles contain `U+9225? mojibake marker`.
- The same 5 caseStudy drafts are missing valid slug values.
- These are marked only. No draft was discarded, patched, deleted, or published.

## MVP Draft Review

- `article-mvp`: duplicates formal candidate: false; independent valid content: false; recommendation: manual review, then merge or discard only after explicit approval; current action: none; automatic operation forbidden
- `author-mvp`: duplicates formal candidate: false; independent valid content: false; recommendation: manual review, then merge or discard only after explicit approval; current action: none; automatic operation forbidden
- `case-study-mvp`: duplicates formal candidate: false; independent valid content: false; recommendation: manual review, then merge or discard only after explicit approval; current action: none; automatic operation forbidden
- `product-basketball-mvp`: duplicates formal candidate: true; independent valid content: false; recommendation: manual review, then merge or discard only after explicit approval; current action: none; automatic operation forbidden
- `product-soccer-mvp`: duplicates formal candidate: true; independent valid content: false; recommendation: manual review, then merge or discard only after explicit approval; current action: none; automatic operation forbidden
- `product-category-basketball-mvp`: duplicates formal candidate: true; independent valid content: false; recommendation: manual review, then merge or discard only after explicit approval; current action: none; automatic operation forbidden
- `product-category-soccer-mvp`: duplicates formal candidate: true; independent valid content: false; recommendation: manual review, then merge or discard only after explicit approval; current action: none; automatic operation forbidden
- `faq-moq-mvp`: duplicates formal candidate: true; independent valid content: false; recommendation: manual review, then merge or discard only after explicit approval; current action: none; automatic operation forbidden
- `faq-sample-mvp`: duplicates formal candidate: true; independent valid content: false; recommendation: manual review, then merge or discard only after explicit approval; current action: none; automatic operation forbidden
- `faq-shipping-mvp`: duplicates formal candidate: true; independent valid content: false; recommendation: manual review, then merge or discard only after explicit approval; current action: none; automatic operation forbidden

## Schema Registry Status

Sanity project `oqpv1xbc` currently has a hosted Studio, but Schema Registry has not been confirmed as deployed for this local schema. Do not use MCP schema deployment for this repository. After explicit future approval, schema deployment should be performed from the approved local Studio commit with:

```bash
npx sanity@latest schema deploy
```

Before importing content, confirm Schema Registry can read the schema, Studio is built from the approved commit, every planned type is registered, and Studio/GROQ/frontend fields match.
