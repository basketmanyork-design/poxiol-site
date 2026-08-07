import type { Metadata } from "next";
import Link from "next/link";
import ContactForm from "@/components/forms/ContactForm";
import { BuyerDecisionSections } from "@/components/sections/BuyerDecisionSections";
import { FirstWeekBuyingGuides } from "@/components/sections/FirstWeekBuyingGuides";
import { Header, Footer, SectionHeading, PrimaryButton, SecondaryButton, EmailAddress, emailHref } from "@/components/ui";
import { OrganizationSchema, FAQSchema, BreadcrumbSchema } from "@/components/seo/GEOStructuredData";
import { getHomepageContent, getSiteChrome } from "@/lib/sanity/content";
import { BUYER_DECISION_HERO_HEADING_MOBILE } from "@/lib/buyer-decision";

// Four priority product categories shown on the homepage (Task 4).
const FEATURED_PRODUCTS = [
  {
    title: "Basketball Uniforms",
    description: "Custom jerseys, shorts and full sublimation team sets. Sample MOQ 1 set.",
    cta: "View Basketball Uniforms",
    href: "/products/basketball-uniforms/",
    image: "/images/sports/basketball_sm.webp",
    alt: "POXIOL custom basketball uniforms manufacturer",
  },
  {
    title: "Soccer Kits",
    description: "Jerseys, shorts, socks and goalkeeper kits for clubs, schools and academies.",
    cta: "View Soccer Kits",
    href: "/products/soccer-jerseys/",
    image: "/images/sports/soccer_sm.webp",
    alt: "POXIOL custom soccer kit manufacturer",
  },
  {
    title: "Training Wear",
    description: "Warm-up suits, tracksuits and team travel apparel for training programs.",
    cta: "View Training Wear",
    href: "/products/training-wear/",
    image: "/images/sports/training_sm.webp",
    alt: "POXIOL custom training wear supplier",
  },
  {
    title: "OEM Sportswear",
    description: "Private-label manufacturing with buyer-approved labels, packaging and specs.",
    cta: "Start OEM Project",
    href: "/oem-odm/",
    image: "/images/solutions/brand-oem.webp",
    alt: "POXIOL OEM sportswear factory",
  },
];



export async function generateMetadata(): Promise<Metadata> {
  const content = await getHomepageContent();
  return {
    title: content.seo.title,
    description: content.seo.description,
    alternates: { canonical: content.seo.canonicalUrl || `${content.siteUrl}/` },
  };
}

