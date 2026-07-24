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

## Common Fields Matrix
Shared across multiple types (sitePage, product, caseStudy, article).

| Field | Schema (file:line) | GROQ (query) | TypeScript (type) | Resolver | Component | Fallback | Required | Status |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| title | schema:10 | .title | string | pass-through | Heading | "" | Yes | PASS |
| slug | schema:15 | .slug.current | string | slug.current | - | null | Yes | PASS |
| seo | common:5 | ...seoFields | SeoFields | normalizeSeo | SEO | defaultSeo | No | PASS |
| image | common:20 | ...imageWithAlt | ImageWithAlt | urlFor | Image | placeholder | No | PASS |

## Per-Type Detail Tables

### 1. siteSettings
| Field | Schema (file:line) | GROQ (query) | TypeScript (type) | Resolver | Component | Fallback | Required | Status |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| siteTitle | siteSettings:8 | .siteTitle | string | - | Layout | "POXIOL" | Yes | PASS |
| logo | siteSettings:12 | .logo | image | urlFor | Header | null | Yes | PASS |

### 2. navigationSettings
| Field | Schema (file:line) | GROQ (query) | TypeScript (type) | Resolver | Component | Fallback | Required | Status |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| items | nav:10 | .items[] | NavItem[] | mapItems | Navbar | [] | Yes | PASS |

### 3. footerSettings
| Field | Schema (file:line) | GROQ (query) | TypeScript (type) | Resolver | Component | Fallback | Required | Status |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| sections | footer:10 | .sections[] | FooterSection[] | - | Footer | [] | Yes | PASS |

### 4. procurementStandards
| Field | Schema (file:line) | GROQ (query) | TypeScript (type) | Resolver | Component | Fallback | Required | Status |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| standards | standards:8 | .standards[] | Standard[] | - | Procurement | [] | Yes | PASS |

### 5. sitePage
| Field | Schema (file:line) | GROQ (query) | TypeScript (type) | Resolver | Component | Fallback | Required | Status |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| sections | sitePage:25 | .sections[] | PageSection[] | resolveSection | PageBuilder | [] | No | PASS |

### 6. productCategory
| Field | Schema (file:line) | GROQ (query) | TypeScript (type) | Resolver | Component | Fallback | Required | Status |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| parent | category:18 | .parent->slug | string | - | Breadcrumb | null | No | PASS |

### 7. product
| Field | Schema (file:line) | GROQ (query) | TypeScript (type) | Resolver | Component | Fallback | Required | Status |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| category | product:30 | .category->title | string | - | ProductHeader | null | Yes | PASS |
| specs | product:45 | .specs[] | ProductSpec[] | - | SpecTable | [] | No | PASS |

### 8. caseStudy
| Field | Schema (file:line) | GROQ (query) | TypeScript (type) | Resolver | Component | Fallback | Required | Status |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| client | caseStudy:20 | .client | string | - | Hero | - | Yes | PASS |
| results | caseStudy:40 | .results[] | PortableText | toHtml | Content | null | No | PASS |

### 9. faqCategory
| Field | Schema (file:line) | GROQ (query) | TypeScript (type) | Resolver | Component | Fallback | Required | Status |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| title | faqCat:5 | .title | string | - | CategoryTab | - | Yes | PASS |

### 10. faqItem
| Field | Schema (file:line) | GROQ (query) | TypeScript (type) | Resolver | Component | Fallback | Required | Status |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| question | faqItem:10 | .question | string | - | Accordion | - | Yes | PASS |
| answer | faqItem:15 | .answer | PortableText | toHtml | Accordion | - | Yes | PASS |

### 11. article
| Field | Schema (file:line) | GROQ (query) | TypeScript (type) | Resolver | Component | Fallback | Required | Status |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| author | article:50 | .author->name | string | - | Byline | "Editorial" | No | PASS |
| body | article:60 | .body | PortableText | toHtml | ArticleBody | - | Yes | PASS |

### 12. author
| Field | Schema (file:line) | GROQ (query) | TypeScript (type) | Resolver | Component | Fallback | Required | Status |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| name | author:5 | .name | string | - | AuthorProfile | - | Yes | PASS |

### 13. redirectRule
| Field | Schema (file:line) | GROQ (query) | TypeScript (type) | Resolver | Component | Fallback | Required | Status |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| from | redirect:8 | .from | string | - | - | - | Yes | PASS |
| to | redirect:12 | .to | string | - | - | - | Yes | PASS |
