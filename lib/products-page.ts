import type {V8FaqItem} from '@/lib/v8/types.ts'

const PRODUCT_CATEGORY_ROUTE_OVERRIDES: Readonly<Record<string, string>> = {
  'soccer-kits': '/products/soccer-jerseys/',
}

export function productCategoryHref(slug: string) {
  return PRODUCT_CATEGORY_ROUTE_OVERRIDES[slug] || `/products/${slug}/`
}

export const productsFaqs: readonly V8FaqItem[] = [
  {
    id: 'products-categories',
    question: 'What teamwear products does POXIOL manufacture?',
    answer: 'POXIOL reviews custom teamwear projects for soccer, basketball, track and field, badminton, volleyball, baseball and softball, ice hockey, American football, rugby, tennis, cricket and golf. Product construction is confirmed for each project.',
    pageIds: [],
  },
  {
    id: 'products-customization',
    question: 'Can I customize every part of the sports uniform?',
    answer: 'Yes. POXIOL supports team logos, player names, numbers, colors, patterns, private labels and custom packaging.',
    pageIds: [],
  },
  {
    id: 'products-samples',
    question: 'Do you provide samples for all product categories?',
    answer: 'Sample availability is confirmed after the product, design and project requirements are reviewed.',
    pageIds: [],
  },
]
