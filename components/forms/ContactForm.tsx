"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { trackFormStart, trackFormSubmit, trackLead } from "@/lib/analytics/client";

type ContactFormState = {
  fullName: string;
  email: string;
  company: string;
  country: string;
  product: string;
  quantity: string;
  message: string;
  selected_style: string;
};

const initialState: ContactFormState = {
  fullName: "",
  email: "",
  company: "",
  country: "",
  product: "",
  quantity: "",
  message: "",
  selected_style: "",
};

function FieldLabel({ htmlFor, children, required = false }: { htmlFor?: string; children: React.ReactNode; required?: boolean }) {
  return (
    <label htmlFor={htmlFor} className="mb-2 block text-sm font-black text-neutral-950">
      {children} {required ? <span className="text-lime-600">*</span> : null}
    </label>
  );
}

const inputClass = "h-[50px] w-full rounded-2xl border border-neutral-300 bg-white px-4 text-sm text-neutral-950 outline-none transition placeholder:text-neutral-400 focus:border-lime-400";

interface ContactFormProps {
  title?: string;
  subtitle?: string;
  formType?: string;
  ctaText?: string;
  successUrl?: string;
  publicEmail?: string;
  whatsappHref?: string;
}

function ContactFormInner({
  title,
  subtitle,
  formType,
  ctaText,
  successUrl,
}: ContactFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [form, setForm] = useState<ContactFormState>(initialState);

  useEffect(() => {
    const style = searchParams.get("style");
    if (style) {
      setForm(prev => ({ ...prev, selected_style: style }));
    }
  }, [searchParams]);

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  function updateField(name: keyof ContactFormState, value: string) {
    trackFormStart(formType || "contact");
    setForm((current) => ({ ...current, [name]: value }));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setErrorMessage("");

    try {
      const endpoint = process.env.NEXT_PUBLIC_FORMSPREE_CONTACT_ENDPOINT;
      if (!endpoint) {
        throw new Error("Form endpoint is not configured. Add NEXT_PUBLIC_FORMSPREE_CONTACT_ENDPOINT in Cloudflare Pages.");
      }

      // Package everything in FormData to allow native file attachments on Formspree
      const formData = new FormData();
      formData.append("formType", formType || "Contact V8 Optimized");
      formData.append("sourcePage", window.location.href);

      Object.entries(form).forEach(([key, value]) => {
        formData.append(key, value);
      });

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          Accept: "application/json",
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Submit failed. Please try again or contact us by email.");
      }

      const submissionId = crypto.randomUUID();
      trackFormSubmit(formType || "contact", submissionId);
      trackLead(formType || "contact", submissionId);
      router.push(successUrl || "/thank-you/");
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-[2rem] bg-white p-6 shadow-xl md:p-9 text-left">
      <div className="mb-8">
        <p className="text-sm font-black uppercase tracking-[0.14em] text-lime-600">POXIOL B2B Inquiry</p>
        <h2 className="mt-3 text-3xl font-black text-neutral-950">{title}</h2>
        <p className="mt-3 text-sm leading-6 text-neutral-600">
          {subtitle}
        </p>
        <p className="mt-4 rounded-2xl bg-neutral-50 border border-neutral-200 px-4 py-3 text-xs font-bold text-neutral-600">
          1. Send project details → 2. Free mockup in 2h → 3. Sample option → 4. Production plan
        </p>
      </div>

      {form.selected_style && (
        <div className="mb-8 rounded-2xl bg-[#B6FF00]/10 border border-[#B6FF00]/30 p-4">
          <p className="text-xs font-black uppercase tracking-widest text-neutral-500">Requested Look / Style</p>
          <p className="mt-1 text-lg font-black text-neutral-950 uppercase italic">{form.selected_style.replace(/-/g, ' ')}</p>
        </div>
      )}

      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <FieldLabel htmlFor="field-fullName" required>Full Name</FieldLabel>
            <input
              required
              id="field-fullName"
              name="fullName"
              value={form.fullName}
              onChange={(e) => updateField("fullName", e.target.value)}
              className={inputClass}
              placeholder="Your name"
            />
          </div>
          <div>
            <FieldLabel htmlFor="field-email" required>Email Address</FieldLabel>
            <input
              required
              type="email"
              id="field-email"
              name="email"
              value={form.email}
              onChange={(e) => updateField("email", e.target.value)}
              className={inputClass}
              placeholder="your@email.com"
            />
          </div>
          <div>
            <FieldLabel htmlFor="field-company">Company / Team</FieldLabel>
            <input
              id="field-company"
              name="company"
              value={form.company}
              onChange={(e) => updateField("company", e.target.value)}
              className={inputClass}
              placeholder="e.g. POXIOL Academy"
            />
          </div>
          <div>
            <FieldLabel htmlFor="field-country" required>Country / Region</FieldLabel>
            <input
              required
              id="field-country"
              name="country"
              value={form.country}
              onChange={(e) => updateField("country", e.target.value)}
              className={inputClass}
              placeholder="e.g. United States"
            />
          </div>
          <div>
            <FieldLabel htmlFor="field-product" required>Product</FieldLabel>
            <select
              required
              id="field-product"
              name="product"
              value={form.product}
              onChange={(e) => updateField("product", e.target.value)}
              className={inputClass}
            >
              <option value="">Select product</option>
              <option value="Basketball Uniforms">Basketball Uniforms</option>
              <option value="Soccer Kits">Soccer Kits</option>
              <option value="Training Wear">Training Wear</option>
              <option value="OEM / Private Label">OEM / Private Label</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div>
            <FieldLabel htmlFor="field-quantity" required>Estimated Quantity</FieldLabel>
            <select
              required
              id="field-quantity"
              name="quantity"
              value={form.quantity}
              onChange={(e) => updateField("quantity", e.target.value)}
              className={inputClass}
            >
              <option value="">Select quantity</option>
              <option value="1 Sample MOQ">1 Sample MOQ</option>
              <option value="10-29 Sets">10-29 Sets (Team Order)</option>
              <option value="30-99 Sets">30-99 Sets</option>
              <option value="100-299 Sets">100-299 Sets</option>
              <option value="300+ Sets">300+ Sets (Volume Order)</option>
              <option value="Not Sure Yet">Not Sure Yet</option>
            </select>
          </div>
        </div>

        <div>
          <FieldLabel htmlFor="field-message">Message</FieldLabel>
          <textarea
            id="field-message"
            name="message"
            value={form.message}
            onChange={(e) => updateField("message", e.target.value)}
            className="min-h-[110px] w-full rounded-2xl border border-neutral-300 bg-white p-4 text-sm text-neutral-950 outline-none transition placeholder:text-neutral-400 focus:border-lime-400"
            placeholder="Tell us about your project — design ideas, colors, deadline or any questions..."
          />
        </div>
      </div>

      {errorMessage ? (
        <div className="mt-5 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700">
          {errorMessage}
        </div>
      ) : null}

      <button
        type="submit"
        disabled={loading}
        className="mt-8 h-[56px] w-full rounded-full bg-lime-400 text-sm font-black uppercase tracking-wide text-neutral-950 transition hover:bg-neutral-950 hover:text-white disabled:cursor-not-allowed disabled:opacity-70"
      >
        {loading ? "Submitting..." : ctaText}
      </button>

      <div className="mt-5 grid gap-2 text-xs font-semibold text-neutral-500 md:grid-cols-3">
        <p>✓ Free mockup before any ordering</p>
        <p>✓ Itemized quote after project review</p>
        <p>✓ No hidden assumptions — all costs confirmed before payment</p>
      </div>
    </form>
  );
}

