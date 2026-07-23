import {defineType} from 'sanity'

export const portableText = defineType({
  name: 'portableText',
  title: 'Rich text',
  type: 'array',
  of: [
    {type: 'block'},
    {
      type: 'object',
      name: 'callout',
      title: 'Callout',
      fields: [
        {name: 'title', type: 'string', title: 'Title'},
        {name: 'body', type: 'text', title: 'Body'},
        {name: 'tone', type: 'string', title: 'Tone', options: {list: [{title: 'Info', value: 'info'}, {title: 'Warning', value: 'warning'}, {title: 'Success', value: 'success'}]}},
      ],
    },
    {
      type: 'object',
      name: 'tableBlock',
      title: 'Table',
      fields: [
        {name: 'caption', type: 'string', title: 'Caption'},
        {name: 'rows', type: 'array', title: 'Rows', of: [{type: 'object', fields: [{name: 'cells', type: 'array', of: [{type: 'string'}]}]}]},
      ],
    },
    {type: 'imageWithAlt'},
  ],
})
