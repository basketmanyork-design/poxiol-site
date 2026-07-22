import {defineField, defineType} from 'sanity'
import {DocumentsIcon} from '@sanity/icons'
import {createRiskValidation} from '../validation'

export const sitePage = defineType({
  name: 'sitePage',
  title: 'Site Pages',
  type: 'document',
  icon: DocumentsIcon,
  groups: [
    {name: 'basic', title: 'Basic'},
    {name: 'hero', title: 'Hero'},
    {name: 'content', title: 'Content'},
    {name: 'seo', title: 'SEO'},
  ],
  fields: [
    defineField({name: 'internalName', title: 'Internal page name', type: 'string', group: 'basic', validation: (Rule) => Rule.required()}),
    defineField({name: 'pageKey', title: 'Page key', type: 'string', group: 'basic', description: 'Stable key used by the frontend, for example homepage, about, factory, contact.', validation: (Rule) => Rule.required()}),
    defineField({
      name: 'pageType',
      title: 'Page template type',
      type: 'string',
      group: 'basic',
      options: {
        list: [
          {title: 'Homepage', value: 'homepage'},
          {title: 'About', value: 'about'},
          {title: 'Factory', value: 'factory'},
          {title: 'Manufacturing', value: 'manufacturing'},
          {title: 'Quality Control', value: 'qualityControl'},
          {title: 'Customization', value: 'customization'},
          {title: 'OEM / ODM', value: 'oemOdm'},
          {title: 'Free Mockup', value: 'freeMockup'},
          {title: 'Sample Order', value: 'sampleOrder'},
          {title: 'Get Quote', value: 'getQuote'},
          {title: 'Contact', value: 'contact'},
          {title: 'Products Landing', value: 'productsLanding'},
          {title: 'Projects Landing', value: 'projectsLanding'},
          {title: 'Guides Landing', value: 'guidesLanding'},
          {title: 'Resources Landing', value: 'resourcesLanding'},
          {title: 'Blog Landing', value: 'blogLanding'},
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({name: 'slug', title: 'URL slug', type: 'slug', group: 'basic', options: {source: 'internalName'}}),
    defineField({name: 'heroEyebrow', title: 'Hero eyebrow', type: 'string', group: 'hero'}),
    defineField({name: 'heroHeading', title: 'Hero H1', type: 'string', group: 'hero'}),
    defineField({name: 'heroSubheading', title: 'Hero description', type: 'text', rows: 3, group: 'hero'}),
    defineField({name: 'heroImage', title: 'Hero image', type: 'imageWithAlt', group: 'hero'}),
    defineField({name: 'heroCTA', title: 'Hero CTA', type: 'callToAction', group: 'hero'}),
    defineField({name: 'contentSections', title: 'Main content modules', type: 'array', group: 'content', of: [{type: 'pageSection'}]}),
    defineField({name: 'bottomCTA', title: 'Bottom CTA', type: 'callToAction', group: 'content'}),
    defineField({name: 'seo', title: 'SEO', type: 'seoFields', group: 'seo'}),
    defineField({name: 'publishStatus', title: 'Publish status', type: 'publishStatus', group: 'seo'}),
  ],
  preview: {select: {title: 'internalName', subtitle: 'pageKey'}},
  validation: createRiskValidation(['internalName', 'heroHeading', 'heroSubheading']),
})
