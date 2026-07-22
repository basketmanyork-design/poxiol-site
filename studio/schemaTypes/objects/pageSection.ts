import {defineField, defineType} from 'sanity'
import {DocumentTextIcon} from '@sanity/icons'

export const pageSection = defineType({
  name: 'pageSection',
  title: 'Page Section',
  type: 'object',
  icon: DocumentTextIcon,
  fields: [
    defineField({name: 'eyebrow', title: 'Eyebrow', type: 'string'}),
    defineField({name: 'title', title: 'Section title', type: 'string', validation: (Rule) => Rule.required()}),
    defineField({name: 'body', title: 'Body copy', type: 'array', of: [{type: 'block'}]}),
    defineField({name: 'image', title: 'Image module', type: 'imageWithAlt'}),
    defineField({name: 'facts', title: 'Evidence / parameter bullets', type: 'array', of: [{type: 'string'}]}),
    defineField({name: 'cta', title: 'Section CTA', type: 'callToAction'}),
  ],
  preview: {
    select: {title: 'title', subtitle: 'eyebrow'},
  },
})
