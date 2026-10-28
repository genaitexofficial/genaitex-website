import type { PriceTier } from "./pricing";

export type ServiceIcon = "globe" | "bot" | "palette" | "users" | "sparkles" | "megaphone";

/** Values of `/contact?type=…`; each preselects that service in the inquiry form. */
export type ContactType = "web" | "ai" | "design" | "crm" | "ads" | "marketing";

export interface Service {
  slug: string;
  /** Call-to-action wording, e.g. "Start a website or app". */
  startLabel: string;
  contactType: ContactType;
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
  /** Priced options (rupees; shown in rupees or dollars). Services without any are quoted per project. */
  pricing?: PriceTier[];
  /**
   * Typical timeline, shown only when set. Left empty until it is a commitment you are happy to make
   * (scope-dependent estimates belong in the quote).
   */
  timeline?: string;
}

/**
 * Prices (rupees) are the studio's "from" prices; the final amount is confirmed in the quote. Everything else
 * below is descriptive copy: edit it freely, but keep it to what the studio actually delivers (no invented
 * numbers or guaranteed results).
 */
export const websitePricing: PriceTier[] = [
  { id: "static", label: "Static website", detail: "Marketing sites, landing pages and portfolios", inr: 2000 },
  { id: "ecom-5", label: "Custom Ecommerce website", detail: "5 pages", inr: 10000 },
  { id: "ecom-10", label: "Custom Ecommerce website", detail: "10 pages", inr: 20000 },
  { id: "app", label: "Web apps & dashboards", detail: "Built around how your team works" },
  {
    id: "ready",
    label: "Ready-made UI & websites",
    detail: "Finished designs and sites, adapted to your brand",
    priceLabel: "Browse & book",
    action: "Browse & book",
    type: "ready",
  },
];

