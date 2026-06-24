import type { Metadata } from "next";
import Link from "next/link";
import ContactForm from "@/components/forms/ContactForm";
import { contactCards, inquiryGuide, contactFaqs } from "@/lib/contact-data";
import { Header, Footer, SectionHeading, whatsAppHref } from "@/components/ui";

export const metadata: Metadata = { 
  title: "Contact POXIOL | Get Free Custom Teamwear Mockup", 
  description: "Contact POXIOL to start your custom teamwear project. Submit sport category, logo, quantity, colors and deadline to get a free mockup and production plan." 
};

export default function ContactPage() {
  return (
    <main className="bg-[#0A0A0A] text-white">
      <Header />
      <section className="relative overflow-hidden bg-neutral-950 px-5 py-20 md:px-10 md:py-32 xl:px-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_40%,rgba(182,255,0,0.14),transparent_30%)]"/>
        <div className="relative mx-auto grid max-w-7xl gap-16 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <div className="pt-4 lg:sticky lg:top-28">
            <p className="mb-5 text-sm font-black uppercase tracking-[0.16em] text-[#B6FF00]">Contact POXIOL</p>
            <h1 className="text-5xl font-black leading-[0.98] tracking-tight text-white md:text-8xl uppercase">
              Get in <br />Touch<span className="text-[#B6FF00]">.</span>
            </h1>
            <p className="mt-8 max-w-xl text-lg leading-8 text-neutral-300">
              Whether you are a local sports academy or an international brand, we are here to support your teamwear manufacturing needs.
            </p>
            <div className="mt-10 space-y-6">
              <a href={whatsAppHref} target="_blank" rel="noreferrer" className="flex items-center gap-4 group">
                <div className="h-12 w-12 rounded-full bg-[#25D366] flex items-center justify-center group-hover:scale-110 transition">
                   <span className="text-white font-bold">W</span>
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-neutral-500">Fast Response</p>
                  <p className="text-lg font-black text-white">Chat on WhatsApp</p>
                </div>
              </a>
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
                   <span className="text-white font-bold">E</span>
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-neutral-500">Official Email</p>
                  <p className="text-lg font-black text-white">york@basketman.cn</p>
                </div>
              </div>
            </div>
          </div>
          <div id="contact-form">
            <ContactForm 
              title="Send an Official Inquiry"
              subtitle="Please provide as much detail as possible so our specialists can give you a precise answer."
              formType="Official Contact Page V8"
              ctaText="Send My Message"
              successUrl="/thank-you/"
            />
          </div>
        </div>
      </section>

      <section className="bg-neutral-100 px-5 py-24 md:px-10 md:py-32 xl:px-20 text-neutral-950">
        <div className="mx-auto max-w-7xl">
          <SectionHeading eyebrow="Quick Paths" title="Specialized Contact Paths" subtitle="Select the path that best matches your specific project or business requirement." center />
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4 mt-20">
            {contactCards.map(card => (
              <Link key={card.title} href={card.href} className="group rounded-[2rem] bg-white p-8 shadow-sm border border-neutral-200 transition hover:border-[#B6FF00] hover:shadow-xl">
                <h3 className="text-xl font-black uppercase tracking-tight">{card.title}</h3>
                <p className="mt-4 text-sm leading-7 text-neutral-500">{card.description}</p>
                <p className="mt-6 text-xs font-black uppercase tracking-widest text-[#B6FF00] group-hover:underline">Proceed →</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
