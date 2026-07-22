export type CaseStudy = {
  slug: string;
  title: string;
  clientType: string;
  country: string;
  quantity: string;
  product: string;
  timeline: string;
  customization: string;
  overview: string;
  buyerBackground: string;
  orderRequirements: string[];
  designMockup: string;
  fabricPrinting: string;
  productionTimeline: string[];
  qualityControl: string;
  packingDelivery: string;
  challenge: string;
  solution: string;
  result: string;
  image: string;
  snapshot: { item: string; details: string }[];
};

export const caseStudies: CaseStudy[] = [
  {
    slug: "usa-basketball-academy-uniform-program",
    title: "Basketball Academy Uniform Program",
    clientType: "Basketball Academy",
    country: "North America",
    quantity: "300 sets",
    product: "Reversible basketball jersey and shorts sets",
    timeline: "21 days",
    customization: "Team logo, player number, reversible color design, youth/adult size breakdown",
    overview: "POXIOL supported a basketball academy uniform program with reversible basketball jersey sets, player number customization, size grouping and production planning for training and tournament use.",
    buyerBackground: "The buyer was a basketball academy preparing uniforms for training sessions and tournament use. The academy needed a professional uniform system for multiple age groups and wanted the uniforms to be breathable, durable and easy to reorder.",
    orderRequirements: [
      "Reversible jersey + shorts set",
      "Team identity based on black, white and green color system",
      "Player number customization",
      "Youth and adult size planning",
      "Sample confirmation before bulk order",
      "Size-grouped packing for team distribution"
    ],
    designMockup: "POXIOL prepared front and back mockups based on the academy's colors and number layout. After sample confirmation, bulk production was arranged with size-grouped packing.",
    fabricPrinting: "The project used lightweight performance fabric with sublimation printing for long-lasting color and clear number graphics.",
    productionTimeline: [
      "Day 1鈥?: Design mockup and layout confirmation",
      "Day 4鈥?: Sample preparation and review",
      "Day 9鈥?8: Bulk production",
      "Day 19鈥?1: QC, packing and shipment preparation"
    ],
    qualityControl: "The QC process checked fabric surface, sublimation print clarity, number alignment, stitching strength, size measurement and packing labels.",
    packingDelivery: "Uniforms were sorted by size and packed for easier team distribution after delivery.",
    challenge: "The academy required reversible uniforms with clear number visibility and consistent team colors. The order also needed size grouping for easier distribution after delivery.",
    solution: "We engineered a dual-layer lightweight polyester mesh system, rendered full visual mocks, and did custom sorting by size prior to air shipping.",
    result: "The academy received a complete reversible uniform program with consistent color, clear numbers and organized packing.",
    image: "/images/poxiol-v62/projects_basketball_academy_uniform_program.png",
    snapshot: [
      { item: "Buyer Type", details: "Basketball Academy" },
      { item: "Region", details: "North America" },
      { item: "Product", details: "Reversible basketball jersey and shorts sets" },
      { item: "Quantity", details: "300 sets" },
      { item: "Timeline", details: "21 days" },
      { item: "Customization", details: "Team logo, player number, reversible color design, youth/adult size breakdown" },
      { item: "Related Product", details: "Custom Basketball Uniforms" }
    ]
  },
  {
    slug: "australia-soccer-club-kit-project",
    title: "Soccer Club Home & Away Kit Launch",
    clientType: "Soccer Club",
    country: "Australia",
    quantity: "500 sets",
    product: "Home and away soccer kits",
    timeline: "25 days",
    customization: "Club colors, sponsor placement, player numbers, youth/adult size breakdown",
    overview: "POXIOL supported a soccer club with home and away kit development, custom color matching, mockup confirmation and bulk production planning.",
    buyerBackground: "The soccer club needed a coordinated home and away kit launch before the season. The buyer wanted consistent team identity and clear sponsor placement.",
    orderRequirements: [
      "Home kit and away kit",
      "Team color matching",
      "Sponsor placement support",
      "Player number customization",
      "Youth and adult sizes",
      "Bulk order planning"
    ],
    designMockup: "POXIOL prepared mockups for both kit versions and helped the buyer review color balance, logo placement and number visibility.",
    fabricPrinting: "The kits used breathable performance fabric and sublimation printing for durable team graphics.",
    productionTimeline: [
      "Day 1鈥?: Mockup development",
      "Day 4鈥?: Sample confirmation",
      "Day 8鈥?1: Bulk production",
      "Day 22鈥?5: Inspection, packing and shipping preparation"
    ],
    qualityControl: "Checks included color consistency, sponsor placement, number visibility, stitching, size measurement and carton packing list.",
    packingDelivery: "The order was packed by size and kit type to support easier club distribution.",
    challenge: "The project required two kit colorways, number visibility and packing separated by kit type and size.",
    solution: "POXIOL prepared mockups for both home and away kits, helped review number visibility and sponsor placement, then arranged sample confirmation and bulk production.",
    result: "The club completed its kit launch with a unified home and away kit system.",
    image: "/images/poxiol-v62/projects_soccer_club_kit_launch.png",
    snapshot: [
      { item: "Buyer Type", details: "Soccer Club" },
      { item: "Region", details: "Australia" },
      { item: "Product", details: "Home and away soccer kits" },
      { item: "Quantity", details: "500 sets" },
      { item: "Timeline", details: "25 days" },
      { item: "Customization", details: "Club colors, sponsor placement, player numbers, youth/adult size breakdown" },
      { item: "Related Product", details: "Custom Soccer Kits" }
    ]
  },
  {
    slug: "school-athletics-multi-sport-program",
    title: "School Multi-Sport Uniform Program",
    clientType: "School Athletics Department",
    country: "United States",
    quantity: "800 pieces",
    product: "Basketball uniforms, volleyball uniforms and training wear",
    timeline: "28 days",
    customization: "Unified school color system, team logo placement, player numbers, size-grouped packing",
    overview: "POXIOL supported a school athletics department with a coordinated multi-sport apparel program covering basketball, volleyball and training wear.",
    buyerBackground: "The school needed a coordinated apparel program across several sports while maintaining one shared visual identity.",
    orderRequirements: [
      "Basketball uniforms",
      "Volleyball uniforms",
      "Training wear",
      "Unified color and pattern direction",
      "Player number customization",
      "Size grouping by sport and team"
    ],
    designMockup: "POXIOL created a unified design system and adapted it across basketball, volleyball and training wear. Packing was organized by sport, size and team group.",
    fabricPrinting: "Different fabric options were matched to each product category, with sublimation printing used for clear graphics and color consistency.",
    productionTimeline: [
      "Day 1鈥?: Multi-sport design mockup",
      "Day 6鈥?0: Sample and size confirmation",
      "Day 11鈥?4: Bulk production",
      "Day 25鈥?8: QC, packing and delivery preparation"
    ],
    qualityControl: "QC checked color consistency across sports, print position, stitching, size measurement, quantity by team and packing separation.",
    packingDelivery: "Items were sorted by sport category, size and team group for easier distribution.",
    challenge: "Different sports required different product fits and fabrics, but the school wanted consistent colors and branding.",
    solution: "POXIOL created a unified design system and adapted it across basketball, volleyball and training wear. Packing was organized by sport, size and team group.",
    result: "The school received a complete multi-sport apparel program with unified identity and organized delivery.",
    image: "/images/poxiol-v62/project_school_multisport_v62.png",
    snapshot: [
      { item: "Buyer Type", details: "School Athletics Department" },
      { item: "Region", details: "United States" },
      { item: "Product", details: "Basketball uniforms, volleyball uniforms and training wear" },
      { item: "Quantity", details: "800 pieces" },
      { item: "Timeline", details: "28 days" },
      { item: "Customization", details: "Unified school color system, team logo placement, player numbers, size-grouped packing" },
      { item: "Related Product", details: "Custom Teamwear for Schools" }
    ]
  },
  {
    slug: "middle-east-sports-event-program",
    title: "Sports Event Bulk Uniform Program",
    clientType: "Event Organizer",
    country: "Middle East",
    quantity: "1,200 pieces",
    product: "Event uniforms and staff apparel",
    timeline: "30 days",
    customization: "Event color system, size grouping, staff and participant apparel",
    overview: "POXIOL supported a sports event with uniforms for staff and participants, requiring strict delivery and organized packing.",
    buyerBackground: "The buyer needed uniforms for a sports event with a strict deadline and multiple size groups.",
    orderRequirements: [
      "Staff shirts",
      "Participant uniforms",
      "Event branding",
      "Multiple size groups"
    ],
    designMockup: "POXIOL confirmed branding and color layout for event staff and participants.",
    fabricPrinting: "Lightweight mesh for staff and training performance fabric for participants.",
    productionTimeline: [
      "Day 1鈥?: Prep and design confirmation",
      "Day 6鈥?5: Bulk production",
      "Day 26鈥?0: QC and export packing"
    ],
    qualityControl: "Checking print quality, size breakdown and event-day distribution labels.",
    packingDelivery: "Packed by staff/participant category and size.",
    challenge: "The event required a large volume of apparel delivered under a very tight timeline with complex distribution needs.",
    solution: "POXIOL confirmed size breakdown, arranged production scheduling and organized export packing labels to support easier event distribution.",
    result: "The buyer received event apparel sorted by size and category before the event date.",
    image: "/images/poxiol-v6/manufacturing_packing_global_delivery.png",
    snapshot: [
      { item: "Buyer Type", details: "Event Organizer" },
      { item: "Region", details: "Middle East" },
      { item: "Product", details: "Event uniforms and staff apparel" },
      { item: "Quantity", details: "1,200 pieces" },
      { item: "Timeline", details: "30 days" },
      { item: "Customization", details: "Event color system, size grouping, staff and participant apparel" },
      { item: "Related Product", details: "Custom Event Teamwear" }
    ]
  },
  {
    slug: "distributor-bulk-teamwear-program",
    title: "Teamwear Distributor Bulk Program",
    clientType: "Regional Distributor",
    country: "Global",
    quantity: "3,000 pieces",
    product: "Multi-sport custom uniforms",
    timeline: "35 days",
    customization: "Multi-sport category development, repeatable mockup templates, fabric recommendations",
    overview: "POXIOL established a repeatable manufacturing workflow for a regional distributor to support multiple teamwear categories.",
    buyerBackground: "The distributor needed a scalable production partner for multiple teamwear categories and repeat local buyers.",
    orderRequirements: [
      "Repeatable mockup templates",
      "Multi-sport fabric options",
      "Bulk production planning",
      "Distributor price support"
    ],
    designMockup: "POXIOL created design templates for the distributor's catalog.",
    fabricPrinting: "Durable sublimation inks on mesh and interlock fabrics.",
    productionTimeline: [
      "Day 1鈥?: Catalog prep",
      "Day 6鈥?0: Continuous production cycles",
      "Day 31鈥?5: QC and consolidated shipping"
    ],
    qualityControl: "Batch-level QC for color consistency and stitching durability.",
    packingDelivery: "Bulk packing for ocean or air freight.",
    challenge: "The distributor required a stable supply chain to handle consistent orders from various local sports teams and schools.",
    solution: "POXIOL supported product category planning, mockup template creation, fabric recommendations and bulk production workflow setup.",
    result: "The distributor expanded its custom teamwear catalog with a more repeatable production workflow.",
    image: "/images/poxiol-v6/manufacturing_sublimation_printing.png",
    snapshot: [
      { item: "Buyer Type", details: "Regional Distributor" },
      { item: "Region", details: "Global" },
      { item: "Product", details: "Multi-sport custom uniforms" },
      { item: "Quantity", details: "3,000 pieces" },
      { item: "Timeline", details: "35 days" },
      { item: "Customization", details: "Multi-sport category development, repeatable mockup templates, fabric recommendations" },
      { item: "Related Product", details: "OEM / ODM Teamwear" }
    ]
  },
];

export function getCaseStudyBySlug(slug: string) {
  return caseStudies.find((p) => p.slug === slug);
}
