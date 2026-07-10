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

export function LocalBusinessSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "POXIOL Teamwear Factory",
    "image": `${baseUrl}/images/hero/hero-trust-new.webp`,
    "@id": `${baseUrl}/factory/#localbusiness`,
    "url": `${baseUrl}/factory/`,
    "telephone": "+86-13055646888",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "No. 88, Teamwear Industrial Zone",
      "addressLocality": "Putian",
      "addressRegion": "Fujian",
      "postalCode": "351100",
      "addressCountry": "CN"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 25.4542,
      "longitude": 119.0075
    },
    "openingHoursSpecification": {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
      "opens": "08:00",
      "closes": "22:00"
    }
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />;
}

export function CollectionPageSchema({ name, description, url, items }: { name: string; description: string; url: string; items: { name: string; url: string }[] }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": name,
    "description": description,
    "url": url,
    "mainEntity": {
      "@type": "ItemList",
      "itemListElement": items.map((item, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "name": item.name,
        "url": item.url
      }))
    }
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

export function ServiceSchema({ name, description, url }: { name: string; description: string; url: string }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "serviceType": "Custom Manufacturing",
    "name": name,
    "description": description,
    "provider": { "@id": `${baseUrl}/#organization` },
    "areaServed": { "@type": "Country", "name": "Global" },
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Custom Teamwear Services",
      "itemListElement": [
        { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Free 3D Mockup" } },
        { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "B2B Factory Quote" } },
        { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "1-Set Sample Production" } }
      ]
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

export function BreadcrumbSchema({ items }: { items: { name: string; url: string }[] }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": item.url
    }))
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
