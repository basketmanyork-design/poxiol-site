export type CaseStudy = {
  slug: string;
  title: string;
  clientType: string;
  country: string;
  quantity: string;
  product: string;
  challenge: string;
  solution: string;
  result: string;
  image: string;
};

export const caseStudies: CaseStudy[] = [
  {
    slug: "usa-basketball-academy-uniform-program",
    title: "USA Basketball Academy Professional Uniform Program",
    clientType: "Basketball Academy",
    country: "United States",
    quantity: "300 sets",
    product: "Sublimated Basketball Uniforms",
    challenge: "The academy required breathable custom basketball uniforms for tournament competition and training programs.",
    solution: "POXIOL developed sublimated basketball jerseys and shorts with quick-dry polyester, custom player names, individual numbers and team branding.",
    result: "The academy launched the season with a unified team identity and durable uniforms suitable for competitive play.",
    image: "https://sc02.alicdn.com/kf/A772a22928d684adb8167d7d829671a08I.png",
  },
  {
    slug: "australia-soccer-club-kit-project",
    title: "Australia Soccer Club Elite Kit Launch",
    clientType: "Soccer Club",
    country: "Australia",
    quantity: "500 sets",
    product: "Soccer Kits",
    challenge: "The club needed home and away kits with sponsor visibility and consistent branding.",
    solution: "POXIOL produced match jerseys, training shirts, goalkeeper kits, sponsor branding and custom packaging.",
    result: "The club improved its visual identity and launched new teamwear before league season.",
    image: "https://sc02.alicdn.com/kf/Ab583a0a8bb5c4ff2a81a568159e94033H.png",
  },
  {
    slug: "school-athletics-multi-sport-program",
    title: "School Athletics Multi-Sport Uniform Program",
    clientType: "School Athletics Department",
    country: "United States",
    quantity: "800 pieces",
    product: "Multi-Sport Uniforms",
    challenge: "The school needed uniforms for multiple sports under one unified identity.",
    solution: "POXIOL supplied basketball uniforms, soccer kits and volleyball apparel with consistent color standards.",
    result: "The school established a professional athletic identity across all sports programs.",
    image: "https://sc02.alicdn.com/kf/A0f261719535c4e9aa43fd2bcb07cb17dB.png",
  },
  {
    slug: "europe-volleyball-team-apparel-project",
    title: "European Professional Volleyball Tournament Gear",
    clientType: "Volleyball Team",
    country: "Europe",
    quantity: "200 sets",
    product: "Volleyball Uniforms",
    challenge: "The team needed lightweight stretch uniforms for competitive matches.",
    solution: "POXIOL selected stretch performance fabric and produced custom sublimated volleyball uniforms.",
    result: "The team received comfortable tournament uniforms with a professional visual identity.",
    image: "https://sc02.alicdn.com/kf/A4533af8b04db4d1298efa1baf63d11a8a.png",
  },
  {
    slug: "middle-east-sports-event-program",
    title: "Middle East International Sports Event Program",
    clientType: "Sports Event Organizer",
    country: "Middle East",
    quantity: "1200 pieces",
    product: "Event Uniforms",
    challenge: "The event required large-volume custom uniforms with strict delivery deadlines.",
    solution: "POXIOL provided mass production, sublimation printing, event branding and logistics planning.",
    result: "Uniforms were delivered before event launch and supported a unified event image.",
    image: "https://sc02.alicdn.com/kf/Ae0775326d0f14eae9deb24588c952252r.png",
  },
  {
    slug: "canada-basketball-club-program",
    title: "Canada Basketball Club Reversible Program",
    clientType: "Basketball Club",
    country: "Canada",
    quantity: "250 sets",
    product: "Reversible Basketball Uniforms",
    challenge: "The club required custom reversible uniforms for training and competition.",
    solution: "POXIOL developed reversible basketball jerseys with team colors, numbers and sponsor graphics.",
    result: "The club improved training flexibility and match-day presentation.",
    image: "https://sc02.alicdn.com/kf/A4f2c0bb476fe4b92b27c1438f156e7c03.png",
  },
  {
    slug: "uk-football-academy-kit-program",
    title: "UK Football Academy Youth Kit Program",
    clientType: "Football Academy",
    country: "United Kingdom",
    quantity: "400 sets",
    product: "Soccer Kits & Training Wear",
    challenge: "The academy needed soccer kits and training wear for youth teams.",
    solution: "POXIOL produced match kits, training shirts and goalkeeper apparel with academy branding.",
    result: "The academy created a consistent professional appearance across age groups.",
    image: "https://sc02.alicdn.com/kf/Ad40bd4153a154c6d9cf2eb6e7323340eZ.png",
  },
  {
    slug: "private-label-teamwear-brand-launch",
    title: "New Sportswear Brand Private Label Launch",
    clientType: "Sportswear Brand",
    country: "Global",
    quantity: "1000 pieces",
    product: "OEM Teamwear Collection",
    challenge: "A new brand needed private label basketball and soccer apparel for launch.",
    solution: "POXIOL supported OEM production, custom labels, hang tags and branded packaging.",
    result: "The brand launched its first teamwear collection with professional presentation.",
    image: "https://sc02.alicdn.com/kf/A50d83c550d9f43548963f0a54327adb3N.png",
  },
  {
    slug: "distributor-bulk-teamwear-program",
    title: "Global Teamwear Distributor Bulk Program",
    clientType: "Teamwear Distributor",
    country: "Global",
    quantity: "3000 pieces",
    product: "Bulk Sportswear Supply",
    challenge: "A distributor needed scalable production across multiple sports categories.",
    solution: "POXIOL provided basketball, soccer and baseball teamwear with repeatable production standards.",
    result: "The distributor expanded its product offering and improved supply reliability.",
    image: "https://sc02.alicdn.com/kf/A52b2f94464374e28adda193b6547ef4dw.png",
  },
  {
    slug: "university-athletics-project",
    title: "US University Coordinated Athletics Project",
    clientType: "University Sports Program",
    country: "United States",
    quantity: "1000 pieces",
    product: "Coordinated Team Apparel",
    challenge: "The university needed coordinated apparel across several athletic teams.",
    solution: "POXIOL created custom teamwear using consistent color standards, sizing and packaging.",
    result: "The athletics program improved uniform consistency across departments.",
    image: "https://sc02.alicdn.com/kf/A90d246ea5a2a4e6fb858541ecb9128b24.png",
  },
];

export function getCaseStudyBySlug(slug: string) {
  return caseStudies.find((p) => p.slug === slug);
}
