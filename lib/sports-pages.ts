export type SportsPageData = {
  slug: string;
  metaTitle: string;
  metaDescription: string;
  eyebrow: string;
  h1: string;
  heroText: string;
  heroImage: string;
  primaryKeyword: string;
  productTypes: { title: string; description: string }[];
  features: { title: string; description: string }[];
  designs: { title: string; description: string; image: string; href?: string }[];
  buyerTypes: { title: string; description: string }[];
  procurementTable: { item: string; specification: string }[];
  faqs: { question: string; answer: string }[];
  checklist?: { title: string; intro: string; items: string[] };
  relatedGuides?: { title: string; slug: string }[];
};

const commonFaqs = [
  { question: "What is the minimum order quantity?", answer: "Sample order support is available for design and quality confirmation. Bulk team order pricing depends on product type, quantity, fabric, customization details and packaging requirements." },
  { question: "Can I get a free mockup before ordering?", answer: "Yes. Send your logo, colors, sport category and quantity. Our design team can create a professional visual mockup for review." },
  { question: "How long does sampling take?", answer: "Sample Production: 2–3 Days After Mockup Confirmation. Express Delivery: Usually 3–7 Days Depending on Country." },
  { question: "How long does production take?", answer: "Bulk production time depends on order quantity, customization complexity, confirmed size breakdown and current factory schedule. POXIOL will provide a production plan before order confirmation." },
  { question: "Can you customize names, numbers and team logos?", answer: "Yes. POXIOL supports custom team names, player names, numbers, logos, colors and original pattern designs." },
  { question: "Do you support OEM/ODM for sportswear brands?", answer: "Yes. POXIOL supports OEM/ODM teamwear development, including design support, sampling, production and flexible customization." },
];

function genericProcurementTable(productName: string, mainProducts: string) {
  return [
    { item: "Product Name", specification: productName },
    { item: "Main Products", specification: mainProducts },
    { item: "Material", specification: "Polyester mesh, interlock, bird eye, stretch performance fabric" },
    { item: "Printing", specification: "Sublimation, heat transfer, embroidery, screen printing" },
    { item: "Custom Areas", specification: "Team name, logo, player name, number, sponsor graphic, colors, collar, sleeve, label, packaging" },
    { item: "Sizes", specification: "Youth and adult sizes available" },
    { item: "Sample Support", specification: "1 set sample support (Sample Production: 2–3 Days After Mockup Confirmation)" },
    { item: "Bulk Production", specification: "Production planning based on quantity, customization and delivery deadline" },
    { item: "Packaging", specification: "Individual polybag, size label, hangtag, custom packaging, carton packing" },
    { item: "Buyer Types", specification: "Clubs, schools, academies, event organizers, brands, distributors and wholesalers" },
    { item: "Alibaba Link", specification: "Official store: Alibaba.com/basketman" }
  ];
}

function genericFeatures() {
  return [
    { title: "High-Color Sublimation", description: "Vibrant graphics printed into the fabric using professional sublimation inks for long-lasting team identity." },
    { title: "Fast Mockup Support", description: "Free design support helps you preview your custom teamwear before sampling." },
    { title: "Sample Support Available", description: "Sample order support is available for design and quality confirmation." },
    { title: "Quality Support", description: "Strict QC before shipment and comprehensive After-Sales Quality Support for every order." },
  ];
}

