export type ServiceIcon = "globe" | "store" | "code" | "bot";

export interface Service {
  slug: string;
  /** Value of `/contact?type=…` that preselects this option in the inquiry form. */
  contactType: "static" | "shopify" | "custom" | "ai";
  icon: ServiceIcon;
  title: string;
  /** One-liner for cards */
  summary: string;
  /** Longer pitch for the services page */
  pitch: string;
  /** Who it is for */
  idealFor: string;
  includes: string[];
  stack: string[];
  /**
   * Typical timeline, shown only when set. Left empty until it is a commitment you are happy to make
   * (scope-dependent estimates belong in the quote).
   */
  timeline?: string;
}

export const services: Service[] = [
  {
    slug: "static-websites",
    contactType: "static",
    icon: "globe",
    title: "Static Websites",
    summary:
      "Marketing sites, landing pages and portfolios built to load instantly and rank well.",
    pitch:
      "Pre-rendered pages served from the edge: no waiting on servers, nothing to patch, almost nothing to go wrong. We design and build sites that feel premium, score well on Core Web Vitals and are easy for you to update.",
    idealFor: "Businesses, founders and creators who need a sharp online presence without the maintenance burden.",
    includes: [
      "Custom design: no templates, no page-builder bloat",
      "Mobile-first, accessible, SEO-ready markup",
      "Fast by default: optimised images, fonts and scripts",
      "Optional headless CMS so you can edit content yourself",
      "Contact forms, analytics and booking integrations",
      "Deployment, domain and email DNS set up for you",
    ],
    stack: ["Next.js", "Astro", "Tailwind CSS", "TypeScript", "Sanity", "Vercel"],
  },
  {
    slug: "shopify-storefronts",
    contactType: "shopify",
    icon: "store",
    title: "Custom Shopify Storefronts",
    summary:
      "Theme builds and headless storefronts that turn browsers into buyers.",
    pitch:
      "Shopify handles the commerce engine; we build the experience on top. From a tightly customised Liquid theme to a fully headless storefront on the Storefront API, we shape the buying journey around your products and your brand.",
    idealFor: "Brands that have outgrown their theme, or are launching a store that needs to look and convert like a flagship.",
    includes: [
      "Custom Liquid themes and section-level theme customisation",
      "Headless storefronts with Hydrogen or Next.js and the Storefront API",
      "Product pages, bundles, variants, quick-add and cart upgrades",
      "Checkout and app extensions, plus third-party integrations",
      "Store migrations from other platforms",
      "Speed and conversion audits with a prioritised fix list",
    ],
    stack: ["Shopify", "Liquid", "Hydrogen", "Storefront API", "Next.js", "GraphQL"],
  },
  {
    slug: "custom-development",
    contactType: "custom",
    icon: "code",
    title: "Custom Development",
    summary: "Web apps, dashboards, APIs and integrations built around how you actually work.",
    pitch:
      "When an off-the-shelf tool does not fit, we build the thing you actually need: internal dashboards, customer portals, APIs, and the integrations between the tools you already use.",
    idealFor: "Teams with a specific problem to solve, or an idea that needs an MVP in front of users quickly.",
    includes: [
      "Web applications and dashboards, from MVP to production",
      "REST and GraphQL APIs, authentication, payments and webhooks",
      "Integrations between the tools and services you already use",
      "Performance, security and code-quality reviews",
      "Ongoing support and feature work after launch",
    ],
    stack: ["TypeScript", "React", "Node.js", "PostgreSQL", "Stripe", "GraphQL"],
  },
  {
    slug: "ai-automation",
    contactType: "ai",
    icon: "bot",
    title: "AI & Automation",
    summary: "AI assistants, smart search and workflow automation grounded in your own content and data.",
    pitch:
      "We add AI where it earns its keep: assistants that answer from your own content, search that understands questions, and automation that takes repetitive manual work off your team, with a person kept in the loop where it matters.",
    idealFor: "Businesses with repetitive work, lots of documents, or support questions that keep coming back.",
    includes: [
      "AI assistants and chat grounded in your own content and data",
      "Document and knowledge-base search",
      "Content and workflow tooling powered by large language model APIs",
      "Automation between the tools your team already uses",
      "Human hand-off and review for answers that matter",
      "Guardrails: usage limits, logging and sensible data handling",
    ],
    stack: ["LLM APIs", "TypeScript", "Node.js", "Vector search", "Webhooks", "Shopify Admin API"],
  },
];

export const techMarquee = [
  "Next.js",
  "React",
  "TypeScript",
  "Shopify",
  "Hydrogen",
  "Liquid",
  "Tailwind CSS",
  "Astro",
  "Node.js",
  "PostgreSQL",
  "Stripe",
  "GraphQL",
  "Sanity",
  "Vercel",
  "Cloudflare",
  "OpenAI",
];

export interface ProcessStep {
  title: string;
  body: string;
}

export const processSteps: ProcessStep[] = [
  {
    title: "Discover",
    body: "We learn your business, audience and goals, then agree scope, timeline and a fixed quote before anything is built.",
  },
  {
    title: "Design",
    body: "Wireframes and high-fidelity designs for the key pages. You review and refine until it feels right.",
  },
  {
    title: "Build",
    body: "Clean, typed, tested code in short iterations, with a live preview link so you always see real progress.",
  },
  {
    title: "Launch",
    body: "Performance, accessibility and SEO checks, then go-live on your domain with analytics and monitoring in place.",
  },
  {
    title: "Support",
    body: "Handover documentation, a walkthrough, and optional ongoing care for updates, fixes and new features.",
  },
];

export const principles = [
  {
    title: "Performance is a feature",
    body: "Every build is held to a performance budget and checked against Core Web Vitals before it ships.",
  },
  {
    title: "Design and code, one team",
    body: "No hand-off gap. The person designing the interface understands exactly what it takes to build it well.",
  },
  {
    title: "Direct communication",
    body: "You talk to the people building your project. Clear updates, honest timelines, no jargon walls.",
  },
  {
    title: "You own everything",
    body: "Your code, your accounts, your content. Clean handover, documentation and no lock-in.",
  },
];
