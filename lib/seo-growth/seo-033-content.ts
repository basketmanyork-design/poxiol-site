export type DecisionRow = {
  option: string
  startingPoint: string
  confirm: string
  nextStep: string
}

export type DecisionLink = {
  label: string
  href: string
}

export type BuyerDecisionContent = {
  id: string
  eyebrow: string
  title: string
  answer: string
  rows: readonly DecisionRow[]
  checklist: readonly string[]
  links: readonly DecisionLink[]
}

export const SEO033_BASKETBALL_CONTENT = {
  id: 'basketball-order-planning',
  eyebrow: 'Basketball Order Planning',
  title: 'Choose the Basketball Uniform Path Before You Request a Quote',
  answer: 'A basketball uniform project starts with the garment structure, roster and size breakdown, authorized artwork, sample expectations, quantity, destination and required in-hand date. Confirm these inputs before the project moves to mockup, sample or quotation review.',
  rows: [
    {
      option: 'Jersey and shorts set',
      startingPoint: 'A coordinated standard game set.',
      confirm: 'Jersey and shorts quantities, size breakdown, colors and authorized artwork.',
      nextStep: 'Mockup, sample or quotation review.',
    },
    {
      option: 'Reversible set',
      startingPoint: 'Two coordinated wearing sides are required.',
      confirm: 'Both designs, construction preference, roster, sizes and sample expectations.',
      nextStep: 'Mockup and sample-requirement review.',
    },
    {
      option: 'Single-layer set',
      startingPoint: 'One primary uniform side is required.',
      confirm: 'Garment structure, artwork placement, fit direction and size breakdown.',
      nextStep: 'Mockup, sample or quotation review.',
    },
    {
      option: 'Personalized roster',
      startingPoint: 'Player names or numbers vary by garment.',
      confirm: 'Final spelling, numbers, garment sizes and approved placement.',
      nextStep: 'Roster validation before the next project step.',
    },
    {
      option: 'Private-label or reorder planning',
      startingPoint: 'A brand or distributor needs labels, packaging or a later repeat run.',
      confirm: 'Authorized brand assets, label and packaging requirements, current specification, quantity and timing.',
      nextStep: 'Private-label or current-specification review.',
    },
  ],
  checklist: [
    'Product structure',
    'Expected quantity',
    'Size breakdown',
    'Final names and numbers',
    'Authorized logos and color direction',
    'Sample expectation',
    'Destination',
    'Required in-hand date',
  ],
  links: [
    {label: 'Basketball Uniform Ordering Guide', href: '/guides/how-to-order-custom-basketball-uniforms/'},
    {label: 'Plan a Sample Order', href: '/sample-order/'},
    {label: 'Review the Quality Control Process', href: '/quality-control-process/'},
    {label: 'Request a Basketball Project Quote', href: '/get-quote/'},
  ],
} satisfies BuyerDecisionContent

export const SEO033_OEM_ODM_CONTENT = {
  id: 'oem-odm-project-planning',
  eyebrow: 'OEM/ODM Project Planning',
  title: 'Choose the Development Path Before You Request a Quote',
  answer: 'Choose OEM when the product, artwork and specification direction are already defined. Choose ODM when the concept, range structure or open product decisions still need development review. POXIOL confirms the appropriate path after reviewing the actual project brief.',
  rows: [
    {
      option: 'OEM',
      startingPoint: 'The buyer already has a reference style, artwork, product or technical direction.',
      confirm: 'Construction, materials, customization, sizes, quantity, packaging and target date.',
      nextStep: 'Open-point review followed by a mockup, sample or quotation decision.',
    },
    {
      option: 'ODM',
      startingPoint: 'The buyer has a target market, sport category, collection goal or design direction but still has open product decisions.',
      confirm: 'Product scope, range structure, reference direction, authorized brand inputs, quantity and target date.',
      nextStep: 'Concept and range review followed by an agreed development step.',
    },
  ],
  checklist: [
    'Buyer or company type',
    'Target market',
    'Sport category',
    'Product range',
    'Reference style or technical input',
    'Authorized logos and brand assets',
    'Estimated quantity',
    'Size requirements',
    'Label and packaging requirements',
    'Destination',
    'Required in-hand date',
  ],
  links: [
    {label: 'OEM/ODM Sportswear Manufacturing Guide', href: '/guides/oem-odm-sportswear-manufacturing-guide-for-brands/'},
    {label: 'Review Private Label Teamwear', href: '/private-label-teamwear/'},
    {label: 'Plan a Sample Order', href: '/sample-order/'},
    {label: 'Discuss an OEM/ODM Project', href: '/get-quote/'},
  ],
} satisfies BuyerDecisionContent
