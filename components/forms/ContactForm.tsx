"use client";

import {useEffect, useState} from "react";
import {useRouter} from "next/navigation";
import {trackFileUpload, trackFormStart, trackFormSubmit, trackLead} from "@/lib/analytics/client";
import {
  BUYER_ROLE_OPTIONS,
  PROJECT_QUANTITY_OPTIONS,
  PROJECT_SPORT_OPTIONS,
  createProjectSubmissionFormData,
  requireContactFormEndpoint,
  validateProjectAttachment,
  type ProjectAttachments,
  type ProjectQualificationFields,
  type V8ConversionIntent,
} from "@/lib/v8/leads";

const initialFields: ProjectQualificationFields = {
  buyerRole: "",
  sport: "",
  quantity: "",
  deadline: "",
  customizationRequirements: "",
  fullName: "",
  company: "",
  country: "",
  whatsapp: "",
  email: "",
  selectedStyle: "",
};

const initialAttachments: ProjectAttachments = {
  logo_file: null,
  reference_design_file: null,
  size_chart_tech_pack_file: null,
};

const inputClass = "h-[50px] w-full rounded-2xl border border-neutral-300 bg-white px-4 text-base text-neutral-950 outline-none transition placeholder:text-neutral-400 focus:border-lime-400 focus-visible:ring-2 focus-visible:ring-lime-400/40";
const fileClass = "block min-h-[50px] w-full cursor-pointer rounded-2xl border border-neutral-300 bg-white px-3 py-3 text-sm text-neutral-700 file:mr-3 file:rounded-full file:border-0 file:bg-neutral-950 file:px-4 file:py-2 file:text-xs file:font-black file:uppercase file:text-white hover:file:bg-lime-400 hover:file:text-neutral-950 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lime-400";

function FieldLabel({htmlFor, children, required = false}: {htmlFor: string; children: React.ReactNode; required?: boolean}) {
  return (
    <label htmlFor={htmlFor} className="mb-2 block text-sm font-black text-neutral-950">
      {children} {required ? <span className="text-lime-600">*</span> : null}
    </label>
  );
}

export interface ContactFormProps {
  intent?: V8ConversionIntent;
  title?: string;
  subtitle?: string;
  formType?: string;
  ctaText?: string;
  successUrl?: string;
  publicEmail?: string;
  whatsappHref?: string;
  defaultSport?: string;
}

