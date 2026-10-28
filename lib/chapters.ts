import type { Base, CameraKey } from "./helix";

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
  | "zap"
  | "rocket"
  | "users"
  | "megaphone"
  | "sparkles"
  | "mail"
  | "image"
  | "video";

export interface Callout {
  title: string;
  detail: string;
  icon: IconKey;
  /** Chapter-1 option cards carry a DNA base (A, T, G, C) and "pair" with what makes them perform. */
  base?: Base;
  pairs?: string;
  /** Chapter id this card scrolls to when clicked (chapter 1 only). */
  jumpTo?: string;
  /** A price line under the title: "From ₹…" in the visitor's currency, or "Custom quote" when `inr` is left out. */
  price?: { inr?: number };
  /** Shown instead of a price line (a card that is not priced per package, e.g. "Ready to launch"). */
  tag?: string;
  /** A few short points about what the card covers (large screens and the stacked layout; phones keep the compact chip). */
  includes?: string[];
  /** A "Book" link under the card, to the contact form with this option preselected. */
  book?: { label: string; href: string };
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
  /** Where the DNA camera is, and how far zoomed in, while this chapter is on screen. */
  camera: CameraKey;
  callouts: Callout[];
  card: { title: string; body: string; meter?: { label: string; value: string; fill: number } };
  /** A short strip of facts under the text (large screens and the stacked layout; phones leave it out). */
  proof?: { value: string; label: string }[];
  /** A card beyond the four options: on a floating-card chapter the sixth card beside the info card (large screens and the stacked layout); on the Home glass stack the fifth block. */
  extra?: Callout;
  cta: { label: string; href: string };
  secondary?: { label: string; href: string };
}

/**
 * The home page story: five chapters told over a DNA double helix (genaitex's "genetics": the building blocks and what each one pairs with).
 * No invented numbers: the only figures are the studio's 5 years in the field, a performance *target*, labelled as
 * one, and the "from" prices.
 */
