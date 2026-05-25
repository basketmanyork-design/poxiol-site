"use client";

import { useState } from "react";
import { sportOptions, buyerTypeOptions, quantityOptions, productOptions } from "@/lib/free-mockup-data";

type FormState = { fullName: string; email: string; phone: string; country: string; company: string; sportCategory: string; buyerType: string; quantity: string; products: string[]; deliveryDate: string; colors: string; hasLogo: string; notes: string; };
const initialState: FormState = { fullName: "", email: "", phone: "", country: "", company: "", sportCategory: "", buyerType: "", quantity: "", products: [], deliveryDate: "", colors: "", hasLogo: "", notes: "" };
function FieldLabel({ children, required = false }: { children: React.ReactNode; required?: boolean }) { return <label className="mb-2 block text-sm font-black text-neutral-950">{children} {required ? <span className="text-lime-600">*</span> : null}</label>; }
const inputClass = "h-[50px] w-full rounded-2xl border border-neutral-300 bg-white px-4 text-sm text-neutral-950 outline-none transition placeholder:text-neutral-400 focus:border-lime-400";

export default function FreeMockupForm() {
  const [form, setForm] = useState<FormState>(initialState);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  function updateField(name: keyof FormState, value: string) { setForm((current) => ({ ...current, [name]: value })); }
  function toggleProduct(product: string) { setForm((current) => { const exists = current.products.includes(product); return { ...current, products: exists ? current.products.filter((item) => item !== product) : [...current.products, product] }; }); }
  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); setLoading(true); setErrorMessage("");
    try {
      const endpoint = process.env.NEXT_PUBLIC_FORMSPREE_FREE_MOCKUP_ENDPOINT;
      if (!endpoint) throw new Error("Form endpoint is not configured. Add NEXT_PUBLIC_FORMSPREE_FREE_MOCKUP_ENDPOINT in Cloudflare Pages.");
      const response = await fetch(endpoint, { method: "POST", headers: { Accept: "application/json", "Content-Type": "application/json" }, body: JSON.stringify({ formType: "Free Mockup", ...form, products: form.products.join(", "), sourcePage: window.location.href }) });
      if (!response.ok) throw new Error("Submit failed. Please try again or contact us by email.");
      setSubmitted(true); setForm(initialState);
    } catch (error) { setErrorMessage(error instanceof Error ? error.message : "Something went wrong. Please try again."); } finally { setLoading(false); }
  }
  if (submitted) return <div className="rounded-[2rem] bg-white p-8 shadow-2xl md:p-10"><div className="flex h-14 w-14 items-center justify-center rounded-full bg-lime-400 text-2xl font-black text-neutral-950">✓</div><h2 className="mt-6 text-3xl font-black text-neutral-950">Request Received</h2><p className="mt-4 leading-7 text-neutral-600">Thank you. Your request has been received. The POXIOL team will review your project details and contact you with the next steps.</p><button type="button" onClick={() => setSubmitted(false)} className="mt-8 h-[52px] rounded-full bg-neutral-950 px-7 text-sm font-black uppercase text-white transition hover:bg-lime-400 hover:text-neutral-950">Submit Another Request</button></div>;
  return (
    <form onSubmit={handleSubmit} className="rounded-[2rem] bg-white p-6 shadow-2xl md:p-9">
      <div className="mb-8"><p className="text-sm font-black uppercase tracking-[0.14em] text-lime-600">Free Mockup Form</p><h2 className="mt-3 text-3xl font-black text-neutral-950">Tell Us About Your Project</h2><p className="mt-3 text-sm leading-6 text-neutral-600">Fields marked with * are required. More details help us prepare a better design preview.</p></div>
      <div className="space-y-8">
        <div><h3 className="mb-4 text-lg font-black text-neutral-950">Contact Information</h3><div className="grid gap-4 md:grid-cols-2">
          <div><FieldLabel required>Full Name</FieldLabel><input required value={form.fullName} onChange={(e)=>updateField("fullName",e.target.value)} className={inputClass} placeholder="Your name" /></div>
          <div><FieldLabel required>Email Address</FieldLabel><input required type="email" value={form.email} onChange={(e)=>updateField("email",e.target.value)} className={inputClass} placeholder="your@email.com" /></div>
          <div><FieldLabel>WhatsApp / Phone</FieldLabel><input value={form.phone} onChange={(e)=>updateField("phone",e.target.value)} className={inputClass} placeholder="Country code + phone number" /></div>
          <div><FieldLabel required>Country / Region</FieldLabel><input required value={form.country} onChange={(e)=>updateField("country",e.target.value)} className={inputClass} placeholder="United States, Germany, UAE..." /></div>
          <div className="md:col-span-2"><FieldLabel>Company / Team Name</FieldLabel><input value={form.company} onChange={(e)=>updateField("company",e.target.value)} className={inputClass} placeholder="Your club, school, brand or company name" /></div>
        </div></div>
        <div><h3 className="mb-4 text-lg font-black text-neutral-950">Project Details</h3><div className="grid gap-4 md:grid-cols-2">
          <div><FieldLabel required>Sport Category</FieldLabel><select required value={form.sportCategory} onChange={(e)=>updateField("sportCategory",e.target.value)} className={inputClass}><option value="">Select sport</option>{sportOptions.map((item)=><option key={item} value={item}>{item}</option>)}</select></div>
          <div><FieldLabel required>Buyer Type</FieldLabel><select required value={form.buyerType} onChange={(e)=>updateField("buyerType",e.target.value)} className={inputClass}><option value="">Select buyer type</option>{buyerTypeOptions.map((item)=><option key={item} value={item}>{item}</option>)}</select></div>
          <div><FieldLabel required>Estimated Quantity</FieldLabel><select required value={form.quantity} onChange={(e)=>updateField("quantity",e.target.value)} className={inputClass}><option value="">Select quantity</option>{quantityOptions.map((item)=><option key={item} value={item}>{item}</option>)}</select></div>
          <div><FieldLabel>Target Delivery Date</FieldLabel><input type="date" value={form.deliveryDate} onChange={(e)=>updateField("deliveryDate",e.target.value)} className={inputClass} /></div>
        </div><div className="mt-4"><FieldLabel required>Required Products</FieldLabel><div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">{productOptions.map((item)=><label key={item} className="flex cursor-pointer items-center gap-3 rounded-2xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm font-bold text-neutral-700 transition hover:border-lime-400"><input type="checkbox" checked={form.products.includes(item)} onChange={()=>toggleProduct(item)} className="h-4 w-4 accent-lime-400" />{item}</label>)}</div>{form.products.length===0?<input className="sr-only" required value="" onChange={()=>null}/>:null}</div></div>
        <div><h3 className="mb-4 text-lg font-black text-neutral-950">Design Details</h3><div className="grid gap-4 md:grid-cols-2">
          <div><FieldLabel>Main Colors</FieldLabel><input value={form.colors} onChange={(e)=>updateField("colors",e.target.value)} className={inputClass} placeholder="Black + lime, blue + white..." /></div>
          <div><FieldLabel required>Do You Have a Logo?</FieldLabel><select required value={form.hasLogo} onChange={(e)=>updateField("hasLogo",e.target.value)} className={inputClass}><option value="">Select option</option><option value="Yes, I can upload it">Yes, I can upload it</option><option value="Not yet, need design help">Not yet, need design help</option></select></div>
          <div className="md:col-span-2 rounded-2xl border border-dashed border-neutral-300 bg-neutral-50 p-5"><p className="text-sm font-black text-neutral-950">Logo / Reference Files</p><p className="mt-2 text-sm leading-6 text-neutral-600">Have logo or reference files? Submit the form first. The POXIOL team will reply and ask you to send files by email or WhatsApp.</p></div>
          <div className="md:col-span-2"><FieldLabel>Design Notes</FieldLabel><textarea value={form.notes} onChange={(e)=>updateField("notes",e.target.value)} className="min-h-[120px] w-full rounded-2xl border border-neutral-300 bg-white p-4 text-sm text-neutral-950 outline-none transition placeholder:text-neutral-400 focus:border-lime-400" placeholder="Tell us your team name, player numbers, preferred style or any special request." /></div>
        </div></div>
      </div>
      {errorMessage ? <div className="mt-5 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700">{errorMessage}</div> : null}
      <button type="submit" disabled={loading} className="mt-8 h-[56px] w-full rounded-full bg-lime-400 text-sm font-black uppercase tracking-wide text-neutral-950 transition hover:bg-neutral-950 hover:text-white disabled:cursor-not-allowed disabled:opacity-70">{loading ? "Submitting..." : "Get My Free Mockup"}</button>
      <div className="mt-5 grid gap-2 text-xs font-semibold text-neutral-500 md:grid-cols-3"><p>Free design preview before order</p><p>Response within 1 business day</p><p>Files requested by reply email</p></div>
    </form>
  );
}
