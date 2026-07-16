// ---- Objects (可复用) ----
import {seoFields, imageWithAlt} from './objects/common'
import {publishStatus, callToAction, faqReference, relatedContent, procurementOverride} from './objects/reusable'
import {portableText} from './objects/portableText'

// ---- Singletons (单例) ----
import {siteSettings} from './singletons/siteSettings'
import {procurementStandards} from './singletons/procurementStandards'

// ---- Documents (内容类型) ----
import {productCategory} from './documents/productCategory'
import {product} from './documents/product'
import {caseStudy} from './documents/caseStudy'
import {faqItem} from './documents/faqItem'
import {article} from './documents/article'
import {author} from './documents/author'

export const schemaTypes = [
  // Objects
  seoFields,
  imageWithAlt,
  portableText,
  publishStatus,
  callToAction,
  faqReference,
  relatedContent,
  procurementOverride,

  // Singletons
  siteSettings,
  procurementStandards,

  // Documents
  productCategory,
  product,
  caseStudy,
  faqItem,
  article,
  author,
]
