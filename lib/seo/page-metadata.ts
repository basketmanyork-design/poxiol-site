import type { Metadata } from "next";

const SITE_ORIGIN = "https://www.poxiol.com";

export const PRESERVED_ROOT_TWITTER_METADATA: NonNullable<Metadata["twitter"]> = {
  card: "summary",
  title: "Custom Teamwear & Sports Uniforms Manufacturer | POXIOL",
  description:
    "Custom basketball, soccer and baseball uniforms for clubs, schools, youth programs, sports brands and distributors.",
};

export type PageMetadataInput = {
  title: string;
  description: string;
  canonical: string;
  metadata?: Omit<Metadata, "title" | "description" | "alternates" | "openGraph">;
};

function resolveCanonical(canonical: string): string {
  if (!canonical || canonical.trim() !== canonical) {
    throw new Error("Page metadata canonical must be a non-empty exact URL or path.");
  }

  const isAbsolute = /^https?:\/\//i.test(canonical);
  if (!isAbsolute && (!canonical.startsWith("/") || canonical.startsWith("//"))) {
    throw new Error("Page metadata canonical path must start with one slash.");
  }

  const resolved = new URL(canonical, SITE_ORIGIN);
  if (
    resolved.origin !== SITE_ORIGIN ||
    resolved.protocol !== "https:" ||
    resolved.username ||
    resolved.password ||
    resolved.search ||
    resolved.hash
  ) {
    throw new Error("Page metadata canonical must be a clean HTTPS www.poxiol.com URL.");
  }

  if (isAbsolute && resolved.href !== canonical) {
    throw new Error("Page metadata canonical must already be normalized.");
  }

  return resolved.href;
}

export function createPageMetadata({
  title,
  description,
  canonical,
  metadata = {},
}: PageMetadataInput): Metadata {
  if (!title.trim() || !description.trim()) {
    throw new Error("Page metadata title and description must be non-empty.");
  }

  const absoluteCanonical = resolveCanonical(canonical);

  return {
    ...metadata,
    title,
    description,
    alternates: { canonical },
    openGraph: {
      title,
      description,
      url: absoluteCanonical,
      type: "website",
      siteName: "POXIOL Teamwear",
    },
  };
}
