"use client";

import {useEffect, useRef, useState} from "react";
import {useRouter} from "next/navigation";
import {useInquiryContext} from '@/components/useInquiryContext';
import {InquiryReference} from './InquiryReference';
import {appendInquiryContext, publicSourcePath} from '@/lib/inquiry-context';
import {ProjectInquiryRequestError, sendProjectInquiry} from '@/lib/project-inquiry-request';
import {trackFileUpload, trackFormStart, trackFormSubmit, trackLead} from "@/lib/analytics/client";
import {PrivacyStatusLink} from '../legal/PrivacyStatusLink';
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
const fileChooserClass = "inline-flex min-h-11 shrink-0 items-center justify-center rounded-full border-0 bg-neutral-950 px-4 py-2 text-xs font-black uppercase text-white transition hover:bg-lime-400 hover:text-neutral-950 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lime-400 disabled:cursor-not-allowed disabled:opacity-50";

function FieldLabel({htmlFor, children, required = false}: {htmlFor: string; children: React.ReactNode; required?: boolean}) {
  return (
    <label htmlFor={htmlFor} className="mb-2 block text-sm font-black text-neutral-950">
      {children} {required ? <span className="text-lime-600">*</span> : null}
    </label>
  );
}

function AttachmentField({id, name, label, accept, file, disabled, onChange}: {
  id: string;
  name: keyof ProjectAttachments;
  label: string;
  accept: string;
  file: File | null;
  disabled: boolean;
  onChange: (file: File | null) => boolean;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const invalid = Boolean(validateProjectAttachment(file));
  const statusId = `${id}-status`;
  const errorId = `${id}-error`;

  function removeFile() {
    // The parent checks the live submission lock, including stale click handlers.
    if (!onChange(null)) return;
    if (inputRef.current) {
      inputRef.current.value = '';
    }
    buttonRef.current?.focus();
  }

  return (
    <>
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      <input ref={inputRef} id={id} name={name} type="file" accept={accept}
        disabled={disabled} aria-invalid={invalid || undefined}
        aria-describedby={`${statusId}${invalid ? ` ${errorId}` : ''}`}
        onChange={(event) => onChange(event.target.files?.[0] || null)} className="sr-only" />
      <div className="flex min-h-[58px] min-w-0 items-center gap-3 rounded-2xl border border-neutral-300 bg-white px-3 py-2">
        <button ref={buttonRef} id={`${id}-choose`} type="button" aria-controls={id} disabled={disabled}
          onClick={() => inputRef.current?.click()} className={fileChooserClass}>{file ? 'Replace file' : 'Choose file'}</button>
        <span id={statusId} aria-live="polite" className="min-w-0 break-all text-sm leading-5 text-neutral-700">{file ? file.name : 'No file selected'}</span>
      </div>
      {file ? (
        <div className="mt-3 min-w-0 space-y-2">
          {invalid ? <p id={errorId} aria-live="polite" className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm font-semibold leading-5 text-red-700">File exceeds the 10 MB limit. Choose a smaller file or remove it.</p> : null}
          <button type="button" aria-controls={id} aria-label={`Remove ${label}`} disabled={disabled} onClick={removeFile}
            className="inline-flex min-h-11 items-center rounded-lg border border-neutral-300 px-3 py-2 text-sm font-bold text-neutral-950 underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-50">Remove file</button>
        </div>
      ) : null}
    </>
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
  privacyPolicyApproved: boolean;
}

function ContactFormInner({
  intent = "contact",
  title = "Send a Project Inquiry",
  subtitle = "Share the project details available now so POXIOL can identify the right next step.",
  formType = "Contact V8 Optimized",
  ctaText = "Send Project Inquiry",
  successUrl = "/thank-you/",
  publicEmail = "sales@poxiol.com",
  whatsappHref = "https://wa.me/8613055646888",
  defaultSport = "",
  privacyPolicyApproved,
}: ContactFormProps) {
  const router = useRouter();
  const [fields, setFields] = useState<ProjectQualificationFields>(initialFields);
  const [attachments, setAttachments] = useState<ProjectAttachments>(initialAttachments);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [unconfirmed, setUnconfirmed] = useState(false);
  const submissionState = useRef<'idle' | 'sending' | 'accepted' | 'unconfirmed'>('idle');
  const errorPanelRef = useRef<HTMLDivElement>(null);
  const [errorFocusRequest, setErrorFocusRequest] = useState(0);
  const context = useInquiryContext();
  const [productReference, setProductReference] = useState('');

  useEffect(() => {
    const sport = context.sport || (PROJECT_SPORT_OPTIONS.includes(defaultSport as typeof PROJECT_SPORT_OPTIONS[number]) ? defaultSport : '');
    setFields((current) => ({...current, selectedStyle: context.style, sport: current.sport || sport}));
    setProductReference(context.product);
  }, [defaultSport, context.product, context.sport, context.style]);

  // Wait until the conditional error panel is committed. File selection/edits
  // do not request focus; only a failed submit increments this counter.
  useEffect(() => {
    if (!errorFocusRequest) return;
    errorPanelRef.current?.focus({preventScroll: true});
    errorPanelRef.current?.scrollIntoView({block: 'start'});
  }, [errorFocusRequest]);

  function updateField(name: keyof ProjectQualificationFields, value: string) {
    setFields((current) => ({...current, [name]: value}));
    try { trackFormStart(formType); } catch { /* Analytics must not discard edits. */ }
  }

  function updateAttachment(name: keyof ProjectAttachments, file: File | null) {
    if (submissionState.current === 'sending' || submissionState.current === 'accepted') return false;
    // Keep the actual selection, even when invalid, so it cannot be silently
    // dropped from an otherwise successful submission. Revalidate before POST.
    setAttachments((current) => ({...current, [name]: file}));
    if (submissionState.current === 'idle') {
      const nextAttachments = {...attachments, [name]: file};
      const invalid = Object.values(nextAttachments).find(item => validateProjectAttachment(item));
      setErrorMessage(invalid ? `${invalid.name} is larger than 10 MB. Replace or remove that file before submitting; you can arrange file sharing with us below.` : '');
    }
    if (file) {
      try { trackFormStart(formType); trackFileUpload(formType); } catch { /* Optional telemetry only. */ }
    }
    return true;
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submissionState.current !== 'idle') return;
    submissionState.current = 'sending';
    setLoading(true);
    setErrorMessage("");

    try {
      if (!process.env.NEXT_PUBLIC_FORMSPREE_CONTACT_ENDPOINT) {
        throw new Error('The form is temporarily unavailable. Please contact us by email or WhatsApp below.');
      }
      const endpoint = requireContactFormEndpoint(process.env.NEXT_PUBLIC_FORMSPREE_CONTACT_ENDPOINT);

      const invalid = Object.values(attachments).find(file => validateProjectAttachment(file));
      if (invalid) throw new Error(`${invalid.name} is larger than 10 MB. Replace or remove that file before submitting; it has not been uploaded.`);

      const formData = createProjectSubmissionFormData({
        intent,
        formType,
        sourcePage: publicSourcePath(window.location.pathname),
        fields,
        attachments,
      });
      appendInquiryContext(formData, {...context, product:productReference, style:fields.selectedStyle});

      await sendProjectInquiry(endpoint, formData);
      submissionState.current = 'accepted';
      setSubmitted(true);
      try {
        const submissionId = crypto.randomUUID();
        trackFormSubmit(formType, submissionId);
        trackLead(formType, submissionId);
      } catch { /* An accepted submission remains accepted without analytics. */ }
      try { router.push(successUrl); } catch { /* Keep the accepted state and next-step link below. */ }
    } catch (error) {
      const uncertain = error instanceof ProjectInquiryRequestError && error.unconfirmed;
      submissionState.current = uncertain ? 'unconfirmed' : 'idle';
      setUnconfirmed(uncertain);
      setErrorMessage(error instanceof Error ? error.message : 'The request could not be prepared. Please contact us below.');
      setErrorFocusRequest((current) => current + 1);
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

      <fieldset disabled={loading || submitted} className="min-w-0">
      <InquiryReference context={context} product={productReference} style={fields.selectedStyle} onProduct={setProductReference} onStyle={value=>updateField('selectedStyle',value)} />

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
              <input id="field-deadline" name="deadline" type="text" inputMode="numeric" autoComplete="off" placeholder="YYYY-MM-DD" maxLength={10} value={fields.deadline} onChange={(event) => updateField("deadline", event.target.value)} className={inputClass} />
            </div>
            <div className="md:col-span-2">
              <FieldLabel htmlFor="field-customizationRequirements">Customization Requirement</FieldLabel>
              <textarea id="field-customizationRequirements" name="customizationRequirements" value={fields.customizationRequirements} onChange={(event) => updateField("customizationRequirements", event.target.value)} className="min-h-[120px] w-full rounded-2xl border border-neutral-300 bg-white p-4 text-base text-neutral-950 outline-none transition placeholder:text-neutral-400 focus:border-lime-400 focus-visible:ring-2 focus-visible:ring-lime-400/40" placeholder="Describe product type, colors, names, numbers, labels, packaging or other confirmed requirements." />
            </div>
          </div>
        </fieldset>

        <fieldset>
          <legend className="mb-2 text-lg font-black text-neutral-950">Assets</legend>
          <p className="mb-4 text-xs leading-5 text-neutral-500">Optional. Maximum 10 MB per file. Choosing a file does not upload it; files are sent only when you submit. Upload only project files you are authorized to share.</p>
          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <AttachmentField id="field-logo-file" name="logo_file" label="Logo Upload" accept=".ai,.eps,.pdf,.png,.jpg,.jpeg,.webp,image/*,application/pdf"
                file={attachments.logo_file} disabled={loading || submitted} onChange={(file) => updateAttachment('logo_file', file)} />
            </div>
            <div>
              <AttachmentField id="field-reference-file" name="reference_design_file" label="Reference Image Upload" accept=".pdf,.png,.jpg,.jpeg,.webp,image/*,application/pdf"
                file={attachments.reference_design_file} disabled={loading || submitted} onChange={(file) => updateAttachment('reference_design_file', file)} />
            </div>
            <div className="md:col-span-2">
              <AttachmentField id="field-tech-pack-file" name="size_chart_tech_pack_file" label="Size Chart / Tech Pack (Optional)" accept=".csv,.xls,.xlsx,.pdf,.doc,.docx,.png,.jpg,.jpeg"
                file={attachments.size_chart_tech_pack_file} disabled={loading || submitted} onChange={(file) => updateAttachment('size_chart_tech_pack_file', file)} />
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

      </fieldset>

      {errorMessage ? (
        <div ref={errorPanelRef} id="project-form-error" role="alert" aria-live="assertive" tabIndex={-1} className="mt-5 scroll-mt-28 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-700">
          <h3 className="font-black">{unconfirmed ? 'Please check receipt before resending' : 'Your request needs attention'}</h3>
          <p className="mt-2 break-words">{errorMessage}</p>
          <p className="mt-2">Your entered details and selected files remain on this page. They are not saved after leaving or refreshing.</p>
          {unconfirmed ? <p className="mt-2">Do not submit again or refresh to retry. Use email or WhatsApp to check receipt first; mention your original email, team or company and approximate submission time.</p> : null}
          {unconfirmed ? <p className="mt-2">Changing or removing files here only changes this page; it does not withdraw an earlier submission.</p> : null}
          <div className="mt-3 flex flex-wrap gap-3">
            <a href={`mailto:${publicEmail}?subject=POXIOL%20inquiry%20help`} className="inline-flex min-h-11 max-w-full items-center break-all rounded-lg bg-white px-3 py-2 underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2">Email {publicEmail}</a>
            <a href={whatsappHref} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center rounded-lg bg-white px-3 py-2 underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2">Open WhatsApp</a>
          </div>
          <p className="mt-2 text-xs">These links open your email app or WhatsApp; they do not send a message automatically.</p>
        </div>
      ) : null}

      {submitted ? <div role="status" className="mt-5 rounded-xl bg-lime-50 p-4 text-sm text-neutral-950"><p className="font-bold">Request submitted. Please do not send it again.</p><a href={successUrl} className="inline-flex min-h-11 items-center font-bold underline">View next steps</a></div> : null}
      {loading ? <p role="status" className="mt-5 text-sm text-neutral-700">Sending your request. Please keep this page open and do not submit again.</p> : null}
      <button type="submit" disabled={loading || submitted || unconfirmed} className="mt-8 min-h-[56px] w-full rounded-full bg-lime-400 px-5 py-3 text-sm font-black uppercase tracking-wide text-neutral-950 transition hover:bg-neutral-950 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-lime-400 disabled:cursor-not-allowed disabled:opacity-70">
        {submitted ? 'Request submitted' : unconfirmed ? 'Check receipt before resending' : loading ? "Submitting..." : ctaText}
      </button>

      <p className="mt-4 text-xs leading-5 text-neutral-600">
        <PrivacyStatusLink approved={privacyPolicyApproved} />
      </p>

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
