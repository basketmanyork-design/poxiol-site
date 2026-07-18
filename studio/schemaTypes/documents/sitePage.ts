import {defineField, defineType} from 'sanity'
import {DocumentsIcon} from '@sanity/icons'
import {createRiskValidation} from '../validation'

export const sitePage = defineType({
  name: 'sitePage',
  title: '核心页面管理',
  type: 'document',
  icon: DocumentsIcon,
  groups: [
    {name: 'basic', title: '基础信息'},
    {name: 'hero', title: 'Hero 区域'},
    {name: 'content', title: '页面内容'},
    {name: 'seo', title: 'SEO'},
  ],
  fields: [
    defineField({name: 'internalName', title: '内部页面名称', type: 'string', group: 'basic', validation: (R) => R.required()}),
    defineField({
      name: 'pageKey', 
      title: '页面唯一 Key', 
      type: 'string', 
      group: 'basic', 
      description: '由开发者设置。例如 homepage, about, factory。请勿随意修改。',
      validation: (R) => R.required()
    }),
    defineField({
      name: 'pageType', 
      title: '页面模板类型', 
      type: 'string', 
      group: 'basic',
      options: {
        list: [
          {title: '首页 (Homepage)', value: 'homepage'},
          {title: '关于 (About)', value: 'about'},
          {title: '工厂 (Factory)', value: 'factory'},
          {title: '制造中心 (Manufacturing)', value: 'manufacturing'},
          {title: '质量控制 (Quality Control)', value: 'qualityControl'},
          {title: '定制页面 (Customization)', value: 'customization'},
          {title: '免费打样 (Free Mockup)', value: 'freeMockup'},
          {title: '样品订单 (Sample Order)', value: 'sampleOrder'},
          {title: '报价单 (Get Quote)', value: 'getQuote'},
          {title: '联系 (Contact)', value: 'contact'},
          {title: '产品落地 (Products Landing)', value: 'productsLanding'},
          {title: '案例落地 (Projects Landing)', value: 'projectsLanding'},
          {title: '指南落地 (Guides Landing)', value: 'guidesLanding'},
          {title: '资源落地 (Resources Landing)', value: 'resourcesLanding'},
        ]
      },
      validation: (R) => R.required()
    }),
    defineField({name: 'slug', title: 'URL Slug', type: 'slug', group: 'basic', options: {source: 'internalName'}}),
    
    // ---- Hero 区域 ----
    defineField({name: 'heroEyebrow', title: 'Hero 眉标题', type: 'string', group: 'hero'}),
    defineField({name: 'heroHeading', title: 'Hero 主标题', type: 'string', group: 'hero'}),
    defineField({name: 'heroSubheading', title: 'Hero 副标题', type: 'text', rows: 2, group: 'hero'}),
    defineField({name: 'heroImage', title: 'Hero 图片', type: 'imageWithAlt', group: 'hero'}),
    defineField({name: 'heroCTA', title: 'Hero CTA', type: 'callToAction', group: 'hero'}),

    // ---- 动态模块 ----
    defineField({
      name: 'contentSections', 
      title: '内容板块', 
      type: 'array', 
      group: 'content',
      of: [{type: 'pageSection'}] 
    }),

    // ---- SEO ----
    defineField({name: 'seo', title: 'SEO 配置', type: 'seoFields', group: 'seo'}),
    defineField({name: 'publishStatus', title: '发布状态', type: 'publishStatus', group: 'seo'}),
  ],
  preview: {
    select: {title: 'internalName', subtitle: 'pageKey'}
  },
  validation: createRiskValidation(['internalName', 'heroHeading', 'heroSubheading']),
})
