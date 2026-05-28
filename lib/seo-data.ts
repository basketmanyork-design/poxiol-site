export const basketballPageSchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Product",
      "name": "Custom Basketball Uniforms",
      "brand": {
        "@type": "Brand",
        "name": "POXIOL"
      },
      "category": "Custom Teamwear",
      "description": "Custom basketball uniforms including sublimated basketball jerseys, reversible uniforms and OEM basketball teamwear."
    },
    {
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "What is the MOQ for custom basketball uniforms?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "POXIOL supports flexible MOQ from 1 piece for sample orders."
          }
        },
        {
          "@type": "Question",
          "name": "How long does basketball uniform production take?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Sample production usually takes 5-7 days and bulk production takes 10-20 days."
          }
        }
      ]
    }
  ]
};

export const manufacturingPageSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  "name": "OEM/ODM Sportswear Manufacturing",
  "provider": {
    "@type": "Organization",
    "name": "POXIOL"
  },
  "description": "Professional teamwear manufacturing services including sublimation printing, private label production, and scalable OEM/ODM solutions."
};
