export type BuyingGuide = {
  slug: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  eyebrow: string;
  h1: string;
  intro: string;
  sections: { title: string; content: string }[];
  faqs: { question: string; answer: string }[];
};

export const buyingGuides: BuyingGuide[] = [
  {
    slug: "how-to-order-custom-basketball-uniforms",
    title: "How to Order Custom Basketball Uniforms | Ordering Process Guide | POXIOL",
    metaTitle: "How to Order Custom Basketball Uniforms | 5-Step Ordering Guide",
    metaDescription: "Learn the step-by-step process of ordering custom basketball uniforms from POXIOL. From design mockups to bulk production and shipping.",
    eyebrow: "Step-by-Step Guide",
    h1: "How To Order Custom Basketball Uniforms",
    intro: "Ordering custom teamwear shouldn't be complicated. At POXIOL, we've streamlined our manufacturing process to ensure you get professional-grade basketball uniforms with zero stress. Follow this simple 5-step guide to launch your team project.",
    sections: [
      {
        title: "Step 1: Consultation & Mockup",
        content: "Share your team's vision, colors, and logos with our design team. We provide a professional 3D mockup within 24 hours for your approval.",
      },
      {
        title: "Step 2: Size & Roster Collection",
        content: "Use our sizing guides to collect measurements for your players. Provide us with your roster including player names and numbers.",
      },
      {
        title: "Step 3: Prototyping (Optional)",
        content: "For large orders, we can produce a physical sample to verify fabric feel, color accuracy, and fit before bulk production.",
      },
      {
        title: "Step 4: Bulk Production",
        content: "Once the design and roster are finalized, our factory begins the sublimation and sewing process. Most orders are completed in 10-14 days.",
      },
      {
        title: "Step 5: Quality Check & Express Shipping",
        content: "Every garment undergoes a 3-point inspection before being vacuum-sealed and shipped via express courier to your doorstep.",
      },
    ],
    faqs: [
      { question: "Can I order just one sample?", answer: "Yes, we support sample orders to ensure you are 100% satisfied with the quality before committing to a full team order." },
      { question: "What is the standard turnaround time?", answer: "Our standard production time is 10-14 days after design approval, plus 3-5 days for international express shipping." },
    ],
  },
  {
    slug: "basketball-uniform-size-guide",
    title: "Basketball Uniform Size Guide | Adult & Youth Measurement Chart | POXIOL",
    metaTitle: "Basketball Uniform Size Guide | Find Your Perfect Fit",
    metaDescription: "Detailed sizing charts for custom basketball jerseys and shorts. Comprehensive measurements for youth, men's, and women's teamwear.",
    eyebrow: "Sizing Expert",
    h1: "Basketball Uniform Size Guide",
    intro: "Getting the right fit is critical for performance on the court. Our basketball uniforms are designed with an athletic fit that allows for maximum range of motion while maintaining a professional silhouette.",
    sections: [
      {
        title: "How to Measure",
        content: "To find your size, measure the chest width (pit to pit) of your favorite jersey and compare it to our chart. For shorts, measure the waist circumference and desired inseam.",
      },
      {
        title: "Youth vs Adult Sizing",
        content: "We offer a full range of sizes from Youth XS to Adult 5XL. Our youth sizes are cut specifically for younger athletes with shorter torsos and proportional sleeve openings.",
      },
    ],
    faqs: [
      { question: "Do your sizes run small?", answer: "Our basketball uniforms are designed with a standard athletic fit. If you prefer a baggier '90s style, we recommend sizing up." },
      { question: "Can I request custom measurements?", answer: "As a manufacturer, we can adjust lengths (extra long jerseys) upon request for tall players." },
    ],
  },
  {
    slug: "sublimation-printing-guide",
    title: "Sublimation Printing Guide | Custom Teamwear Technology | POXIOL",
    metaTitle: "What is Sublimation Printing? | Teamwear Technology Guide",
    metaDescription: "Explore the benefits of dye-sublimation printing for custom sportswear. Learn why it's the gold standard for durable, high-vibrancy team uniforms.",
    eyebrow: "Manufacturing Tech",
    h1: "The Ultimate Guide to Sublimation Printing",
    intro: "Dye-sublimation is the gold standard for custom teamwear. Unlike screen printing or heat transfers, sublimation infuses the ink directly into the fabric fibers, ensuring designs never crack, peel, or fade.",
    sections: [
      {
        title: "The Sublimation Process",
        content: "High-heat and pressure are used to turn solid dye into gas, which then permeates the polyester fibers. As the fabric cools, the dye becomes a permanent part of the garment.",
      },
      {
        title: "Benefits for Athletes",
        content: "Because the design isn't 'sitting' on top of the fabric, the garment remains fully breathable and lightweight, no matter how complex the graphics.",
      },
    ],
    faqs: [
      { question: "Does sublimation work on cotton?", answer: "Sublimation requires polyester fibers to bond correctly. For performance teamwear, we use high-grade polyesters and poly-blends." },
      { question: "Is there a limit to colors?", answer: "No. Sublimation allows for unlimited colors, gradients, and fine details at no additional cost." },
    ],
  },
];

export function getGuideBySlug(slug: string) {
  return buyingGuides.find((g) => g.slug === slug);
}
