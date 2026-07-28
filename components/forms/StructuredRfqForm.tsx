"use client"

import {useRouter} from "next/navigation"
import {useState} from "react"

import {catalog} from "@/lib/aao/catalog.mjs"
import {toRfqFormData, validateRfq} from "@/lib/aao/rfq-contract.mjs"

type Props = {
  publicEmail: string
  whatsappHref: string
}

const inputClass =
  "mt-2 h-12 w-full rounded-xl border border-neutral-300 bg-white px-4 text-sm text-neutral-950 outline-none focus:border-lime-500"
const labelClass = "block text-sm font-black text-neutral-950"

export default function StructuredRfqForm({publicEmail, whatsappHref}: Props) {
  const router = useRouter()
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [submitError, setSubmitError] = useState("")
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSubmitError("")

    const formElement = event.currentTarget
    const browserData = new FormData(formElement)
    const result = validateRfq({
      fullName: browserData.get("fullName"),
      email: browserData.get("email"),
      phone: browserData.get("phone"),
      country: browserData.get("country"),
      buyerType: browserData.get("buyerType"),
      sport: browserData.get("sport"),
      productType: browserData.get("productType"),
      quantity: browserData.get("quantity"),
      quantityUnit: browserData.get("quantityUnit"),
      targetDeliveryDate: browserData.get("targetDeliveryDate"),
      teamOrBrandName: browserData.get("teamOrBrandName"),
      colors: browserData.get("colors"),
      customization: browserData.getAll("customization"),
      notes: browserData.get("notes"),
      manualReviewAccepted: browserData.get("manualReviewAccepted") === "true",
    })

    if (!result.ok) {
      setErrors(result.errors)
      const firstField = Object.keys(result.errors)[0]
      document.getElementById(`rfq-${firstField}`)?.focus()
      return
    }

    setErrors({})
    setSubmitting(true)

    try {
      const endpoint = process.env.NEXT_PUBLIC_FORMSPREE_CONTACT_ENDPOINT
      if (!endpoint) {
        throw new Error(
          "RFQ endpoint is not configured. Please use email or WhatsApp.",
        )
      }

      const payload = toRfqFormData(result.value)
      payload.set("sourcePage", window.location.href)

      for (const name of ["logoFile", "referenceFile", "techPackFile"]) {
        const file = browserData.get(name)
        if (file instanceof File && file.size > 0) payload.set(name, file)
      }

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {Accept: "application/json"},
        body: payload,
      })
      if (!response.ok) {
        throw new Error(
          "Submission failed. Please retry or use email or WhatsApp.",
        )
      }

      router.push("/quote-received/")
    } catch (error) {
      setSubmitError(
        error instanceof Error
          ? error.message
          : "Submission failed. Please retry or use email or WhatsApp.",
      )
    } finally {
      setSubmitting(false)
    }
  }

  const fieldError = (name: string) =>
    errors[name] ? (
      <p className="mt-1 text-sm font-semibold text-red-700">{errors[name]}</p>
    ) : null

  return (
    <form
      onSubmit={handleSubmit}
      data-rfq-schema-version={catalog.contractVersion}
      className="rounded-[2rem] border border-neutral-200 bg-white p-6 shadow-xl md:p-10"
      noValidate
    >
      <p className="text-xs font-black uppercase tracking-[0.18em] text-lime-600">
        Structured RFQ · Schema {catalog.contractVersion}
      </p>
      <h2 className="mt-3 text-3xl font-black text-neutral-950">
        Request a human-reviewed quotation
      </h2>
      <p className="mt-3 text-sm leading-7 text-neutral-600">
        Submit comparable project requirements for POXIOL staff to review.
        This submission is not an automatic quote or order acceptance.
      </p>

      <div className="mt-8 grid gap-5 md:grid-cols-2">
        <label className={labelClass} htmlFor="rfq-fullName">
          Full name
          <input id="rfq-fullName" name="fullName" required className={inputClass} />
          {fieldError("fullName")}
        </label>
        <label className={labelClass} htmlFor="rfq-email">
          Email
          <input id="rfq-email" name="email" type="email" required className={inputClass} />
          {fieldError("email")}
        </label>
        <label className={labelClass} htmlFor="rfq-phone">
          WhatsApp / phone
          <input id="rfq-phone" name="phone" className={inputClass} />
        </label>
        <label className={labelClass} htmlFor="rfq-country">
          Destination country code
          <input
            id="rfq-country"
            name="country"
            required
            maxLength={2}
            placeholder="US"
            className={inputClass}
          />
          {fieldError("country")}
        </label>

        <SelectField
          id="rfq-buyerType"
          name="buyerType"
          label="Buyer type"
          options={catalog.buyerTypes}
          error={errors.buyerType}
        />
        <SelectField
          id="rfq-sport"
          name="sport"
          label="Sport"
          options={catalog.sports}
          error={errors.sport}
        />
        <SelectField
          id="rfq-productType"
          name="productType"
          label="Product type"
          options={catalog.products}
          error={errors.productType}
        />
        <div className="grid grid-cols-[1fr_0.8fr] gap-3">
          <label className={labelClass} htmlFor="rfq-quantity">
            Quantity
            <input
              id="rfq-quantity"
              name="quantity"
              type="number"
              min={1}
              step={1}
              required
              className={inputClass}
            />
            {fieldError("quantity")}
          </label>
          <label className={labelClass} htmlFor="rfq-quantityUnit">
            Unit
            <select id="rfq-quantityUnit" name="quantityUnit" className={inputClass}>
              <option value="set">Set</option>
              <option value="piece">Piece</option>
            </select>
            {fieldError("quantityUnit")}
          </label>
        </div>

        <label className={labelClass} htmlFor="rfq-targetDeliveryDate">
          Target delivery date
          <input
            id="rfq-targetDeliveryDate"
            name="targetDeliveryDate"
            type="date"
            className={inputClass}
          />
          {fieldError("targetDeliveryDate")}
        </label>
        <label className={labelClass} htmlFor="rfq-teamOrBrandName">
          Team / brand name
          <input id="rfq-teamOrBrandName" name="teamOrBrandName" className={inputClass} />
        </label>
        <label className={labelClass} htmlFor="rfq-colors">
          Colors
          <input id="rfq-colors" name="colors" className={inputClass} />
        </label>
      </div>

      <fieldset className="mt-6">
        <legend className={labelClass}>Customization</legend>
        <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {catalog.customization.map((option) => (
            <label key={option.id} className="flex items-center gap-3 rounded-xl border border-neutral-200 p-3 text-sm font-semibold text-neutral-700">
              <input type="checkbox" name="customization" value={option.id} />
              {option.label}
            </label>
          ))}
        </div>
        {fieldError("customization")}
      </fieldset>

      <label className={`${labelClass} mt-6`} htmlFor="rfq-notes">
        Project notes
        <textarea id="rfq-notes" name="notes" className={`${inputClass} min-h-28 py-3`} />
      </label>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <FileField name="logoFile" label="Logo file" accept=".ai,.eps,.pdf,.svg,.png,.jpg,.jpeg" />
        <FileField name="referenceFile" label="Reference design" accept=".pdf,.png,.jpg,.jpeg,.webp" />
        <FileField name="techPackFile" label="Tech pack / size chart" accept=".pdf,.xlsx,.xls,.csv,.png,.jpg,.jpeg" />
      </div>

      <label
        htmlFor="rfq-manualReviewAccepted"
        className="mt-7 flex items-start gap-3 rounded-2xl border border-lime-300 bg-lime-50 p-4 text-sm font-semibold text-neutral-800"
      >
        <input
          id="rfq-manualReviewAccepted"
          name="manualReviewAccepted"
          value="true"
          type="checkbox"
          className="mt-1"
        />
        <span>
          <strong>Human review required.</strong> I understand POXIOL must
          confirm feasibility, price, schedule, compliance, and order terms.
        </span>
      </label>
      {fieldError("manualReviewAccepted")}

      {submitError ? (
        <p className="mt-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700">
          {submitError}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={submitting}
        className="mt-7 h-14 w-full rounded-full bg-lime-400 text-sm font-black uppercase tracking-wider text-neutral-950 transition hover:bg-neutral-950 hover:text-white disabled:opacity-60"
      >
        {submitting ? "Submitting for review…" : "Submit structured RFQ"}
      </button>

      <p className="mt-5 text-center text-xs text-neutral-500">
        Endpoint unavailable? Email{" "}
        <a className="underline" href={`mailto:${publicEmail}`}>{publicEmail}</a>
        {" "}or{" "}
        <a className="underline" href={whatsappHref} target="_blank" rel="noreferrer">use WhatsApp</a>.
      </p>
    </form>
  )
}

function SelectField({
  id,
  name,
  label,
  options,
  error,
}: {
  id: string
  name: string
  label: string
  options: Array<{id: string; label: string}>
  error?: string
}) {
  return (
    <label className={labelClass} htmlFor={id}>
      {label}
      <select id={id} name={name} required className={inputClass} defaultValue="">
        <option value="" disabled>Select</option>
        {options.map((option) => (
          <option key={option.id} value={option.id}>{option.label}</option>
        ))}
      </select>
      {error ? <p className="mt-1 text-sm font-semibold text-red-700">{error}</p> : null}
    </label>
  )
}

function FileField({name, label, accept}: {name: string; label: string; accept: string}) {
  return (
    <label className={labelClass}>
      {label}
      <input
        name={name}
        type="file"
        accept={accept}
        className="mt-2 block w-full text-xs text-neutral-600 file:mr-3 file:rounded-full file:border-0 file:bg-lime-100 file:px-3 file:py-2 file:font-bold"
      />
    </label>
  )
}
