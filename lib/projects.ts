export type Category = "static" | "shopify" | "custom";

export const categoryLabels: Record<Category, string> = {
  static: "Static Website",
  shopify: "Shopify",
  custom: "Custom Dev",
};

export type MockVariant = "storefront" | "landing" | "dashboard" | "app";
export type Accent = "violet" | "cyan" | "emerald" | "amber" | "rose" | "blue";

export interface Project {
  slug: string;
  title: string;
  /** Who the project is for */
  client: string;
  category: Category;
  tagline: string;
  summary: string;
  challenge: string;
  solution: string;
  stack: string[];
  /** What was built, described as capabilities, not invented results */
  highlights: string[];
  /** Live URL, if the project is public */
  url?: string;
  /**
   * TRUE while this is a concept/sample project. Shows a "Concept" label in the UI.
   * When you replace a sample with a real project: set this to false, add `url`,
   * and rewrite the copy with real details and results.
   */
  isSample: boolean;
  mock: MockVariant;
  accent: Accent;
  featured?: boolean;
}

export const projects: Project[] = [
  {
    slug: "lumen-skincare-storefront",
    title: "Lumen Skincare",
    client: "Direct-to-consumer skincare brand",
    category: "shopify",
    tagline: "A headless storefront with a product experience as polished as the packaging.",
    summary:
      "Headless Shopify storefront with a guided routine builder, quick-add cart and subscription options.",
    challenge:
      "The brand's theme-based store looked generic and slowed down on mobile, where most of its traffic arrives. Customers struggled to work out which products belonged together.",
    solution:
      "A headless storefront on the Storefront API with a lightweight routine builder that recommends a regimen, a persistent slide-out cart with one-tap add, and image delivery tuned for mobile connections.",
    stack: ["Shopify", "Hydrogen", "Storefront API", "Tailwind CSS", "Vercel"],
    highlights: [
      "Guided 'build your routine' flow with bundle pricing",
      "Slide-out cart with upsells and free-shipping progress",
      "Subscription and one-time purchase on a single product page",
      "Structured data for products and reviews",
    ],
    isSample: true,
    mock: "storefront",
    accent: "rose",
    featured: true,
  },
  {
    slug: "brewline-coffee-theme",
    title: "Brewline Coffee",
    client: "Specialty coffee roaster",
    category: "shopify",
    tagline: "A custom Liquid theme built around subscriptions and repeat orders.",
    summary:
      "Custom Liquid theme with subscribe-and-save, a grind selector and a loyalty-ready account area.",
    challenge:
      "Most revenue should come from repeat subscribers, but the stock theme buried the subscription option and made switching grind or cadence a support ticket.",
    solution:
      "A bespoke Shopify theme with subscription-first product pages, a grind and roast selector, and a customer account area where people manage deliveries themselves.",
    stack: ["Shopify", "Liquid", "JavaScript", "Subscriptions API", "Theme sections"],
    highlights: [
      "Subscription-first product page with clear savings",
      "Grind, roast and bag-size selectors with live availability",
      "Merchant-editable sections for launches and seasonal drops",
      "Account area for pausing, skipping and swapping deliveries",
    ],
    isSample: true,
    mock: "storefront",
    accent: "amber",
  },
  {
    slug: "aerolite-architecture-studio",
    title: "Aerolite Studio",
    client: "Architecture and interiors practice",
    category: "static",
    tagline: "A portfolio that lets the photography do the talking.",
    summary:
      "Image-led portfolio site with smooth page transitions, project case studies and an enquiry flow.",
    challenge:
      "The studio's work is visual and detailed, but the old site was slow, cropped images badly and gave visitors no clear way to enquire.",
    solution:
      "A static, edge-delivered portfolio with responsive image sets, full-bleed case studies, subtle transitions and a short enquiry form that routes straight to the team.",
    stack: ["Next.js", "Tailwind CSS", "Sanity", "Vercel"],
    highlights: [
      "Responsive image pipeline with blur-up placeholders",
      "Case studies editable through a headless CMS",
      "Page transitions that respect reduced-motion settings",
      "Enquiry form with spam protection and email routing",
    ],
    isSample: true,
    mock: "landing",
    accent: "cyan",
    featured: true,
  },
  {
    slug: "pinecrest-dental-clinic",
    title: "Pinecrest Dental",
    client: "Local dental clinic",
    category: "static",
    tagline: "A fast local-business site built to turn searches into booked appointments.",
    summary:
      "Local-SEO focused clinic website with treatment pages, clear pricing guidance and online booking.",
    challenge:
      "Patients searched on their phones, found a slow brochure site and called a competitor. The clinic wanted more bookings without hiring front-desk staff.",
    solution:
      "A lean, mobile-first site with a page per treatment, structured local-business data, click-to-call and an embedded booking flow, all under a strict performance budget.",
    stack: ["Astro", "Tailwind CSS", "Cal.com", "Cloudflare Pages"],
    highlights: [
      "A dedicated, search-optimised page for every treatment",
      "LocalBusiness structured data and Google Business alignment",
      "Click-to-call and online booking above the fold on mobile",
      "Zero-JavaScript pages where interactivity is not needed",
    ],
    isSample: true,
    mock: "landing",
    accent: "emerald",
  },
  {
    slug: "stackpilot-analytics-dashboard",
    title: "Stackpilot",
    client: "B2B SaaS start-up",
    category: "custom",
    tagline: "An analytics dashboard that makes dense data feel simple.",
    summary:
      "Multi-tenant SaaS dashboard with role-based access, live charts, CSV export and Stripe billing.",
    challenge:
      "The founders had validated the idea in spreadsheets, but customers needed a real product: secure logins, shareable reports and billing that scales with usage.",
    solution:
      "A TypeScript full-stack application with row-level data isolation per customer, an interactive chart layer, scheduled report emails and usage-based billing through Stripe.",
    stack: ["Next.js", "TypeScript", "PostgreSQL", "Stripe", "Tailwind CSS"],
    highlights: [
      "Multi-tenant architecture with role-based permissions",
      "Interactive charts with saved views and CSV export",
      "Scheduled report emails and shareable read-only links",
      "Subscription and usage billing with Stripe webhooks",
    ],
    isSample: true,
    mock: "dashboard",
    accent: "violet",
    featured: true,
  },
  {
    slug: "relay-ai-support-assistant",
    title: "Relay Assistant",
    client: "E-commerce operations team",
    category: "custom",
    tagline: "An AI support assistant grounded in the store's own catalogue and policies.",
    summary:
      "Customer-support assistant that answers from product and policy data, with human handover.",
    challenge:
      "Repetitive questions about orders, sizing and returns consumed most of the support team's day, and generic chatbots gave confident but wrong answers.",
    solution:
      "A retrieval-based assistant that answers only from the store's catalogue, policies and order data, cites its sources, and hands conversations to a person when it is unsure.",
    stack: ["TypeScript", "Node.js", "LLM APIs", "Vector search", "Shopify Admin API"],
    highlights: [
      "Answers grounded in your catalogue and policy documents",
      "Order-status lookups through the Shopify Admin API",
      "Confidence thresholds with seamless human handover",
      "Conversation logs and review tools for the support team",
    ],
    isSample: true,
    mock: "app",
    accent: "blue",
  },
];

export function getProject(slug: string) {
  return projects.find((p) => p.slug === slug);
}

export function getNextProject(slug: string) {
  const i = projects.findIndex((p) => p.slug === slug);
  return projects[(i + 1) % projects.length];
}

export const featuredProjects = projects.filter((p) => p.featured);
