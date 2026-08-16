import { faqData } from "@/lib/faq";

type StructuredDataProps = {
  data: Record<string, unknown> | Record<string, unknown>[];
};

export default function StructuredData({ data }: StructuredDataProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}

export const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "POXIOL Teamwear",
  "alternateName": "POXIOL",
  "url": "https://www.poxiol.com/",
  "logo": "https://www.poxiol.com/logo.png",
  "description": "POXIOL is a custom teamwear manufacturer specializing in basketball, soccer and baseball uniforms for clubs, schools, youth programs, sports brands and distributors.",
  "knowsAbout": [
    "Custom teamwear",
    "Custom sports uniforms",
    "Basketball uniforms",
    "Soccer kits",
    "Baseball uniforms",
    "Sublimation printing",
    "OEM sportswear",
    "ODM sportswear"
  ],
  "makesOffer": [
    {
      "@type": "Offer",
      "name": "Free Custom Teamwear Mockup",
      "url": "https://www.poxiol.com/free-mockup/"
    },
    {
      "@type": "Offer",
      "name": "OEM/ODM Teamwear Production",
      "url": "https://www.poxiol.com/oem-odm/"
    }
  ]
};

export const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "POXIOL",
  "url": "https://www.poxiol.com/",
  "potentialAction": {
    "@type": "SearchAction",
    "target": "https://www.poxiol.com/search?q={search_term_string}",
    "query-input": "required name=search_term_string"
  }
};

// Generate full FAQ schema from lib/faq.ts
export const fullFaqPageSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": faqData.flatMap(category => 
    category.items.map(item => ({
      "@type": "Question",
      "name": item.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": item.answer
      }
    }))
  )
};

export function faqPageSchemaFromGroups(groups: {items: {question: string; answer: string}[]}[]) {
  return generateFaqSchema(groups.flatMap((group) => group.items));
}

// Generic FAQ Schema Generator
export function generateFaqSchema(items: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": items.map(item => ({
      "@type": "Question",
      "name": item.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": item.answer
      }
    }))
  };
}

export const homepageFaqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What is POXIOL?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "POXIOL is a custom teamwear manufacturing platform specializing in OEM and ODM sports uniforms for clubs, schools, distributors and sports brands."
      }
    },
    {
      "@type": "Question",
      "name": "What is your MOQ for custom teamwear?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Order quantity depends on the product format and project requirements. Share the sport, product, estimated quantity and customization needs so the order structure can be confirmed for the quotation."
      }
    },
    {
      "@type": "Question",
      "name": "How long does custom teamwear production take?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Sample availability and production scheduling are confirmed after the design, materials, quantity, size breakdown, customization and project requirements are reviewed."
      }
    },
    {
      "@type": "Question",
      "name": "Do you support OEM and ODM manufacturing?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes. POXIOL provides professional OEM and ODM sportswear manufacturing services including sublimation printing, private label tags and custom packaging."
      }
    }
  ]
};
