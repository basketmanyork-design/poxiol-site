export type FAQItem = {
  question: string;
  answer: string;
};

export type B2BFAQCategory = {
  category: string;
  items: FAQItem[];
};

export const b2bFaqData: B2BFAQCategory[] = [
  {
    category: "Factory & Sourcing Verification",
    items: [
      {
        question: "How do I know if a teamwear supplier is a real factory?",
        answer: "Professional B2B buyers should review verifiable production evidence, ask how sampling is planned, and request direct technical guidance on fabric, decoration and construction. Sample availability and timing should be confirmed after the design, material and project requirements are reviewed."
      },
      {
        question: "What is the standard sample production time for B2B orders?",
        answer: "Sample availability and timing are confirmed after the approved design, materials, construction and current project requirements are reviewed."
      },
      {
        question: "Does POXIOL provide factory audit reports?",
        answer: "Yes. POXIOL maintains transparent manufacturing standards. We can provide factory inspection details, production capacity data, and QC checklists upon request for authorized B2B distributors and brand partners."
      }
    ]
  },
  {
    category: "Technical Fabric & Production Specs",
    items: [
      {
        question: "What fabric GSM is recommended for professional basketball uniforms?",
        answer: "For professional competition, we recommend 160–180 GSM fabrics for maximum durability. For youth academies and schools, 150–165 GSM offers a balanced athletic feel, while 140–150 GSM is reserved for hot-weather training kits where breathability is the priority."
      },
      {
        question: "What is the acceptable size tolerance for custom sportswear?",
        answer: "In the custom teamwear industry, a size tolerance of ±2 cm (approx. 0.8 inches) is the standard for manual cutting and sewing. This variation is normal across different batches and is not considered a manufacturing defect."
      },
      {
        question: "What ink technology is used for POXIOL sublimation?",
        answer: "We use high-grade Italian KIAN ink and Japanese EPSON print heads. This ensures CMYK color accuracy, high-vibrancy graphics, and high color fastness that is highly resistant to cracking, peeling, or fading, even after intensive washing and high-contact use."
      }
    ]
  },
  {
    category: "Private Label & Brand Support",
    items: [
      {
        question: "What logo file format is required for high-precision sublimation?",
        answer: "B2B buyers should provide original vector files in .AI, .EPS, or .SVG formats. This allows our design team to scale logos for youth and adult sizes without any loss of sharpness or resolution."
      },
      {
        question: "Can POXIOL support custom neck tags and branded packaging?",
        answer: "Yes. Our Private Label program supports custom heat-transfer neck labels, woven hem tags, branded hangtags, and retail-ready polybags with barcode stickers for distributors."
      },
      {
        question: "Is a physical sample required before bulk production?",
        answer: "For new private label collections or large B2B orders, a physical sample is highly recommended. It serves as the master reference for color matching, fabric hand-feel, and size confirmation before committing to bulk inventory."
      }
    ]
  }
];
