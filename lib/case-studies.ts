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
};

export const caseStudies: CaseStudy[] = [
  {
    slug: "usa-basketball-academy-uniform-program",
    title: "USA Basketball Academy Uniform Program",
    clientType: "Basketball Academy",
    country: "North America",
    quantity: "300 Sets",
    product: "Reversible Basketball Uniform Sets",
    timeline: "21 Days",
    customization: "Team logo, player number, reversible color design, youth/adult size breakdown",
    overview: "POXIOL supported a basketball academy uniform program with reversible basketball jersey sets, player number customization, size grouping and production planning for training and tournament use.",
    buyerBackground: "The buyer needed a consistent basketball uniform program for academy training sessions and tournament games. The uniforms had to be lightweight, breathable and easy to reorder for future team expansion.",
    orderRequirements: [
      "Reversible jersey + shorts set",
      "Team identity based on black, white and green color system",
      "Player number customization",
      "Youth and adult size planning",
      "Sample confirmation before bulk order",
      "Size-grouped packing for team distribution"
    ],
    designMockup: "POXIOL prepared front and back mockups based on the academy's color direction and player number requirements. The buyer reviewed the visual layout before moving to sample production.",
    fabricPrinting: "The project used lightweight performance fabric with sublimation printing for long-lasting color and clear number graphics.",
    productionTimeline: [
      "Day 1–3: Design mockup and layout confirmation",
      "Day 4–8: Sample preparation and review",
      "Day 9–18: Bulk production",
      "Day 19–21: QC, packing and shipment preparation"
    ],
    qualityControl: "POXIOL checked fabric surface, print clarity, stitching strength, size measurement and packing quantity before shipment.",
    packingDelivery: "Uniforms were sorted by size and packed for easier team distribution after delivery.",
    challenge: "The academy needed highly breathable and durable reversible uniforms that allowed player-level custom numbering, delivered strictly before their tournament season.",
    solution: "We engineered a dual-layer lightweight polyester mesh system, rendered full visual mocks, and did custom sorting by size prior to air shipping.",
    result: "The academy received a complete reversible basketball uniform program with consistent colors, clear numbers and size-grouped delivery.",
    image: "/images/poxiol-v62/home_hero_v62.png", // Hero Team visual is perfect for basketball academy teamwear
  },
  {
    slug: "australia-soccer-club-kit-project",
    title: "Soccer Club Kit Launch",
    clientType: "Soccer Club",
    country: "Australia",
    quantity: "500 Sets",
    product: "Home & Away Soccer Kits",
    timeline: "25 Days",
    customization: "Club color design, team number, sponsor placement, size breakdown",
    overview: "POXIOL supported a soccer club with home and away kit development, custom color matching, mockup confirmation and bulk production planning.",
    buyerBackground: "The club needed a coordinated kit launch for several teams, including home and away color options and consistent visual identity.",
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
      "Day 1–3: Mockup development",
      "Day 4–7: Sample confirmation",
      "Day 8–21: Bulk production",
      "Day 22–25: Inspection, packing and shipping preparation"
    ],
    qualityControl: "Checks included color consistency, print alignment, stitching, size measurements and order quantity.",
    packingDelivery: "The order was packed by size and kit type to support easier club distribution.",
    challenge: "The soccer club required home and away kits that preserved perfect team colors while seamlessly integrating their newly signed local B2B sponsor logo without distortion.",
    solution: "We did print calibration on 140gsm interlock polyester and aligned sponsor graphics across all adult and junior sizes prior to bulk hot press sublimation.",
    result: "The club completed its kit launch with a unified home and away uniform system.",
    image: "/images/poxiol-v62/project_soccer_club_v62.png",
  },
  {
    slug: "school-athletics-multi-sport-program",
    title: "School Multi-Sport Program",
    clientType: "School Athletics Department",
    country: "United States",
    quantity: "800 Pieces",
    product: "Basketball Uniforms, Volleyball Uniforms, Training Wear",
    timeline: "28 Days",
    customization: "Unified color system, team logo placement, player numbers, size-grouped packing",
    overview: "POXIOL supported a school athletics department with a coordinated multi-sport apparel program covering basketball, volleyball and training wear.",
    buyerBackground: "The school needed consistent visual identity across multiple sports teams, while keeping product types and size requirements organized.",
    orderRequirements: [
      "Basketball uniforms",
      "Volleyball uniforms",
      "Training wear",
      "Unified color and pattern direction",
      "Player number customization",
      "Size grouping by sport and team"
    ],
    designMockup: "POXIOL created a unified design system and applied it across different sports categories, helping the school maintain consistent branding.",
    fabricPrinting: "Different fabric options were matched to each product category, with sublimation printing used for clear graphics and color consistency.",
    productionTimeline: [
      "Day 1–5: Multi-sport design mockup",
      "Day 6–10: Sample and size confirmation",
      "Day 11–24: Bulk production",
      "Day 25–28: QC, packing and delivery preparation"
    ],
    qualityControl: "The QC process checked fabric, print, stitching, measurements and packing separation for each sport category.",
    packingDelivery: "Items were sorted by sport category, size and team group for easier distribution.",
    challenge: "The school needed consistent athletic colors across three distinct apparel categories (basketball, volleyball, and tracksuits) utilizing different fabrics.",
    solution: "Our laboratory performed dye-matching on mesh, interlock, and tricot fabrics to guarantee color uniformity, backed by custom size tag coding.",
    result: "The school received a complete multi-sport apparel program with unified identity and organized delivery.",
    image: "/images/poxiol-v62/project_school_multisport_v62.png",
  },
  {
    slug: "middle-east-sports-event-program",
    title: "Sports Event Bulk Uniform Program",
    clientType: "Event Organizer",
    country: "Middle East",
    quantity: "1,200 Pieces",
    product: "Event uniforms and staff apparel",
    timeline: "30 Days",
    customization: "Event colors, volunteer badge printing, size-grouped carton labeling",
    overview: "POXIOL supported a major regional race event with highly breathable custom event shirts and uniform sets for competitors and volunteers.",
    buyerBackground: "The buyer needed bulk event apparel delivered directly to the tournament arena, requiring clear box labeling to enable rapid day-one distribution.",
    orderRequirements: [
      "Lightweight racerback singlets",
      "Crewneck volunteer t-shirts",
      "Sponsor logo placements",
      "Custom size tags and polybags"
    ],
    designMockup: "POXIOL mapped out logo scale variations across small, medium, and XXL templates to ensure perfect branding alignment.",
    fabricPrinting: "We deployed 120gsm ultra-dry mesh fabrics designed for hot climates, with eco-friendly sublimation inks.",
    productionTimeline: [
      "Day 1–4: Order setup & vector checks",
      "Day 5–9: Color calibration and strike-offs",
      "Day 10–25: Automated cutting & high-speed bulk sewing",
      "Day 26–30: Size QC, sorting and freight packing"
    ],
    qualityControl: "Rigorous alignment checks for volunteer logos, stitch durability tests, and quantitative packing validation.",
    packingDelivery: "Cartons were labeled by size range and delivered directly to the logistics hub.",
    challenge: "High-volume demand required extremely light, heat-defying running fabrics with absolute sponsor branding consistency under tight shipping deadlines.",
    solution: "We allocated our high-speed laser cutting line and prioritized the order in our automated sublimation print department.",
    result: "The order was successfully delivered on-schedule, fully sorted, supporting seamless event-day rollout.",
    image: "/images/poxiol-v6/manufacturing_packing_global_delivery.png",
  },
  {
    slug: "distributor-bulk-teamwear-program",
    title: "Teamwear Distributor Bulk Program",
    clientType: "Regional Distributor",
    country: "Global",
    quantity: "3,000 Pieces",
    product: "Multi-sport custom uniforms",
    timeline: "35 Days",
    customization: "Repeatable design catalogs, custom collar labels, generic packaging",
    overview: "POXIOL established an OEM partnership with a regional distributor to manufacture and replenish their seasonal teamwear inventory.",
    buyerBackground: "The distributor required blank mockup templates and bulk uniform supply with original brand labels to serve local leagues.",
    orderRequirements: [
      "Basketball, soccer and training shirts",
      "Custom brand collar labels and tags",
      "Generic individual packaging",
      "Locked wholesale pricing structures"
    ],
    designMockup: "Our design team created blank vector templates for the distributor to utilize with their local design software.",
    fabricPrinting: "High-performance mesh and interlock polyester, customized woven collar labels.",
    productionTimeline: [
      "Day 1–5: Label approvals & catalog prep",
      "Day 6–12: Base fabric sorting & sizing tests",
      "Day 13–30: Bulk production run across three sew lines",
      "Day 31–35: Label checks, QC audit, and pallet packing"
    ],
    qualityControl: "Label sewing inspection, size conformity checking, and drop-shipping weight validation.",
    packingDelivery: "Packed in neutral high-grade polybags and palletized for global ocean freight.",
    challenge: "The distributor needed absolute fit and stitching consistency across multiple production batches to support repeat club buyers.",
    solution: "We established locked CAD pattern sizes and assigned a dedicated production team to handle all distributor reorders.",
    result: "The distributor successfully expanded their teamwear catalog with a more stable and predictable manufacturing workflow.",
    image: "/images/poxiol-v6/manufacturing_sublimation_printing.png",
  },
];

export function getCaseStudyBySlug(slug: string) {
  return caseStudies.find((p) => p.slug === slug);
}
