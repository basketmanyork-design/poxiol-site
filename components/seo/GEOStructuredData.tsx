import React from "react";

const baseUrl = "https://www.poxiol.com";

export function OrganizationSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${baseUrl}/#organization`,
        "name": "POXIOL",
        "url": `${baseUrl}/`,
        "logo": `${baseUrl}/logo.png`,
        "description": "POXIOL is a factory-direct custom teamwear manufacturer specializing in basketball uniforms, soccer kits, training wear, team hoodies, accessories and OEM/ODM sportswear programs for clubs, schools, academies, brands, distributors and event organizers worldwide.",
        "sameAs": [
          "https://basketman.en.alibaba.com/",
          "https://chinabingli.en.alibaba.com/"
        ],
        "areaServed": ["United States", "Europe", "Australia", "Middle East", "Global"],
        "knowsAbout": [
          "Custom Teamwear",
          "Basketball Uniforms",
          "Soccer Kits",
          "OEM Sportswear Manufacturing",
          "Private Label Teamwear",
          "Sublimation Printing"
        ],
        "contactPoint": [{
          "@type": "ContactPoint",
          "telephone": "+86-13055646888",
          "contactType": "sales",
          "availableLanguage": ["English"],
          "url": `${baseUrl}/contact/`
        }]
      },
      {
        "@type": "WebSite",
        "@id": `${baseUrl}/#website`,
        "url": `${baseUrl}/`,
        "name": "POXIOL Custom Teamwear Manufacturer",
        "publisher": {
          "@id": `${baseUrl}/#organization`
        }
      }
    ]
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />;
}

export function ProductSchema({ name, description, url, image }: { name: string; description: string; url: string; image?: string }) {
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "Home", "item": `${baseUrl}/` },
          { "@type": "ListItem", "position": 2, "name": "Products", "item": `${baseUrl}/products/` },
          { "@type": "ListItem", "position": 3, "name": name, "item": url }
        ]
      },
      {
        "@type": "Product",
        "@id": `${url}#product`,
        "name": name,
        "brand": {
          "@type": "Brand",
          "name": "POXIOL"
        },
        "description": description,
        "category": "Custom Sports Uniforms",
        "image": image || `${baseUrl}/images/hero/hero-trust-new.webp`,
        "manufacturer": {
          "@id": `${baseUrl}/#organization`
        },
        "offers": {
          "@type": "Offer",
          "url": `${baseUrl}/free-mockup/`,
          "priceCurrency": "USD",
          "availability": "https://schema.org/InStock",
          "eligibleQuantity": { "@type": "QuantitativeValue", "minValue": 1, "unitText": "set" },
          "description": "Sample support available. Bulk quotation is based on quantity and customization."
        }
      }
    ]
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />;
}

export function ArticleSchema({ headline, description, url }: { headline: string; description: string; url: string }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": headline,
    "description": description,
    "author": {
      "@id": `${baseUrl}/#organization`
    },
    "publisher": {
      "@id": `${baseUrl}/#organization`
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": url
    }
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />;
}

export function FAQSchema({ faqs }: { faqs: { question: string; answer: string }[] }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />;
}

export function CaseStudySchema({ title, url, description, keywords }: { title: string; url: string; description: string; keywords?: string[] }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    "name": title,
    "url": url,
    "about": description,
    "provider": { "@id": `${baseUrl}/#organization` },
    "keywords": keywords || ["custom teamwear", "sportswear case study", "B2B manufacturing"]
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />;
}
