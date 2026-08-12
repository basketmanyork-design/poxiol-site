import type {CmsFaqItem, CmsPage, CmsPageSection} from '../cms/types.ts'

export const FREE_MOCKUP_FAQS = [
  {
    question: 'What information is needed for a mockup request?',
    answer: 'Share the sport or product type, team or brand context, preferred colors, design direction, estimated quantity and target date. If some details are not yet confirmed, provide what is available so the remaining requirements can be reviewed.',
  },
  {
    question: 'Can buyers upload logos or references?',
    answer: 'Yes. Buyers can attach a logo and a reference image through the mockup request form. Clear files help the design discussion cover colors, placement and the intended visual direction.',
  },
  {
    question: 'What happens after receiving a mockup?',
    answer: 'The buyer can review the design direction, logo and color placement, and relevant product details. Feedback can then guide revisions or the next discussion about a quotation or production sample.',
  },
  {
    question: 'What information is needed before production discussion?',
    answer: 'Before discussing production, confirm the design direction, product specifications, size requirements, quantity, customization details, sample expectations, target date and shipping destination.',
  },
] as const satisfies readonly CmsFaqItem[]

export function withFreeMockupFaqs(page: CmsPage, faqs: readonly CmsFaqItem[]): CmsPage {
  const sectionsWithoutFaqs = page.sections.filter((section) => section.type !== 'faq' && !section.faqs?.length)
  const faqSection: CmsPageSection = {
    type: 'faq',
    eyebrow: 'Mockup Request FAQ',
    title: 'Before You Request a Mockup',
    body: 'Review the project information, file uploads and next steps used for a custom teamwear mockup request.',
    faqs: faqs.map((faq) => ({...faq})),
  }
  return {
    ...page,
    sections: [...sectionsWithoutFaqs, faqSection],
  }
}
