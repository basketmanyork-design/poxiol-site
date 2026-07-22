# POXIOL CMS Migration Report

## Scope

This checkpoint adds production CMS resolvers, route integration, Studio schema/structure fixes, and legacy fallback mappings. It does not run Seed, Dataset Import, publish documents, or deploy production.

## Legacy inventory target

The existing public site content inventory to preserve during CMS productionization is:

- Product categories: 12
- Case studies: 5
- FAQ entries: 32
- Articles / guides / resource pages: 27

## Preservation rules

- Existing public URLs remain unchanged.
- Slugs are preserved through resolver mapping and generated static params.
- SEO title, meta description, canonical URL, OG image, index status, and image alt fields are mapped where the CMS provides them.
- Legacy data remains available as field-level fallback when Sanity content is missing, unpublished, or temporarily unavailable.
- Sanity published content is the default production source. Sanity draft content is read only in `sanity-preview` mode with the server-only `SANITY_READ_TOKEN`.

## CMS document types connected

- `siteSettings`
- `navigationSettings`
- `footerSettings`
- `sitePage`
- `productCategory`
- `product`
- `caseStudy`
- `faqCategory`
- `faqItem`
- `article`
- `author`
- `redirectRule`

## Routes connected in this checkpoint

- `/`
- `/products/`
- `/products/[slug]/`
- `/projects/`
- `/projects/[slug]/`
- `/faq/`
- `/guides/`
- `/guides/[slug]/`
- `/resources/`
- `/resources/[slug]/`
- `/blog/`
- `/blog/[slug]/`
- `/about/`
- `/factory/`
- `/manufacturing/`
- `/quality-control-process/`
- `/customization/`
- `/contact/`
- `/oem-odm/`
- `/free-mockup/`
- `/sample-order/`
- `/get-quote/`

## Current checkpoint status

- Dataset Import: not executed
- Seed: not executed
- Production deploy: not executed
- Secret read/output: not performed
- Main branch modification: not performed