export default async function HomePage() {
  const baseUrl = "https://www.poxiol.com";
  const [content, chrome] = await Promise.all([getHomepageContent(), getSiteChrome()]);

  return (
    <main id="main-content" className="bg-[#0A0A0A] text-white selection:bg-[#B6FF00] selection:text-black">
      {/* --- AEO / GEO Infrastructure --- */}
      <OrganizationSchema />
      <FAQSchema faqs={content.faqs.map(f => ({ question: f.question, answer: f.answer }))} />
      <BreadcrumbSchema items={[{ name: "Home", url: `${baseUrl}/` }]} />

      <Header />

      {/* 1. Optimized Hero Section - Direct B2B Conclusion */}
      <section className="relative overflow-hidden bg-neutral-950 px-5 py-14 md:px-10 md:py-32 xl:px-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_35%,rgba(182,255,0,0.12),transparent_30%)]" />
        <div className="relative mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">

          <div>
            <span className="mb-6 inline-block text-sm font-black uppercase tracking-[0.2em] text-[#B6FF00]">
              {content.heroEyebrow}
            </span>
            <h1 className="text-[2.75rem] font-black leading-[0.95] tracking-tighter md:text-8xl uppercase">
              <span className="md:hidden">{BUYER_DECISION_HERO_HEADING_MOBILE}</span>
              <span className="hidden md:inline">{content.heroHeading}</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-neutral-400 md:mt-8 md:text-xl">
              {content.heroDescription}
            </p>

            {/* CTAs render before trust chips on mobile so they stay within the first screen */}
            <div className="order-2 mt-8 flex flex-col gap-3 sm:flex-row lg:order-3 lg:mt-12">
              <div className="flex flex-1 flex-col gap-2">
                <PrimaryButton href={content.heroPrimaryCta.href} className="h-16 px-10">{content.heroPrimaryCta.label}</PrimaryButton>
                <span className="text-xs font-semibold text-neutral-400">Free within 2 hours of your project details</span>
              </div>
              <div className="flex flex-1 flex-col gap-2">
                <SecondaryButton href={content.heroSecondaryCta.href} className="h-16 px-10">{content.heroSecondaryCta.label}</SecondaryButton>
                <span className="text-xs font-semibold text-neutral-400">Sample fee confirmed before payment. No hidden costs.</span>
              </div>
            </div>

            <a
              href={chrome.whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="order-3 mt-5 inline-flex items-center gap-3 rounded-full border border-[#25D366]/40 px-6 py-4 text-sm font-black uppercase tracking-wide text-[#25D366] transition hover:border-[#25D366] hover:bg-[#25D366]/10 lg:order-4 lg:mt-6"
            >
              <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.72.937 3.659 1.432 5.631 1.433h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              WhatsApp Chat
            </a>

            <div className="order-4 mt-6 flex flex-wrap gap-3 lg:order-2 lg:mt-10">
              {content.trustChips.map(chip => (
                <span key={chip} className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-bold uppercase tracking-wider text-white">
                  {chip}
                </span>
              ))}
            </div>
          </div>

          <div className="relative aspect-[4/5] overflow-hidden rounded-[3rem] border border-white/10 shadow-2xl shadow-[#B6FF00]/5">
            <img
              src={content.heroImage.url}
              width="900"
              height="1125"
              alt={content.heroImage.alt}
              fetchPriority="high"
              loading="eager"
              decoding="sync"
              className="absolute inset-0 h-full w-full object-cover grayscale-[0.2] hover:grayscale-0 transition duration-700"
            />
            <div className="absolute bottom-10 left-10 right-10 rounded-3xl border border-white/15 bg-black/40 p-6 backdrop-blur-2xl">
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-[#B6FF00]">B2B Production</p>
                  <h3 className="mt-1 text-2xl font-black uppercase italic">MOQ 1 SET</h3>
                </div>
                <div className="max-w-[11rem] text-right">
                  <p className="text-sm font-black uppercase leading-tight text-white">Quality Checks Before Shipment</p>
                  <p className="mt-1 text-[10px] font-bold text-neutral-400">Names, numbers, sizing and packing</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 1b. Production Quick Facts - structured B2B summary for buyers and AI retrieval */}
      <section className="border-b border-white/5 bg-[#0d0d0d] px-5 py-14 md:px-10 md:py-16 xl:px-20">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.2em] text-[#B6FF00]">Factory Capability</p>
              <h2 className="mt-3 text-3xl font-black uppercase tracking-tight md:text-4xl">Production Quick Facts</h2>
            </div>
            <p className="max-w-md text-sm leading-6 text-neutral-400">
              Standard B2B parameters for custom teamwear orders. Every project is confirmed in writing before production.
            </p>
          </div>
          <dl className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-7">
            {[
              { label: 'Product', value: 'Custom Teamwear' },
              { label: 'MOQ', value: '1 Set Sample' },
              { label: 'Design', value: 'Free Mockup Support' },
              { label: 'Sample', value: '2-3 Working Days' },
              { label: 'Bulk Production', value: '7-12 Working Days' },
              { label: 'Quality', value: 'QC Before Shipment' },
              { label: 'Shipping', value: 'Worldwide' },
            ].map((fact) => (
              <div key={fact.label} className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                <dt className="text-[10px] font-black uppercase tracking-widest text-neutral-500">{fact.label}</dt>
                <dd className="mt-2 text-sm font-black leading-snug text-white">{fact.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <BuyerDecisionSections />

      <FirstWeekBuyingGuides />

      {/* 2. Factory Sourcing Summary - AEO / GEO Table */}
      <section className="bg-black px-5 py-16 md:px-10 md:py-24 border-b border-white/5">
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            eyebrow={content.sectionHeadings.sourcing.eyebrow}
            title={content.sectionHeadings.sourcing.title}
            subtitle={content.sectionHeadings.sourcing.subtitle || "POXIOL is a factory-direct custom teamwear manufacturer in China specializing in sublimated basketball uniforms and soccer kits for international B2B buyers."}
            dark
          />
          <div className="mt-12 overflow-x-auto rounded-[2rem] border border-white/10 bg-white/[0.02] scrollbar-hide">
            <table className="w-full text-left border-collapse min-w-[600px] md:min-w-0">
              <thead>
                <tr className="border-b border-white/10 bg-white/[0.04]">
                  <th className="px-8 py-5 text-sm font-black uppercase tracking-widest text-lime-400 w-1/3">Manufacturer Capability</th>
                  <th className="px-8 py-5 text-sm font-black uppercase tracking-widest text-lime-400">Verified Details</th>
                </tr>
              </thead>
              <tbody className="text-sm text-neutral-300">
                {content.sourcingRows.map(({item, capability}) => (
                  <tr key={item} className="border-b border-white/5 last:border-0">
                    <td className="px-8 py-5 font-bold text-white whitespace-nowrap">{item}</td>
                    <td className="px-8 py-5 leading-relaxed">{capability}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* 3. The POXIOL Advantage - Conclusion + Data + Explanation */}
      <section className="bg-neutral-900 px-5 py-24 md:px-10 md:py-32 xl:px-20">
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            eyebrow={content.sectionHeadings.usp.eyebrow}
            title={content.sectionHeadings.usp.title}
            subtitle={content.sectionHeadings.usp.subtitle || "Providing flexible teamwear production, visual consistency and responsive deadlines for professional partners."}
            dark center
          />
          <div className="mt-20 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {content.uspCards.map((card) => (
              <div key={card.title} className="group rounded-[2.5rem] border border-white/10 bg-white/[0.03] p-10 transition hover:border-[#B6FF00]/50 hover:bg-[#B6FF00]/5">
                <p className="text-3xl font-black text-[#B6FF00] tracking-tighter">{card.metric}</p>
                <h3 className="mt-6 text-xl font-black uppercase tracking-tight">{card.title}</h3>
                <p className="mt-4 text-sm text-neutral-400 leading-relaxed">{card.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Performance Matrix - Product Hub (4 priority categories with clear CTAs) */}
      <section className="bg-neutral-950 px-5 py-24 md:px-10 md:py-32 border-y border-white/5">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col md:flex-row items-end justify-between mb-20 gap-6">
            <SectionHeading eyebrow={content.sectionHeadings.matrix.eyebrow} title={content.sectionHeadings.matrix.title} dark />
            <SecondaryButton href="/products/" className="mb-14">View All Products</SecondaryButton>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {FEATURED_PRODUCTS.map(product => (
              <Link key={product.title} href={product.href} className="group relative aspect-square overflow-hidden rounded-[2.5rem] border border-white/10 shadow-xl">
                <img src={product.image} alt={product.alt} loading="lazy" decoding="async" className="h-full w-full object-cover grayscale transition duration-500 group-hover:grayscale-0 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent p-8 flex flex-col justify-end">
                  <h3 className="text-2xl font-black uppercase italic leading-none">{product.title}</h3>
                  <p className="mt-3 text-xs leading-5 text-neutral-300">{product.description}</p>
                  <span className="mt-5 inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-[#B6FF00]">
                    {product.cta} <span aria-hidden="true">→</span>
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Converstion Lead Form */}
      <section id="contact" className="bg-neutral-900 px-5 py-24 md:px-10 md:py-32 xl:px-20">
        <div className="mx-auto max-w-7xl grid gap-16 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <SectionHeading eyebrow="Get Started" title={content.inquiryTitle} dark />
            <p className="mt-8 text-lg leading-relaxed text-neutral-400">
              {content.inquiryDescription}
            </p>
            <div className="mt-12 p-8 rounded-3xl border border-white/5 bg-white/[0.02]">
              <h4 className="text-[#B6FF00] font-black uppercase text-sm tracking-widest">{content.inquirySupportTitle}</h4>
              <p className="mt-4 text-neutral-400 leading-relaxed text-sm">{content.inquirySupportDescription}</p>
              <a href={chrome.whatsappHref} target="_blank" rel="noreferrer" className="mt-6 inline-block font-black uppercase text-xs tracking-[0.2em] hover:text-[#B6FF00]">Open WhatsApp Messenger →</a>
            </div>
          </div>
          <noscript>
            <div className="mx-auto max-w-2xl rounded-lg border border-yellow-400 bg-yellow-50 p-6 dark:bg-yellow-950/20">
              <p className="font-semibold">If the form does not load, please send your sport, product type, quantity, delivery country, target date and logo files by email or WhatsApp.</p>
              <p className="mt-2"><a href={emailHref(chrome.publicEmail)} className="underline"><EmailAddress email={chrome.publicEmail} /></a></p>
              <p><a href={chrome.whatsappHref} className="underline" target="_blank" rel="noopener">WhatsApp</a></p>
            </div>
          </noscript>
          <ContactForm
            title="Request Factory Quote"
            subtitle="Provide your sport category, quantity and logo files to receive a high-fidelity 3D mockup and pricing plan after the project requirements are reviewed."
            formType="Homepage AEO Lead V90"
            ctaText="Get Free Mockup & Quote"
            successUrl="/thank-you/"
            publicEmail={chrome.publicEmail}
            whatsappHref={chrome.whatsappHref}
          />
        </div>
      </section>

      {/* 6. AI / GEO Friendly FAQ Center */}
      <section className="bg-neutral-950 px-5 py-24 md:px-10 md:py-32 border-t border-white/5">
         <div className="mx-auto max-w-4xl">
            <SectionHeading eyebrow={content.sectionHeadings.faq.eyebrow} title={content.sectionHeadings.faq.title} dark center />
            <div className="mt-16 space-y-4 text-left">
               {content.faqs.map((faq)=>(
                  <details key={faq.question} className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 group">
                  <summary className="cursor-pointer text-lg font-black text-white list-none flex justify-between items-center group-open:text-[#B6FF00]">
                     {faq.question}
                     <span className="text-xl font-light transition-transform group-open:rotate-45">+</span>
                  </summary>
                <p className="mt-4 leading-7 text-neutral-400 border-t border-white/5 pt-4">{faq.answer}</p>
                   </details>
                ))}
             </div>
             <div className="mt-12 text-center">
                <Link
                  href="/guides/b2b-sourcing-faq/"
                  className="inline-flex items-center text-sm font-black uppercase tracking-[0.2em] text-[#B6FF00] hover:underline"
                >
                  View Technical B2B FAQ Hub <span className="ml-2">→</span>
                </Link>
             </div>
          </div>
       </section>


      {content.bottomCta ? (
        <section className="bg-[#B6FF00] px-5 py-16 text-center text-black md:px-10 md:py-20">
          <h2 className="text-3xl font-black uppercase md:text-5xl">{content.bottomCta.label}</h2>
          <div className="mt-8">
            <PrimaryButton href={content.bottomCta.href}>Start Your Project</PrimaryButton>
          </div>
        </section>
      ) : null}

      <Footer />
    </main>
  );
}
