import {defineField, defineType} from 'sanity'
import {CogIcon} from '@sanity/icons'

const ga4Id = /^G-[A-Z0-9]+$/
const gtmId = /^GTM-[A-Z0-9]+$/

export const analyticsSettings = defineType({
  name: 'analyticsSettings',
  title: 'Analytics Settings',
  type: 'document',
  icon: CogIcon,
  description: 'Public analytics identifiers and feature flags only. Never store API credentials or private keys here.',
  fields: [
    defineField({name: 'analyticsEnabled', title: 'Analytics enabled', type: 'boolean', initialValue: false}),
    defineField({name: 'ga4Enabled', title: 'Google Analytics 4 enabled', type: 'boolean', initialValue: false}),
    defineField({
      name: 'ga4MeasurementId',
      title: 'GA4 Measurement ID',
      type: 'string',
      description: 'Public identifier in the form G-XXXXXXXXXX.',
      validation: (rule) => rule.custom((value) => !value || ga4Id.test(value) ? true : 'Use a valid GA4 Measurement ID beginning with G-.'),
    }),
    defineField({name: 'googleTagManagerEnabled', title: 'Google Tag Manager enabled', type: 'boolean', initialValue: false}),
    defineField({
      name: 'googleTagManagerContainerId',
      title: 'Google Tag Manager Container ID',
      type: 'string',
      description: 'Public identifier in the form GTM-XXXXXXX.',
      validation: (rule) => rule.custom((value) => !value || gtmId.test(value) ? true : 'Use a valid Google Tag Manager Container ID beginning with GTM-.'),
    }),
    defineField({name: 'consentModeEnabled', title: 'Consent mode enabled', type: 'boolean', initialValue: false}),
    defineField({name: 'debugMode', title: 'Analytics debug mode', type: 'boolean', initialValue: false}),
    defineField({name: 'searchConsoleProperty', title: 'Search Console property', type: 'string', description: 'Public property identifier only, such as sc-domain:poxiol.com.'}),
    defineField({name: 'cloudflareAnalyticsEnabled', title: 'Cloudflare Web Analytics enabled', type: 'boolean', initialValue: false}),
    defineField({name: 'defaultUtmSource', title: 'Default UTM source', type: 'string', validation: (rule) => rule.lowercase()}),
    defineField({name: 'defaultUtmMedium', title: 'Default UTM medium', type: 'string', validation: (rule) => rule.lowercase()}),
    defineField({name: 'defaultUtmCampaign', title: 'Default UTM campaign', type: 'string', validation: (rule) => rule.lowercase()}),
    defineField({name: 'lastVerifiedAt', title: 'Last verified at', type: 'datetime', readOnly: true}),
  ],
  preview: {prepare: () => ({title: 'Analytics Settings', subtitle: 'Public identifiers and feature flags'})},
})