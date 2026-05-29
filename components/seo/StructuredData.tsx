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
      "url": "https://www.poxiol.com/free-mockup/"
    },
    {
      "@type": "Offer",
      "name": "OEM/ODM Teamwear Production",
      "url": "https://www.poxiol.com/oem-odm/"
    }
  ]
};

export const fullFaqPageSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What is POXIOL?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "POXIOL is a custom teamwear manufacturing platform for clubs, schools, distributors and sports brands."
      }
    },
    {
      "@type": "Question",
      "name": "What is your MOQ for custom teamwear?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "POXIOL supports flexible MOQ from 1 piece for sample orders."
      }
    },
    {
      "@type": "Question",
      "name": "How long does custom teamwear production take?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Sample production usually takes 5-7 days and bulk production usually takes 10-20 days depending on order details."
      }
    },
    {
      "@type": "Question",
      "name": "Do you support OEM and ODM manufacturing?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes. POXIOL provides professional OEM and ODM sportswear manufacturing services including sublimation printing, private label tags and custom packaging."
      }
    },
    {
      "@type": "Question",
      "name": "What fabric is best for basketball uniforms?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Quick-dry polyester, mesh and interlock fabrics are commonly used for basketball uniforms."
      }
    },
    {
      "@type": "Question",
      "name": "What printing method is used for soccer jerseys?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Sublimation is commonly used for durable full-color soccer designs."
      }
    },
    {
      "@type": "Question",
      "name": "What is sublimation printing?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Sublimation printing uses heat to transfer dye into fabric for durable full-color graphics that do not crack or peel."
      }
    }
  ]
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
        "text": "POXIOL is a custom teamwear manufacturing platform specializing in OEM and ODM sports uniforms for clubs, schools, distributors and sports brands."
      }
    },
    {
      "@type": "Question",
      "name": "What is your MOQ for custom teamwear?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "POXIOL supports flexible MOQ from 1 piece for sample orders."
      }
    },
    {
      "@type": "Question",
      "name": "How long does custom teamwear production take?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Sample production usually takes 5-7 days and bulk production usually takes 10-20 days depending on order details."
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
