import {defineField, defineType} from 'sanity'
import {HelpCircleIcon} from '@sanity/icons'
import {createRiskValidation} from '../validation'

export const faqItem = defineType({
  name: 'faqItem',
  title: 'FAQ Knowledge Base',
  type: 'document',
  icon: HelpCircleIcon,
  groups: [{name: 'content', title: 'Content'}, {name: 'meta', title: 'Management and review'}],
  fields: [
    defineField({name: 'question', title: 'Question', type: 'string', group: 'content', validation: (Rule) => Rule.required()}),
    defineField({name: 'answer', title: 'Answer', type: 'portableText', group: 'content', validation: (Rule) => Rule.required()}),
    defineField({name: 'category', title: 'Category', type: 'string', group: 'meta'}),
    defineField({name: 'categoryRef', title: 'Category reference', type: 'reference', to: [{type: 'faqCategory'}], group: 'meta'}),
    defineField({name: 'keywords', title: 'Keywords', type: 'array', of: [{type: 'string'}], group: 'meta'}),
    defineField({name: 'displayOrder', title: 'Display order', type: 'number', initialValue: 0, group: 'meta'}),
    defineField({name: 'publishStatus', title: 'Publish status', type: 'publishStatus', group: 'meta'}),
    defineField({name: 'lastReviewedAt', title: 'Last reviewed at', type: 'datetime', group: 'meta'}),
  ],
  orderings: [{name: 'order', title: 'Display order', by: [{field: 'displayOrder', direction: 'asc'}]}, {name: 'category', title: 'Category', by: [{field: 'category', direction: 'asc'}]}],
  preview: {select: {title: 'question', subtitle: 'category'}},
  validation: createRiskValidation(['question', 'answer']),
})
