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
    slug: "usa-basketball-academy-project",
    title: "USA Basketball Academy Professional Uniform Program",
    clientType: "Basketball Academy",
    country: "United States",
    quantity: "300 sets",
    product: "Sublimated Basketball Uniforms",
    challenge: "The client needed breathable uniforms with fast delivery before tournament season.",
    solution: "POXIOL provided quick-dry fabrics, custom sublimation design, player names and numbers, and quality control before shipping.",
    result: "The academy received professional uniforms before the tournament schedule.",
    image: "/images/projects/basketball-academy.webp",
  },
  {
    slug: "australia-soccer-club-project",
    title: "Australia Soccer Club Elite Kit Launch",
    clientType: "Soccer Club",
    country: "Australia",
    quantity: "500 sets",
    product: "Soccer Kits",
    challenge: "The club needed private label soccer kits with sponsor graphics.",
    solution: "POXIOL created sublimated soccer jerseys and shorts with club colors, sponsor logos and packaging support.",
    result: "The club launched a unified professional kit program.",
    image: "/images/projects/soccer-club.webp",
  },
  {
    slug: "europe-volleyball-team-project",
    title: "European Professional Volleyball Tournament Gear",
    clientType: "Volleyball Team",
    country: "Europe",
    quantity: "200 sets",
    product: "Volleyball Uniforms",
    challenge: "The team needed lightweight stretch uniforms for competitive matches.",
    solution: "POXIOL selected breathable stretch performance fabric and produced custom sublimated uniforms.",
    result: "The team received comfortable and professional tournament uniforms.",
    image: "/images/projects/volleyball-team.webp",
  },
];

export function getCaseStudyBySlug(slug: string) {
  return caseStudies.find((p) => p.slug === slug);
}
