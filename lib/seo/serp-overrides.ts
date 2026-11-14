/**
 * SERP-length repair for CMS-owned pages.
 *
 * Some CMS documents store SEO text that is outside the range a search result can
 * show (title > 60 characters, description outside 120-160). The content team cannot
 * publish a correction for every one of them: the /customization/ document is blocked
 * by a pre-existing schema conflict (pageType "content" is not in the allowed list),
 * which keeps Publish disabled, and the article documents carry empty required dates.
 *
 * This table is a repair, not a replacement. It only takes effect while the stored
 * value violates the constraint, so as soon as the CMS value lands inside the range
 * the stored value wins again and the entry below becomes inert.
 *
 * Remove an entry once the CMS value is correct; nothing else depends on it.
 */

const TITLE_MAX = 60
const DESC_MIN = 120
const DESC_MAX = 160

type SerpText = {title?: string; description?: string}

const REPAIRS: Record<string, SerpText> = {
  "/customization/": {
    description:
      "Custom logos, names, numbers, labels and packaging for teamwear programs. Review which elements can be customized before requesting a quote.",
  },
  "/resources/sports-uniform-fabric-guide/": {
    title: "Sports Uniform Fabric Guide for Teamwear Buyers",
    description:
      "Compare polyester mesh, interlock, bird eye, stretch and quick-dry fabrics for basketball, soccer, volleyball and training uniforms.",
  },
  "/resources/private-label-teamwear-launch-checklist/": {
    title: "Private Label Teamwear Launch Checklist | POXIOL",
    description:
      "A launch checklist for private label teamwear: OEM/ODM production, labels, hangtags, packaging and repeat order support for sportswear brands.",
  },
}

function titleIsOutOfRange(title: string | undefined): boolean {
  return !title || title.length > TITLE_MAX
}

function descriptionIsOutOfRange(description: string | undefined): boolean {
  return !description || description.length < DESC_MIN || description.length > DESC_MAX
}

/**
 * Returns the fields that must replace the stored value. An empty object means the
 * stored metadata is already acceptable and must be left untouched.
 */
export function repairSerpText(
  route: string,
  stored: {title?: string; description?: string},
): SerpText {
  const repair = REPAIRS[route]
  if (!repair) return {}

  const next: SerpText = {}
  if (repair.title && titleIsOutOfRange(stored.title)) next.title = repair.title
  if (repair.description && descriptionIsOutOfRange(stored.description)) {
    next.description = repair.description
  }
  return next
}
