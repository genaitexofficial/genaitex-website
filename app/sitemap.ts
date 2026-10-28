import type { MetadataRoute } from "next";
import { projects } from "@/lib/projects";
import { seoPages } from "@/lib/seoPages";
import { hasLiveInsights, visibleArticles } from "@/lib/insights";
import { site } from "@/lib/site";

/**
 * Every public page. `lastModified` is given only where the content carries a real date (the service pages), never
 * guessed: an inaccurate date teaches search engines to ignore it.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const pages = ["", "/services", "/work", "/about", "/contact"].map((path) => ({
    url: `${site.url}${path}`,
    priority: path === "" ? 1 : 0.8,
  }));

  const servicePages = seoPages.map((p) => ({
    url: `${site.url}/services/${p.slug}`,
    lastModified: new Date(p.updated),
    priority: 0.9,
  }));

  const caseStudies = projects.map((p) => ({
    url: `${site.url}/work/${p.slug}`,
    priority: 0.5,
  }));

  const insights = hasLiveInsights
    ? [
        { url: `${site.url}/insights`, priority: 0.7 },
        ...visibleArticles().map((a) => ({
          url: `${site.url}/insights/${a.slug}`,
          lastModified: new Date(a.updated ?? a.published),
          priority: 0.7,
        })),
      ]
    : [];

  return [...pages, ...servicePages, ...insights, ...caseStudies];
}
