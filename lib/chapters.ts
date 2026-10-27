import type { Base } from "./helix";

/** Icon keys resolved to lucide icons in the stage components. */
export type IconKey =
  | "globe"
  | "store"
  | "code"
  | "bot"
  | "search"
  | "palette"
  | "layers"
  | "pencil"
  | "plug"
  | "workflow"
  | "gauge"
  | "chart"
  | "shield"
  | "life-buoy"
  | "file-text"
  | "server"
  | "package"
  | "zap";

export interface Callout {
  title: string;
  detail: string;
  icon: IconKey;
  /** Chapter-1 option cards carry a DNA base (A, T, G, C) and "pair" with what makes them perform. */
  base?: Base;
  pairs?: string;
  /** Chapter id this card scrolls to when clicked (chapter 1 only). */
  jumpTo?: string;
}

export interface Chapter {
  id: string;
  number: string;
  /** Short label for the rail and pager. */
  label: string;
  eyebrow: string;
  title: string;
  lead: string;
  /** Longer copy, shown on large screens only. */
  body: string;
  callouts: Callout[];
  card: { title: string; body: string; meter?: { label: string; value: string; fill: number } };
  cta: { label: string; href: string };
  secondary?: { label: string; href: string };
}

/**
 * The home page story: five chapters told over a DNA double helix (genaitex's "genetics": the building blocks and what each one pairs with).
 * No invented numbers: the only figure is a performance *target*, labelled as one.
 */
export const homeChapters: Chapter[] = [
  {
    id: "studio",
    number: "01",
    label: "Studio",
    eyebrow: "The building blocks of the web",
    title: "Websites & storefronts engineered to convert.",
    lead: "genaitex builds fast static websites, custom Shopify storefronts and bespoke software, from first sketch to launch and beyond.",
    body: "One team designs, builds and ships it all. Choose the starting point that fits your business: each option pairs with the pieces that make it perform.",
    callouts: [
      {
        title: "Static Websites",
        base: "A",
        detail: "Pre-rendered pages that load instantly",
        pairs: "SEO & speed",
        icon: "globe",
        jumpTo: "websites",
      },
      {
        title: "Shopify Storefronts",
        base: "T",
        detail: "Themes and headless stores that sell",
        pairs: "Checkout & payments",
        icon: "store",
        jumpTo: "storefronts",
      },
      {
        title: "Custom Development",
        base: "G",
        detail: "Web apps, dashboards and APIs",
        pairs: "APIs & integrations",
        icon: "code",
        jumpTo: "custom",
      },
      {
        title: "AI & Automation",
        base: "C",
        detail: "Assistants, search and workflows",
        pairs: "Your data & workflows",
        icon: "bot",
        jumpTo: "custom",
      },
    ],
    card: {
      title: "The genaitex code",
      body: "Every launch is checked for speed, accessibility and SEO before it goes live.",
      meter: { label: "Lighthouse target", value: "95+", fill: 0.95 },
    },
    cta: { label: "Start a project", href: "/contact" },
    secondary: { label: "Choose your starting point", href: "#options" },
  },
  {
    id: "websites",
    number: "02",
    label: "Websites",
    eyebrow: "Static websites",
    title: "Pages that load before you blink.",
    lead: "Pre-rendered pages served from the edge: nothing to patch, almost nothing to go wrong, and fast on any connection.",
    body: "We design and build sites that feel premium, score well on Core Web Vitals and are easy for you to update. Ideal for businesses, founders and creators who need a sharp online presence without the maintenance burden.",
    callouts: [
      { title: "Custom design", detail: "No templates, no page-builder bloat", icon: "palette" },
      { title: "SEO-ready markup", detail: "Structure search engines understand", icon: "search" },
      { title: "Optional CMS", detail: "Edit your content without a developer", icon: "pencil" },
      { title: "Domain & hosting", detail: "Deployment and DNS set up for you", icon: "server" },
    ],
    card: {
      title: "Ideal for",
      body: "Marketing sites, landing pages, portfolios and local businesses.",
    },
    cta: { label: "Get a quote for a website", href: "/contact?type=static" },
    secondary: { label: "See what's included", href: "/services#static-websites" },
  },
  {
    id: "storefronts",
    number: "03",
    label: "Storefronts",
    eyebrow: "Shopify storefronts",
    title: "A store that looks like a flagship and sells like one.",
    lead: "Shopify runs the commerce engine; we build the experience on top, from a tightly customised theme to a fully headless storefront.",
    body: "We shape the buying journey around your products and your brand: product pages, bundles, cart upgrades, checkout extensions and the integrations that keep your store running smoothly.",
    callouts: [
      { title: "Custom Liquid themes", detail: "Sections you can edit in Shopify", icon: "layers" },
      { title: "Headless storefronts", detail: "Hydrogen or Next.js on the Storefront API", icon: "zap" },
      { title: "Checkout & apps", detail: "Upsells, bundles and extensions", icon: "package" },
      { title: "Store migrations", detail: "Move from another platform safely", icon: "store" },
    ],
    card: {
      title: "Ideal for",
      body: "Brands that have outgrown their theme, or are launching a store that needs to convert.",
    },
    cta: { label: "Get a quote for a storefront", href: "/contact?type=shopify" },
    secondary: { label: "See what's included", href: "/services#shopify-storefronts" },
  },
  {
    id: "custom",
    number: "04",
    label: "Custom & AI",
    eyebrow: "Custom development & AI",
    title: "Software built around how you actually work.",
    lead: "When an off-the-shelf tool does not fit, we build the thing you need: web apps, APIs, integrations and AI features.",
    body: "From an MVP in front of users to production systems: dashboards, customer portals, connections between the tools you already use, and AI assistants grounded in your own content and data.",
    callouts: [
      { title: "Web apps & dashboards", detail: "From MVP to production", icon: "code" },
      { title: "APIs & integrations", detail: "Connect the tools you already use", icon: "plug" },
      { title: "AI assistants & search", detail: "Grounded in your own content", icon: "bot" },
      { title: "Workflow automation", detail: "Remove repetitive manual work", icon: "workflow" },
    ],
    card: {
      title: "Ideal for",
      body: "Teams with a specific problem to solve, or an idea that needs an MVP.",
    },
    cta: { label: "Discuss a custom project", href: "/contact?type=custom" },
    secondary: { label: "Explore AI & automation", href: "/contact?type=ai" },
  },
  {
    id: "launch",
    number: "05",
    label: "Launch",
    eyebrow: "Launch & beyond",
    title: "Live on your domain, built to last.",
    lead: "We handle go-live, final checks, analytics and handover, then stay on hand for updates and new features.",
    body: "Your code, your accounts and your content stay yours, with documentation and a walkthrough so you are never locked in.",
    callouts: [
      { title: "Pre-launch checks", detail: "Speed, accessibility and SEO review", icon: "gauge" },
      { title: "Analytics & monitoring", detail: "See how it performs from day one", icon: "chart" },
      { title: "Handover & docs", detail: "Your code, your accounts, no lock-in", icon: "file-text" },
      { title: "Ongoing support", detail: "Fixes, updates and new features", icon: "life-buoy" },
    ],
    card: {
      title: "You own everything",
      body: "Clean handover, documentation and no lock-in.",
    },
    cta: { label: "Start a project", href: "/contact" },
    secondary: { label: "See our work", href: "/work" },
  },
];
