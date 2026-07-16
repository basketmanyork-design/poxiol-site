import {defineType, defineField, defineArrayMember} from 'sanity'

export const portableText = defineType({
  name: 'portableText',
  title: '富文本内容',
  type: 'array',
  of: [
    defineArrayMember({
      type: 'block',
      styles: [
        {title: '正文', value: 'normal'},
        {title: 'H2', value: 'h2'},
        {title: 'H3', value: 'h3'},
      ],
      lists: [
        {title: '无序列表', value: 'bullet'},
        {title: '有序列表', value: 'number'},
      ],
      marks: {
        decorators: [
          {title: '加粗', value: 'strong'},
          {title: '斜体', value: 'em'},
        ],
        annotations: [
          {
            name: 'link',
            type: 'object',
            title: '链接',
            fields: [
              {name: 'href', type: 'url', title: 'URL'},
            ],
          },
        ],
      },
    }),
    defineArrayMember({
      type: 'image',
      name: 'inlineImage',
      title: '图片',
      options: {hotspot: true},
      fields: [
        {name: 'alt', type: 'string', title: 'Alt 描述 (必填)', validation: (R) => R.required()},
      ],
    }),
    defineArrayMember({
      type: 'object',
      name: 'callout',
      title: '提示框',
      fields: [
        {name: 'type', type: 'string', title: '类型', options: {list: [{title: '提示 (Info)', value: 'info'}, {title: '警告 (Warning)', value: 'warning'}, {title: '成功 (Success)', value: 'success'}]}},
        {name: 'content', type: 'text', title: '内容', rows: 3},
      ],
    }),
    defineArrayMember({
      type: 'object',
      name: 'checklistBlock',
      title: 'Checklist',
      fields: [
        {name: 'title', type: 'string', title: 'Checklist 标题'},
        {name: 'items', type: 'array', title: '检查项', of: [{type: 'string'}]},
      ],
    }),
    defineArrayMember({
      type: 'object',
      name: 'comparisonTable',
      title: '对比表格',
      fields: [
        {name: 'headers', type: 'array', title: '表头', of: [{type: 'string'}]},
        {name: 'rows', type: 'array', title: '行数据', of: [{type: 'object', fields: [{name: 'cells', type: 'array', of: [{type: 'string'}]}]}]},
      ],
    }),
    defineArrayMember({
      type: 'object',
      name: 'ctaBlock',
      title: 'CTA 按钮',
      fields: [
        {name: 'label', type: 'string', title: '按钮文案'},
        {name: 'url', type: 'url', title: '链接'},
      ],
    }),
    defineArrayMember({
      type: 'object',
      name: 'faqAccordion',
      title: 'FAQ 折叠',
      fields: [
        {name: 'question', type: 'string', title: '问题'},
        {name: 'answer', type: 'text', title: '答案', rows: 4},
      ],
    }),
  ],
})
