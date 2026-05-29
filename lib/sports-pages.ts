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
  { question: "What is the minimum order quantity?", answer: "POXIOL supports flexible custom orders starting from MOQ 1, suitable for samples, trials, small teams and custom retail projects." },
  { question: "Can I get a free mockup before ordering?", answer: "Yes. Send your logo, colors, sport category and quantity. Our design team can create a professional visual mockup for review." },
  { question: "How long does sampling take?", answer: "Sample production usually takes 2-3 days after design confirmation, depending on product type and customization details." },
  { question: "How long does production take?", answer: "For many custom teamwear orders, production can be completed in 3-5 days after sample approval and order confirmation. Larger or complex orders may need more time." },
  { question: "Can you customize names, numbers and team logos?", answer: "Yes. POXIOL supports custom team names, player names, numbers, logos, colors and original pattern designs." },
  { question: "Do you support OEM/ODM for sportswear brands?", answer: "Yes. POXIOL supports OEM/ODM teamwear development, including design support, sampling, production and flexible customization." },
];

function genericFeatures() {
  return [
    { title: "Sublimation Printing", description: "Full-color graphics printed into the fabric for long-lasting team identity." },
    { title: "Fast Mockup", description: "Free design support helps you preview your custom teamwear before sampling." },
    { title: "MOQ 1", description: "Flexible order options support samples, trials and small team needs." },
    { title: "OEM/ODM Ready", description: "Support for clubs, schools, brands, distributors and custom retailers." },
  ];
}

