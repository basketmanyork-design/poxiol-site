import type {Metadata} from 'next'
import GeneralInquiryForm from '@/components/forms/GeneralInquiryForm'
import {ConversionEntryGuide} from '@/components/v8/ConversionEntryGuide'
import {CmsPageTemplate, metadataFromCmsPage} from '@/components/cms/PageTemplate'
import {EmailAddress, emailHref} from '@/components/ui'
import {getSiteChrome, getSitePage} from '@/lib/sanity/content'
import {getV8ConversionEntry} from '@/lib/v8/leads'
import {legalPolicyApproved} from '@/lib/legal-release'

const pageKey = 'contact'

export async function generateMetadata(): Promise<Metadata> {
  const page = await getSitePage(pageKey)
  return metadataFromCmsPage(page, {
    title: 'Contact POXIOL | Ask a Teamwear Question',
    description: 'Ask POXIOL about teamwear cooperation, ordering or delivery. Start with your question and reply email; no artwork or production details are required.',
  })
}

export default async function ContactPage() {
  const [page, chrome] = await Promise.all([getSitePage(pageKey), getSiteChrome()])

  return (
    <CmsPageTemplate
      page={{
        ...page,
        eyebrow: 'Ask POXIOL',
        description: 'Have a question about working with POXIOL? Start with your question and reply email. You do not need a finished design or a confirmed quantity.',
        sections: page.sections.map(section => section.title === 'Send project details for a practical reply' ? {
          ...section,
          title: 'Already planning a specific project?',
          body: `The details below help with a project quote; they are not required for a general question. ${section.body || ''}`,
        } : section),
      }}
      conversionIntent="contact"
      contactSlot={
        <>
          <noscript>
            <div className="rounded-lg border border-yellow-400 bg-yellow-50 p-6 dark:bg-yellow-950/20">
              <p className="font-semibold">If the form does not load, send your question by email or WhatsApp. No production details are required.</p>
              <p className="mt-2"><a href={emailHref(chrome.publicEmail)} className="underline"><EmailAddress email={chrome.publicEmail} /></a></p>
              <p><a href={chrome.whatsappHref} className="underline" target="_blank" rel="noopener">WhatsApp: {chrome.whatsappNumber}</a></p>
            </div>
          </noscript>
          <div id={getV8ConversionEntry('contact').formAnchorId} tabIndex={-1} className="scroll-mt-24">
            <GeneralInquiryForm
              publicEmail={chrome.publicEmail}
              whatsappHref={chrome.whatsappHref}
              privacyPolicyApproved={legalPolicyApproved()}
            />
          </div>
          <div className="mt-12"><ConversionEntryGuide currentIntent="contact" /></div>
        </>
      }
    />
  )
}
