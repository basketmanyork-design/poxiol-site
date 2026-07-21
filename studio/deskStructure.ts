import {StructureResolver} from 'sanity/structure'
import {
  CogIcon, EarthGlobeIcon, DocumentsIcon, TagIcon, PackageIcon,
  CaseIcon, HelpCircleIcon, DocumentIcon, UserIcon,
} from '@sanity/icons'

export const deskStructure: StructureResolver = (S) =>
  S.list()
    .id('poxiolCms')
    .title('POXIOL CMS')
    .items([
      S.listItem()
        .id('dashboard')
        .title('Dashboard')
        .icon(DocumentsIcon)
        .child(
          S.documentList()
            .id('dashboardRecentContent')
            .title('最近更新的内容')
            .filter('_type in ["product", "article", "caseStudy"]')
            .defaultOrdering([
              {field: '_updatedAt', direction: 'desc'},
            ])
        ),

      S.divider(),

      S.listItem()
        .id('siteSettings')
        .title('网站全局设置')
        .icon(EarthGlobeIcon)
        .child(
          S.document()
            .id('siteSettingsEditor')
            .schemaType('siteSettings')
            .documentId('siteSettings')
        ),

      S.listItem()
        .id('procurementStandards')
        .title('采购参数标准')
        .icon(CogIcon)
        .child(
          S.document()
            .id('procurementStandardsEditor')
            .schemaType('procurementStandards')
            .documentId('procurementStandards')
        ),

      S.listItem()
        .id('navigationFooter')
        .title('导航与Footer')
        .icon(DocumentsIcon)
        .child(
          S.list()
            .id('navigationFooterPlaceholder')
            .title('建设中')
        ),

      S.divider(),

      S.listItem()
        .id('productCategories')
        .title('产品分类')
        .icon(TagIcon)
        .child(
          S.documentTypeList('productCategory')
            .id('productCategoryList')
            .title('产品分类')
        ),

      S.listItem()
        .id('products')
        .title('产品管理')
        .icon(PackageIcon)
        .child(
          S.documentTypeList('product')
            .id('productList')
            .title('产品')
        ),

      S.listItem()
        .id('caseStudies')
        .title('客户案例')
        .icon(CaseIcon)
        .child(
          S.documentTypeList('caseStudy')
            .id('caseStudyList')
            .title('客户案例')
        ),

      S.listItem()
        .id('faqKnowledgeBase')
        .title('FAQ 知识库')
        .icon(HelpCircleIcon)
        .child(
          S.documentTypeList('faqItem')
            .id('faqItemList')
            .title('FAQ')
        ),

      S.listItem()
        .id('articles')
        .title('文章与指南')
        .icon(DocumentIcon)
        .child(
          S.documentTypeList('article')
            .id('articleList')
            .title('文章与指南')
        ),

      S.divider(),

      S.listItem()
        .id('authors')
        .title('作者管理')
        .icon(UserIcon)
        .child(
          S.documentTypeList('author')
            .id('authorList')
            .title('作者')
        ),

      S.listItem()
        .id('redirectRules')
        .title('301 重定向')
        .icon(DocumentsIcon)
        .child(
          S.list()
            .id('redirectRulesPlaceholder')
            .title('建设中')
        ),
    ])
