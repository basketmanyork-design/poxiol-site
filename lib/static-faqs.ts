import type {StaticFaq} from '@/components/seo/CodeOwnedFaq'

/**
 * FAQs for pages whose copy is owned by the CMS.
 *
 * The answers restate rules the site already applies: what a brief contains, what
 * is confirmed in writing, who owns artwork. No quantity, price, lead time or
 * certification is stated, because none of them is fixed per project.
 */
export const ABOUT_FAQS: StaticFaq[] = [
  {
    question: 'Who operates POXIOL?',
    answer: 'POXIOL is a brand operated by Quanzhou Lanren Electronic Commerce Co., Ltd. Projects are handled as business-to-business custom teamwear work rather than retail sales.',
  },
  {
    question: 'What kinds of buyers does POXIOL work with?',
    answer: 'Sports clubs, schools, academies, youth programs, sportswear brands and distributors. Each of those prepares a different brief, which is why the buyer programs are described separately.',
  },
  {
    question: 'How does a project start?',
    answer: 'With a brief: intended use, item list, size range, quantity basis, artwork status and destination. That brief is reviewed, a mockup route is agreed, and whether a physical sample is needed is decided before production is scheduled.',
  },
  {
    question: 'What is confirmed in writing before an order?',
    answer: 'The product specification, the size breakdown, the quantity basis, how the schedule was set and the delivery terms that apply to the quotation. Nothing quantitative is published as a fixed figure because it is confirmed per project.',
  },
]

export const CONTACT_FAQS: StaticFaq[] = [
  {
    question: 'What should the first message contain?',
    answer: 'The intended use, the item type, the size range, the quantity basis and the destination. A finished design is not required, and neither is a confirmed quantity.',
  },
  {
    question: 'Do I need artwork before asking a question?',
    answer: 'No. A general question can be answered without artwork. Artwork matters once the project moves to a mockup, because placement and colour have to be reviewed against the garment.',
  },
  {
    question: 'What happens after I send a brief?',
    answer: 'The brief is reviewed against the product, the size range and the decoration method, then the mockup route and whether a sample is required are confirmed for that project.',
  },
  {
    question: 'Can I ask about an existing order?',
    answer: 'Yes. Include the project reference and the specific point you need confirmed, so the answer can be checked against the approved project records rather than answered in general terms.',
  },
]
