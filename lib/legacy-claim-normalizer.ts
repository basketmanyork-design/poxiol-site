import {getApprovedClaimWording} from './governance/claims.ts'

// Shared by CMS mapping and release-guard regression tests.
export function normalizeBuyerFacingClaim(value: string): string {
  return value
    .replace(
      /\bthe\s+draft\s+procurement\s+standard\s+lists\s+(?:a\s+)?minimum\s+sample\s+order\s+of\s+one\s+set\b\.?/gi,
      getApprovedClaimWording('order-quantity-confirmation'),
    )
    .replace(/\bSample\s+MOQ\s*(?::|is)?\s*1\s*set\b/gi, 'Sample quantity is confirmed for the project')
    .replace(/\b1\s*[-\u2010-\u2015]?\s*(?:set|piece)\s+(?:custom\s+\w+\s+)?sample\b/gi, 'project-specific sample plan')
    .replace(/\bMOQ\s*(?::|is)?\s*(?:from\s+)?1(?:\s*(?:set|piece))?\b/gi, 'project-specific order quantity')
    .replace(/\b1\s*[-\u2010-\u2015]?\s*set\s+MOQ\b/gi, 'project-specific order quantity')
    .replace(/\bminimum\s+order(?:\s+quantity)?\s*(?:is|:)?\s*1\s*set\b/gi, 'order quantity confirmed for the project')
    .replace(/\bSample\s+(?:Production|Timing|Time)?\s*(?::|in|is|usually\s+takes|can\s+usually\s+be\s+arranged\s+in|\()?\s*(?:2\s*[-\u2010-\u2015]\s*3|3\s*[-\u2010-\u2015]\s*5|5\s*[-\u2010-\u2015]\s*7|7\s*[-\u2010-\u2015]\s*10)\s*(?:working\s*)?days(?:\s*after\s*(?:mockup|design)\s*(?:approval|confirmation))?\)?/gi, 'Sample timing is confirmed after project review')
    .replace(/\bsampling\s*\(\s*(?:2\s*[-\u2010-\u2015]\s*3|3\s*[-\u2010-\u2015]\s*5|5\s*[-\u2010-\u2015]\s*7|7\s*[-\u2010-\u2015]\s*10)\s*(?:working\s*)?days\s*\)?/gi, 'sample timing confirmed after project review')
    .replace(/\bBulk\s+production\s*(?::|in|is|usually\s+takes|commonly\s+takes|takes|\()?\s*(?:3\s*[-\u2010-\u2015]\s*5|7\s*[-\u2010-\u2015]\s*12|10\s*[-\u2010-\u2015]\s*20)\s*(?:working\s*)?days(?:\s*after\s*(?:sample|artwork)\s*approval)?\)?/gi, 'Production scheduling is confirmed after project approval')
    .replace(/\b(?:Express\s+)?(?:international\s+)?(?:delivery|shipping)[^.\n]{0,60}\b\d+\s*[-\u2010-\u2015]\s*\d+\s*business\s+days(?:\s+depending\s+on\s+(?:country|destination|carrier))?(?:\s+via\s+[^.\n]+)?/gi, 'Shipping timing is confirmed for the destination and project requirements')
    .replace(/\b\d+\s*[-\u2010-\u2015]\s*\d+\s*business\s+days\b[^.\n]{0,60}\b(?:delivery|shipping|courier)\b/gi, 'shipping timing confirmed for the destination and project requirements')
    .replace(/\b(?:Free\s+)?Mockup[^.\n]{0,40}\b(?:1\s*[-\u2010-\u2015]\s*2|2)\s*(?:hours?|h)\b/gi, 'Mockup support after project requirements are reviewed')
    .replace(/\bwithin\s+(?:2\s+hours|24\s+hours|1\s+business\s+day)\b/gi, 'after the project requirements are reviewed')
    .replace(/\bresponse\s+within\s+1\s+business\s+day\b/gi, 'response after the project details are reviewed')
    .replace(/\b(?:over\s+)?\d+\+?\s*years\s+(?:of\s+[\w -]{0,30}experience|experience|mastering)\b/gi, 'relevant teamwear manufacturing experience')
    .replace(/\bover\s+\d[\d,]*\s+(?:\w+\s+)?(?:teams|academies)\b/gi, 'team and academy projects')
    .replace(/\b(?:3,?000|5,?000)\+?\s*teams\b/gi, 'teamwear projects')
    .replace(/15\+ years(?: of apparel experience| of expertise| experience)?/gi, 'B2B teamwear experience')
    .replace(/(?:(?:production|monthly) capacity:\s*)?30,000\+ units(?: monthly)?\.?/gi, 'Production planning is based on confirmed quantity and schedule.')
    .replace(/reliable door-to-door logistics serving clubs and brands in 50\+ countries including USA, EU, AU\.?/gi, 'Global shipping support is planned according to the confirmed destination and shipping method.')
    .replace(/Elite\s+B2B\s+custom\s+teamwear\s+manufacturer/gi, 'factory-direct custom teamwear manufacturer')
    .replace(/Elite\s+Custom\s+Teamwear\s+Manufacturing/gi, 'Custom Teamwear Manufacturing')
    .replace(/Elite\s+OEM\s+Soccer\s+Apparel\s+Manufacturer/gi, 'OEM Soccer Apparel Manufacturer')
    .replace(/Elite\s+Custom\s+Teamwear\s+Manufacturer/gi, 'Custom teamwear manufacturer')
    .replace(/Elite\s+sublimation\s+printing/gi, 'Full-color sublimation printing')
}

export function normalizeBuyerFacingQuestion(value: string): string {
  if (/\b(?:does\s+POXIOL\s+support|what\s+is\s+(?:your|the))\s+MOQ\b/i.test(value)) {
    return 'How is the order quantity confirmed?'
  }
  if (/\b(?:how\s+fast|what\s+is\s+the\s+standard).*\bsample/i.test(value)) {
    return 'How is sample timing confirmed?'
  }
  return normalizeBuyerFacingClaim(value)
}

export function normalizeBuyerFacingFaq(question: string, answer: string): {question: string; answer: string} {
  const normalizedQuestion = normalizeBuyerFacingQuestion(question)
  if (normalizedQuestion === 'How is the order quantity confirmed?') {
    return {
      question: normalizedQuestion,
      answer: getApprovedClaimWording('order-quantity-confirmation'),
    }
  }
  return {
    question: normalizedQuestion,
    answer: normalizeBuyerFacingClaim(answer),
  }
}
