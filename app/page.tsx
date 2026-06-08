import type { Metadata } from "next";
import Link from "next/link";
import StructuredData, { organizationSchema, websiteSchema, homepageFaqSchema } from "@/components/seo/StructuredData";

export const metadata: Metadata = {
  title: "Custom Teamwear Manufacturer | OEM Sports Uniform Supplier | POXIOL",
  description: "POXIOL is a professional custom teamwear manufacturer specializing in basketball uniforms, soccer kits, baseball jerseys and OEM sportswear manufacturing for clubs, schools and sports brands worldwide.",
};

export default function HomePage() {
  return (
    <main className="relative min-h-screen bg-[#0A0A0A] text-white selection:bg-[#B6FF00] selection:text-black">
      <StructuredData data={[organizationSchema, websiteSchema, homepageFaqSchema]} />

      {/* --- Visual Layout: High-Fidelity Slices Stack --- */}
      <div className="mx-auto max-w-[1920px] overflow-hidden">
        
        {/* 1. Hero & Trust Numbers Section */}
        <section className="relative w-full">
          <img 
            src="/images/homepage-v3/01_v3_hero_trust_numbers.png" 
            alt="POXIOL Custom Teamwear Manufacturing" 
            className="w-full h-auto object-cover"
          />
          {/* Top Navigation Links Overlay */}
          <div className="absolute top-0 left-0 w-full h-[10%] flex items-center justify-between px-[5%] lg:px-[10%]">
            <Link href="/" className="w-[15%] h-full block" aria-label="POXIOL Home" />
            <nav className="hidden md:flex w-[60%] h-full items-center justify-between">
              <Link href="/sports/" className="w-[12%] h-[60%] block" aria-label="Sports Categories" />
              <Link href="/sports/" className="w-[12%] h-[60%] block" aria-label="Teamwear" />
              <Link href="/oem-odm/" className="w-[12%] h-[60%] block" aria-label="OEM & ODM" />
              <Link href="/manufacturing/" className="w-[16%] h-[60%] block" aria-label="Manufacturing" />
              <Link href="/projects/" className="w-[12%] h-[60%] block" aria-label="Projects" />
              <Link href="/about/" className="w-[12%] h-[60%] block" aria-label="About Us" />
              <Link href="/contact/" className="w-[12%] h-[60%] block" aria-label="Contact Us" />
            </nav>
            <Link href="/contact/" className="w-[10%] h-[60%] hidden md:block" aria-label="Enquire Now" />
          </div>

          {/* Hero CTA Overlays */}
          <div className="absolute bottom-[22%] left-[4%] w-[40%] h-[12%] flex gap-4">
            <Link href="/free-mockup/" className="w-[50%] h-full block" aria-label="Get Free Mockup" />
            <Link href="/contact/?type=wholesale" className="w-[50%] h-full block" aria-label="Request Wholesale Quote" />
          </div>
        </section>

        {/* 2. Why POXIOL Section */}
        <section className="relative w-full">
          <img 
            src="/images/homepage-v3/02_v3_why_poxiol.png" 
            alt="Why Teams Choose POXIOL" 
            className="w-full h-auto object-cover"
          />
          <Link href="/free-mockup/" className="absolute inset-0 w-full h-full block" aria-label="Get Free Mockup" />
        </section>

        {/* 3. Featured Team Projects Section */}
        <section className="relative w-full">
          <img 
            src="/images/homepage-v3/03_v3_featured_team_projects.png" 
            alt="Featured Team Projects Showcase" 
            className="w-full h-auto object-cover"
          />
          <Link href="/projects/" className="absolute top-[5%] right-[5%] w-[15%] h-[8%] block" aria-label="View All Projects" />
          <div className="absolute bottom-[5%] left-[5%] w-[90%] h-[75%] grid grid-cols-4 gap-4">
            <Link href="/custom-basketball-uniforms/" className="w-full h-full block" aria-label="USA Basketball Academy Project" />
            <Link href="/custom-soccer-kits/" className="w-full h-full block" aria-label="Germany Soccer Club Project" />
            <Link href="/custom-running-marathon-wear/" className="w-full h-full block" aria-label="Australia Tournament Project" />
            <Link href="/custom-ice-hockey-jerseys/" className="w-full h-full block" aria-label="Canada Hockey Team Project" />
          </div>
        </section>

        {/* 4. How To Start Section */}
        <section className="relative w-full">
          <img 
            src="/images/homepage-v3/04_v3_how_to_start.png" 
            alt="How To Start Your Custom Teamwear Project" 
            className="w-full h-auto object-cover"
          />
          <Link href="/free-mockup/" className="absolute bottom-[10%] left-[40%] w-[20%] h-[12%] block" aria-label="Get Free Mockup Now" />
        </section>

        {/* 5. Real Manufacturing System Section */}
        <section className="relative w-full">
          <img 
            src="/images/homepage-v3/05_v4_real_manufacturing_system.png" 
            alt="POXIOL Real Manufacturing System" 
            className="w-full h-auto object-cover"
          />
          <Link href="/manufacturing/" className="absolute inset-0 w-full h-full block" aria-label="Explore Manufacturing Capability" />
        </section>

        {/* 6. OEM & ODM Solutions Section */}
        <section className="relative w-full">
          <img 
            src="/images/homepage-v3/06_v4_oem_odm_solutions.png" 
            alt="OEM and ODM Sportswear Solutions" 
            className="w-full h-auto object-cover"
          />
          <div className="absolute bottom-[12%] left-[4%] w-[40%] h-[12%] flex gap-4">
            <Link href="/free-mockup/" className="w-[50%] h-full block" aria-label="Start OEM Project" />
            <Link href="/oem-odm/" className="w-[50%] h-full block" aria-label="View OEM/ODM Solutions" />
          </div>
        </section>

        {/* 7. Customer Reviews Section */}
        <section className="relative w-full">
          <img 
            src="/images/homepage-v3/08_v4_customer_reviews.png" 
            alt="What Teams Say About POXIOL" 
            className="w-full h-auto object-cover"
          />
        </section>

        {/* 8. Club Partnership Program Section */}
        <section className="relative w-full">
          <img 
            src="/images/homepage-v3/09_v4_club_partnership_program.png" 
            alt="Club Partnership Program" 
            className="w-full h-auto object-cover"
          />
          <Link href="/contact/?type=partnership" className="absolute bottom-[12%] left-[42%] w-[16%] h-[12%] block" aria-label="Apply For Club Partnership" />
        </section>

        {/* 9. Resources Center Section */}
        <section className="relative w-full">
          <img 
            src="/images/homepage-v3/10_v5_resources_center.png" 
            alt="POXIOL Resources and Teamwear Guides" 
            className="w-full h-auto object-cover"
          />
          <div className="absolute bottom-[8%] left-[5%] w-[90%] h-[75%] grid grid-cols-4 gap-4">
            <Link href="/fabric-guide/" className="w-full h-full block" aria-label="Fabric Guide" />
            <Link href="/printing-guide/" className="w-full h-full block" aria-label="Printing Guide" />
            <Link href="/resources/" className="w-full h-full block" aria-label="Size Charts" />
            <Link href="/resources/" className="w-full h-full block" aria-label="Care Instructions" />
          </div>
        </section>

        {/* 10. FAQ Section */}
        <section className="relative w-full">
          <img 
            src="/images/homepage-v3/07_v5_faq_section.png" 
            alt="Frequently Asked Questions" 
            className="w-full h-auto object-cover"
          />
          <Link href="/faq/" className="absolute inset-0 w-full h-full block" aria-label="View Full FAQ Page" />
        </section>

        {/* 11. Explore By Sport Section */}
        <section className="relative w-full">
          <img 
            src="/images/homepage-v3/11_v5_explore_by_sport.png" 
            alt="Explore Custom Uniforms By Sport" 
            className="w-full h-auto object-cover"
          />
          <div className="absolute bottom-[10%] left-[5%] w-[90%] h-[80%] grid grid-cols-4 grid-rows-2 gap-4">
            <Link href="/custom-soccer-kits/" className="w-full h-full block" aria-label="Custom Soccer Kits" />
            <Link href="/custom-basketball-uniforms/" className="w-full h-full block" aria-label="Custom Basketball Uniforms" />
            <Link href="/custom-baseball-softball-uniforms/" className="w-full h-full block" aria-label="Custom Baseball Jerseys" />
            <Link href="/custom-ice-hockey-jerseys/" className="w-full h-full block" aria-label="Custom Hockey Jerseys" />
            <Link href="/custom-volleyball-uniforms/" className="w-full h-full block" aria-label="Custom Volleyball Uniforms" />
            <Link href="/custom-american-football-uniforms/" className="w-full h-full block" aria-label="Custom Football Uniforms" />
            <Link href="/custom-running-marathon-wear/" className="w-full h-full block" aria-label="Custom Running Wear" />
            <Link href="/sports/" className="w-full h-full block" aria-label="Explore More Sports" />
          </div>
        </section>

        {/* 12. Footer Contact Section */}
        <section className="relative w-full">
          <img 
            src="/images/homepage-v3/12_footer_contact.png" 
            alt="Contact POXIOL Teamwear" 
            className="w-full h-auto object-cover"
          />
          <Link href="/contact/" className="absolute inset-0 w-full h-full block" aria-label="Contact Us Form" />
        </section>

      </div>

      {/* --- Semantic Copy for SEO / AI Search Engines (GEO) --- */}
      <div className="sr-only">
        <header>
          <h2>POXIOL Teamwear Navigation</h2>
          <ul>
            <li><Link href="/sports/">Sports Categories</Link></li>
            <li><Link href="/oem-odm/">OEM & ODM Capability</Link></li>
            <li><Link href="/manufacturing/">Manufacturing System</Link></li>
            <li><Link href="/projects/">Featured Projects</Link></li>
            <li><Link href="/about/">About POXIOL</Link></li>
            <li><Link href="/contact/">Contact Us</Link></li>
          </ul>
        </header>

        <article>
          <h1>Custom Teamwear Manufacturing for Clubs, Schools & Sports Brands</h1>
          <p>Design, sampling, production and global delivery — all in one professional teamwear platform.</p>
          
          <section>
            <h2>B2B Trust Statistics</h2>
            <ul>
              <li>3,000+ Teams Served</li>
              <li>50+ Countries Shipped</li>
              <li>500,000+ Pieces Produced</li>
              <li>15+ Years Industry Experience</li>
              <li>98% On-Time Delivery Guarantee</li>
            </ul>
          </section>

          <section>
            <h2>Why Teams Choose POXIOL</h2>
            <ul>
              <li><strong>Faster:</strong> Free high-fidelity graphic mockup within 24 hours.</li>
              <li><strong>Flexible:</strong> Flexible MOQ starting from 1 piece for small trials and samples.</li>
              <li><strong>Reliable:</strong> Strict QC checking, premium sublimation, and durable stitching.</li>
              <li><strong>Global:</strong> Reliable worldwide logistics to key markets in US, Canada, EU, and Australia.</li>
              <li><strong>Professional:</strong> Full OEM & ODM private-label apparel manufacturing capacity.</li>
            </ul>
          </section>

          <section>
            <h2>Featured Team Projects</h2>
            <ul>
              <li><strong>USA Basketball Academy:</strong> 500 Sets | 21 Days Turnaround | Reordered 3 Times</li>
              <li><strong>Germany Soccer Club:</strong> 1200 Pieces | 28 Days Turnaround | Signed Annual Partnership</li>
              <li><strong>Australia Tournament:</strong> 3000 Pieces | 30 Days Turnaround | Delivered perfectly on schedule</li>
              <li><strong>Canada Hockey Team:</strong> 800 Sets | 25 Days Turnaround | Reordered 2 Times</li>
            </ul>
          </section>

          <section>
            <h2>Professional 5-Step Customization Onboarding</h2>
            <ol>
              <li><strong>Send Your Logo:</strong> Submit your ideas, color preferences and vectors.</li>
              <li><strong>Get Free Mockup:</strong> Receive a professional, photorealistic mockup layout.</li>
              <li><strong>Confirm Sample:</strong> Test fabric fit, physical print vibrancy, and stitch durability.</li>
              <li><strong>Bulk Production:</strong> Real-time tracking through our advanced sublimation cutting & sewing system.</li>
              <li><strong>Global Delivery:</strong> Secure packaging and fast-track shipping right to your team, club or warehouse.</li>
            </ol>
          </section>

          <section>
            <h2>Robust Manufacturing Infrastructure</h2>
            <p>Our verification-ready factory features precision digital CAD pattern design, advanced high-speed sublimation printers, precision fabric lasers, highly skilled sewing lines, and a dedicated 100% manual check QC team ensuring every shipment meets WRAP, SGS, ISO, and BSCI benchmarks.</p>
          </section>

          <section>
            <h2>Client Testimonials</h2>
            <blockquote>
              <p>“Excellent quality and fast delivery. POXIOL is a reliable teamwear partner.”</p>
              <cite>Mark Johnson / Coach / USA Basketball Academy</cite>
            </blockquote>
            <blockquote>
              <p>“Great communication and attention to detail. Our go-to B2B manufacturer.”</p>
              <cite>Sophie Müller / Manager / Germany Soccer Club</cite>
            </blockquote>
          </section>
        </article>
      </div>
    </main>
  );
}
