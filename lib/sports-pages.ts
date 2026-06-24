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
  designs: { title: string; description: string; image: string }[];
  buyerTypes: { title: string; description: string }[];
  faqs: { question: string; answer: string }[];
};

const commonFaqs = [
  { question: "What is the minimum order quantity?", answer: "Sample order support is available for design and quality confirmation. Bulk team order pricing depends on product type, quantity, fabric, customization details and packaging requirements." },
  { question: "Can I get a free mockup before ordering?", answer: "Yes. Send your logo, colors, sport category and quantity. Our design team can create a professional visual mockup for review." },
  { question: "How long does sampling take?", answer: "Sample Production: 2–3 Days After Mockup Confirmation. Express Delivery: Usually 3–7 Days Depending on Country." },
  { question: "How long does production take?", answer: "Bulk production time depends on order quantity, customization complexity, confirmed size breakdown and current factory schedule. POXIOL will provide a production plan before order confirmation." },
  { question: "Can you customize names, numbers and team logos?", answer: "Yes. POXIOL supports custom team names, player names, numbers, logos, colors and original pattern designs." },
  { question: "Do you support OEM/ODM for sportswear brands?", answer: "Yes. POXIOL supports OEM/ODM teamwear development, including design support, sampling, production and flexible customization." },
];

function genericFeatures() {
  return [
    { title: "High-Color Sublimation", description: "Vibrant graphics printed into the fabric using professional sublimation inks for long-lasting team identity." },
    { title: "Fast Mockup Support", description: "Free design support helps you preview your custom teamwear before sampling." },
    { title: "Sample Support Available", description: "Sample order support is available for design and quality confirmation." },
    { title: "Quality Support", description: "Strict QC before shipment and comprehensive after-sales quality support for every order." },
  ];
}

export const sportsPages: SportsPageData[] = [
  {
    slug: "products/basketball-uniforms",
    metaTitle: "Custom Basketball Uniform Manufacturer | Sublimated Basketball Jerseys | POXIOL",
    metaDescription: "POXIOL is a professional custom basketball uniform manufacturer specializing in OEM teamwear, high-color sublimation printing, and custom uniforms for clubs and schools.",
    eyebrow: "CUSTOM BASKETBALL UNIFORMS",
    h1: "Custom Basketball Uniform Manufacturer",
    heroText: "POXIOL provides professional custom teamwear manufacturing for basketball uniforms, reversible jerseys, and youth basketball teamwear. We support clubs, schools, and brands with fast mockups and reliable production.",
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
      { title: "Storm Court Set", description: "Black and electric lime basketball uniform with sharp motion graphics.", image: "/images/designs/storm-court-basketball.webp" },
      { title: "Metro Blue Set", description: "Blue and white team set for clubs and school programs.", image: "/images/sports-pages/basketball/design-2.webp" },
      { title: "Red Impact Set", description: "Red, black and white basketball kit for strong team identity.", image: "/images/sports-pages/basketball/design-3.webp" }
    ],
    buyerTypes: [
      { title: "Basketball Clubs", description: "Flexible team orders for local clubs and amateur programs." },
      { title: "Schools & Academies", description: "Consistent uniforms for school teams and sports departments." },
      { title: "Sportswear Brands", description: "OEM/ODM basketball collection development for brands and distributors." }
    ],
    faqs: commonFaqs,
  },
  {
    slug: "products/soccer-jerseys",
    metaTitle: "Custom Soccer Jersey Manufacturer | Soccer Kits & Teamwear | POXIOL",
    metaDescription: "POXIOL is a professional custom soccer jersey manufacturer specializing in OEM teamwear, high-color sublimation printing, and custom uniforms for clubs worldwide.",
    eyebrow: "CUSTOM SOCCER TEAMWEAR",
    h1: "Custom Soccer Jersey Manufacturer",
    heroText: "POXIOL provides professional custom teamwear manufacturing for soccer jerseys, football kits, and goalkeeper jerseys. We support clubs and schools with fast mockups and reliable production.",
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
      { title: "United Field Kit", description: "Royal blue, white and silver soccer kit for clubs and academies.", image: "/images/designs/united-field-soccer-kit.webp" },
      { title: "Navy Crest Kit", description: "Clean navy and lime style for modern teamwear programs.", image: "/images/sports-pages/soccer/design-2.webp" },
      { title: "City Red Kit", description: "Red and white soccer kit with safe custom team identity.", image: "/images/sports-pages/soccer/design-3.webp" }
    ],
    buyerTypes: [
      { title: "Soccer Clubs", description: "Custom kits for local clubs, academies and seasonal teams." },
      { title: "Schools", description: "Team kits for school soccer programs and tournaments." },
      { title: "Sportswear Brands", description: "OEM/ODM soccer collection production and sampling." }
    ],
    faqs: commonFaqs,
  },
  {
    slug: "products/training-wear",
    metaTitle: "Custom Training Wear & Warm-up Suits Manufacturer | POXIOL",
    metaDescription: "Custom training wear, warm-up suits, tracksuits, and jackets for clubs, schools and brands. POXIOL offers OEM/ODM and high-color sublimation printing.",
    eyebrow: "CUSTOM TRAINING WEAR",
    h1: "Custom Training Wear and Warm-up Suits",
    heroText: "Create custom tracksuits, warm-up jackets, and training tops for clubs, schools, and sportswear brands with professional quality support.",
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
      { title: "Pro Training Set", description: "Charcoal, white and electric lime tracksuit for warmups and travel.", image: "/images/designs/pro-training-tracksuit.webp" },
      { title: "Navy Travel Set", description: "Navy and white warm-up jacket and pants for team travel.", image: "/images/sports-pages/training/design-2.webp" },
      { title: "Black Motion Set", description: "Black and gray training top and pants with lime accents.", image: "/images/sports-pages/training/design-3.webp" }
    ],
    buyerTypes: [
      { title: "Clubs", description: "Warmups and travel apparel for club teams." },
      { title: "Schools", description: "Training wear for school sports departments." },
      { title: "Brands", description: "OEM/ODM training wear collection development." }
    ],
    faqs: commonFaqs,
  },
  {
    slug: "products/hoodies-jackets",
    metaTitle: "Custom Hoodies & Jackets Manufacturer | Team Outerwear | POXIOL",
    metaDescription: "Custom team hoodies, jackets, and outerwear for clubs and brands. POXIOL offers high-color sublimation and premium construction.",
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
      { title: "Elite Tech Hoodie", description: "Modern fit hoodie with vibrant team accents.", image: "/images/designs/cyber-league-esports.webp" }
    ],
    buyerTypes: [
      { title: "Clubs", description: "Branded outerwear for team members and supporters." },
      { title: "Brands", description: "OEM hoodie collections with private label support." }
    ],
    faqs: commonFaqs,
  },
  {
    slug: "products/team-accessories",
    metaTitle: "Custom Team Accessories Manufacturer | POXIOL",
    metaDescription: "Custom team socks, bags, and accessories to complete your team look. High-quality manufacturing with POXIOL quality support.",
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
      { title: "Pro Gear Bag", description: "Heavy-duty custom bag for athlete gear.", image: "/images/manufacturing/packing-shipping.webp" }
    ],
    buyerTypes: [
      { title: "Clubs", description: "Complete accessory kits for team members." },
      { title: "Events", description: "Branded merchandise and participant gear." }
    ],
    faqs: commonFaqs,
  },
];

export function getSportsPageBySlug(slug: string) {
  return sportsPages.find((page) => page.slug === slug);
}
