import type { Metadata } from "next";
import { Header, Footer } from "@/components/ui";
import ContactForm from "@/components/forms/ContactForm";

export const metadata: Metadata = {
  title: "Start a Sample Order | POXIOL Custom Teamwear",
  description: "Test the fabric, fit, and print quality before bulk production. Start a sample order for your custom basketball, soccer or sportswear brand uniforms.",
};

export default function SampleOrderPage() {
  return (
    <main className="bg-[#0A0A0A] text-white">
      <Header />
      <section className="relative overflow-hidden bg-neutral-950 px-5 py-20 md:px-10 md:py-28 xl:px-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(182,255,0,0.12),transparent_35%)]" />
        <div className="relative mx-auto grid max-w-7xl gap-16 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p className="mb-5 text-sm font-black uppercase tracking-[0.16em] text-lime-400">Sample Support</p>
            <h1 className="text-4xl font-black uppercase leading-[0.95] tracking-tight md:text-6xl">
              Start Your Sample Order
            </h1>
            <p className="mt-8 text-lg leading-relaxed text-neutral-300">
              Test our premium fabric, sizing, and sublimation print quality before committing to bulk production. POXIOL supports 1-piece sample orders for serious B2B projects.
            </p>
            
            <div className="mt-12 p-8 rounded-3xl border border-white/10 bg-white/[0.03]">
              <h3 className="text-xl font-bold mb-6">Sample Process</h3>
              <ul className="space-y-4">
                <li className="flex gap-4">
                  <span className="text-lime-400 font-bold">01</span>
                  <span className="text-neutral-300">Submit your design and color requirements.</span>
                </li>
                <li className="flex gap-4">
                  <span className="text-lime-400 font-bold">02</span>
                  <span className="text-neutral-300">Confirm the digital mockup for print alignment.</span>
                </li>
                <li className="flex gap-4">
                  <span className="text-lime-400 font-bold">03</span>
                  <span className="text-neutral-300">Pay sample fee (credited toward bulk order over 100 sets).</span>
                </li>
                <li className="flex gap-4">
                  <span className="text-lime-400 font-bold">04</span>
                  <span className="text-neutral-300">Receive physical sample within 7-10 days via DHL/FedEx.</span>
                </li>
              </ul>
            </div>
          </div>
          
          <ContactForm 
            title="Request Physical Sample"
            subtitle="Tell us which product you want to sample. Include logo, colors and sizes so we can prepare your sample tech-pack."
            formType="Sample Order V8"
            ctaText="Start Sample Order"
            successUrl="/sample-request-received/"
          />
        </div>
      </section>
      <Footer />
    </main>
  );
}
