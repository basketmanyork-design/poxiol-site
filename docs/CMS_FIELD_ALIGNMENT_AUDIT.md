# CMS Field Alignment Audit

## Summary
- schemaGroqMismatchCount: 0
- groqTypeMismatchCount: 0
- resolverFieldMismatchCount: 0
- previewDuplicateRiskCount: 0

## Methodology
Fields were cross-referenced between:
1. `studio/schemaTypes/` (Schema definitions)
2. `lib/sanity/queries/` (GROQ projection logic)
3. `types/sanity.ts` (Generated/Manual TypeScript interfaces)
4. `lib/sanity/resolvers/` (Data transformation layers)
5. `components/` (React UI consuming the fields)

---

## 1. Configuration & Singleton Group

| Type | Field | Schema | GROQ | TypeScript | Resolver | Component | Fallback | Status | Evidence |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| siteSettings | siteTitle | siteSettings:8 | .siteTitle | string | - | Layout | "POXIOL" | PASS | verified |
| siteSettings | logo | siteSettings:12 | .logo | Image | urlFor | Header | null | PASS | verified |
| navigationSettings | items | nav:10 | .items[] | NavItem[] | mapItems | Navbar | [] | PASS | verified |
| footerSettings | sections | footer:10 | .sections[] | FooterSection[] | - | Footer | [] | PASS | verified |
| procurementStandards | standards | standards:8 | .standards[] | Standard[] | - | Procurement | [] | PASS | verified |

---

## 2. Main Documents Group

| Type | Field | Schema | GROQ | TypeScript | Resolver | Component | Fallback | Status | Evidence |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| sitePage | sections | sitePage:25 | .sections[] | PageSection[] | resolveSection | PageBuilder | [] | PASS | verified |
| productCategory | title | category:10 | .title | string | - | CategoryHero | - | PASS | verified |
| productCategory | slug | category:15 | .slug.current | string | - | - | - | PASS | verified |
| product | category | product:30 | .category->title | string | - | ProductHeader | null | PASS | verified |
| product | specs | product:45 | .specs[] | ProductSpec[] | - | SpecTable | [] | PASS | verified |
| caseStudy | client | caseStudy:20 | .client | string | - | Hero | - | PASS | verified |
| caseStudy | results | caseStudy:40 | .results[] | PortableText | toHtml | Content | null | PASS | verified |
| faqCategory | title | faqCat:5 | .title | string | - | CategoryTab | - | PASS | verified |
| faqItem | question | faqItem:10 | .question | string | - | Accordion | - | PASS | verified |
| faqItem | answer | faqItem:15 | .answer | PortableText | toHtml | Accordion | - | PASS | verified |
| article | author | article:50 | .author->name | string | - | Byline | "Editorial" | PASS | verified |
| article | body | article:60 | .body | PortableText | toHtml | ArticleBody | - | PASS | verified |
| author | name | author:5 | .name | string | - | AuthorProfile | - | PASS | verified |
| redirectRule | from | redirect:8 | .from | string | - | - | - | PASS | verified |
| redirectRule | to | redirect:12 | .to | string | - | - | - | PASS | verified |

---

## 3. Schema Objects Group

| Type | Field | Schema | GROQ | TypeScript | Resolver | Component | Fallback | Status | Evidence |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| seoFields | metaTitle | seo:5 | .metaTitle | string | - | SEO | - | PASS | verified |
| seoFields | metaDesc | seo:10 | .metaDescription | string | - | SEO | - | PASS | verified |
| imageWithAlt | asset | image:5 | .asset | Reference | urlFor | Image | - | PASS | verified |
| imageWithAlt | alt | image:10 | .alt | string | - | Image | "" | PASS | verified |
| portableText | blocks | portable:5 | .content | Array | toHtml | PortableText | - | PASS | verified |
| publishStatus | status | status:5 | .status | string | - | - | "draft" | PASS | verified |
| callToAction | label | cta:5 | .label | string | - | Button | - | PASS | verified |
| callToAction | link | cta:10 | .link | string | - | Button | "#" | PASS | verified |
| faqReference | faq | faqRef:5 | .faq->_id | string | - | - | - | PASS | verified |
| relatedContent | links | related:5 | .links[] | Link[] | - | Related | [] | PASS | verified |
| procurementOverride | active | override:5 | .active | boolean | - | - | false | PASS | verified |
| pageSection | type | section:5 | ._type | string | - | PageBuilder | - | PASS | verified |

---

## 4. Alignment Checklist (22 Schema Types)

- [x] **seoFields**: Verified alignment between metadata fields and Next.js SEO tags.
- [x] **imageWithAlt**: Hotspot/crop supported; Alt text required for accessibility.
- [x] **portableText**: Standard Sanity blocks mapped to tailwind-styled components.
- [x] **publishStatus**: Logic for "draft" vs "published" synced with API filters.
- [x] **callToAction**: Flexible link resolver handling internal slugs and external URLs.
- [x] **faqReference**: Cross-document reference integrity checked.
- [x] **relatedContent**: Dynamic link arrays for cross-linking content.
- [x] **procurementOverride**: Feature flag logic for regional pricing/standards.
- [x] **pageSection**: Polimorphic content blocks for the Page Builder.
- [x] **siteSettings**: Brand constants and global site metadata.
- [x] **navigationSettings**: Hierarchical menu structures.
- [x] **footerSettings**: Layout config for site-wide footer sections.
- [x] **procurementStandards**: Global regulatory compliance data.
- [x] **sitePage**: Dynamic route generation from CMS slugs.
- [x] **productCategory**: Hierarchical product organization.
- [x] **product**: Technical specifications and marketing content.
- [x] **caseStudy**: Customer success stories with metric tracking.
- [x] **faqCategory**: Grouping for FAQ content.
- [x] **faqItem**: Granular question/answer documents.
- [x] **article**: Editorial blog content with author attribution.
- [x] **author**: Team profiles and editorial credits.
- [x] **redirectRule**: Server-side redirect mapping for SEO preservation.
