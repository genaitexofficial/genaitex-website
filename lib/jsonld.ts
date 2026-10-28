import { site } from "./site";
import { services, websitePricing } from "./services";
import { seoPages, type Faq, type SeoPage } from "./seoPages";

/**
 * Structured data (schema.org JSON-LD) for search engines. Only facts the site already states go in: the studio,
 * its services, the "from" prices, and the contact details it publishes. Nothing here claims reviews, ratings,
 * clients or awards. Empty config (location, socials) is left out, never guessed.
 */
const abs = (path: string) => `${site.url}${path === "/" ? "" : path}`;

export const ids = {
  org: `${site.url}/#organization`,
  website: `${site.url}/#website`,
  business: `${site.url}/#business`,
};

const areaServed = [{ "@type": "Country", name: "India" }, "Worldwide"];

const address = () => {
  const { city, region, country } = site.location;
  if (!city && !region && !country) return undefined;
  return {
    "@type": "PostalAddress",
    ...(city && { addressLocality: city }),
    ...(region && { addressRegion: region }),
    ...(country && { addressCountry: country }),
  };
};

const organization = () => ({
  "@type": "Organization",
  "@id": ids.org,
  name: site.name,
  url: site.url,
  logo: { "@type": "ImageObject", url: abs("/icons/512"), width: 512, height: 512 },
  image: abs("/opengraph-image"),
  description: site.description,
  email: site.email,
  ...(site.socials.length > 0 && { sameAs: site.socials.map((s) => s.href) }),
  contactPoint: [
    {
      "@type": "ContactPoint",
      contactType: "sales",
      email: site.email,
      ...(site.whatsapp && { telephone: `+${site.whatsapp}` }),
      availableLanguage: ["English"],
      areaServed: ["IN", "Worldwide"],
    },
  ],
  ...(address() && { address: address() }),
  areaServed,
});

const website = () => ({
  "@type": "WebSite",
  "@id": ids.website,
  url: site.url,
  name: site.name,
  description: site.description,
  inLanguage: "en-IN",
  publisher: { "@id": ids.org },
});

const business = () => ({
  "@type": "ProfessionalService",
  "@id": ids.business,
  name: site.name,
  url: site.url,
  description: site.description,
  image: abs("/opengraph-image"),
  parentOrganization: { "@id": ids.org },
  email: site.email,
  ...(address() && { address: address() }),
  areaServed,
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: `${site.name} services`,
    itemListElement: seoPages.map((p) => ({
      "@type": "Offer",
      itemOffered: { "@type": "Service", name: p.name, url: abs(`/services/${p.slug}`) },
    })),
  },
});

/** The graph on every page: who the studio is, the website, and what it offers. */
export function siteGraph() {
  return { "@context": "https://schema.org", "@graph": [organization(), website(), business()] };
}

export interface Crumb {
  name: string;
  path: string;
}

/** BreadcrumbList; Home is always the first item. */
export function breadcrumbJsonLd(crumbs: Crumb[]) {
  const all: Crumb[] = [{ name: "Home", path: "/" }, ...crumbs];
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: all.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.name,
      item: abs(c.path),
    })),
  };
}

/** A service page: the Service itself, with its starting prices as Offers where the site states them. */
export function serviceJsonLd(page: SeoPage) {
  const tiers = (page.tierIds ?? [])
    .map((id) => websitePricing.find((t) => t.id === id))
    .filter((t): t is NonNullable<typeof t> => !!t && t.inr !== undefined);
  const svc = services.find((s) => s.slug === page.service);
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${abs(`/services/${page.slug}`)}#service`,
    name: page.name,
    serviceType: page.name,
    description: page.description,
    url: abs(`/services/${page.slug}`),
    provider: { "@id": ids.org },
    areaServed,
    ...(svc && { category: svc.title }),
    ...(tiers.length > 0 && {
      offers: tiers.map((t) => ({
        "@type": "Offer",
        name: `${t.label}${t.detail ? `, ${t.detail}` : ""}`,
        priceCurrency: "INR",
        priceSpecification: {
          "@type": "PriceSpecification",
          priceCurrency: "INR",
          minPrice: t.inr,
        },
        url: abs(`/contact?type=${svc?.contactType ?? "web"}&plan=${t.id}`),
      })),
    }),
  };
}

export function faqJsonLd(faqs: Faq[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}

export function articleJsonLd(a: {
  title: string;
  description: string;
  path: string;
  published: string;
  updated?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: a.title,
    description: a.description,
    url: abs(a.path),
    mainEntityOfPage: abs(a.path),
    datePublished: a.published,
    dateModified: a.updated ?? a.published,
    inLanguage: "en-IN",
    image: abs(`${a.path}/opengraph-image`),
    author: { "@id": ids.org },
    publisher: { "@id": ids.org },
  };
}

export function collectionJsonLd(c: { name: string; description: string; path: string; items: { name: string; path: string }[] }) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: c.name,
    description: c.description,
    url: abs(c.path),
    isPartOf: { "@id": ids.website },
    mainEntity: {
      "@type": "ItemList",
      itemListElement: c.items.map((it, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: it.name,
        url: abs(it.path),
      })),
    },
  };
}
