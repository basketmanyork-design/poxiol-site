import {defineField, defineType} from 'sanity'
import {HelpCircleIcon} from '@sanity/icons'

export const faqCategory = defineType({
  name: 'faqCategory',
  title: 'FAQ Categories',
  type: 'document',
  icon: HelpCircleIcon,
  fields: [
    defineField({name: 'title', title: 'Title', type: 'string', validation: (Rule) => Rule.required()}),
    defineField({name: 'slug', title: 'Slug', type: 'slug', options: {source: 'title'}}),
    defineField({name: 'description', title: 'Description', type: 'text', rows: 2}),
    defineField({name: 'displayOrder', title: 'Display order', type: 'number', initialValue: 0}),
    defineField({name: 'active', title: 'Active', type: 'boolean', initialValue: true}),
  ],
  preview: {select: {title: 'title'}},
})
