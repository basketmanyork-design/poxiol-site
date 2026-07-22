import {StructureResolver} from 'sanity/structure'
import {
  CogIcon,
  EarthGlobeIcon,
  DocumentsIcon,
  TagIcon,
  PackageIcon,
  CaseIcon,
  HelpCircleIcon,
  DocumentIcon,
  UserIcon,
  MenuIcon,
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
            .title('Recently updated content')
            .filter('_type in ["product", "article", "caseStudy", "sitePage"]')
            .defaultOrdering([{field: '_updatedAt', direction: 'desc'}]),
        ),
      S.divider(),
      S.listItem()
        .id('siteSettings')
        .title('Site Settings')
        .icon(EarthGlobeIcon)
        .child(S.document().id('siteSettingsEditor').schemaType('siteSettings').documentId('siteSettings')),
      S.listItem()
        .id('navigation')
        .title('Navigation')
        .icon(MenuIcon)
        .child(S.document().id('navigationSettingsEditor').schemaType('navigationSettings').documentId('navigationSettings')),
      S.listItem()
        .id('footer')
        .title('Footer')
        .icon(MenuIcon)
        .child(S.document().id('footerSettingsEditor').schemaType('footerSettings').documentId('footerSettings')),
      S.listItem()
        .id('procurementStandards')
        .title('Procurement Standards')
        .icon(CogIcon)
        .child(S.document().id('procurementStandardsEditor').schemaType('procurementStandards').documentId('procurementStandards')),
      S.listItem()
        .id('sitePages')
        .title('Site Pages')
        .icon(DocumentsIcon)
        .child(S.documentTypeList('sitePage').id('sitePageList').title('Site Pages')),
      S.divider(),
      S.listItem()
        .id('productCategories')
        .title('Product Categories')
        .icon(TagIcon)
        .child(S.documentTypeList('productCategory').id('productCategoryList').title('Product Categories')),
      S.listItem()
        .id('products')
        .title('Products')
        .icon(PackageIcon)
        .child(S.documentTypeList('product').id('productList').title('Products')),
      S.listItem()
        .id('caseStudies')
        .title('Case Studies')
        .icon(CaseIcon)
        .child(S.documentTypeList('caseStudy').id('caseStudyList').title('Case Studies')),
      S.listItem()
        .id('faqCategories')
        .title('FAQ Categories')
        .icon(HelpCircleIcon)
        .child(S.documentTypeList('faqCategory').id('faqCategoryList').title('FAQ Categories')),
      S.listItem()
        .id('faqKnowledgeBase')
        .title('FAQ Knowledge Base')
        .icon(HelpCircleIcon)
        .child(S.documentTypeList('faqItem').id('faqItemList').title('FAQ')),
      S.listItem()
        .id('articles')
        .title('Articles and Guides')
        .icon(DocumentIcon)
        .child(S.documentTypeList('article').id('articleList').title('Articles and Guides')),
      S.listItem()
        .id('authors')
        .title('Authors')
        .icon(UserIcon)
        .child(S.documentTypeList('author').id('authorList').title('Authors')),
      S.listItem()
        .id('redirectRules')
        .title('301 Redirect Rules')
        .icon(DocumentsIcon)
        .child(S.documentTypeList('redirectRule').id('redirectRuleList').title('301 Redirect Rules')),
    ])