export const sportsPages: SportsPageData[] = [
  {
    slug: "custom-basketball-uniforms",
    metaTitle: "Custom Basketball Uniform Manufacturer | Sublimated Basketball Jerseys | POXIOL",
    metaDescription: "POXIOL is a professional custom basketball uniform manufacturer specializing in OEM teamwear, sublimation printing, private label sportswear and custom uniforms for clubs, schools, distributors and sports brands worldwide.",
    eyebrow: "CUSTOM BASKETBALL UNIFORMS",
    h1: "Custom Basketball Uniform Manufacturer",
    heroText: "POXIOL provides professional custom teamwear manufacturing for basketball uniforms, reversible jerseys, youth basketball teamwear. We support clubs, schools, academies, distributors and sports brands with fast mockups, flexible MOQ and reliable production.",

    heroImage: "/images/sports-pages/basketball/hero.png",
    primaryKeyword: "custom basketball uniforms",
    productTypes: [
      { title: "Basketball Jerseys", description: "Sleeveless custom jerseys with team name, logo, player name and number options." },
      { title: "Basketball Shorts", description: "Matching shorts with breathable fabric, sublimation graphics and team colors." },
      { title: "Reversible Jerseys", description: "Two-sided training or game jerseys for clubs, schools and practice teams." },
      { title: "Full Team Sets", description: "Complete jersey and shorts sets for teams, tournaments and retail programs." },
      { title: "Warm-up Apparel", description: "Training tops, shooting shirts and warm-up sets for team travel and practice." }
    ],
    features: genericFeatures(),
    designs: [
      { title: "Storm Court Set", description: "Black and electric lime basketball uniform with sharp motion graphics.", image: "/images/sports-pages/basketball/design-1.webp" },
      { title: "Metro Blue Set", description: "Blue and white team set for clubs and school programs.", image: "/images/sports-pages/basketball/design-2.webp" },
      { title: "Red Impact Set", description: "Red, black and white basketball kit for strong team identity.", image: "/images/sports-pages/basketball/design-3.webp" }
    ],
    buyerTypes: [
      { title: "Basketball Clubs", description: "Flexible team orders for local clubs and amateur programs." },
      { title: "Schools & Academies", description: "Consistent uniforms for school teams and sports departments." },
      { title: "Custom Retailers", description: "MOQ 1 and fast design support for custom basketball uniform sellers." },
      { title: "Sportswear Brands", description: "OEM/ODM basketball collection development for brands and distributors." }
    ],
    faqs: commonFaqs,
  },
  {
    slug: "custom-soccer-kits",
    metaTitle: "Custom Soccer Jersey Manufacturer | Soccer Kits & Teamwear | POXIOL",
    metaDescription: "POXIOL is a professional custom soccer jersey manufacturer specializing in OEM teamwear, sublimation printing, private label sportswear and custom uniforms for clubs, schools, distributors and sports brands worldwide.",
    eyebrow: "CUSTOM SOCCER TEAMWEAR",
    h1: "Custom Soccer Jersey Manufacturer",
    heroText: "POXIOL provides professional custom teamwear manufacturing for soccer jerseys, football kits, goalkeeper jerseys, youth soccer uniforms. We support clubs, schools, academies, distributors and sports brands with fast mockups, flexible MOQ and reliable production.",

    heroImage: "/images/sports-pages/soccer/hero.png",
    primaryKeyword: "custom soccer kits",
    productTypes: [
      { title: "Soccer Jerseys", description: "Custom soccer shirts with team logo, colors, names and numbers." },
      { title: "Soccer Shorts", description: "Matching shorts for full club and school soccer kits." },
      { title: "Soccer Socks", description: "Team socks to complete the on-field kit system." },
      { title: "Goalkeeper Kits", description: "Goalkeeper jerseys and sets with custom colors and graphics." },
      { title: "Training Shirts", description: "Lightweight training tops for practice, academies and team sessions." }
    ], features: genericFeatures(),
    designs: [
      { title: "United Field Kit", description: "Royal blue, white and silver soccer kit for clubs and academies.", image: "/images/sports-pages/soccer/design-1.webp" },
      { title: "Navy Crest Kit", description: "Clean navy and lime style for modern teamwear programs.", image: "/images/sports-pages/soccer/design-2.webp" },
      { title: "City Red Kit", description: "Red and white soccer kit with safe custom team identity.", image: "/images/sports-pages/soccer/design-3.webp" }
    ],
    buyerTypes: [
      { title: "Soccer Clubs", description: "Custom kits for local clubs, academies and seasonal teams." },
      { title: "Schools", description: "Team kits for school soccer programs and tournaments." },
      { title: "Distributors", description: "Flexible supply for regional teamwear sellers." },
      { title: "Sportswear Brands", description: "OEM/ODM soccer collection production and sampling." }
    ], faqs: commonFaqs,
  },
  {
    slug: "custom-baseball-softball-uniforms",
    metaTitle: "Custom Baseball Jersey Manufacturer | Baseball Uniforms | POXIOL",
    metaDescription: "POXIOL is a professional custom baseball uniform manufacturer specializing in OEM teamwear, sublimation printing, button jerseys, pants and custom uniforms for clubs, schools, distributors and sports brands worldwide.",
    eyebrow: "CUSTOM BASEBALL UNIFORMS",
    h1: "Custom Baseball Jersey Manufacturer",
    heroText: "POXIOL provides professional custom teamwear manufacturing for baseball jerseys, button-front uniforms, baseball pants, youth baseball teamwear. We support clubs, schools, academies, distributors and sports brands with fast mockups, flexible MOQ and reliable production.",

    heroImage: "/images/sports-pages/baseball/hero.png",
    primaryKeyword: "custom baseball uniforms",
    productTypes: [
      { title: "Button Baseball Jerseys", description: "Classic button-front jerseys with modern custom design options." },
      { title: "Baseball Pants", description: "Matching pants for full team uniform sets." },
      { title: "Softball Sets", description: "Custom softball uniforms for schools, clubs and women’s teams." },
      { title: "Baseball Caps", description: "Custom cap options to complete the team look." },
      { title: "Full Uniform Sets", description: "Complete jersey, pants and cap systems for teams and retailers." }
    ], features: genericFeatures(),
    designs: [
      { title: "Falcons Classic", description: "White, navy and red baseball uniform with classic team styling.", image: "/images/sports-pages/baseball/design-1.webp" },
      { title: "Black Gold Line", description: "Premium black and gold baseball set for clubs and retailers.", image: "/images/sports-pages/baseball/design-2.webp" },
      { title: "Softball Energy", description: "Modern softball uniform with dynamic custom graphics.", image: "/images/sports-pages/baseball/design-3.webp" }
    ],
    buyerTypes: [
      { title: "Baseball Clubs", description: "Custom uniforms for youth, amateur and local teams." },
      { title: "Softball Teams", description: "Flexible softball team sets with custom fit and color options." },
      { title: "Schools", description: "Team uniforms for school baseball and softball programs." },
      { title: "Retailers", description: "Custom baseball uniform supply for online and offline sellers." }
    ], faqs: commonFaqs,
  },
  {
    slug: "custom-american-football-uniforms",
    metaTitle: "Custom American Football Uniforms Manufacturer | POXIOL",
    metaDescription: "Custom American football jerseys, pants and practice uniforms for teams and schools. POXIOL offers sublimation printing, free mockup, fast sampling and OEM/ODM production.",
    eyebrow: "CUSTOM AMERICAN FOOTBALL UNIFORMS",
    h1: "Custom American Football Uniforms for Teams and Schools",
    heroText: "Create custom American football jerseys, pants, practice uniforms and full team sets with original graphics, names, numbers and fast sampling support.",
    heroImage: "/images/sports-pages/american-football/hero.png",
    primaryKeyword: "custom American football uniforms",
    productTypes: [
      { title: "Football Jerseys", description: "Custom game jerseys with team colors, names, numbers and original graphics." },
      { title: "Football Pants", description: "Matching pants for complete American football team sets." },
      { title: "Practice Jerseys", description: "Lightweight practice tops for training programs and school teams." },
      { title: "Full Team Sets", description: "Complete uniform solutions for teams, schools and retailers." }
    ], features: genericFeatures(),
    designs: [
      { title: "Titans Power", description: "Dark navy, silver and electric lime football uniform with strong geometric graphics.", image: "/images/sports-pages/american-football/design-1.webp" },
      { title: "Red Practice Set", description: "Black and red practice jersey design for training programs.", image: "/images/sports-pages/american-football/design-2.webp" },
      { title: "Silver Field Set", description: "White and dark blue football uniform with silver accent details.", image: "/images/sports-pages/american-football/design-3.webp" }
    ],
    buyerTypes: [
      { title: "School Teams", description: "Custom football uniforms for school sports programs." },
      { title: "Practice Teams", description: "Flexible practice jersey supply with fast mockup support." },
      { title: "Retailers", description: "Custom football uniform options for teamwear sellers." },
      { title: "Clubs", description: "Original football teamwear for local and amateur programs." }
    ], faqs: commonFaqs,
  },
  {
    slug: "custom-running-marathon-wear",
    metaTitle: "Custom Running & Marathon Wear Manufacturer | POXIOL",
    metaDescription: "Custom running singlets, marathon vests, shorts and event apparel for clubs, races and organizations. POXIOL supports free mockup, quick dry fabric and OEM/ODM production.",
    eyebrow: "CUSTOM RUNNING & MARATHON WEAR",
    h1: "Custom Running & Marathon Wear for Clubs and Events",
    heroText: "Create lightweight running singlets, marathon vests, race shirts, shorts and event apparel for clubs, races, charity events and corporate teams.",
    heroImage: "/images/sports-pages/running/hero.webp",

    primaryKeyword: "custom running apparel",
    productTypes: [
      { title: "Running Singlets", description: "Lightweight custom singlets for running clubs and events." },
      { title: "Marathon Vests", description: "Event-ready vests for races, teams and charity runs." },
      { title: "Running Shorts", description: "Breathable shorts designed for comfort and movement." },
      { title: "Event Shirts", description: "Custom shirts for participants, staff and race crews." },
      { title: "Full Running Sets", description: "Complete apparel systems for running teams and events." }
    ], features: genericFeatures(),
    designs: [
      { title: "Velocity Run", description: "Neon yellow, black and gray running singlet with speed graphics.", image: "/images/sports-pages/running/design-1.webp" },
      { title: "City Run Blue", description: "Blue and white event vest for clubs and race teams.", image: "/images/sports-pages/running/design-2.webp" },
      { title: "Orange Pace Kit", description: "Orange, white and black running set for energetic team identity.", image: "/images/sports-pages/running/design-3.webp" }
    ],
    buyerTypes: [
      { title: "Running Clubs", description: "Custom apparel for group training and race day." },
      { title: "Event Organizers", description: "Race apparel for participants, staff and event teams." },
      { title: "Charity Races", description: "Custom shirts and vests for fundraising events." },
      { title: "Corporate Teams", description: "Branded running apparel for company sports programs." }
    ], faqs: commonFaqs,
  },
  {
    slug: "custom-volleyball-uniforms",
    metaTitle: "Custom Volleyball Uniform Manufacturer | Volleyball Teamwear | POXIOL",
    metaDescription: "POXIOL is a professional custom volleyball uniform manufacturer specializing in OEM teamwear, sublimation printing, breathable jerseys and custom uniforms for clubs, schools, distributors and sports brands worldwide.",
    eyebrow: "CUSTOM VOLLEYBALL TEAMWEAR",
    h1: "Custom Volleyball Uniform Manufacturer",
    heroText: "POXIOL provides professional custom teamwear manufacturing for volleyball jerseys, volleyball shorts, youth volleyball uniforms. We support clubs, schools, academies, distributors and sports brands with fast mockups, flexible MOQ and reliable production.",

    heroImage: "/images/sports-pages/volleyball/hero.png",
    primaryKeyword: "custom volleyball uniforms",
    productTypes: [
      { title: "Volleyball Jerseys", description: "Custom team jerseys with names, numbers and original graphics." },
      { title: "Volleyball Shorts", description: "Matching shorts for training and competition sets." },
      { title: "Women’s Team Sets", description: "Custom volleyball sets for school and club teams." },
      { title: "Sleeveless Jerseys", description: "Lightweight sleeveless options for high-intensity play." }
    ], features: genericFeatures(),
    designs: [
      { title: "Rangers Court", description: "Purple, white and navy volleyball uniform with dynamic gradient style.", image: "/images/sports-pages/volleyball/design-1.webp" },
      { title: "Red Navy Strike", description: "Red and navy volleyball set with breathable athletic fit.", image: "/images/sports-pages/volleyball/design-2.webp" },
      { title: "Teal Motion Set", description: "White, teal and black volleyball team design with modern graphics.", image: "/images/sports-pages/volleyball/design-3.webp" }
    ],
    buyerTypes: [
      { title: "School Teams", description: "Custom uniforms for school volleyball programs." },
      { title: "Clubs", description: "Teamwear for club training and competition." },
      { title: "Women’s Teams", description: "Custom fit and style options for women’s volleyball sets." },
      { title: "Retailers", description: "Flexible volleyball uniform supply for sellers." }
    ], faqs: commonFaqs,
  },
  {
    slug: "custom-ice-hockey-jerseys",
    metaTitle: "Custom Ice Hockey Jerseys Manufacturer | POXIOL",
    metaDescription: "POXIOL manufactures custom ice hockey jerseys with sublimation printing, team name, number customization, free mockup, fast sampling and OEM/ODM support.",
    eyebrow: "CUSTOM ICE HOCKEY JERSEYS",
    h1: "Custom Ice Hockey Jerseys for Teams and Clubs",
    heroText: "Create long-sleeve custom hockey jerseys, practice jerseys, team socks and full hockey sets with original graphics and name-number customization.",
    heroImage: "/images/sports-pages/ice-hockey/hero.png",
    primaryKeyword: "custom ice hockey jerseys",
    productTypes: [
      { title: "Hockey Jerseys", description: "Long-sleeve custom jerseys with team name and number options." },
      { title: "Practice Jerseys", description: "Custom practice jerseys for clubs and training programs." },
      { title: "Hockey Socks", description: "Matching socks to complete team identity." },
      { title: "Full Hockey Sets", description: "Team jersey systems for clubs, schools and retailers." }
    ], features: genericFeatures(),
    designs: [
      { title: "Ice Blue Classic", description: "White, blue and black long-sleeve hockey jersey with custom number style.", image: "/images/sports-pages/ice-hockey/design-1.webp" },
      { title: "Black Cyan Rink", description: "Black and cyan hockey jersey with bold geometric graphics.", image: "/images/sports-pages/ice-hockey/design-2.webp" },
      { title: "Red Navy Ice", description: "Red, white and navy hockey team jersey with safe identity.", image: "/images/sports-pages/ice-hockey/design-3.webp" }
    ],
    buyerTypes: [
      { title: "Hockey Clubs", description: "Custom jerseys for club teams and amateur programs." },
      { title: "Schools", description: "Team jerseys for school and academy programs." },
      { title: "Retailers", description: "Custom hockey jersey supply for online sellers." },
      { title: "Distributors", description: "OEM/ODM hockey jersey programs for regional buyers." }
    ], faqs: commonFaqs,
  },
  {
    slug: "custom-tennis-wear",
    metaTitle: "Custom Tennis Wear Manufacturer | POXIOL Teamwear",
    metaDescription: "Custom tennis shirts, shorts, skirts and club apparel for teams, schools and sportswear brands. POXIOL supports free mockup, OEM/ODM and quick sampling.",
    eyebrow: "CUSTOM TENNIS WEAR",
    h1: "Custom Tennis Wear for Clubs, Schools and Brands",
    heroText: "Create custom tennis shirts, shorts, skirts, polo shirts and club apparel with breathable fabrics, clean styling and logo customization.",
    heroImage: "/images/sports-pages/tennis/hero.png",
    primaryKeyword: "custom tennis wear",
    productTypes: [
      { title: "Tennis Shirts", description: "Custom shirts for clubs, teams and sports programs." },
      { title: "Tennis Shorts", description: "Lightweight shorts for training and match use." },
      { title: "Tennis Skirts", description: "Custom skirt options for club and school apparel." },
      { title: "Polo Shirts", description: "Clean polo designs for tennis clubs and corporate programs." },
      { title: "Club Apparel", description: "Complete tennis apparel solutions for teams and brands." }
    ], features: genericFeatures(),
    designs: [
      { title: "Green Club Set", description: "White and green tennis shirt and shorts with clean club styling.", image: "/images/sports-pages/tennis/design-1.webp" },
      { title: "Navy Court Set", description: "Navy and white tennis skirt and top with elegant athletic style.", image: "/images/sports-pages/tennis/design-2.webp" },
      { title: "Lime Polo Set", description: "White, lime and gray tennis polo apparel for clubs and events.", image: "/images/sports-pages/tennis/design-3.webp" }
    ],
    buyerTypes: [
      { title: "Tennis Clubs", description: "Custom club apparel for teams and members." },
      { title: "Schools", description: "Tennis uniforms for school sports programs." },
      { title: "Corporate Events", description: "Clean sportswear for company tennis events." },
      { title: "Brands", description: "OEM/ODM tennis apparel collection development." }
    ], faqs: commonFaqs,
  },
  {
    slug: "custom-golf-wear",
    metaTitle: "Custom Golf Wear & Polo Shirts Manufacturer | POXIOL",
    metaDescription: "POXIOL provides custom golf polos, pants and corporate golf wear for clubs, events and brands with logo customization, OEM/ODM support and fast sampling.",
    eyebrow: "CUSTOM GOLF WEAR",
    h1: "Custom Golf Wear and Polo Shirts for Clubs and Events",
    heroText: "Create custom golf polos, pants, club apparel and corporate golf wear with clean styling, logo customization and OEM/ODM support.",
    heroImage: "/images/sports-pages/golf/hero.png",
    primaryKeyword: "custom golf wear",
    productTypes: [
      { title: "Golf Polo Shirts", description: "Custom polo shirts for clubs, teams and corporate events." },
      { title: "Golf Pants", description: "Clean performance pants for golf apparel programs." },
      { title: "Club Apparel", description: "Custom apparel solutions for golf clubs and organizations." },
      { title: "Corporate Golf Wear", description: "Branded golf apparel for company events and campaigns." }
    ], features: genericFeatures(),
    designs: [
      { title: "Elite Green Polo", description: "White, forest green and beige golf polo set for clubs and events.", image: "/images/sports-pages/golf/design-1.webp" },
      { title: "Corporate Navy Polo", description: "Navy and white golf polo for corporate sports programs.", image: "/images/sports-pages/golf/design-2.webp" },
      { title: "Event Golf Set", description: "Green and gray golf apparel for event and club programs.", image: "/images/sports-pages/golf/design-3.webp" }
    ],
    buyerTypes: [
      { title: "Golf Clubs", description: "Custom club apparel and polo shirts." },
      { title: "Corporate Events", description: "Branded golf wear for company sports events." },
      { title: "Brands", description: "OEM/ODM golf apparel development." },
      { title: "Wholesalers", description: "Custom golf wear supply for regional buyers." }
    ], faqs: commonFaqs,
  },
  {
    slug: "custom-training-wear",
    metaTitle: "Custom Training Wear & Warm-up Suits Manufacturer | POXIOL",
    metaDescription: "Custom training wear, warm-up suits, tracksuits, jackets and team travel apparel for clubs, schools and brands. POXIOL offers OEM/ODM, fast sampling and free mockup.",
    eyebrow: "CUSTOM TRAINING WEAR",
    h1: "Custom Training Wear and Warm-up Suits for Teams",
    heroText: "Create custom tracksuits, warm-up jackets, training tops, pants and team travel apparel for clubs, schools, coaches and sportswear brands.",
    heroImage: "/images/sports-pages/training/hero.png",
    primaryKeyword: "custom training wear",
    productTypes: [
      { title: "Tracksuits", description: "Custom jacket and pants sets for team travel and warmups." },
      { title: "Warm-up Jackets", description: "Team jackets with custom colors, logos and graphics." },
      { title: "Training Pants", description: "Comfortable pants for training, travel and team activities." },
      { title: "Training Tops", description: "Lightweight tops for practice and athletic programs." },
      { title: "Team Travel Suits", description: "Unified apparel systems for clubs, schools and coaches." }
    ], features: genericFeatures(),
    designs: [
      { title: "Pro Training Set", description: "Charcoal, white and electric lime tracksuit for warmups and travel.", image: "/images/sports-pages/training/design-1.webp" },
      { title: "Navy Travel Set", description: "Navy and white warm-up jacket and pants for team travel.", image: "/images/sports-pages/training/design-2.webp" },
      { title: "Black Motion Set", description: "Black and gray training top and pants with lime accents.", image: "/images/sports-pages/training/design-3.webp" }
    ],
    buyerTypes: [
      { title: "Clubs", description: "Warmups and travel apparel for club teams." },
      { title: "Schools", description: "Training wear for school sports departments." },
      { title: "Coaches", description: "Custom team apparel for staff and coaches." },
      { title: "Brands", description: "OEM/ODM training wear collection development." }
    ], faqs: commonFaqs,
  },
  {
    slug: "custom-rugby-uniforms",
    metaTitle: "Custom Rugby Jersey Manufacturer | Rugby Teamwear | POXIOL",
    metaDescription: "POXIOL is a professional custom rugby jersey manufacturer specializing in OEM teamwear, sublimation printing, high-durability rugby jerseys and custom uniforms for clubs, schools, distributors and sports brands worldwide.",
    eyebrow: "CUSTOM RUGBY TEAMWEAR",
    h1: "Custom Rugby Jersey Manufacturer",
    heroText: "POXIOL provides professional custom teamwear manufacturing for rugby jerseys, rugby shorts, youth rugby uniforms. We support clubs, schools, academies, distributors and sports brands with fast mockups, flexible MOQ and reliable production.",

    heroImage: "/images/sports-pages/rugby/hero.png",
    primaryKeyword: "custom rugby jerseys",
    productTypes: [
      { title: "Rugby Jerseys", description: "Durable, high-tensile jerseys built for contact sports." },
      { title: "Rugby Shorts", description: "Reinforced shorts with internal drawstrings and grip waistbands." },
      { title: "Training Apparel", description: "Rugby singlets, training tops and warmup gear for teams." },
      { title: "Club Wear", description: "Custom polo shirts and travel apparel for rugby clubs." }
    ], features: genericFeatures(),
    designs: [
      { title: "Pacific Pro Jersey", description: "Traditional patterns with modern reinforced construction.", image: "/images/designs/samoa-rugby-jersey.webp" },
      { title: "Elite Club Kit", description: "Clean, professional look for competitive rugby clubs.", image: "/images/designs/united-field-soccer-kit.webp" }
    ],
    buyerTypes: [
      { title: "Rugby Clubs", description: "Professional kits for competitive rugby teams." },
      { title: "Schools", description: "Durable uniforms for school rugby programs." },
      { title: "Brands", description: "OEM/ODM rugby apparel development." }
    ], faqs: commonFaqs,
  },
  {
    slug: "custom-esports-jerseys",
    metaTitle: "Custom Esports Jersey Manufacturer | Pro Gaming Teamwear | POXIOL",
    metaDescription: "POXIOL is a professional custom esports jersey manufacturer specializing in OEM teamwear, sublimation printing, pro gaming apparel and custom uniforms for gaming teams, schools, distributors and sports brands worldwide.",
    eyebrow: "CUSTOM ESPORTS TEAMWEAR",
    h1: "Custom Esports Jersey Manufacturer",
    heroText: "POXIOL provides professional custom teamwear manufacturing for esports jerseys, pro gaming hoodies, team jackets. We support clubs, schools, academies, distributors and sports brands with fast mockups, flexible MOQ and reliable production.",

    heroImage: "/images/sports-pages/esports/hero.png",
    primaryKeyword: "custom esports jerseys",
    productTypes: [
      { title: "Pro Jerseys", description: "Vibrant sublimated jerseys with custom team graphics and player IDs." },
      { title: "Esports Hoodies", description: "Premium hoodies and zip-ups for team travel and events." },
      { title: "Gaming Jackets", description: "Technical jackets designed for pro gaming comfort." },
      { title: "Event Apparel", description: "Staff and fan apparel for esports tournaments and launches." }
    ], features: genericFeatures(),
    designs: [
      { title: "Cyber Neon Jersey", description: "High-contrast neon graphics for maximum visual impact.", image: "/images/designs/cyber-league-esports.webp" },
      { title: "Stealth Gaming Set", description: "Dark, professional aesthetic for pro esports organizations.", image: "/images/designs/storm-court-basketball.webp" }
    ],
    buyerTypes: [
      { title: "Pro Teams", description: "Custom pro jerseys for competitive gaming organizations." },
      { title: "Gaming Clubs", description: "Affordable teamwear for local and online gaming communities." },
      { title: "Brands", description: "OEM/ODM gaming apparel development." }
    ], faqs: commonFaqs,
  },
];


export function getSportsPageBySlug(slug: string) {
  return sportsPages.find((page) => page.slug === slug);
}
