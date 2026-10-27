/**
 * Single source of truth for brand details.
 * Everything marked CONFIGURE can be overridden with an env var (see .env.example)
 * so the placeholders can be replaced without touching components.
 */
export const site = {
  name: "genaitex",
  tagline: "Websites & storefronts engineered to convert.",
  description:
    "genaitex is a development studio building fast static websites, custom Shopify storefronts and bespoke web software.",

  // CONFIGURE: the final domain, including the TLD (genaitex.com, .in, .io ...)
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://genaitex.com",

  // CONFIGURE: where inquiries and "email us" links point
  email: process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? "hello@genaitex.com",

  // CONFIGURE: digits only, with country code (e.g. 919876543210). Leave empty to hide WhatsApp.
  whatsapp: process.env.NEXT_PUBLIC_WHATSAPP ?? "",

  // CONFIGURE: short status line shown above the hero headline. Set to "" to hide.
  availability: "Now booking new projects",

  // CONFIGURE: add { label: "LinkedIn", href: "https://..." } entries to show them in the footer
  socials: [] as { label: string; href: string }[],

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
