/**
 * Single source of truth for brand details.
 * Everything marked CONFIGURE can be overridden with an env var (see .env.example)
 * so the placeholders can be replaced without touching components.
 */
export const site = {
  name: "genaitex",
  tagline: "Websites, AI & growth, engineered to convert.",
  description:
    "genaitex is a studio building websites and applications, AI and automation, custom UI designs, CRM setups, AI product advertisements and marketing.",

  // The title of the home page in search results (the tagline above is the on-page headline, not the search title).
  seoTitle: "genaitex: Websites, AI Automation & Growth Studio in India",
  // Short, search-led description of the home page (about 150 characters).
  seoDescription:
    "Websites, Shopify stores, AI automation, UI design, CRM setup and AI product ads for businesses in India. Custom builds or ready-made UIs and websites.",

  // The primary domain. genaitex.in should redirect here (set up in Vercel), never serve a copy.
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://genaitex.com",

  // Where inquiries and "email us" links point
  email: process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? "genaitexofficial@gmail.com",

  // Digits only, with country code (91 = India). Set the env var to an empty string to hide WhatsApp.
  whatsapp: process.env.NEXT_PUBLIC_WHATSAPP ?? "919912377803",

  // The off-white / silver / ash Day and Night themes (with the navbar button) on screens 1024px and wider.
  // Set NEXT_PUBLIC_DESKTOP_THEMES=off to go back to the original dark-blue look everywhere.
  desktopThemes: process.env.NEXT_PUBLIC_DESKTOP_THEMES !== "off",

  // CONFIGURE: short status line shown above the hero headline. Set to "" to hide.
  availability: "Now booking new projects",

  // CONFIGURE: add { label: "LinkedIn", href: "https://..." } entries to show them in the footer. They also become the
  // `sameAs` profiles in the structured data (Google uses them to connect the brand to its profiles).
  socials: [] as { label: string; href: string }[],

  // CONFIGURE: where the studio is based, for the structured data and local search. Left empty, nothing is published.
  // Use the city and region only (no street address is needed): e.g. { city: "Hyderabad", region: "Telangana", country: "IN" }.
  location: {
    city: process.env.NEXT_PUBLIC_CITY ?? "",
    region: process.env.NEXT_PUBLIC_REGION ?? "",
    country: process.env.NEXT_PUBLIC_COUNTRY ?? "",
  },

  // Search-engine verification codes (Google Search Console "HTML tag" method, Bing Webmaster Tools). Optional.
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION ?? "",
    bing: process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION ?? "",
  },

  nav: [
    { label: "Services", href: "/services" },
    { label: "Work", href: "/work" },
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
  ],
} as const;

export function whatsappLink(message = "Hi genaitex, I'd like to discuss a project.") {
  if (!site.whatsapp) return null;
  return `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(message)}`;
}
