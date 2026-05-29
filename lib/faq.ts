export type FAQCategory = {
  category: string;
  items: { question: string; answer: string }[];
};

export const faqData: FAQCategory[] = [
  {
    category: "General Teamwear",
    items: [
      { question: "What is POXIOL?", answer: "POXIOL is a custom teamwear manufacturing platform for clubs, schools, distributors and sports brands." },
      { question: "What is your MOQ for custom teamwear?", answer: "POXIOL supports flexible MOQ from 1 piece for sample orders." },
      { question: "How long does custom teamwear production take?", answer: "Sample production usually takes 5-7 days and bulk production usually takes 10-20 days depending on order details." },
      { question: "Do you support OEM and ODM manufacturing?", answer: "Yes. POXIOL provides OEM and ODM sportswear manufacturing services." },
      { question: "Do you ship worldwide?", answer: "Yes. POXIOL supports global shipping including USA, Europe, Australia and the Middle East." },
      { question: "Can I request a free mockup?", answer: "Yes. Buyers can request a free teamwear mockup before production." },
      { question: "Can I customize labels and packaging?", answer: "Yes. POXIOL supports private label tags, neck labels and custom packaging." },
      { question: "Who do you serve?", answer: "POXIOL serves clubs, schools, academies, distributors, sports brands and event organizers." },
      { question: "What sports do you specialize in?", answer: "POXIOL specializes in basketball, soccer, baseball, volleyball, rugby, running and esports teamwear." },
      { question: "Can you support repeat orders?", answer: "Yes. Previous designs can be saved and reproduced for repeat orders." },
    ],
  },
  {
    category: "Basketball",
    items: [
      { question: "What fabric is best for basketball uniforms?", answer: "Quick-dry polyester, mesh and interlock fabrics are commonly used for basketball uniforms." },
      { question: "Do you offer reversible basketball uniforms?", answer: "Yes. POXIOL provides custom reversible basketball jerseys and sets." },
      { question: "Can I add player names and numbers?", answer: "Yes. Player names, numbers, logos and sponsor graphics can be customized." },
      { question: "Do you provide youth basketball sizes?", answer: "Yes. POXIOL supports youth and adult basketball uniform sizes." },
      { question: "What printing is best for basketball jerseys?", answer: "Sublimation printing is a popular choice because colors are durable and do not crack or peel." },
      { question: "Can I order basketball shorts separately?", answer: "Yes. Basketball jerseys and shorts can be ordered as sets or separately." },
      { question: "Do you support school basketball teams?", answer: "Yes. POXIOL supports custom uniforms for schools, academies and clubs." },
      { question: "Can you create a basketball uniform mockup?", answer: "Yes. POXIOL can provide a custom mockup based on team colors and logos." },
      { question: "What is the basketball uniform production timeline?", answer: "Samples usually take 5-7 days and bulk production usually takes 10-20 days." },
      { question: "Can I customize reversible jersey sides differently?", answer: "Yes. Each side can use different colors, numbers and graphics." },
    ],
  },
  {
    category: "Soccer",
    items: [
      { question: "Do you make full soccer kits?", answer: "Yes. POXIOL makes soccer jerseys, shorts and full team kits." },
      { question: "Can I customize sponsor logos on soccer jerseys?", answer: "Yes. Club logos, sponsor graphics, names and numbers can be customized." },
      { question: "Do you make goalkeeper jerseys?", answer: "Yes. POXIOL can manufacture custom goalkeeper jerseys." },
      { question: "What fabric is used for soccer kits?", answer: "Lightweight polyester, mesh and quick-dry fabrics are commonly used." },
      { question: "Do you offer youth soccer uniforms?", answer: "Yes. Youth and adult soccer uniform sizes are available." },
      { question: "Can I reorder previous soccer designs?", answer: "Yes. Repeat orders can reproduce previous designs." },
      { question: "What printing method is used for soccer jerseys?", answer: "Sublimation is commonly used for durable full-color soccer designs." },
      { question: "Do you support soccer academies?", answer: "Yes. POXIOL supports academies, clubs, schools and distributors." },
      { question: "Can I customize sleeve patterns?", answer: "Yes. Sleeve patterns, collar styles and graphics can be customized." },
      { question: "Do you offer private label soccer apparel?", answer: "Yes. POXIOL supports OEM private label soccer teamwear." },
    ],
  },
  {
    category: "Baseball & Softball",
    items: [
      { question: "What types of baseball jerseys do you offer?", answer: "We offer full-button, two-button, and v-neck sublimated baseball jerseys." },
      { question: "What is the best fabric for baseball jerseys?", answer: "We recommend our 180gsm or 220gsm Interlock polyester for a professional, durable feel." },
      { question: "Can you make custom baseball pants?", answer: "Yes, we produce custom baseball pants with reinforced knees and piping options." },
      { question: "Do you offer softball-specific cuts?", answer: "Yes, we provide specialized cuts for women's and girls' softball teams." },
      { question: "Are your baseball jerseys sublimated?", answer: "Yes, our jerseys are fully sublimated to ensure logos and colors never fade or peel during heavy game use." },
    ],
  },
  {
    category: "Manufacturing",
    items: [
      { question: "What is OEM sportswear manufacturing?", answer: "OEM manufacturing allows customers to produce sportswear using their own designs, labels and brand identity." },
      { question: "What is ODM teamwear manufacturing?", answer: "ODM manufacturing allows customers to customize existing product models and design directions." },
      { question: "What is sublimation printing?", answer: "Sublimation printing uses heat to transfer dye into fabric for durable full-color graphics." },
      { question: "How does quality control work?", answer: "POXIOL checks fabric, printing, sewing, sizing, packaging and final product quality before shipping." },
      { question: "Can you handle bulk production?", answer: "Yes. POXIOL supports scalable production for clubs, distributors and sports brands." },
      { question: "Can you produce samples before bulk orders?", answer: "Yes. Sample production is available before bulk production." },
      { question: "What files are needed for production?", answer: "Vector logos, color references, size quantities and design requirements are recommended." },
      { question: "Do you inspect sizing?", answer: "Yes. Sizing and measurements are checked during quality control." },
      { question: "Can you support custom packaging?", answer: "Yes. Custom polybags, labels and packaging options are available." },
      { question: "Do you offer production updates?", answer: "Yes. Production progress can be shared during the order process." },
    ],
  },
  {
    category: "Fabric",
    items: [
      { question: "What is moisture-wicking fabric?", answer: "Moisture-wicking fabric helps move sweat away from the skin to keep athletes dry." },
      { question: "What is mesh fabric used for?", answer: "Mesh fabric is used for breathable teamwear and high-activity sports uniforms." },
      { question: "What is interlock fabric?", answer: "Interlock fabric is a smooth and durable knit fabric used for sportswear." },
      { question: "Is polyester good for sports uniforms?", answer: "Yes. Polyester is lightweight, durable and suitable for sublimation printing." },
      { question: "What fabric is best for sublimation?", answer: "Polyester-based fabrics are best for sublimation printing." },
      { question: "Can I choose different fabric weights?", answer: "Yes. Fabric weight can be selected based on sport, comfort and budget." },
      { question: "What fabric is best for soccer jerseys?", answer: "Lightweight quick-dry polyester or mesh fabric is commonly used for soccer jerseys." },
      { question: "What fabric is best for basketball jerseys?", answer: "Mesh, interlock and quick-dry polyester are common options." },
      { question: "Do you provide fabric recommendations?", answer: "Yes. POXIOL can recommend fabric based on sport and usage." },
      { question: "Are fabrics suitable for hot weather?", answer: "Breathable and quick-dry fabrics are recommended for hot-weather sports." },
    ],
  },
  {
    category: "Shipping & Delivery",
    items: [
      { question: "How long is shipping to the USA?", answer: "Express shipping to the USA typically takes 3-5 business days via DHL or FedEx." },
      { question: "Do you ship to Australia?", answer: "Yes, we have many regular clients in Australia. Shipping takes about 4-7 business days." },
      { question: "Is shipping tracked?", answer: "Yes, all shipments are sent via express couriers with real-time tracking numbers provided." },
      { question: "Do you handle customs duties?", answer: "We provide all necessary commercial invoices and documentation. Customers are responsible for local import taxes depending on their country's regulations." },
      { question: "Can you ship to multiple addresses?", answer: "Yes, we can arrange split shipments to different club branches or distributor warehouses." },
    ],
  },
  {
    category: "Pricing & Payments",
    items: [
      { question: "Do you offer bulk discounts?", answer: "Yes, our pricing is tiered based on volume. Larger orders for schools or leagues receive significant discounts." },
      { question: "What payment methods do you accept?", answer: "We accept T/T Bank Transfers, Western Union, and major credit cards via secure payment gateways." },
      { question: "Are there any hidden setup fees?", answer: "No. Our sublimation pricing includes all design work, logo placement, and numbering." },
      { question: "Do I need to pay upfront?", answer: "Standard terms are a 50% deposit to begin production and the 50% balance before shipping." },
    ],
  },
];
