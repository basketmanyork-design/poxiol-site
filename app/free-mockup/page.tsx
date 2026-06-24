import type { Metadata } from "next";
import Link from "next/link";
import ContactForm from "@/components/forms/ContactForm";
import { trustItems, requestTypes, prepareChecklist, freeMockupFaqs } from "@/lib/free-mockup-data";
import { Header, Footer, SectionHeading } from "@/components/ui";

export const metadata: Metadata = {
  title: "Get a Free Custom Teamwear Mockup | POXIOL",
  description: "Request a free POXIOL custom teamwear mockup. Send your sport, logo, colors and quantity to get a professional uniform design preview for your team, event or brand.",
};

const receiveItems = [
  ["Uniform Visual Mockup", "Preview the teamwear look before sampling or bulk order."],
  ["Color & Logo Direction", "See how your colors, logo, name and number layout can work."],
  ["Product Suggestion", "Get guidance based on sport category, quantity and buyer type."],
  ["Next-Step Quote Path", "Move from mockup to sample, production plan or OEM discussion."],
];
const buyerFit = ["Clubs preparing for a new season", "Schools ordering team uniforms", "Events with tournament or race deadlines", "Brands developing private label collections", "Distributors expanding multi-sport catalogs", "Custom retailers testing new products"];

export default function FreeMockupPage() {
  return (
    <main className="bg-[#0A0A0A] text-white selection:bg-[#B6FF00] selection:text-black">
      <Header />
      <section id="top" className="relative overflow-hidden bg-neutral-950 px-5 py-16 md:px-10 md:py-24 xl:px-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(182,255,0,0.16),transparent_30%),radial-gradient(circle_at_80%_60%,rgba(255,255,255,0.08),transparent_28%)]"/>
        <div className="relative mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <div className="pt-4 lg:sticky lg:top-28">
            <p className="mb-5 text-sm font-black uppercase tracking-[0.16em] text-lime-400">Free Mockup Request</p>
            <h1 className="text-5xl font-black leading-[0.98] tracking-tight text-white md:text-7xl">Get Your Free POXIOL Teamwear Mockup</h1>
            <p className="mt-7 max-w-2xl text-lg leading-8 text-neutral-300">Send us your sport, logo, colors and quantity. Our design team will help create a professional custom uniform preview for your team, event or brand.</p>
            <div className="mt-8 grid gap-3 sm:grid-cols-2">{["MOQ 1 supported", "1-2H design support", "2-3 day sampling", "OEM/ODM ready", "180-day quality support"].map(item => <div key={item} className="rounded-2xl border border-white/10 bg-white/[0.06] px-4 py-3 text-sm font-bold text-white">{item}</div>)}</div>
            <div className="mt-8 rounded-[1.5rem] border border-lime-400/25 bg-lime-400/10 p-5 text-sm leading-7 text-neutral-200">No complete design file? No problem. Send your idea, reference style, team color or logo. POXIOL will help turn it into a professional teamwear concept.</div>
          </div>
          <ContactForm 
            title="Get Your Free Mockup"
            subtitle="Upload your logo, reference design or size chart if available. Our design team will review your request and prepare a high-fidelity visual preview."
            formType="Free Mockup V8"
            ctaText="Request Free Mockup Now"
            successUrl="/thank-you/"
          />
        </div>
      </section>

      <section className="bg-neutral-950 px-5 pb-16 md:px-10 xl:px-20"><div className="mx-auto grid max-w-7xl gap-3 rounded-[2rem] border border-white/10 bg-white/[0.04] p-5 md:grid-cols-3 lg:grid-cols-6">{trustItems.map(item => <div key={item} className="rounded-2xl bg-white/[0.04] p-4 text-center text-sm font-black text-lime-400">{item}</div>)}</div></section>

      <section className="bg-white px-5 py-20 md:px-10 md:py-28 xl:px-20"><div className="mx-auto max-w-7xl text-neutral-950"><SectionHeading eyebrow="What You Can Request" title="Mockups for Teams, Events and Brands" subtitle="POXIOL supports free mockup requests for multi-sport uniforms, teamwear sets, event apparel and OEM/ODM collections."/><div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">{requestTypes.map(item => <div key={item.title} className="rounded-[1.75rem] border border-neutral-200 bg-neutral-50 p-7"><h3 className="text-2xl font-black text-neutral-950">{item.title}</h3><p className="mt-4 leading-7 text-neutral-600">{item.description}</p></div>)}</div></div></section>

      <section className="bg-neutral-100 px-5 py-20 md:px-10 md:py-28 xl:px-20"><div className="mx-auto max-w-7xl text-neutral-950"><SectionHeading eyebrow="What You Receive" title="More Than a Simple Drawing" subtitle="A POXIOL mockup helps you confirm direction before spending time on samples or bulk orders."/><div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">{receiveItems.map(([title,desc]) => <div key={title} className="rounded-[1.75rem] bg-white p-7 shadow-sm"><h3 className="text-xl font-black text-neutral-950">{title}</h3><p className="mt-3 text-sm leading-6 text-neutral-600">{desc}</p></div>)}</div></div></section>

      <section className="bg-white px-5 py-20 md:px-10 md:py-28 xl:px-20"><div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center text-neutral-950"><div><p className="mb-4 text-sm font-black uppercase tracking-[0.16em] text-lime-600">Best for These Buyers</p><h2 className="text-4xl font-black leading-[1.05] text-neutral-950 md:text-5xl">Built for Serious Custom Teamwear Projects</h2><p className="mt-5 text-lg leading-8 text-neutral-600">The form is designed to help POXIOL quickly understand your sport, order size, timeline and design direction.</p></div><div className="grid gap-3 sm:grid-cols-2">{buyerFit.map(item => <div key={item} className="rounded-2xl border border-neutral-200 bg-neutral-50 p-4 font-bold text-neutral-700">✓ {item}</div>)}</div></div></section>

      <section className="bg-neutral-100 px-5 py-20 md:px-10 md:py-28 xl:px-20"><div className="mx-auto max-w-7xl text-neutral-950"><SectionHeading eyebrow="How It Works" title="How the Free Mockup Process Works" subtitle="A simple process to turn your idea into a professional teamwear preview."/><div className="grid gap-5 md:grid-cols-4">{["Submit project details", "POXIOL reviews your request", "Design team prepares direction", "You confirm sample or quote"].map((step,index) => <div key={step} className="rounded-[1.75rem] bg-white p-7 shadow-sm text-neutral-950"><div className="flex h-12 w-12 items-center justify-center rounded-full bg-neutral-950 text-sm font-black text-lime-400">{String(index+1).padStart(2,"0")}</div><h3 className="mt-5 text-xl font-black text-neutral-950">{step}</h3></div>)}</div></div></section>

      <section className="bg-white px-5 py-20 md:px-10 md:py-28 xl:px-20"><div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center text-neutral-950"><div><p className="mb-4 text-sm font-black uppercase tracking-[0.16em] text-lime-600">What to Prepare</p><h2 className="text-4xl font-black leading-[1.05] text-neutral-950 md:text-5xl">Prepare These Details for a Better Mockup</h2><p className="mt-5 text-lg leading-8 text-neutral-600">The more complete your request is, the faster POXIOL can understand your project and create a useful design preview.</p></div><div className="grid gap-3 sm:grid-cols-2">{prepareChecklist.map(item => <div key={item} className="rounded-2xl border border-neutral-200 bg-neutral-50 p-4 font-bold text-neutral-700">✓ {item}</div>)}</div></div></section>

      <section className="bg-neutral-100 px-5 py-20 md:px-10 md:py-28 xl:px-20"><div className="mx-auto max-w-4xl text-neutral-950"><SectionHeading eyebrow="FAQ" title="Free Mockup FAQ" subtitle="Common questions about POXIOL mockup requests and next steps."/><div className="space-y-4">{freeMockupFaqs.map(faq => <details key={faq.question} className="rounded-3xl border border-neutral-200 bg-white p-6"><summary className="cursor-pointer text-lg font-black text-neutral-950">{faq.question}</summary><p className="mt-4 leading-7 text-neutral-600">{faq.answer}</p></details>)}</div></div></section>

      <section className="bg-neutral-950 px-5 py-20 md:px-10 md:py-24 xl:px-20"><div className="mx-auto max-w-7xl rounded-[2rem] border border-white/10 bg-[radial-gradient(circle_at_80%_50%,rgba(182,255,0,0.16),transparent_28%),linear-gradient(135deg,#111,#050505)] p-8 text-center md:p-14 text-white"><h2 className="text-4xl font-black leading-[1.05] text-white md:text-6xl">Ready to Start?</h2><p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-neutral-300">Submit your project details above and POXIOL will review your teamwear request.</p><Link href="#top" className="mt-8 inline-flex h-[52px] items-center justify-center rounded-full bg-lime-400 px-7 text-sm font-black uppercase tracking-wide text-neutral-950 transition hover:bg-white">Back to Form</Link></div></section>
      <Footer />
    </main>
  );
}