export const homeChapters: Chapter[] = [
  {
    id: "studio",
    number: "01",
    label: "Studio",
    eyebrow: "The building blocks of growth",
    title: "Websites, AI & growth, built by people who've done it for 5 years.",
    lead: "genaitex is a studio for websites and apps, AI and automation, interfaces, CRM and AI-made ads, plus ready-made UIs and websites you can buy, make your own and launch: everything a business needs, under one roof.",
    body: "We fix what quietly holds businesses back: a slow site that loses visitors, hours lost to manual work, leads that slip through the cracks, ads that get scrolled past.",
    proof: [
      { value: "5 years", label: "in websites, AI & growth" },
      { value: "One team", label: "design, code, AI & marketing, no hand-offs" },
      { value: "95+", label: "Lighthouse target on every launch" },
    ],
    camera: { zoom: 1.5, focus: 0 },
    callouts: [
      {
        title: "Websites & Applications",
        base: "A",
        detail: "Static sites, ecommerce and web apps",
        pairs: "SEO & speed",
        icon: "globe",
        jumpTo: "websites",
      },
      {
        title: "AI, Automation & Integrations",
        base: "T",
        detail: "Assistants, search and workflows",
        pairs: "Your data & tools",
        icon: "bot",
        jumpTo: "ai",
      },
      {
        title: "UI Designs & CRM",
        base: "G",
        detail: "Interfaces and sales systems",
        pairs: "Your customers",
        icon: "palette",
        jumpTo: "growth",
      },
      {
        title: "AI Ads & Marketing",
        base: "C",
        detail: "Creative and campaigns that get seen",
        pairs: "Your audience",
        icon: "megaphone",
        jumpTo: "growth",
      },
    ],
    card: {
      title: "The genaitex code",
      body: "Every launch is checked for speed, accessibility and SEO before it goes live.",
      meter: { label: "Lighthouse target", value: "95+", fill: 0.95 },
    },
    extra: { title: "Ready-made UI & Websites", detail: "Finished designs and sites, ready to make yours", icon: "layers", jumpTo: "websites" },
    cta: { label: "Start a project", href: "/contact" },
    secondary: { label: "Choose your starting point", href: "#options" },
  },
  {
    id: "websites",
    number: "02",
    label: "Websites & Apps",
    eyebrow: "Websites & Applications",
    title: "Sites, stores and apps built to perform.",
    lead: "From a fast static website to a custom online store or a full web app, designed and built end to end. Or start from one of our ready-made UIs and websites.",
    body: "Static websites are pre-rendered and served from the edge, ecommerce can be a custom Shopify build or a fully custom storefront, and apps are built around how your team works. Prices are starting points; the final amount is confirmed in your quote.",
    camera: { zoom: 2.4, focus: 2.2, roll: 0.06 },
    callouts: [
      {
        title: "Static website",
        detail: "Marketing sites, landing pages, portfolios",
        icon: "globe",
        price: { inr: 2000 },
        includes: ["Fast, pre-rendered pages", "Responsive and SEO-ready", "Hosting and analytics set up"],
        book: { label: "Book", href: "/contact?type=web&plan=static" },
      },
      {
        title: "Ecommerce, 5 pages",
        detail: "A custom store built around your products",
        icon: "store",
        price: { inr: 10000 },
        includes: ["Shopify or fully custom store", "Product pages, cart, checkout", "Payments and analytics linked"],
        book: { label: "Book", href: "/contact?type=web&plan=ecom-5" },
      },
      {
        title: "Ecommerce, 10 pages",
        detail: "More pages, the same custom build",
        icon: "package",
        price: { inr: 20000 },
        includes: ["Everything in the 5-page store", "Ten pages for your content", "Payments and analytics linked"],
        book: { label: "Book", href: "/contact?type=web&plan=ecom-10" },
      },
      { title: "Web apps & dashboards", detail: "Built around how your team works", icon: "code", price: {} },
    ],
    card: {
      title: "Ideal for",
      body: "Businesses, brands and teams that need a premium site, a store that converts, or software that fits.",
    },
    extra: {
      title: "Ready-made UI & websites",
      detail: "Finished designs and sites, ready to make yours",
      icon: "layers",
      tag: "Ready to launch",
      includes: ["Browse finished UIs and sites", "Adapted to your brand", "Faster than a custom build"],
      book: { label: "Browse & book", href: "/contact?type=ready" },
    },
    cta: { label: "Get a quote for a website", href: "/contact?type=web" },
    secondary: { label: "See what's included", href: "/services#websites-applications" },
  },
  {
    id: "ai",
    number: "03",
    label: "AI & Automation",
    eyebrow: "AI, automation & integrations",
    title: "AI where it earns its keep.",
    lead: "Assistants that answer from your own content, search that understands questions, and automation that takes repetitive work off your team.",
    body: "We connect the tools you already use, keep a person in the loop where answers matter, and build in usage limits, logging and sensible data handling from the start.",
    camera: { zoom: 4, focus: -1.9, roll: -0.08 },
    callouts: [
      { title: "Grounded assistants", detail: "Answers drawn from your content and data", icon: "bot" },
      { title: "Document & knowledge search", detail: "Find the right answer fast", icon: "search" },
      { title: "Workflow automation", detail: "Connect your tools, remove manual steps", icon: "workflow" },
      { title: "Integrations", detail: "Your store, CRM, email and payments, connected", icon: "plug" },
    ],
    card: {
      title: "Ideal for",
      body: "Businesses with repetitive work, lots of documents, or support questions that keep coming back.",
    },
    cta: { label: "Discuss AI & automation", href: "/contact?type=ai" },
    secondary: { label: "See what's included", href: "/services#ai-automation-integrations" },
  },
  {
    id: "growth",
    number: "04",
    label: "Design & growth",
    eyebrow: "Design, CRM & growth",
    title: "Design that stands out. Marketing that gets seen.",
    lead: "Custom UI designs, CRM setup, AI product advertisements and marketing: the pieces that turn a good build into steady customers.",
    body: "Interfaces designed around your users, a CRM that matches how you sell, AI-made product creatives reviewed by a person, and marketing you can see working.",
    camera: { zoom: 6, focus: 1.2, roll: 0.1 },
    callouts: [
      { title: "Custom UI designs", detail: "Interfaces built around your users", icon: "palette" },
      { title: "CRM setup", detail: "Pipelines, forms and follow-ups", icon: "users" },
      { title: "AI product ads", detail: "Images and video ads from your products", icon: "sparkles" },
      { title: "Marketing", detail: "Search, social, email and paid ads", icon: "megaphone" },
    ],
    card: {
      title: "Ideal for",
      body: "Businesses that want a standout interface and steady enquiries or orders.",
    },
    cta: { label: "Discuss a project", href: "/contact" },
    secondary: { label: "See all services", href: "/services" },
  },
  {
    id: "launch",
    number: "05",
    label: "Launch",
    eyebrow: "Launch & beyond",
    title: "Live on your domain, built to last.",
    lead: "We handle go-live, final checks, analytics and handover, then stay on hand for updates and new features.",
    body: "Your code, your accounts and your content stay yours, with documentation and a walkthrough so you are never locked in.",
    camera: { zoom: 1.3, focus: 0 },
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

/** Chapter ids from before the services were reorganised: old /services#… links land on the new chapter. */
export const chapterAliases: Record<string, string> = {
  "static-websites": "websites-applications",
  "shopify-storefronts": "websites-applications",
  "custom-development": "websites-applications",
  "ai-automation": "ai-automation-integrations",
};

const home = (id: string) => homeChapters.find((c) => c.id === id)!;

/**
 * The services page story: the six services in detail, then how we work. Chapter ids match the service
 * slugs, so links such as /services#crm-setup jump to the right chapter.
 */
export const servicesChapters: Chapter[] = [
  {
    ...home("websites"),
    id: "websites-applications",
    number: "01",
    camera: { zoom: 1.8, focus: 1.6 },
    secondary: { label: "Choose your starting point", href: "#start" },
  },
  {
    ...home("ai"),
    id: "ai-automation-integrations",
    number: "02",
    camera: { zoom: 3, focus: -2, roll: -0.06 },
    secondary: { label: "Choose your starting point", href: "#start" },
  },
  {
    id: "custom-ui-design",
    number: "03",
    label: "UI Design",
    eyebrow: "Custom UI designs",
    title: "Interfaces that feel as good as they look.",
    lead: "Clear, distinctive interfaces for websites, web apps and dashboards, designed around your users and your brand.",
    body: "From wireframes to a full design system and clickable prototypes, so you see and refine everything before a line of code is written.",
    camera: { zoom: 4.4, focus: 1.1, roll: 0.07 },
    callouts: [
      { title: "Research & wireframes", detail: "Goals, audience and structure first", icon: "pencil" },
      { title: "High-fidelity screens", detail: "Polished, responsive designs", icon: "palette" },
      { title: "Design system", detail: "Colours, type and components that stay consistent", icon: "layers" },
      { title: "Prototype & handoff", detail: "Clickable, and ready for developers", icon: "rocket" },
    ],
    card: { title: "Ideal for", body: "Founders and teams who need a standout interface before they build, or a product that deserves a redesign." },
    cta: { label: "Start a design project", href: "/contact?type=design" },
    secondary: { label: "Choose your starting point", href: "#start" },
  },
  {
    id: "crm-setup",
    number: "04",
    label: "CRM Setup",
    eyebrow: "CRM setup",
    title: "A CRM that fits how you sell.",
    lead: "We choose and set up the right CRM with you, connect your website and tools, and train your team to use it.",
    body: "Pipelines, fields and roles built around your sales process, lead capture straight from your website, automated follow-ups, and reports you will actually read.",
    camera: { zoom: 6.4, focus: -1.4, roll: -0.1 },
    callouts: [
      { title: "Pipeline & fields", detail: "Stages and roles shaped to your process", icon: "workflow" },
      { title: "Lead capture", detail: "Website forms flow straight in", icon: "plug" },
      { title: "Follow-up automation", detail: "Emails and tasks that run themselves", icon: "zap" },
      { title: "Reports & training", detail: "Dashboards, plus a walkthrough for your team", icon: "chart" },
    ],
    card: { title: "Ideal for", body: "Small and growing teams whose leads live in inboxes and spreadsheets." },
    cta: { label: "Start a CRM setup", href: "/contact?type=crm" },
    secondary: { label: "Choose your starting point", href: "#start" },
  },
  {
    id: "ai-product-ads",
    number: "05",
    label: "AI Product Ads",
    eyebrow: "AI product advertisements",
    title: "Product ads without a studio shoot.",
    lead: "Product visuals, lifestyle scenes and short video ads made with AI from your real product photos, and checked by a person before they reach you.",
    body: "Fresh creative for your store and ad channels, in several variations to test, in the sizes and formats each channel needs.",
    camera: { zoom: 3.2, focus: 0.6, roll: 0.05 },
    callouts: [
      { title: "Product visuals", detail: "Your products in your brand's look", icon: "image" },
      { title: "Short video ads", detail: "For social media and your store", icon: "video" },
      { title: "Creative variations", detail: "Several versions to test", icon: "layers" },
      { title: "Reviewed by a person", detail: "Quality and brand fit, checked", icon: "shield" },
    ],
    card: { title: "Ideal for", body: "Ecommerce and product brands that need fresh ad creative often, on a practical budget." },
    cta: { label: "Start an ad project", href: "/contact?type=ads" },
    secondary: { label: "Choose your starting point", href: "#start" },
  },
  {
    id: "marketing",
    number: "06",
    label: "Marketing",
    eyebrow: "Marketing",
    title: "Reach the people ready to buy.",
    lead: "Search, content, social, email and paid ads, planned around your goals and tracked so you can see what is working.",
    body: "We are straight about what is realistic: no promised rankings, just steady work and clear reporting.",
    camera: { zoom: 2.4, focus: -0.8, roll: -0.04 },
    callouts: [
      { title: "SEO", detail: "Technical fixes, on-page work and content", icon: "search" },
      { title: "Social & content", detail: "Posts and content that fit your brand", icon: "megaphone" },
      { title: "Email & automation", detail: "Campaigns and follow-up flows", icon: "mail" },
      { title: "Ads & analytics", detail: "Paid campaigns with conversion tracking", icon: "chart" },
    ],
    card: { title: "Ideal for", body: "Businesses with a website or store that want steady enquiries and orders." },
    cta: { label: "Start with marketing", href: "/contact?type=marketing" },
    secondary: { label: "Choose your starting point", href: "#start" },
  },
  {
    id: "process",
    number: "07",
    label: "How we work",
    eyebrow: "How we work",
    title: "A clear process, no surprises.",
    lead: "Five stages, a live preview link from the first week, and a scope agreed up front.",
    body: "Discover, design, build, launch, support: you always know what is happening and what comes next.",
    camera: { zoom: 1.4, focus: 0 },
    callouts: [
      { title: "Discover", detail: "Goals, audience, scope and a quote", icon: "search" },
      { title: "Design", detail: "Wireframes and polished designs for key pages", icon: "palette" },
      { title: "Build", detail: "Clean, typed, tested code with a live preview", icon: "code" },
      { title: "Launch & support", detail: "Checks, go-live, handover, ongoing care", icon: "rocket" },
    ],
    card: { title: "You own everything", body: "Your code, your accounts and your content, with clean handover and no lock-in." },
    cta: { label: "Start a project", href: "/contact" },
    secondary: { label: "See our work", href: "/work" },
  },
];