function ContactFormFallback({ publicEmail, whatsappHref }: ContactFormProps) {
  const emailHref = publicEmail ? `mailto:${Array.from(publicEmail).map((char) => `%${char.charCodeAt(0).toString(16).padStart(2, "0")}`).join("")}` : '/contact/'
  const whatsappLink = whatsappHref || '/contact/'

  return (
    <div className="rounded-[2rem] bg-white p-10 shadow-xl text-center">
      <p className="text-sm font-black uppercase tracking-widest text-lime-600 mb-6">Contact POXIOL</p>
      <div className="py-6">
        <h3 className="text-neutral-950 font-black text-2xl mb-4">Send Your Teamwear Project Details</h3>
        <p className="text-neutral-500 text-sm mb-8">
          Share your sport, quantity, logo files, delivery country and target date. Use any contact path below while the full inquiry form loads.
        </p>

        <div className="grid gap-3 sm:grid-cols-2">
          <a href="/free-mockup/" className="h-[52px] flex items-center justify-center rounded-full bg-lime-400 text-neutral-950 text-xs font-black uppercase tracking-widest hover:bg-neutral-950 hover:text-white transition">Get Free Mockup</a>
          <a href="/get-quote/" className="h-[52px] flex items-center justify-center rounded-full bg-neutral-950 text-white text-xs font-black uppercase tracking-widest hover:bg-lime-400 hover:text-neutral-950 transition">Get Factory Quote</a>
          <a href={emailHref} className="h-[52px] flex items-center justify-center rounded-full border border-neutral-200 text-neutral-950 text-xs font-black uppercase tracking-widest hover:border-lime-400 transition">Email POXIOL</a>
          <a href={whatsappLink} target="_blank" rel="noreferrer" className="h-[52px] flex items-center justify-center rounded-full border border-neutral-200 text-neutral-950 text-xs font-black uppercase tracking-widest hover:border-lime-400 transition">WhatsApp Chat</a>
        </div>

        <a href="/contact/" className="mt-6 inline-flex text-xs font-black uppercase tracking-widest text-neutral-500 underline underline-offset-4">Contact Page</a>
      </div>
    </div>
  )
}
export default function ContactForm(props: ContactFormProps) {
  return (
    <Suspense fallback={<ContactFormFallback {...props} />}>
      <ContactFormInner {...props} />
    </Suspense>
  );
}
