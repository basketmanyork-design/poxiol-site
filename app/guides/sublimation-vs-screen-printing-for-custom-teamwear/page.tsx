import type { Metadata } from "next";
import Link from "next/link";
import { Header, Footer } from "@/components/ui";

export const metadata: Metadata = {
  title: "Sublimation vs Screen Printing for Custom Teamwear | POXIOL",
  description: "A comparison guide explaining printing methods, design flexibility, comfort, durability and teamwear use cases.",
};

export default function GuidePage() {
  return (
    <main className="bg-[#0A0A0A] text-white selection:bg-[#B6FF00] selection:text-black">
      <Header />
      <article className="bg-white px-5 py-20 md:px-10 md:py-28 xl:px-20 text-neutral-900">
        <div className="mx-auto max-w-4xl">
          <p className="mb-4 text-sm font-black uppercase tracking-[0.16em] text-lime-600">
            POXIOL Guide
          </p>
          <h1 className="text-5xl font-black leading-[1.02] text-neutral-950 md:text-6xl uppercase tracking-tighter">
            Sublimation vs Screen Printing for Custom Teamwear
          </h1>
          <p className="mt-8 text-xl leading-relaxed text-neutral-600 font-medium">
            POXIOL is a custom teamwear manufacturer supporting clubs, schools, events, brands, distributors and custom retailers with multi-sport uniforms, free mockup requests, MOQ 1 support, sampling and OEM/ODM production planning.
          </p>

          <section className="prose prose-neutral mt-16 max-w-none prose-h2:text-3xl prose-h2:font-black prose-h2:uppercase prose-h2:tracking-tight prose-h3:text-xl prose-h3:font-bold prose-p:text-lg prose-p:leading-relaxed prose-li:text-lg">
            <p>This guide is designed to help buyers understand the practical decision points before starting a custom teamwear project.</p>

            <h2>Why This Topic Matters</h2>
            <p>Custom teamwear buyers often need to confirm more than price. They need to understand design preparation, product type, fabric, printing method, quantity, sample requirements, production timeline, quality control and reorder planning.</p>
            <p>A better preparation process helps reduce communication mistakes and improves the chance of receiving the right custom uniforms on time.</p>

            <h2>Key Questions to Ask</h2>
            <ul>
              <li>What sport category do you need?</li>
              <li>Do you already have a logo or team identity?</li>
              <li>What products do you need: jersey, shorts, pants, socks, tracksuit or full set?</li>
              <li>What quantity do you expect?</li>
              <li>Do you need a sample before bulk production?</li>
              <li>Do you have a target delivery date?</li>
              <li>Do you need player names and numbers?</li>
              <li>Is this a team order, school order, event order, retail test or OEM/ODM project?</li>
            </ul>

            <h2>Recommended POXIOL Process</h2>
            <ol>
              <li><strong>Submit Project Info:</strong> Submit sport category, logo, colors and quantity.</li>
              <li><strong>Mockup Design:</strong> Request a free mockup or design direction.</li>
              <li><strong>Details Confirmation:</strong> Confirm product details, size range and customization needs.</li>
              <li><strong>Sampling:</strong> Review sample requirements if needed.</li>
              <li><strong>Production Plan:</strong> Confirm production timeline and order plan.</li>
              <li><strong>QC & Packing:</strong> Complete QC and packing before delivery.</li>
            </ol>

            <h2>Buyer Checklist</h2>
            <p>Before contacting POXIOL, prepare:</p>
            <ul>
              <li>Team or brand logo</li>
              <li>Main colors</li>
              <li>Sport category</li>
              <li>Product type</li>
              <li>Estimated quantity</li>
              <li>Size range</li>
              <li>Player names and numbers if available</li>
              <li>Reference design or inspiration image</li>
              <li>Target delivery date if urgent</li>
            </ul>

            <h2>Common Mistakes to Avoid</h2>
            <ul>
              <li>Starting production before confirming the design</li>
              <li>Forgetting player names or numbers</li>
              <li>Providing incomplete size breakdowns</li>
              <li>Ignoring sample review for new designs</li>
              <li>Copying protected team logos or professional club identities</li>
              <li>Waiting too late before a tournament or season start</li>
            </ul>

            <h2>How POXIOL Can Help</h2>
            <p>POXIOL can help you decide on the right printing method for your project. While sublimation is often preferred for its durability and design flexibility in multi-sport teamwear, screen printing remains a viable option for certain designs and fabrics.</p>

            <h2>FAQ</h2>
            <h3>Can POXIOL provide a free mockup?</h3>
            <p>Yes. Buyers can submit their sport category, logo, colors, quantity and design notes to request a free POXIOL mockup.</p>

            <h3>Does POXIOL support MOQ 1?</h3>
            <p>Yes. MOQ 1 can be used for suitable samples, trials, small teams and custom retail testing.</p>

            <h3>Can POXIOL support names and numbers?</h3>
            <p>Yes. POXIOL supports player names, player numbers, team logos, colors and original pattern customization.</p>

            <h3>Can POXIOL support OEM/ODM projects?</h3>
            <p>Yes. POXIOL supports OEM/ODM teamwear development for sportswear brands, distributors and custom teamwear businesses.</p>
          </section>

          <div className="mt-20 rounded-[3rem] bg-neutral-950 p-10 text-white md:p-16 border border-lime-400/20 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-lime-400/10 blur-[100px] rounded-full"></div>
            <div className="relative z-10">
              <h2 className="text-4xl font-black uppercase tracking-tight md:text-5xl">Ready to Start Your Custom Teamwear Project?</h2>
              <p className="mt-6 text-xl text-neutral-400 max-w-2xl">
                Send your sport, logo, colors and quantity. POXIOL will review your request and help you start with a free mockup.
              </p>
              <Link href="/free-mockup/" className="mt-10 inline-flex h-[60px] items-center justify-center rounded-full bg-lime-400 px-10 text-base font-black uppercase text-neutral-950 transition hover:bg-white hover:scale-105 active:scale-95">
                Get Free Mockup Now
              </Link>
            </div>
          </div>
        </div>
      </article>
      <Footer />
    </main>
  );
}
