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
        defineField({name: 'supportEmail', title: 'Support email', type: 'string'}),
        defineField({name: 'phone', title: 'Phone', type: 'string'}),
        defineField({name: 'businessHours', title: 'Business hours', type: 'string'}),
        defineField({name: 'timezone', title: 'Timezone', type: 'string', initialValue: 'Asia/Shanghai'}),
        defineField({name: 'addressVisibility', title: 'Address visibility', type: 'string', options: {list: [
          {title: 'Public', value: 'public'},
          {title: 'City / region only', value: 'region'},
          {title: 'Not publicly disclosed', value: 'notPublic'},
        ]}, initialValue: 'region'}),
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
    defineField({
      name: 'socialLinks',
      title: 'Social links',
      type: 'object',
      fields: [
        defineField({name: 'facebook', title: 'Facebook', type: 'url'}),
        defineField({name: 'instagram', title: 'Instagram', type: 'url'}),
        defineField({name: 'linkedin', title: 'LinkedIn', type: 'url'}),
        defineField({name: 'youtube', title: 'YouTube', type: 'url'}),
        defineField({name: 'reddit', title: 'Reddit', type: 'url'}),
        defineField({name: 'tiktok', title: 'TikTok', type: 'url'}),
        defineField({name: 'x', title: 'X / Twitter', type: 'url'}),
      ],
    }),
    defineField({name: 'favicon', title: 'Favicon', type: 'imageWithAlt'}),
    defineField({name: 'defaultOgImage', title: 'Default OG image', type: 'imageWithAlt'}),
    defineField({name: 'globalSeo', title: 'Global SEO defaults', type: 'seoFields'}),
  ],
})
