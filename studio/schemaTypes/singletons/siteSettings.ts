import {defineField, defineType} from 'sanity'
import {EarthGlobeIcon} from '@sanity/icons'

export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  icon: EarthGlobeIcon,
  fields: [
    defineField({name: 'brandName', title: 'Brand name', type: 'string', initialValue: 'POXIOL'}),
    defineField({name: 'siteUrl', title: 'Production site URL', type: 'url', initialValue: 'https://www.poxiol.com/'}),
    defineField({name: 'logo', title: 'Logo', type: 'imageWithAlt'}),
    defineField({
      name: 'contactInfo',
      title: 'Contact information',
      type: 'object',
      fields: [
        defineField({name: 'publicEmail', title: 'Public email', type: 'string'}),
        defineField({name: 'salesEmail', title: 'Sales email', type: 'string'}),
        defineField({name: 'whatsappNumber', title: 'WhatsApp number', type: 'string'}),
        defineField({name: 'whatsappMessage', title: 'WhatsApp default message', type: 'text'}),
        defineField({name: 'alibabaStoreUrl', title: 'Alibaba store URL', type: 'url'}),
        defineField({name: 'companyAddress', title: 'Company address', type: 'text'}),
      ],
    }),
    defineField({
      name: 'footer',
      title: 'Footer defaults',
      type: 'object',
      fields: [
        defineField({name: 'copyright', title: 'Copyright', type: 'string'}),
        defineField({name: 'address', title: 'Address fallback', type: 'text'}),
      ],
    }),
    defineField({name: 'globalSeo', title: 'Global SEO defaults', type: 'seoFields'}),
  ],
})
