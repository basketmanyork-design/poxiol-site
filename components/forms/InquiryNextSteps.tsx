import {getSiteChrome} from '@/lib/sanity/content'

export default async function InquiryNextSteps() {
  const chrome = await getSiteChrome()

  return (
    <section aria-labelledby="inquiry-next-steps" className="mt-10 w-full max-w-3xl rounded-3xl border border-white/15 bg-white/5 p-5 text-left sm:p-8">
      <p className="text-sm font-semibold leading-6 text-lime-300">Submitting a request does not place an order, authorize a payment or start production.</p>
      <h2 id="inquiry-next-steps" className="mt-6 text-2xl font-black text-white">What happens next</h2>
      <ol className="mt-5 list-decimal space-y-5 pl-5 text-sm leading-6 text-neutral-300">
        <li className="pl-1">
          <h3 className="font-bold text-white">POXIOL sales follow-up</h3>
          <p>Our sales team will review your request and use the contact details you provided to follow up. Any quotation, design or sample plan still needs project review.</p>
        </li>
        <li className="pl-1">
          <h3 className="font-bold text-white">Keep useful details ready</h3>
          <p>If available, keep your team or program name, approximate quantity, destination and target date ready. Missing details can be clarified with our team; you do not need to submit the same request again just to add a note.</p>
        </li>
        <li className="pl-1">
          <h3 className="font-bold text-white">Check your reply channel</h3>
          <p>Check the email address you supplied and your spam or junk folder when looking for our reply. This page is not an automatic email receipt.</p>
        </li>
      </ol>
      <div className="mt-7 border-t border-white/15 pt-6">
        <h2 className="text-lg font-bold text-white">Need to correct details or follow up?</h2>
        <p className="mt-2 text-sm leading-6 text-neutral-300">Use email or WhatsApp below. Mention the email address used for your request, your team or company, and roughly when you submitted it so we can look for the matching request. If the email address was wrong, include the correct one.</p>
        <div className="mt-4 flex flex-col items-start gap-3 sm:flex-row sm:flex-wrap sm:items-center">
          <a href={`mailto:${chrome.publicEmail}?subject=POXIOL%20inquiry%20follow-up`} data-analytics-location="form_recovery" className="inline-flex min-h-12 max-w-full items-center break-all rounded-xl bg-lime-400 px-4 py-3 font-bold text-neutral-950 hover:bg-lime-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-lime-300">Email {chrome.publicEmail}</a>
          <a href={chrome.whatsappHref} data-analytics-location="form_recovery" target="_blank" rel="noopener noreferrer" className="inline-flex min-h-12 items-center rounded-xl border border-white/40 px-4 py-3 font-bold text-white hover:border-lime-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-lime-300">Open WhatsApp</a>
        </div>
        <p className="mt-3 text-xs leading-5 text-neutral-400">Email opens your email app; WhatsApp opens its website or app. Neither sends a message automatically.</p>
      </div>
      <p className="mt-6 text-xs leading-5 text-neutral-400">Opened this page without submitting a form? This page alone does not create a request. <a href="/contact/#contact-form" className="inline-flex min-h-11 items-center font-bold text-lime-300 underline underline-offset-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-lime-300">Go to the contact form</a>.</p>
    </section>
  )
}
