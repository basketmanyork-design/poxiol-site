"use client";

import {useEffect, useRef, useState} from 'react'
import {submitGeneralInquiry} from '@/lib/general-inquiry'
import {ProjectInquiryRequestError as InquiryRequestError} from '@/lib/project-inquiry-request'
import {getV8ConversionEntry} from '@/lib/v8/leads'
import {trackFormStart, trackFormSubmit, trackLead} from '@/lib/analytics/client'
import {useInquiryContext} from '@/components/useInquiryContext'
import {InquiryReference} from './InquiryReference'
import {publicSourcePath} from '@/lib/inquiry-context'
import InquiryLink from '@/components/InquiryLink'

const formType = 'Contact Page CMS'
const entry = getV8ConversionEntry('contact')
const inputClass = 'min-h-[50px] w-full rounded-2xl border border-neutral-300 bg-white px-4 py-3 text-base text-neutral-950 outline-none focus:border-lime-500 focus-visible:ring-2 focus-visible:ring-lime-400/40'

export default function GeneralInquiryForm({publicEmail, whatsappHref, privacyPolicyApproved = false}: {publicEmail: string; whatsappHref: string; privacyPolicyApproved?: boolean}) {
  const [fields, setFields] = useState({message: '', email: '', fullName: ''})
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')
  const [unconfirmed, setUnconfirmed] = useState(false)
  const submissionState = useRef<'idle' | 'sending' | 'accepted' | 'unconfirmed'>('idle')
  const context = useInquiryContext()
  const [productReference,setProductReference] = useState('')
  const [styleReference,setStyleReference] = useState('')
  useEffect(() => {setProductReference(context.product);setStyleReference(context.style)}, [context.product,context.style])

  function updateField(name: keyof typeof fields, value: string) {
    setFields(current => ({...current, [name]: value}))
    if (submissionState.current !== 'unconfirmed') setError('')
    try {
      trackFormStart(formType)
    } catch {
      // Optional analytics must never block a buyer's edit.
    }
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (submissionState.current !== 'idle') return
    submissionState.current = 'sending'
    setLoading(true)
    setError('')
    try {
      const gotcha = String(new FormData(event.currentTarget).get('_gotcha') || '')
      await submitGeneralInquiry({...fields, _gotcha: gotcha}, {
        endpoint: process.env.NEXT_PUBLIC_FORMSPREE_CONTACT_ENDPOINT,
        sourcePage: publicSourcePath(window.location.pathname),
        inquiryContext: {...context,product:productReference,style:styleReference},
      })
      submissionState.current = 'accepted'
      setSubmitted(true)
      try {
        const submissionId = crypto.randomUUID()
        trackFormSubmit(formType, submissionId)
        trackLead(formType, submissionId)
      } catch {
        // An accepted inquiry stays successful even when analytics is unavailable.
      }
    } catch (cause) {
      const uncertain = cause instanceof InquiryRequestError && cause.unconfirmed
      submissionState.current = uncertain ? 'unconfirmed' : 'idle'
      setUnconfirmed(uncertain)
      setError(cause instanceof Error ? cause.message : 'Your question could not be sent. Please use email or WhatsApp below.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form method="post" action={process.env.NEXT_PUBLIC_FORMSPREE_CONTACT_ENDPOINT} onSubmit={handleSubmit} className="mx-auto max-w-3xl rounded-[2rem] border border-neutral-200 bg-white p-5 text-left shadow-xl sm:p-6 md:p-9" aria-describedby={error ? 'general-inquiry-help general-inquiry-error' : 'general-inquiry-help'}>
      <p className="text-xs font-black uppercase tracking-[0.14em] text-lime-700">Ask POXIOL</p>
      <h2 className="mt-3 text-3xl font-black text-neutral-950">Send a General Inquiry</h2>
      <p id="general-inquiry-help" className="mt-3 text-sm leading-6 text-neutral-600">New to buying from China? Ask about cooperation, ordering or delivery. No artwork, quantity or technical specifications are needed to ask a question.</p>
      <p className="mt-3 text-sm font-semibold text-neutral-700">Asking a question does not place an order. Only your question and reply email are required.</p>

      <input type="hidden" name="intent" value="contact" />
      <input type="hidden" name="formType" value={formType} />
      <input type="hidden" name="inquiryType" value="general-question" />
      <input type="hidden" name="sourcePage" value="/contact/" />
      <div className="hidden" aria-hidden="true">
        <label htmlFor="general-website">Leave this field empty</label>
        <input id="general-website" type="text" name="_gotcha" tabIndex={-1} autoComplete="off" />
      </div>

      <fieldset disabled={loading || submitted} className="mt-7 space-y-5 disabled:opacity-70">
        <InquiryReference context={context} product={productReference} style={styleReference} onProduct={setProductReference} onStyle={setStyleReference} />
        <div>
          <label htmlFor="general-message" className="mb-2 block text-sm font-bold text-neutral-950">Your question <span className="text-lime-700">*</span></label>
          <textarea id="general-message" name="message" required maxLength={5000} rows={4} value={fields.message} onChange={event => updateField('message', event.target.value)} className={inputClass} placeholder="For example: I supply local teams and have not imported from China before. How do I get started?" />
        </div>
        <div>
          <label htmlFor="general-email" className="mb-2 block text-sm font-bold text-neutral-950">Reply email <span className="text-lime-700">*</span></label>
          <input id="general-email" name="email" type="email" autoComplete="email" required maxLength={254} value={fields.email} onChange={event => updateField('email', event.target.value)} className={inputClass} placeholder="you@company.com" />
        </div>
        <div>
          <label htmlFor="general-name" className="mb-2 block text-sm font-bold text-neutral-950">Your name (optional)</label>
          <input id="general-name" name="fullName" type="text" autoComplete="name" maxLength={100} value={fields.fullName} onChange={event => updateField('fullName', event.target.value)} className={inputClass} />
        </div>
      </fieldset>

      {error ? (
        <div id="general-inquiry-error" role="alert" className="mt-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">
          <h3 className="font-bold">{unconfirmed ? 'Please check receipt before resending' : 'Your question needs attention'}</h3>
          <p className="mt-2">{error}</p>
          <p className="mt-2">Your entered details remain on this page. They are not saved after leaving or refreshing.</p>
          {unconfirmed ? <p className="mt-2">Do not submit again or refresh to retry. Use email or WhatsApp to check receipt first; mention your original reply email and approximate submission time.</p> : null}
          <div className="mt-3 flex flex-wrap gap-3">
            <a href={`mailto:${publicEmail}?subject=POXIOL%20inquiry%20help`} className="inline-flex min-h-11 max-w-full items-center break-all rounded-lg bg-white px-3 py-2 font-bold underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2">Email {publicEmail}</a>
            <a href={whatsappHref} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center rounded-lg bg-white px-3 py-2 font-bold underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2">Open WhatsApp</a>
          </div>
          <p className="mt-2 text-xs">These links open your email app or WhatsApp; they do not send a message automatically.</p>
        </div>
      ) : null}
      {submitted ? <div role="status" className="mt-5 rounded-xl border border-lime-400 bg-lime-50 p-4 text-neutral-950"><h3 className="font-bold">Question submitted</h3><p className="mt-2 text-sm">We will use the email you provided to reply. You have not placed an order. Please do not send the same question again.</p></div> : null}
      {loading ? <p role="status" className="mt-5 text-sm text-neutral-700">Sending your question. Please keep this page open and do not submit again.</p> : null}
      <button type="submit" disabled={loading || submitted || unconfirmed} className="mt-6 min-h-14 w-full rounded-full bg-lime-400 px-5 py-3 text-sm font-black uppercase tracking-wide text-neutral-950 hover:bg-lime-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-lime-500 disabled:cursor-not-allowed disabled:opacity-60">
        {submitted ? 'Question submitted' : unconfirmed ? 'Check receipt before resending' : loading ? 'Sending...' : entry.ctaLabel}
      </button>
      <p className="mt-4 text-xs leading-5 text-neutral-600">
        {privacyPolicyApproved ? <>Read how we handle your information in our <a href="/privacy-policy/" className="font-semibold underline">Privacy Policy</a>.</> : <><a href="/privacy-policy/" className="font-semibold underline">Draft privacy notice</a> — pending owner and legal approval.</>}
      </p>
      <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-neutral-200 pt-4 text-sm">
        <p className="w-full text-neutral-600">Prefer another way to ask?</p>
        <a href={`mailto:${publicEmail}`} className="inline-flex min-h-11 items-center break-all font-bold text-neutral-950 underline">Email us: {publicEmail}</a>
        <InquiryLink href={whatsappHref} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center font-bold text-neutral-950 underline">Open WhatsApp</InquiryLink>
      </div>
    </form>
  )
}
