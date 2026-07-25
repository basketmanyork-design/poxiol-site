import {seoFields, imageWithAlt} from './objects/common'
import {publishStatus, callToAction, faqReference, relatedContent, procurementOverride} from './objects/reusable'
import {portableText} from './objects/portableText'
import {pageSection} from './objects/pageSection'
import {siteSettings} from './singletons/siteSettings'
import {navigationSettings, footerSettings} from './singletons/navigation'
import {procurementStandards} from './singletons/procurementStandards'
import {sitePage} from './documents/sitePage'
import {productCategory} from './documents/productCategory'
import {product} from './documents/product'
import {caseStudy} from './documents/caseStudy'
import {faqCategory} from './documents/faqCategory'
import {faqItem} from './documents/faqItem'
import {article} from './documents/article'
import {author} from './documents/author'
import {redirectRule} from './documents/redirectRule'

export const schemaTypes = [
  seoFields,
  imageWithAlt,
  portableText,
  publishStatus,
  callToAction,
  faqReference,
  relatedContent,
  procurementOverride,
  pageSection,
  siteSettings,
  navigationSettings,
  footerSettings,
  procurementStandards,
  sitePage,
  productCategory,
  product,
  caseStudy,
  faqCategory,
  faqItem,
  article,
  author,
  redirectRule,
]