export const sportsPages: SportsPageData[] = [
  {
    slug: "products/basketball-uniforms",
    metaTitle: "Custom Basketball Uniform Manufacturer | OEM Sublimated Jerseys & Shorts | POXIOL",
    metaDescription: "POXIOL manufactures pro-grade custom basketball uniforms, reversible jerseys, shooting shirts and team sets for clubs, academies and schools. Factory-direct OEM/ODM production with Sample Production: 2–3 Days After Mockup Confirmation and global shipping.",
    eyebrow: "CUSTOM BASKETBALL UNIFORMS",
    h1: "Custom Basketball Uniform Manufacturer for Clubs, Schools and Sportswear Brands",
    heroText: "POXIOL manufactures custom basketball jerseys, shorts, reversible uniforms and full team packages for global B2B buyers. We support free mockup design, sample confirmation, sublimation printing, player name and number customization, private label packaging and bulk production planning.",
    heroImage: "/images/sports-pages/basketball/hero.png",
    primaryKeyword: "custom basketball uniforms",
    productTypes: [
      { title: "Basketball Jerseys", description: "Sleeveless custom jerseys with team name, logo, player name and number options." },
      { title: "Basketball Shorts", description: "Matching shorts with breathable fabric, sublimation graphics and team colors." },
      { title: "Reversible Jerseys", description: "Two-sided training or game jerseys for clubs, schools and practice teams." },
      { title: "Full Team Sets", description: "Complete jersey and shorts sets for teams, tournaments and retail programs." }
    ],
    features: genericFeatures(),
    designs: [
      { title: "Storm Court Set", description: "Bold sublimation basketball set with sharp geometric motion graphics.", image: "/images/designs/storm-court-basketball.webp", href: "/free-mockup/?style=storm-court-basketball-set" },
      { title: "Metro Blue Set", description: "Blue and white team set for clubs and school programs.", image: "/images/sports-pages/basketball/design-2.webp", href: "/free-mockup/?style=metro-blue-basketball-set" },
      { title: "Red Impact Set", description: "Red, black and white basketball kit for strong team identity.", image: "/images/sports-pages/basketball/design-3.webp", href: "/free-mockup/?style=red-impact-basketball-set" }
    ],
    buyerTypes: [
      { title: "Basketball Clubs", description: "Flexible team orders for local clubs and amateur programs." },
      { title: "Schools & Academies", description: "Consistent uniforms for school teams and sports departments." },
      { title: "Sportswear Brands", description: "OEM/ODM basketball collection development for brands and distributors." }
    ],
    procurementTable: [
      { item: "Product Name", specification: "Custom Basketball Uniforms" },
      { item: "Main Products", specification: "Jerseys, shorts, reversible sets, practice jerseys and team packages" },
      { item: "Material Options", specification: "100% Polyester Mesh, Dura-Interlock, Pro-Performance mesh" },
      { item: "Size Range", specification: "Youth sizes (YXS-YXL) and Adult sizes (S-5XL)" },
      { item: "Custom Areas", specification: "Front/back logos, names, numbers, side panels, collars, labels" },
      { item: "Sample Support", specification: "1 set sample support (Sample Production: 2–3 Days After Mockup Confirmation)" },
      { item: "Private Label", specification: "Custom neck labels, hangtags and branded packaging available" },
      { item: "Quality Docs", specification: "Inspection records and fabric specs available upon request" },
      { item: "Alibaba Link", specification: "Verified sourcing on Alibaba.com/basketman" }
    ],
    faqs: [
      { question: "What GSM fabric is best for custom basketball uniforms?", answer: "160gsm to 180gsm professional polyester mesh is best for basketball uniforms. It provides the ideal balance of durability, breathability and lightweight performance for high-intensity games." },
      { question: "Is mesh or interlock fabric better for basketball uniforms?", answer: "Mesh fabric is generally better for basketball due to its open-hole structure for maximum ventilation. However, interlock fabric is often used for side panels or premium shooting shirts where a smoother finish is required." },
      { question: "What is the size tolerance for custom basketball uniforms?", answer: "POXIOL maintains a professional size tolerance of ±1.5cm to ±2cm. We measure every finished jersey and shorts against your confirmed size chart during our final QC stage." },
      { question: "What should buyers check before approving a basketball uniform sample?", answer: "Buyers should check the fabric moisture-wicking feel, print color vibrancy (especially neon shades), stitching strength at the armholes and neck, and the accuracy of player number fonts." },
      { question: "What QC checks are done before shipment?", answer: "Our 100% manual QC includes fabric surface check, sublimation print alignment, stitching density inspection, size measurement validation, player name/number verification and packaging check." },
      { question: "Can I order one basketball uniform sample before bulk production?", answer: "Yes. POXIOL supports 1 set sample orders for design and quality confirmation before bulk production." },
      { question: "Can I customize player names and numbers?", answer: "Yes. Player name, team name, number, logo, sponsor graphics and custom colors can be added." },
      { question: "Do you support reversible basketball uniforms?", answer: "Yes. POXIOL can produce reversible basketball uniforms for training, school teams, youth leagues and club programs." },
    ],
    checklist: {
      title: "Fast Quote Checklist",
      intro: "To get a fast quote and production plan for your basketball uniform project, please send:",
      items: [
        "Sport category and product type",
        "Total quantity and size breakdown",
        "Delivery country and shipping method",
        "Team logo or brand logo files",
        "Player name and number list if available",
        "Target delivery or match date",
        "Packaging or private label requirements"
      ]
    },
    relatedGuides: [
      { title: "B2B Sourcing Pro-FAQ", slug: "b2b-sourcing-faq" },
      { title: "Basketball Uniform Fabric GSM Guide", slug: "custom-basketball-uniform-fabric-gsm" },
      { title: "Teamwear Sample Approval Checklist", slug: "teamwear-sample-approval-checklist" }
    ]
  },
  {
    slug: "products/soccer-jerseys",
    metaTitle: "Custom Soccer Kit Manufacturer | Wholesale Soccer Jerseys Supplier | POXIOL",
    metaDescription: "POXIOL manufactures custom soccer jerseys, shorts, socks, goalkeeper kits and team packages for clubs, schools, academies, event organizers, distributors and sportswear brands. Factory-direct manufacturing with premium sublimation, private label support and Sample Production: 2–3 Days After Mockup Confirmation.",
    eyebrow: "CUSTOM SOCCER TEAMWEAR",
    h1: "Custom Soccer Kit Manufacturer for Clubs, Schools and Distributors",
    heroText: "POXIOL provides custom soccer jerseys, shorts, socks, goalkeeper kits and full team packages for global B2B buyers. We support home and away kit design, sponsor placement, team logo customization, sublimation printing, sample confirmation, private label packaging and bulk production planning.",
    heroImage: "/images/sports-pages/soccer/hero.png",
    primaryKeyword: "custom soccer kits",
    productTypes: [
      { title: "Soccer Jerseys", description: "Custom soccer shirts with team logo, colors, names and numbers." },
      { title: "Soccer Shorts", description: "Matching shorts for full club and school soccer kits." },
      { title: "Soccer Socks", description: "Team socks to complete the on-field kit system." },
      { title: "Goalkeeper Kits", description: "Goalkeeper jerseys and sets with custom colors and graphics." }
    ],
    features: genericFeatures(),
    designs: [
      { title: "United Field Kit", description: "Royal blue, white and silver soccer kit for clubs and academies.", image: "/images/designs/united-field-soccer-kit.webp", href: "/free-mockup/?style=united-field-soccer-kit" },
      { title: "Navy Crest Kit", description: "Clean navy and lime style for modern teamwear programs.", image: "/images/sports-pages/soccer/design-2.webp", href: "/free-mockup/?style=navy-crest-soccer-kit" },
      { title: "City Red Kit", description: "Red and white soccer kit with safe custom team identity.", image: "/images/sports-pages/soccer/design-3.webp", href: "/free-mockup/?style=city-red-soccer-kit" }
    ],
    buyerTypes: [
      { title: "Soccer Clubs", description: "Custom kits for local clubs, academies and seasonal teams." },
      { title: "Schools", description: "Team kits for school soccer programs and tournaments." },
      { title: "Sportswear Brands", description: "OEM/ODM soccer collection production and sampling." }
    ],
    procurementTable: [
      { item: "Product Name", specification: "Custom Soccer Kits" },
      { item: "Kit Components", specification: "Jerseys, shorts, socks, goalkeeper kits and team packages" },
      { item: "Material Options", specification: "140gsm interlock polyester, breathable mesh, moisture-wicking fabric" },
      { item: "Size Range", specification: "Youth and Adult sizes (tailored for soccer athletes)" },
      { item: "Custom Areas", specification: "Club crest, sponsor logos, player names, numbers, sleeve badges" },
      { item: "Original Compliance", specification: "Buyer-owned artwork only; no unauthorized trademarked logos" },
      { item: "Sample Process", specification: "Design mockup -> Sample Production: 2–3 Days After Mockup Confirmation -> Bulk order" },
      { item: "Quality Support", specification: "Strict QC Before Shipment and After-Sales Quality Support" },
      { item: "Alibaba Link", specification: "Official store: Alibaba.com/basketman" }
    ],
    faqs: [
      { question: "What fabric is suitable for soccer kits in hot weather?", answer: "140gsm interlock polyester with moisture-wicking technology is best for hot weather. It is lightweight, breathable and dries quickly, keeping players cool during matches." },
      { question: "Is sublimation printing good for soccer jerseys?", answer: "Yes. Sublimation is the best method for soccer jerseys because it integrates the design into the fabric. This ensures zero peeling of logos or numbers and maintains a lightweight feel for players." },
      { question: "Can a soccer kit include jerseys, shorts, socks and goalkeeper sets?", answer: "Yes. POXIOL provides full kit systems. You can order jerseys, shorts, and socks as a set, and we can develop matching goalkeeper kits in contrasting colors." },
      { question: "How do factories control color consistency in soccer kits?", answer: "We use professional sublimation inks and perform color strike-off tests. Every reorder is matched against our saved production records and digital color profiles to ensure consistency." },
      { question: "What should clubs check before approving a soccer jersey sample?", answer: "Clubs should check the sponsor logo alignment, club crest clarity, fabric weight (GSM), and the durability of reinforced stitching on the collar and shoulders." },
      { question: "Can POXIOL make home and away soccer kits?", answer: "Yes. POXIOL supports home and away kit design for clubs, schools and tournament programs." },
      { question: "Can I add sponsor logos to soccer jerseys?", answer: "Yes. Sponsor graphics can be added if the buyer owns or has authorization to use them." },
    ],
    checklist: {
      title: "Soccer Kit Procurement Checklist",
      intro: "Buyers should prepare these details for a professional soccer kit program:",
      items: [
        "Jersey, shorts and optional socks",
        "Club logo file in vector format",
        "Full size breakdown (Youth/Adult)",
        "Player name and number list",
        "Delivery country and shipping choice",
        "Target match or event date",
        "Packaging or private label needs"
      ]
    },
    relatedGuides: [
      { title: "B2B Sourcing Pro-FAQ", slug: "b2b-sourcing-faq" },
      { title: "How to Choose a Teamwear Manufacturer", slug: "how-to-choose-teamwear-manufacturer-china" },
      { title: "Private Label Manufacturing Guide", slug: "private-label-teamwear-manufacturing" }
    ]
  },
  {
    slug: "products/training-wear",
    metaTitle: "Custom Training Wear & Warm-up Suits Manufacturer | POXIOL",
    metaDescription: "Custom training wear, warm-up suits, tracksuits, and jackets for clubs, schools and brands. POXIOL offers OEM/ODM and high-color sublimation printing with Sample Production: 2–3 Days After Mockup Confirmation.",
    eyebrow: "CUSTOM TRAINING WEAR",
    h1: "Custom Training Wear and Warm-up Suits",
    heroText: "Create custom tracksuits, warm-up jackets, and training tops for clubs, schools, and sportswear brands with professional After-Sales Quality Support.",
    heroImage: "/images/sports-pages/training/hero.png",
    primaryKeyword: "custom training wear",
    productTypes: [
      { title: "Tracksuits", description: "Custom jacket and pants sets for team travel and warmups." },
      { title: "Warm-up Jackets", description: "Team jackets with custom colors, logos and graphics." },
      { title: "Training Tops", description: "Lightweight tops for practice and athletic programs." },
      { title: "Team Travel Suits", description: "Unified apparel systems for clubs, schools and coaches." }
    ],
    features: genericFeatures(),
    designs: [
      { title: "Pro Training Set", description: "Modern tracksuit design for warmups, training sessions and travel wear.", image: "/images/designs/pro-training-tracksuit.webp", href: "/free-mockup/?style=pro-training-tracksuit" },
      { title: "Navy Travel Set", description: "Navy and white warm-up jacket and pants for team travel.", image: "/images/sports-pages/training/design-2.webp", href: "/free-mockup/?style=navy-travel-set" },
      { title: "Black Motion Set", description: "Black and gray training top and pants with lime accents.", image: "/images/sports-pages/training/design-3.webp", href: "/free-mockup/?style=black-motion-training-set" }
    ],
    buyerTypes: [
      { title: "Clubs", description: "Warmups and travel apparel for club teams." },
      { title: "Schools", description: "Training wear for school sports departments." },
      { title: "Brands", description: "OEM/ODM training wear collection development." }
    ],
    procurementTable: genericProcurementTable("Custom Training Wear", "Tracksuits, warm-up jackets, training tops and travel suits"),
    faqs: commonFaqs,
  },
  {
    slug: "products/hoodies-jackets",
    metaTitle: "Custom Hoodies & Jackets Manufacturer | Team Outerwear | POXIOL",
    metaDescription: "Custom team hoodies, jackets, and outerwear for clubs and brands. POXIOL offers high-color sublimation and Sample Production: 2–3 Days After Mockup Confirmation.",
    eyebrow: "CUSTOM HOODIES & JACKETS",
    h1: "Custom Team Hoodies & Jackets",
    heroText: "Build your team outerwear with custom hoodies, zip-ups, and jackets. Engineered for comfort and professional appearance.",
    heroImage: "/images/poxiol-v62/home_hero_v62.png",
    primaryKeyword: "custom hoodies",
    productTypes: [
      { title: "Pullover Hoodies", description: "Premium custom hoodies with front pocket and drawstring hood." },
      { title: "Zip-up Jackets", description: "Full-zip or half-zip jackets for easy layering and team travel." },
      { title: "Fleece Outerwear", description: "Warm and durable materials for colder climate teamwear." }
    ],
    features: genericFeatures(),
    designs: [
      { title: "Elite Tech Hoodie", description: "Modern fit hoodie with vibrant team accents.", image: "/images/designs/cyber-league-esports.webp", href: "/free-mockup/?style=elite-tech-hoodie" }
    ],
    buyerTypes: [
      { title: "Clubs", description: "Branded outerwear for team members and supporters." },
      { title: "Brands", description: "OEM hoodie collections with private label support." }
    ],
    procurementTable: genericProcurementTable("Custom Hoodies & Jackets", "Pullover hoodies, zip-up jackets and team outerwear"),
    faqs: commonFaqs,
  },
  {
    slug: "products/team-accessories",
    metaTitle: "Custom Team Accessories Manufacturer | POXIOL",
    metaDescription: "Custom team socks, bags, and accessories to complete your team look. High-quality manufacturing with POXIOL quality support and Sample Production: 2–3 Days After Mockup Confirmation.",
    eyebrow: "CUSTOM TEAM ACCESSORIES",
    h1: "Custom Team Accessories",
    heroText: "Complete your elite team identity with custom socks, bags, and branded accessories manufactured to match your uniforms.",
    heroImage: "/images/poxiol-v6/manufacturing_packing_global_delivery.png",
    primaryKeyword: "team accessories",
    productTypes: [
      { title: "Team Socks", description: "Custom sublimated or knitted socks with team logos and colors." },
      { title: "Custom Bags", description: "Durable gear bags and backpacks for team travel." }
    ],
    features: genericFeatures(),
    designs: [
      { title: "Pro Gear Bag", description: "Heavy-duty custom bag for athlete gear.", image: "/images/manufacturing/packing-shipping.webp", href: "/free-mockup/?style=pro-gear-bag" }
    ],
    buyerTypes: [
      { title: "Clubs", description: "Complete accessory kits for team members." },
      { title: "Events", description: "Branded merchandise and participant gear." }
    ],
    procurementTable: genericProcurementTable("Custom Team Accessories", "Custom team socks and gear bags"),
    faqs: commonFaqs,
  },
];

export function getSportsPageBySlug(slug: string) {
  return sportsPages.find((page) => page.slug === slug);
}
