import {defineField, defineType} from 'sanity'
import {WarningOutlineIcon} from '@sanity/icons'

export const claimPolicy = defineType({
  name: 'claimPolicy',
  title: 'Truth claim policy',
  type: 'object',
  icon: WarningOutlineIcon,
  fields: [
    defineField({name: 'claimId', title: 'Claim ID', type: 'string', validation: (Rule) => Rule.required()}),
    defineField({name: 'sourceField', title: 'Source field path', type: 'string', description: 'Exact CMS field governed by this record.', validation: (Rule) => Rule.required()}),
    defineField({name: 'claim', title: 'Claim', type: 'text', rows: 2}),
    defineField({name: 'status', title: 'Truth status', type: 'string', options: {list: [
      {title: 'Verified', value: 'VERIFIED'},
      {title: 'Conditional', value: 'CONDITIONAL'},
      {title: 'Operational target', value: 'OPERATIONAL_TARGET'},
      {title: 'Unverified', value: 'UNVERIFIED'},
      {title: 'Placeholder', value: 'PLACEHOLDER'},
      {title: 'Owner confirmation required', value: 'OWNER_CONFIRMATION_REQUIRED'},
    ]}, validation: (Rule) => Rule.required()}),
    defineField({name: 'publicValue', title: 'Approved public value', type: 'text', rows: 2, description: 'Used directly only for VERIFIED or CONDITIONAL claims.'}),
    defineField({name: 'replacement', title: 'Safe public replacement', type: 'text', rows: 2, description: 'Used for non-public operational, unverified, placeholder or owner-review values.'}),
    defineField({name: 'legacyValue', title: 'Historical value', type: 'text', rows: 2, readOnly: true, description: 'Preserved by migration. Never use this as public copy.'}),
    defineField({name: 'evidence', title: 'Evidence summary', type: 'text', rows: 2}),
    defineField({name: 'publicRule', title: 'Public rule', type: 'text', rows: 2, validation: (Rule) => Rule.required()}),
    defineField({name: 'reviewedAt', title: 'Reviewed at', type: 'datetime'}),
    defineField({name: 'reviewedBy', title: 'Reviewed by', type: 'string'}),
    defineField({name: 'internalNotes', title: 'Internal notes', type: 'text', rows: 3}),
  ],
  preview: {select: {title: 'claimId', subtitle: 'status'}},
})
