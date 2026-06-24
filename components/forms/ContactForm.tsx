"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

type ContactFormState = {
  fullName: string;
  email: string;
  phone: string;
  country: string;
  buyerType: string;
  sportCategory: string;
  productType: string;
  quantity: string;
  deliveryDate: string;
  teamName: string;
  colors: string;
  needNumbers: string;
  message: string;
  selected_style: string;
};

const initialState: ContactFormState = {
  fullName: "",
  email: "",
  phone: "",
  country: "",
  buyerType: "",
  sportCategory: "",
  productType: "",
  quantity: "",
  deliveryDate: "",
  teamName: "",
  colors: "",
  needNumbers: "",
  message: "",
  selected_style: "",
};

function FieldLabel({ children, required = false }: { children: React.ReactNode; required?: boolean }) {
  return (
    <label className="mb-2 block text-sm font-black text-neutral-950">
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

  // Real File Upload states
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [referenceFile, setReferenceFile] = useState<File | null>(null);
  const [sizeChartFile, setSizeChartFile] = useState<File | null>(null);

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  function updateField(name: keyof ContactFormState, value: string) {
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

      if (logoFile) formData.append("logo_file", logoFile);
      if (referenceFile) formData.append("reference_design_file", referenceFile);
      if (sizeChartFile) formData.append("size_chart_tech_pack_file", sizeChartFile);

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

      router.push(successUrl || "/thank-you/");
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-[2rem] bg-white p-6 shadow-xl md:p-9">
      <div className="mb-8">
        <p className="text-sm font-black uppercase tracking-[0.14em] text-lime-600">POXIOL B2B Inquiry</p>
        <h2 className="mt-3 text-3xl font-black text-neutral-950">{title}</h2>
        <p className="mt-3 text-sm leading-6 text-neutral-600">
          {subtitle}
        </p>
      </div>

      {form.selected_style && (
        <div className="mb-8 rounded-2xl bg-[#B6FF00]/10 border border-[#B6FF00]/30 p-4">
          <p className="text-xs font-black uppercase tracking-widest text-neutral-500">Requested Look / Style</p>
          <p className="mt-1 text-lg font-black text-neutral-950 uppercase italic">{form.selected_style.replace(/-/g, ' ')}</p>
        </div>
      )}

      <div className="space-y-6">
        {/* Step 1: Buyer Information */}
        <div>
          <h3 className="mb-4 text-base font-black uppercase tracking-wider text-neutral-400">1. Buyer Information</h3>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <FieldLabel required>Full Name</FieldLabel>
              <input
                required
                value={form.fullName}
                onChange={(e) => updateField("fullName", e.target.value)}
                className={inputClass}
                placeholder="Your name"
              />
            </div>
            <div>
              <FieldLabel required>Email Address</FieldLabel>
              <input
                required
                type="email"
                value={form.email}
                onChange={(e) => updateField("email", e.target.value)}
                className={inputClass}
                placeholder="your@email.com"
              />
            </div>
            <div>
              <FieldLabel required>WhatsApp / Phone</FieldLabel>
              <input
                required
                value={form.phone}
                onChange={(e) => updateField("phone", e.target.value)}
                className={inputClass}
                placeholder="Country code + phone"
              />
            </div>
            <div>
              <FieldLabel required>Country / Region</FieldLabel>
              <input
                required
                value={form.country}
                onChange={(e) => updateField("country", e.target.value)}
                className={inputClass}
                placeholder="e.g. United States, Germany..."
              />
            </div>
            <div className="md:col-span-2">
              <FieldLabel required>Buyer Type</FieldLabel>
              <select
                required
                value={form.buyerType}
                onChange={(e) => updateField("buyerType", e.target.value)}
                className={inputClass}
              >
                <option value="">Select buyer type</option>
                <option value="Club / Team">Club / Team</option>
                <option value="School / University">School / University</option>
                <option value="Sportswear Brand">Sportswear Brand</option>
                <option value="Distributor / Wholesaler">Distributor / Wholesaler</option>
                <option value="Event Organizer">Event Organizer</option>
                <option value="Custom Retailer">Custom Retailer</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>
        </div>

        {/* Step 2: Project Information */}
        <div>
          <h3 className="mb-4 text-base font-black uppercase tracking-wider text-neutral-400">2. Project Details</h3>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <FieldLabel required>Sport Category</FieldLabel>
              <select
                required
                value={form.sportCategory}
                onChange={(e) => updateField("sportCategory", e.target.value)}
                className={inputClass}
              >
                <option value="">Select sport</option>
                <option value="Basketball">Basketball</option>
                <option value="Soccer">Soccer</option>
                <option value="Baseball">Baseball</option>
                <option value="American Football">American Football</option>
                <option value="Volleyball">Volleyball</option>
                <option value="Hockey">Hockey</option>
                <option value="Running">Running</option>
                <option value="Training Wear">Training Wear</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <FieldLabel required>Product Type</FieldLabel>
              <select
                required
                value={form.productType}
                onChange={(e) => updateField("productType", e.target.value)}
                className={inputClass}
              >
                <option value="">Select product type</option>
                <option value="Jersey Only">Jersey Only</option>
                <option value="Jersey + Shorts Set">Jersey + Shorts Set</option>
                <option value="Full Team Package">Full Team Package</option>
                <option value="Training Wear">Training Wear</option>
                <option value="OEM / ODM Collection">OEM / ODM Collection</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <FieldLabel required>Estimated Quantity</FieldLabel>
              <select
                required
                value={form.quantity}
                onChange={(e) => updateField("quantity", e.target.value)}
                className={inputClass}
              >
                <option value="">Select quantity</option>
                <option value="1 Sample">1 Sample MOQ</option>
                <option value="10–29 Sets">10–29 Sets (Team Order)</option>
                <option value="30–99 Sets">30–99 Sets</option>
                <option value="100–299 Sets">100–299 Sets</option>
                <option value="300+ Sets">300+ Sets (Volume Order)</option>
                <option value="Not Sure Yet">Not Sure Yet</option>
              </select>
            </div>
            <div>
              <FieldLabel>Target Delivery Date</FieldLabel>
              <input
                type="date"
                value={form.deliveryDate}
                onChange={(e) => updateField("deliveryDate", e.target.value)}
                className={inputClass}
              />
            </div>
            <div>
              <FieldLabel>Team / Brand Name</FieldLabel>
              <input
                value={form.teamName}
                onChange={(e) => updateField("teamName", e.target.value)}
                className={inputClass}
                placeholder="e.g. POXIOL Academy"
              />
            </div>
            <div>
              <FieldLabel>Main Colors</FieldLabel>
              <input
                value={form.colors}
                onChange={(e) => updateField("colors", e.target.value)}
                className={inputClass}
                placeholder="e.g. Black + Lime, Blue + White"
              />
            </div>
            <div className="md:col-span-2">
              <FieldLabel required>Need Player Name & Number?</FieldLabel>
              <select
                required
                value={form.needNumbers}
                onChange={(e) => updateField("needNumbers", e.target.value)}
                className={inputClass}
              >
                <option value="">Select option</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
                <option value="Not Sure Yet">Not Sure Yet</option>
              </select>
            </div>
          </div>
        </div>

        {/* Step 3: Logo & Message */}
        <div>
          <h3 className="mb-4 text-base font-black uppercase tracking-wider text-neutral-400">3. Design Details & Attachments</h3>
          <div className="grid gap-6">
            <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-5">
              <p className="text-sm font-black text-neutral-950 uppercase tracking-wide">Upload Custom Teamwear Documents</p>
              <p className="mt-2 text-xs leading-relaxed text-neutral-500">
                Upload your logo, reference design or size chart if available. If you do not have a design yet, POXIOL can help create a mockup based on your sport category, colors and team name.
              </p>
              
              {/* File Inputs Grid */}
              <div className="mt-5 grid gap-4 md:grid-cols-3">
                <div>
                  <FieldLabel>Logo File</FieldLabel>
                  <input 
                    type="file" 
                    accept=".ai,.eps,.pdf,.svg,.png,.jpg,.jpeg"
                    onChange={(e) => setLogoFile(e.target.files?.[0] || null)}
                    className="w-full text-xs text-neutral-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-black file:bg-lime-100 file:text-lime-700 hover:file:bg-lime-200 cursor-pointer"
                  />
                </div>
                <div>
                  <FieldLabel>Reference Design</FieldLabel>
                  <input 
                    type="file" 
                    accept=".png,.jpg,.jpeg,.pdf,.webp"
                    onChange={(e) => setReferenceFile(e.target.files?.[0] || null)}
                    className="w-full text-xs text-neutral-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-black file:bg-lime-100 file:text-lime-700 hover:file:bg-lime-200 cursor-pointer"
                  />
                </div>
                <div>
                  <FieldLabel>Size Chart / Tech Pack</FieldLabel>
                  <input 
                    type="file" 
                    accept=".pdf,.xlsx,.xls,.csv,.png,.jpg,.jpeg"
                    onChange={(e) => setSizeChartFile(e.target.files?.[0] || null)}
                    className="w-full text-xs text-neutral-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-black file:bg-lime-100 file:text-lime-700 hover:file:bg-lime-200 cursor-pointer"
                  />
                </div>
              </div>
            </div>

            <div>
              <FieldLabel>Tell us your design idea or special requests</FieldLabel>
              <textarea
                value={form.message}
                onChange={(e) => updateField("message", e.target.value)}
                className="min-h-[120px] w-full rounded-2xl border border-neutral-300 bg-white p-4 text-sm text-neutral-950 outline-none transition placeholder:text-neutral-400 focus:border-lime-400"
                placeholder="Tell us your design ideas, fabric preferences, packaging requirements or specific questions..."
              />
            </div>
          </div>
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
        <p>✓ Response within 1 business day</p>
        <p>✓ Simple order & sample support</p>
      </div>
    </form>
  );
}

export default function ContactForm(props: ContactFormProps) {
  return (
    <Suspense fallback={<div className="p-10 text-center font-bold text-neutral-500">Loading form...</div>}>
      <ContactFormInner {...props} />
    </Suspense>
  );
}
