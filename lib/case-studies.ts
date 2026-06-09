export type CaseStudy = {
  slug: string;
  title: string;
  clientType: string;
  country: string;
  quantity: string;
  product: string;
  timeline: string;
  challenge: string;
  solution: string;
  result: string;
  image: string;
};

export const caseStudies: CaseStudy[] = [
  {
    slug: "usa-basketball-academy-uniform-program",
    title: "Basketball Academy Uniform Program",
    clientType: "Basketball Academy",
    country: "North America",
    quantity: "300 sets",
    product: "Reversible basketball jersey sets",
    timeline: "21 days",
    challenge: "The academy needed breathable reversible uniforms for training and tournament use, with individual player names and numbers.",
    solution: "We prepared front/back mockups, confirmed size breakdown, produced one sample set and then moved into bulk production after approval.",
    result: "Uniforms were delivered for the tournament schedule, with consistent color, clear number printing and size grouping.",
    image: "/images/projects/project-basketball.webp",
  },
  {
    slug: "australia-soccer-club-kit-project",
    title: "Soccer Club Home & Away Kit Launch",
    clientType: "Soccer Club",
    country: "Australia",
    quantity: "500 sets",
    product: "Home and away soccer kits",
    timeline: "25 days",
    challenge: "The club needed two kit colors, sponsor logo placement and unified visual identity for several teams.",
    solution: "We organized design mockups for both home and away kits, prepared sponsor placement proof and supported youth/adult size planning.",
    result: "The club received a complete team kit program with consistent branding across age groups.",
    image: "/images/projects/project-soccer.webp",
  },
  {
    slug: "school-athletics-multi-sport-program",
    title: "School Multi-Sport Uniform Program",
    clientType: "School Athletics Department",
    country: "United States",
    quantity: "800 pieces",
    product: "Basketball, volleyball and training wear",
    timeline: "28 days",
    challenge: "The school needed coordinated uniforms across several sports with one shared school identity.",
    solution: "We created a unified color system and applied it across basketball, volleyball and training wear products.",
    result: "The school received a complete multi-sport package suitable for team photos, training and competitions.",
    image: "/images/projects/project-school.webp",
  },
  {
    slug: "middle-east-sports-event-program",
    title: "Sports Event Bulk Uniform Program",
    clientType: "Event Organizer",
    country: "Middle East",
    quantity: "1,200 pieces",
    product: "Event uniforms and staff apparel",
    timeline: "30 days",
    challenge: "The event required large-volume uniforms with multiple size groups and strict delivery deadline.",
    solution: "We organized size grouping, production schedule and packing labels to reduce distribution complexity.",
    result: "The order was packed by size and category, supporting smoother event distribution.",
    image: "/images/projects/project-volleyball.webp",
  },
  {
    slug: "distributor-bulk-teamwear-program",
    title: "Teamwear Distributor Bulk Program",
    clientType: "Regional Distributor",
    country: "Global",
    quantity: "3,000 pieces",
    product: "Multi-sport custom uniforms",
    timeline: "35 days",
    challenge: "The distributor needed scalable production across several teamwear categories for repeat local buyers.",
    solution: "We supported repeatable mockup templates, product category planning, fabric recommendations and bulk production.",
    result: "The distributor built a broader custom teamwear catalog with a more stable manufacturing workflow.",
    image: "/images/manufacturing/packing-shipping.webp",
  },
];

export function getCaseStudyBySlug(slug: string) {
  return caseStudies.find((p) => p.slug === slug);
}
