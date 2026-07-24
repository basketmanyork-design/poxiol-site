import {defineField, defineType} from 'sanity'
import {DocumentTextIcon} from '@sanity/icons'

export const pageSection = defineType({
  name: 'pageSection',
  title: 'Page Section',
  type: 'object',
  icon: DocumentTextIcon,
  fields: [
    defineField({
      name: 'sectionType',
      title: 'Section type',
      type: 'string',
      initialValue: 'richText',
      options: {
        list: [
          {title: 'Rich text', value: 'richText'},
          {title: 'Image + text', value: 'imageText'},
          {title: 'Stats', value: 'stats'},
          {title: 'Evidence grid', value: 'evidenceGrid'},
          {title: 'Process steps', value: 'processSteps'},
          {title: 'Specifications table', value: 'specificationsTable'},
          {title: 'Gallery', value: 'gallery'},
          {title: 'FAQ', value: 'faq'},
          {title: 'CTA', value: 'cta'},
        ],
      },
    }),
    defineField({name: 'eyebrow', title: 'Eyebrow', type: 'string'}),
    defineField({name: 'title', title: 'Section title', type: 'string', validation: (Rule) => Rule.required()}),
    defineField({name: 'body', title: 'Body copy', type: 'array', of: [{type: 'block'}]}),
    defineField({name: 'image', title: 'Image module', type: 'imageWithAlt'}),
    defineField({name: 'facts', title: 'Evidence / parameter bullets', type: 'array', of: [{type: 'string'}]}),
    defineField({
      name: 'stats',
      title: 'Stats',
      type: 'array',
      of: [{type: 'object', fields: [defineField({name: 'value', title: 'Value', type: 'string'}), defineField({name: 'label', title: 'Label', type: 'string'})]}],
    }),
    defineField({
      name: 'steps',
      title: 'Process steps',
      type: 'array',
      of: [{type: 'object', fields: [defineField({name: 'title', title: 'Step title', type: 'string'}), defineField({name: 'description', title: 'Description', type: 'text', rows: 3})]}],
    }),
    defineField({
      name: 'specifications',
      title: 'Specifications',
      type: 'array',
      of: [{type: 'object', fields: [defineField({name: 'label', title: 'Label', type: 'string'}), defineField({name: 'value', title: 'Value', type: 'text', rows: 2})]}],
    }),
    defineField({name: 'gallery', title: 'Gallery', type: 'array', of: [{type: 'imageWithAlt'}]}),
    defineField({
      name: 'faqs',
      title: 'FAQ items',
      type: 'array',
      of: [{type: 'object', fields: [defineField({name: 'question', title: 'Question', type: 'string'}), defineField({name: 'answer', title: 'Answer', type: 'text', rows: 3})]}],
    }),
    defineField({name: 'cta', title: 'Section CTA', type: 'callToAction'}),
  ],
  preview: {
    select: {title: 'title', subtitle: 'sectionType'},
  },
})