export const services: Service[] = [
  {
    slug: "websites-applications",
    contactType: "web",
    startLabel: "Start a website or app",
    icon: "globe",
    title: "Websites & Applications",
    summary: "Fast static websites, custom ecommerce stores, web apps and ready-made UIs and websites, designed and built end to end.",
    pitch:
      "From a sharp marketing site to a custom online store or a full web application, we design and build it end to end: fast, accessible and easy for you to run. Ecommerce can be a tightly customised Shopify build or a fully custom storefront, and apps are built around how your team actually works. We also create ready-made UIs and websites that you can buy, adapt to your brand and launch.",
    idealFor:
      "Businesses, brands and teams that need a premium website, an online store that converts, or software that fits the way they work.",
    includes: [
      "Custom design for your brand: no page-builder bloat",
      "Ready-made UIs and websites: finished designs you can buy, have adapted to your brand and launch",
      "Static websites: pre-rendered, fast on any connection and SEO-ready",
      "Custom ecommerce on Shopify (themes or headless) or a fully custom storefront",
      "Product pages, cart, checkout extensions and payment integrations",
      "Web apps, dashboards and customer portals, from MVP to production",
      "Domain, hosting, analytics and deployment set up for you",
    ],
    stack: ["Next.js", "Shopify", "Hydrogen", "Tailwind CSS", "TypeScript", "Node.js", "PostgreSQL", "Stripe"],
    pricing: websitePricing,
  },
  {
    slug: "ai-automation-integrations",
    contactType: "ai",
    startLabel: "Start with AI & automation",
    icon: "bot",
    title: "AI, Automation & Integrations",
    summary: "AI assistants, smart search, workflow automation and integrations between the tools you already use.",
    pitch:
      "We add AI where it earns its keep: assistants that answer from your own content, search that understands questions, and automation and integrations that take repetitive manual work off your team, with a person kept in the loop where it matters.",
    idealFor: "Businesses with repetitive work, lots of documents, or support questions that keep coming back.",
    includes: [
      "AI assistants and chat grounded in your own content and data",
      "Document and knowledge-base search",
      "Workflow automation between the tools your team already uses",
      "API and webhook integrations: store, CRM, email, payments and spreadsheets",
      "Human hand-off and review for answers that matter",
      "Guardrails: usage limits, logging and sensible data handling",
    ],
    stack: ["LLM APIs", "TypeScript", "Node.js", "Vector search", "Webhooks", "REST & GraphQL"],
  },
  {
    slug: "custom-ui-design",
    contactType: "design",
    startLabel: "Start a design project",
    icon: "palette",
    title: "Custom UI Designs",
    summary: "Interfaces designed around your users and your brand: websites, web apps and dashboards.",
    pitch:
      "Good interface design is where a product starts to feel premium and easy to use. We design clear, distinctive interfaces for websites, web apps and dashboards: layouts, components, states and a visual language that stays consistent from the first screen to the last, ready to be built.",
    idealFor: "Founders and teams who need a standout interface before they build, or a tired product that deserves a redesign.",
    includes: [
      "Goals, audience and competitor review to shape the design",
      "Wireframes and high-fidelity designs for the key screens",
      "Responsive layouts for phone, tablet and desktop",
      "A design system: colours, type, components and states",
      "Clickable prototypes to review before anything is built",
      "Developer-ready handoff, or we build it for you",
    ],
    stack: ["Figma", "Design systems", "Prototyping", "Accessibility (WCAG)", "Tailwind CSS", "React"],
  },
  {
    slug: "crm-setup",
    contactType: "crm",
    startLabel: "Start a CRM setup",
    icon: "users",
    title: "CRM Setup",
    summary: "A CRM set up around how you sell: pipelines, forms, automation and reports.",
    pitch:
      "A CRM only helps if it matches how your team actually works. We choose and set up the right tool with you, build your pipeline and fields, connect your website forms and other tools, automate follow-ups, and train your team to use it.",
    idealFor: "Small and growing teams whose leads live in inboxes and spreadsheets.",
    includes: [
      "Choosing the right CRM for your team and budget",
      "Pipelines, stages, fields and user roles set up for how you sell",
      "Website forms and lead capture connected straight into the CRM",
      "Email and task automation for follow-ups",
      "Importing and tidying your existing contacts",
      "Dashboards and reports, plus a walkthrough for your team",
    ],
    stack: ["HubSpot", "Zoho CRM", "Pipedrive", "Webhooks", "Google Workspace"],
  },
  {
    slug: "ai-product-ads",
    contactType: "ads",
    startLabel: "Start an ad project",
    icon: "sparkles",
    title: "AI Product Advertisements",
    summary: "Product images, short videos and ad creatives made with AI, reviewed by a person and ready to run.",
    pitch:
      "Show your products in their best light without a studio shoot for every idea. We use AI to create product visuals, lifestyle scenes, short video ads and creative variations for your store and ad channels, starting from your real product photos so the product stays accurate, and a person reviews every asset for quality and brand fit before it reaches you.",
    idealFor: "Ecommerce and product brands that need fresh ad creative often, on a practical budget.",
    includes: [
      "Product images and lifestyle scenes in your brand's look",
      "Short video ads for social media and your store",
      "Several creative variations to test against each other",
      "Sizes and formats for your ad channels and product pages",
      "Built from your real product photos, so the product is shown accurately",
      "Every asset reviewed for quality and brand fit before delivery",
    ],
    stack: ["Image generation", "Video generation", "Retouching", "Social ad formats"],
  },
  {
    slug: "marketing",
    contactType: "marketing",
    startLabel: "Start with marketing",
    icon: "megaphone",
    title: "Marketing",
    summary: "Search, social, email and paid ads to bring the right people to your site.",
    pitch:
      "A great site needs visitors who are ready to act. We plan and run the marketing around it: search visibility, content, social media, email and paid campaigns, tracked so you can see what is working. We are straight about what is realistic and never promise rankings or results.",
    idealFor: "Businesses that have, or are about to launch, a website or store and want steady enquiries and orders.",
    includes: [
      "A marketing plan built around your goals, audience and budget",
      "SEO: technical fixes, on-page work and content",
      "Social media content and posting",
      "Email campaigns and automations",
      "Paid ads on search and social, with conversion tracking",
      "Analytics and a clear report on what is working",
    ],
    stack: ["SEO", "Google Analytics", "Search Console", "Meta Ads", "Google Ads", "Email marketing"],
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
