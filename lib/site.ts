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
