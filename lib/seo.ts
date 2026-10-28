import type { Metadata } from "next";
import { site } from "./site";

/** Cuts text to at most `max` characters on a word boundary, ending with an ellipsis (for meta descriptions). */
export function clip(text: string, max = 155) {
  const t = text.replace(/\s+/g, " ").trim();
  if (t.length <= max) return t;
  const cut = t.slice(0, max - 1);
  return `${cut.slice(0, cut.lastIndexOf(" ")).replace(/[,;:.\-\s]+$/, "")}…`;
}

/**
 * The metadata of an inner page: its own title, description, canonical URL, and share (Open Graph / Twitter) title,
 * so a page is never shared or listed under the home page's title. `title` gets " · genaitex" from the site template;
 * the share cards show the same full title.
 */
export function pageMetadata({
  title,
  description,
  path,
  type = "website",
  publishedTime,
  modifiedTime,
  ownImage = false,
}: {
  title: string;
  description: string;
  /** The page's path, e.g. "/services/crm-setup". It is the canonical URL. */
  path: string;
  type?: "website" | "article";
  publishedTime?: string;
  modifiedTime?: string;
  /** True when the page's route has its own opengraph-image file (service pages, case studies, articles). */
  ownImage?: boolean;
}): Metadata {
  const full = `${title} · ${site.name}`;
  // A page that sets its own share data loses the site-wide share image unless it names one, so name it here
  const images = ownImage ? undefined : [{ url: "/opengraph-image", width: 1200, height: 630, alt: `${site.name}: ${site.tagline}` }];
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type,
      siteName: site.name,
      locale: "en_IN",
      title: full,
      description,
      url: path,
      ...(images && { images }),
      ...(type === "article" && { publishedTime, modifiedTime }),
    },
    twitter: { card: "summary_large_image", title: full, description, ...(images && { images: images.map((i) => i.url) }) },
  };
}
