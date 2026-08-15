export type FAQCategory = {
  category: string;
  items: { question: string; answer: string }[];
};

export const faqData: FAQCategory[] = [
  {
    category: "General Custom Teamwear",
    items: [
      { question: "What is POXIOL?", answer: "POXIOL is a factory-direct custom teamwear manufacturer specializing in basketball uniforms, soccer kits, training wear, team hoodies, accessories and OEM/ODM sportswear programs for clubs, schools, academies, brands, distributors and event organizers." },
      { question: "Who does POXIOL work with?", answer: "POXIOL works with sports clubs, schools, academies, amateur teams, sportswear brands, distributors, custom retailers and event organizers worldwide." },
      { question: "What products can POXIOL manufacture?", answer: "POXIOL can manufacture custom basketball uniforms, soccer kits, baseball uniforms, training wear, warm-up sets, team hoodies, jackets, accessories and private label teamwear collections." },
      { question: "How is the order quantity confirmed?", answer: "Order quantity depends on the product format and project requirements. Share the sport, product, estimated quantity and customization needs so the order structure can be confirmed for the quotation." },
      { question: "How is sample timing confirmed?", answer: "Sample availability and scheduling are confirmed after the design, material, construction and project requirements are reviewed." },
      { question: "Can POXIOL provide a free mockup?", answer: "Yes. Buyers can send sport category, logo, colors, quantity and reference design. POXIOL can prepare a free visual mockup before sampling or bulk production." },
    ],
  },
  {
    category: "OEM / ODM",
    items: [
      { question: "Does POXIOL support OEM sportswear manufacturing?", answer: "Yes. POXIOL supports OEM sportswear manufacturing, including buyer-owned logos, custom design, product specifications, private label trims, packaging and bulk production." },
      { question: "Does POXIOL support ODM teamwear?", answer: "Yes. POXIOL supports ODM teamwear based on proven product structures that can be customized with colors, logos, player names, numbers and packaging." },
      { question: "Can POXIOL make private label teamwear?", answer: "Yes. POXIOL can support private neck labels, hangtags, polybags, barcode stickers, carton marks and distributor-ready packaging." },
    ],
  },
  {
    category: "Basketball Uniforms",
    items: [
      { question: "Can POXIOL make reversible basketball jerseys?", answer: "Yes. POXIOL can produce reversible basketball jerseys and shorts for clubs, schools, academies, training programs and tournaments." },
      { question: "Can schools order youth and adult basketball sizes together?", answer: "Yes. POXIOL can support youth, adult and plus size breakdowns for school and academy basketball uniform programs." },
      { question: "Can POXIOL customize names and numbers?", answer: "Yes. POXIOL can customize player names, numbers, team logos, sponsor graphics and original pattern designs." },
    ],
  },
  {
    category: "Soccer Kits",
    items: [
      { question: "Can POXIOL make full soccer kits?", answer: "Yes. POXIOL can produce soccer jerseys, shorts, socks, goalkeeper kits and training wear." },
      { question: "Can POXIOL add sponsor logos to soccer jerseys?", answer: "Yes. Buyer-owned or authorized sponsor graphics can be added to approved custom designs." },
      { question: "Can POXIOL use official club or tournament logos?", answer: "No. POXIOL only supports buyer-owned, original or properly authorized artwork and does not provide unauthorized protected team crests, league marks or tournament logos." },
    ],
  },
  {
    category: "Quality Control",
    items: [
      { question: "How does POXIOL control teamwear quality?", answer: "POXIOL uses a multi-stage QC process covering fabric condition, print clarity, color consistency, stitching, size measurement, quantity check and packing review before shipment." },
      { question: "Can I request photos before shipment?", answer: "Yes. POXIOL can provide project-based production or packing photos when required and confirmed before production." },
      { question: "Can POXIOL provide testing documents?", answer: "Testing documents may be available depending on fabric type, target market and buyer requirements. Buyers should confirm testing needs before production." },
    ],
  },
  {
    category: "Ordering & Shipping",
    items: [
      { question: "What information should I send for a quote?", answer: "Send sport category, product type, logo, colors, quantity, size list, reference design and target delivery date." },
      { question: "What happens after I submit a free mockup request?", answer: "POXIOL reviews your project details, prepares a visual mockup or sourcing recommendation, confirms sample requirements, and then provides a quotation and production plan." },
      { question: "Can distributors reorder the same design later?", answer: "Yes. POXIOL can support repeat orders when design files, size breakdowns and production records are kept for future reference." },
      { question: "How is international delivery timing confirmed?", answer: "Shipping method, freight assumptions and delivery timing are confirmed according to the destination and project requirements." },
    ],
  },
];
