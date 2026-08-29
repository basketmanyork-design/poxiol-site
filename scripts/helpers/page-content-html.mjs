/** Exclude shared chrome and executable markup before inspecting page FAQs. */
export function pageContentHtml(html) {
  return html
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, '')
    .replace(/<header\b[^>]*>[\s\S]*?<\/header>/gi, '')
    .replace(/<footer\b[^>]*>[\s\S]*?<\/footer>/gi, '');
}
