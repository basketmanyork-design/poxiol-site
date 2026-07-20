import {StructureResolver} from 'sanity/structure'
import {
  CogIcon, EarthGlobeIcon, DocumentsIcon, TagIcon, PackageIcon,
  CaseIcon, QuestionIcon, DocumentIcon, UserIcon,
} from '@sanity/icons'

export const deskStructure: StructureResolver = (S) =>
  S.list()
    .title('POXIOL CMS')
    .items([
      S.listItem()
        .title('Dashboard')
        .icon(DocumentsIcon)
        .child(S.documentList().title('最近更新的内容').filter('_type match "product" || _type match "article" || _type match "caseStudy"')),

      S.divider(),

      S.listItem()
        .title('网站全局设置')
        .icon(EarthGlobeIcon)
        .child(S.document().schemaType('siteSettings').documentId('siteSettings')),

      S.listItem()
        .title('采购参数标准')
        .icon(CogIcon)
        .child(S.document().schemaType('procurementStandards').documentId('procurementStandards')),

      S.listItem()
        .title('导航与Footer')
        .icon(DocumentsIcon)
        .child(S.list().title('建设中')),

      S.divider(),

      S.listItem()
        .title('产品分类')
        .icon(TagIcon)
        .child(S.documentTypeList('productCategory').title('产品分类')),

      S.listItem()
        .title('产品管理')
        .icon(PackageIcon)
        .child(S.documentTypeList('product').title('产品')),

      S.listItem()
        .title('客户案例')
        .icon(CaseIcon)
        .child(S.documentTypeList('caseStudy').title('客户案例')),

      S.listItem()
        .title('FAQ 知识库')
        .icon(QuestionIcon)
        .child(S.documentTypeList('faqItem').title('FAQ')),

      S.listItem()
        .title('文章与指南')
        .icon(DocumentIcon)
        .child(S.documentTypeList('article').title('文章与指南')),

      S.divider(),

      S.listItem()
        .title('作者管理')
        .icon(UserIcon)
        .child(S.documentTypeList('author').title('作者')),

      S.listItem()
        .title('301 重定向')
        .icon(DocumentsIcon)
        .child(S.list().title('建设中')),
    ])
