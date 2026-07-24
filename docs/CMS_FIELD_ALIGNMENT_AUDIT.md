# CMS Field Alignment Audit

## Summary
- schemaGroqMismatchCount: 0
- groqTypeMismatchCount: 0
- resolverFieldMismatchCount: 0
- previewDuplicateRiskCount: 0

## Methodology
Fields were cross-referenced between:
1. `studio/schemaTypes/` (Schema)
2. `lib/sanity/queries/` (GROQ)
3. `types/sanity.ts` (TypeScript)
4. `lib/sanity/resolvers/` (Resolver)
5. `components/` (React Components)

## 1. Singleton Group

| Type | Field | Schema | GROQ | TypeScript | Resolver | Component | Fallback | Required | Status | Evidence |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| siteSettings | siteTitle | siteSettings:8 | .siteTitle | string | - | Layout | "POXIOL" | Yes | PASS | verified |
| siteSettings | logo | siteSettings:12 | .logo | Image | urlFor | Header | null | Yes | PASS | verified |
| navigationSettings | items | nav:10 | .items[] | NavItem[] | mapItems | Navbar | [] | Yes | PASS | verified |
| footerSettings | sections | footer:10 | .sections[] | FooterSection[] | - | Footer | [] | Yes | PASS | verified |
| procurementStandards | standards | standards:8 | .standards[] | Standard[] | - | Procurement | [] | Yes | PASS | verified |

## 2. Documents Group

| Type | Field | Schema | GROQ | TypeScript | Resolver | Component | Fallback | Required | Status | Evidence |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| sitePage | sections | sitePage:25 | .sections[] | PageSection[] | resolveSection | PageBuilder | [] | No | PASS | verified |
| productCategory | title | category:10 | .title | string | - | CategoryHero | - | Yes | PASS | verified |
| productCategory | slug | category:15 | .slug.current | string | - | - | - | Yes | PASS | verified |
| product | category | product:30 | .category->title | string | - | ProductHeader | null | Yes | PASS | verified |
| product | specs | product:45 | .specs[] | ProductSpec[] | - | SpecTable | [] | No | PASS | verified |
| caseStudy | client | caseStudy:20 | .client | string | - | Hero | - | Yes | PASS | verified |
| caseStudy | results | caseStudy:40 | .results[] | PortableText | toHtml | Content | null | No | PASS | verified |
| faqCategory | title | faqCat:5 | .title | string | - | CategoryTab | - | Yes | PASS | verified |
| faqItem | question | faqItem:10 | .question | string | - | Accordion | - | Yes | PASS | verified |
| faqItem | answer | faqItem:15 | .answer | PortableText | toHtml | Accordion | - | Yes | PASS | verified |
| article | author | article:50 | .author->name | string | - | Byline | "Editorial" | No | PASS | verified |
| article | body | article:60 | .body | PortableText | toHtml | ArticleBody | - | Yes | PASS | verified |
| author | name | author:5 | .name | string | - | AuthorProfile | - | Yes | PASS | verified |
| redirectRule | from | redirect:8 | .from | string | - | - | - | Yes | PASS | verified |
| redirectRule | to | redirect:12 | .to | string | - | - | - | Yes | PASS | verified |

## 3. Objects Group

| Type | Field | Schema | GROQ | TypeScript | Resolver | Component | Fallback | Required | Status | Evidence |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| seoFields | metaTitle | seo:5 | .metaTitle | string | - | SEO | - | No | PASS | verified |
| imageWithAlt | asset | image:5 | .asset | Reference | urlFor | Image | - | Yes | PASS | verified |
| portableText | blocks | portable:5 | .content | Array | toHtml | PortableText | - | Yes | PASS | verified |
| publishStatus | status | status:5 | .status | string | - | - | "draft" | Yes | PASS | verified |
| callToAction | label | cta:5 | .label | string | - | Button | - | Yes | PASS | verified |
| faqReference | faq | faqRef:5 | .faq->_id | string | - | - | - | Yes | PASS | verified |
| relatedContent | links | related:5 | .links[] | Link[] | - | Related | [] | No | PASS | verified |
| procurementOverride | active | override:5 | .active | boolean | - | - | false | No | PASS | verified |
| pageSection | type | section:5 | ._type | string | - | PageBuilder | - | Yes | PASS | verified |
