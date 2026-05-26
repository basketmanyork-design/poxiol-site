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
  "url": "https://poxiol.com/",
  "logo": "https://poxiol.com/logo.png",
  "description": "POXIOL is a custom teamwear manufacturer providing multi-sport sports uniforms, free mockups, MOQ 1 custom orders and OEM/ODM sportswear production for clubs, schools, events, brands, wholesalers and distributors.",
  "knowsAbout": [
    "Custom teamwear",
    "Custom sports uniforms",
    "Basketball uniforms",
    "Soccer kits",
    "Baseball uniforms",
    "Running apparel",
    "Training wear",
    "Sublimation printing",
    "OEM sportswear",
    "ODM sportswear"
  ],
  "makesOffer": [
    {
      "@type": "Offer",
      "name": "Free Custom Teamwear Mockup",
      "url": "https://poxiol.com/free-mockup/"
    },
    {
      "@type": "Offer",
      "name": "OEM/ODM Teamwear Production",
      "url": "https://poxiol.com/oem-odm/"
    }
  ]
};

export const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "POXIOL Teamwear",
  "url": "https://poxiol.com/",
  "description": "Custom teamwear and sports uniforms for clubs, schools, events, brands and distributors.",
  "potentialAction": {
    "@type": "SearchAction",
    "target": "https://poxiol.com/?s={search_term_string}",
    "query-input": "required name=search_term_string"
  }
};

export const homepageFaqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What is POXIOL?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "POXIOL is a custom teamwear manufacturer providing custom sports uniforms, free mockups, MOQ 1 custom orders and OEM/ODM sportswear production for teams, schools, events, brands, wholesalers and distributors."
      }
    },
    {
      "@type": "Question",
      "name": "What sports uniforms does POXIOL customize?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "POXIOL customizes basketball uniforms, soccer kits, baseball and softball uniforms, running and marathon wear, training wear, American football uniforms, volleyball uniforms, ice hockey jerseys, tennis wear and golf wear."
      }
    },
    {
      "@type": "Question",
      "name": "Does POXIOL provide free mockups?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes. POXIOL provides a free teamwear mockup request process for customers who submit their sport category, logo, colors, quantity and design notes."
      }
    },
    {
      "@type": "Question",
      "name": "Does POXIOL support OEM/ODM sportswear production?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes. POXIOL supports OEM/ODM teamwear production for sportswear brands, wholesalers, distributors and custom retailers."
      }
    }
  ]
};