function ContactFormInner({
  intent = "contact",
  title = "Send a Project Inquiry",
  subtitle = "Share the project details available now so POXIOL can identify the right next step.",
  formType = "Contact V8 Optimized",
  ctaText = "Send Project Inquiry",
  successUrl = "/thank-you/",
  defaultSport = "",
}: ContactFormProps) {
  const router = useRouter();
  const [fields, setFields] = useState<ProjectQualificationFields>(initialFields);
  const [attachments, setAttachments] = useState<ProjectAttachments>(initialAttachments);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const style = searchParams.get("style") || "";
    const sport = searchParams.get("sport") || defaultSport;
    setFields((current) => ({...current, selectedStyle: style, sport: current.sport || sport}));
  }, [defaultSport]);

  function updateField(name: keyof ProjectQualificationFields, value: string) {
    trackFormStart(formType);
    setFields((current) => ({...current, [name]: value}));
  }

  function updateAttachment(name: keyof ProjectAttachments, file: File | null) {
    setErrorMessage("");
    const fileError = validateProjectAttachment(file);
    if (fileError) {
      setErrorMessage(fileError);
      setAttachments((current) => ({...current, [name]: null}));
      return;
    }
    setAttachments((current) => ({...current, [name]: file}));
    if (file) {
      trackFormStart(formType);
      trackFileUpload(formType);
    }
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setErrorMessage("");

    try {
      const endpoint = requireContactFormEndpoint(process.env.NEXT_PUBLIC_FORMSPREE_CONTACT_ENDPOINT);

      const formData = createProjectSubmissionFormData({
        intent,
        formType,
        sourcePage: window.location.href,
        fields,
        attachments,
      });

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {Accept: "application/json"},
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Submit failed. Please try again or contact us by email or WhatsApp.");
      }

      const submissionId = crypto.randomUUID();
      trackFormSubmit(formType, submissionId);
      trackLead(formType, submissionId);
      router.push(successUrl);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form method="post" action={process.env.NEXT_PUBLIC_FORMSPREE_CONTACT_ENDPOINT} onSubmit={handleSubmit} encType="multipart/form-data" className="rounded-[2rem] bg-white p-5 text-left shadow-xl sm:p-6 md:p-9" aria-describedby={errorMessage ? "project-form-error" : undefined}>
      <div className="mb-8">
        <p className="text-sm font-black uppercase tracking-[0.14em] text-lime-600">POXIOL Project Qualification</p>
        <h2 className="mt-3 break-words text-3xl font-black text-neutral-950">{title}</h2>
        <p className="mt-3 text-sm leading-6 text-neutral-600">{subtitle}</p>
        <p className="mt-4 rounded-2xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-xs font-bold leading-5 text-neutral-600">
          Your information is used only to review this project and plan sales follow-up. No external CRM is connected.
        </p>
      </div>

      {fields.selectedStyle ? (
        <div className="mb-8 rounded-2xl border border-lime-400/30 bg-lime-400/10 p-4">
          <p className="text-xs font-black uppercase tracking-widest text-neutral-500">Requested Look / Style</p>
          <p className="mt-1 text-lg font-black uppercase italic text-neutral-950">{fields.selectedStyle.replace(/-/g, " ")}</p>
        </div>
      ) : null}

      <div className="space-y-9">
        <fieldset>
          <legend className="mb-4 text-lg font-black text-neutral-950">Buyer Role</legend>
          <div>
            <FieldLabel htmlFor="field-buyerRole" required>Role</FieldLabel>
            <select required id="field-buyerRole" name="buyerRole" value={fields.buyerRole} onChange={(event) => updateField("buyerRole", event.target.value)} className={inputClass}>
              <option value="">Select buyer role</option>
              {BUYER_ROLE_OPTIONS.map((role) => <option key={role} value={role}>{role}</option>)}
            </select>
          </div>
        </fieldset>

        <fieldset>
          <legend className="mb-4 text-lg font-black text-neutral-950">Project Information</legend>
          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <FieldLabel htmlFor="field-sport" required>Sport</FieldLabel>
              <select required id="field-sport" name="sport" value={fields.sport} onChange={(event) => updateField("sport", event.target.value)} className={inputClass}>
                <option value="">Select sport</option>
                {PROJECT_SPORT_OPTIONS.map((sport) => <option key={sport} value={sport}>{sport}</option>)}
              </select>
            </div>
            <div>
              <FieldLabel htmlFor="field-quantity" required>Quantity</FieldLabel>
              <select required id="field-quantity" name="quantity" value={fields.quantity} onChange={(event) => updateField("quantity", event.target.value)} className={inputClass}>
                <option value="">Select quantity</option>
                {PROJECT_QUANTITY_OPTIONS.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
              </select>
            </div>
            <div>
              <FieldLabel htmlFor="field-deadline">Deadline</FieldLabel>
              <input id="field-deadline" name="deadline" type="date" value={fields.deadline} onChange={(event) => updateField("deadline", event.target.value)} className={inputClass} />
            </div>
            <div className="md:col-span-2">
              <FieldLabel htmlFor="field-customizationRequirements">Customization Requirement</FieldLabel>
              <textarea id="field-customizationRequirements" name="customizationRequirements" value={fields.customizationRequirements} onChange={(event) => updateField("customizationRequirements", event.target.value)} className="min-h-[120px] w-full rounded-2xl border border-neutral-300 bg-white p-4 text-base text-neutral-950 outline-none transition placeholder:text-neutral-400 focus:border-lime-400 focus-visible:ring-2 focus-visible:ring-lime-400/40" placeholder="Describe product type, colors, names, numbers, labels, packaging or other confirmed requirements." />
            </div>
          </div>
        </fieldset>

        <fieldset>
          <legend className="mb-2 text-lg font-black text-neutral-950">Assets</legend>
          <p className="mb-4 text-xs leading-5 text-neutral-500">Optional. Maximum 10 MB per file. Upload only project files you are authorized to share.</p>
          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <FieldLabel htmlFor="field-logo-file">Logo Upload</FieldLabel>
              <input id="field-logo-file" name="logo_file" type="file" accept=".ai,.eps,.pdf,.png,.jpg,.jpeg,.webp,image/*,application/pdf" onChange={(event) => updateAttachment("logo_file", event.target.files?.[0] || null)} className={fileClass} />
            </div>
            <div>
              <FieldLabel htmlFor="field-reference-file">Reference Image Upload</FieldLabel>
              <input id="field-reference-file" name="reference_design_file" type="file" accept=".pdf,.png,.jpg,.jpeg,.webp,image/*,application/pdf" onChange={(event) => updateAttachment("reference_design_file", event.target.files?.[0] || null)} className={fileClass} />
            </div>
            <div className="md:col-span-2">
              <FieldLabel htmlFor="field-tech-pack-file">Size Chart / Tech Pack (Optional)</FieldLabel>
              <input id="field-tech-pack-file" name="size_chart_tech_pack_file" type="file" accept=".csv,.xls,.xlsx,.pdf,.doc,.docx,.png,.jpg,.jpeg" onChange={(event) => updateAttachment("size_chart_tech_pack_file", event.target.files?.[0] || null)} className={fileClass} />
            </div>
          </div>
        </fieldset>

        <fieldset>
          <legend className="mb-4 text-lg font-black text-neutral-950">Contact</legend>
          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <FieldLabel htmlFor="field-fullName">Full Name</FieldLabel>
              <input id="field-fullName" name="fullName" autoComplete="name" value={fields.fullName} onChange={(event) => updateField("fullName", event.target.value)} className={inputClass} placeholder="Your name" />
            </div>
            <div>
              <FieldLabel htmlFor="field-company">Company / Team</FieldLabel>
              <input id="field-company" name="company" autoComplete="organization" value={fields.company} onChange={(event) => updateField("company", event.target.value)} className={inputClass} placeholder="Club, school, brand or distributor" />
            </div>
            <div>
              <FieldLabel htmlFor="field-country">Country / Region</FieldLabel>
              <input id="field-country" name="country" autoComplete="country-name" value={fields.country} onChange={(event) => updateField("country", event.target.value)} className={inputClass} placeholder="Delivery country or region" />
            </div>
            <div>
              <FieldLabel htmlFor="field-whatsapp">WhatsApp</FieldLabel>
              <input id="field-whatsapp" name="whatsapp" type="tel" autoComplete="tel" value={fields.whatsapp} onChange={(event) => updateField("whatsapp", event.target.value)} className={inputClass} placeholder="Country code + phone number" />
            </div>
            <div className="md:col-span-2">
              <FieldLabel htmlFor="field-email" required>Email</FieldLabel>
              <input required id="field-email" name="email" type="email" autoComplete="email" value={fields.email} onChange={(event) => updateField("email", event.target.value)} className={inputClass} placeholder="your@email.com" />
            </div>
          </div>
        </fieldset>
      </div>

      {errorMessage ? (
        <div id="project-form-error" role="alert" aria-live="assertive" className="mt-5 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700">
          {errorMessage}
        </div>
      ) : null}

      <button type="submit" disabled={loading} className="mt-8 min-h-[56px] w-full rounded-full bg-lime-400 px-5 py-3 text-sm font-black uppercase tracking-wide text-neutral-950 transition hover:bg-neutral-950 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-lime-400 disabled:cursor-not-allowed disabled:opacity-70">
        {loading ? "Submitting..." : ctaText}
      </button>

      <div className="mt-5 grid gap-2 text-xs font-semibold text-neutral-500 md:grid-cols-3">
        <p>Project details reviewed before follow-up</p>
        <p>Attachments are optional</p>
        <p>No external CRM or unnecessary profiling</p>
      </div>
    </form>
  );
}

export default function ContactForm(props: ContactFormProps) {
  return <ContactFormInner {...props} />;
}
