import React from "react";
import { GEO_V1 } from "@/lib/geo-v1";

const baseUrl = GEO_V1.canonicalBaseUrl;

export function OrganizationSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Brand",
        "@id": GEO_V1.brand.id,
        "name": GEO_V1.brand.name,
        "url": GEO_V1.brand.url,
      },
      {
        "@type": "Organization",
        "@id": GEO_V1.operator.id,
        "name": GEO_V1.operator.name,
        "legalName": GEO_V1.operator.legalName,
        "url": GEO_V1.operator.url,
        "brand": { "@id": GEO_V1.brand.id },
      },
      {
        "@type": "WebSite",
        "@id": `${baseUrl}/#website`,
        "url": `${baseUrl}/`,
        "name": "POXIOL Custom Teamwear Manufacturer",
        "publisher": { "@id": GEO_V1.operator.id },
        "about": { "@id": GEO_V1.brand.id },
      }
    ]
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
        "brand": { "@id": GEO_V1.brand.id },
        "description": description,
        "category": "Custom Sports Uniforms",
        "image": image || `${baseUrl}/images/poxiol-teamwear-hero-poxiol-only-v2.webp`,
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
    "provider": { "@id": GEO_V1.operator.id },
    "areaServed": { "@type": "Country", "name": "Global" },
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Custom Teamwear Services",
      "itemListElement": [
        { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Free 3D Mockup" } },
        { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "B2B Factory Quote" } },
        { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Project-Specific Sample Planning" } }
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
    "author": { "@id": GEO_V1.operator.id },
    "publisher": { "@id": GEO_V1.operator.id },
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
    "provider": { "@id": GEO_V1.operator.id },
    "keywords": keywords || ["custom teamwear", "sportswear case study", "B2B manufacturing"]
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />;
}
