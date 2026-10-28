/**
 * The service pages (/services/<slug>): one page per thing people search for, so each can rank on its own. The copy
 * uses only what the site already states about genaitex (see lib/services.ts): no invented numbers, clients, awards,
 * timelines or guarantees. Prices are the studio's "from" prices; anything else is "confirmed in your quote".
 *
 * To add a page: add an entry here (and link it from `related` of its neighbours). It is generated at build time,
 * listed in the sitemap, the footer and the services hub, and given its Service, FAQ and Breadcrumb data.
 */
export interface Faq {
  q: string;
  a: string;
}

export interface SeoPage {
  /** URL: /services/<slug> */
  slug: string;
  /** The entry in lib/services.ts this page belongs to (its includes, stack and contact type are reused). */
  service: string;
  /** Rows of `websitePricing` shown on this page, as starting prices. */
  tierIds?: string[];
  /** `/contact?type=<this>` for the page's buttons. */
  contactType: string;
  /** `/contact?...&plan=<this>` when the page's offer is a package. */
  plan?: string;
  /** Short name: link text, breadcrumb and structured data. */
  name: string;
  /** Search title (the site adds " · genaitex"); about 50 characters at most. */
  title: string;
  /** Meta description, 120-155 characters. */
  description: string;
  eyebrow: string;
  /** The page's one H1. It carries the main search phrase. */
  h1: string;
  /** The phrase the page is about (checked by the SEO test to appear in the title, H1 and first paragraph). */
  focus: string;
  intro: string[];
  points: { title: string; body: string }[];
  steps: { title: string; body: string }[];
  forWho: string[];
  faqs: Faq[];
  related: string[];
  /** ISO date of the last meaningful edit (shown in the sitemap). */
  updated: string;
}

const updated = "2026-10-28";

export const seoPages: SeoPage[] = [
  {
    slug: "static-website-design",
    service: "websites-applications",
    tierIds: ["static"],
    contactType: "web",
    plan: "static",
    name: "Static website design",
    title: "Static Website Design from ₹2,000",
    description:
      "Fast, search-ready static websites for businesses in India: marketing sites, landing pages and portfolios, custom designed and built from ₹2,000.",
    eyebrow: "Websites & Applications",
    h1: "Static website design for businesses in India",
    focus: "static website design",
    intro: [
      "A static website is built before anyone visits it, so every page is served almost instantly from the edge instead of being assembled on a server for each visitor. For a company website, a landing page or a portfolio, that means pages that load quickly on any phone and connection, very little that can break, and simple, low-cost hosting.",
      "genaitex designs and builds static websites from ₹2,000. Each one is custom designed for your brand rather than dropped into a template or a page-builder, responsive on phone, tablet and desktop, and set up for search engines with clean markup, page titles, descriptions and a sitemap. We also set up your domain, hosting, analytics and deployment, so you launch with everything in place.",
      "Prices are starting points. The final amount depends on how many pages you need and what each page has to do, and it is confirmed in your quote before any work begins.",
    ],
    points: [
      { title: "Custom design", body: "Your brand and your layout: no templates and no page-builder bloat." },
      { title: "Fast by construction", body: "Pre-rendered pages served from the edge, checked against Core Web Vitals before launch." },
      { title: "Ready for search", body: "Clean structure, titles, descriptions and a sitemap, so search engines can read your site." },
      { title: "Works on every screen", body: "Designed and tested for phone, tablet and desktop." },
      { title: "Launch included", body: "Your domain, hosting, analytics and deployment are set up for you." },
      { title: "Yours to keep", body: "A walkthrough and documentation, with your code, accounts and content staying yours." },
    ],
    steps: [
      { title: "Share your goals", body: "Tell us what the site must do, who it is for and what you already have. We agree the pages and a quote." },
      { title: "Design the pages", body: "You see designs for the key pages and refine them until they feel right." },
      { title: "Build and preview", body: "We build it in short steps with a live preview link, so you always see real progress." },
      { title: "Launch and hand over", body: "Performance, accessibility and search checks, go-live on your domain, then a walkthrough." },
    ],
    forWho: [
      "Local businesses and professional services that need a clear, credible website",
      "Campaign and product-launch landing pages",
      "Portfolios for designers, photographers, consultants and agencies",
      "Teams replacing a slow or outdated site",
    ],
    faqs: [
      {
        q: "What is a static website?",
        a: "A static website is made of pages that are built ahead of time and served as ready files, rather than generated by a server for every visit. This makes them fast, reliable and inexpensive to host. They suit company sites, landing pages, portfolios and content that does not change every minute.",
      },
      {
        q: "How much does a static website cost in India?",
        a: "genaitex static websites start from ₹2,000 (about $25). The final price depends on the number of pages and what each page needs, and it is confirmed in your quote before work starts.",
      },
      {
        q: "Is a static website good for SEO?",
        a: "Search engines read static pages easily because the content is in the page itself, and fast loading supports good Core Web Vitals. Rankings also depend on your content, links and competition, so nobody honest can promise a position. We build the site so that nothing technical holds it back.",
      },
      {
        q: "Can I edit the content myself?",
        a: "Static sites are normally updated by changing the content and publishing again, which we can do for you. If you want to edit text yourself, tell us and we will suggest a content tool that fits, such as Sanity.",
      },
      {
        q: "Should I choose a static website or an online store?",
        a: "If you mainly want to present your business and collect enquiries, a static website is simpler and costs less. If you want to sell products online with a cart and checkout, you need an online store: see our ecommerce website development page.",
      },
      {
        q: "What do I need to provide?",
        a: "Your logo, text and images if you have them. If you do not, we help you shape the content so the site says what you want it to say.",
      },
    ],
    related: ["ecommerce-website-development", "custom-ui-design", "marketing"],
    updated,
  },
  {
    slug: "ecommerce-website-development",
    service: "websites-applications",
    tierIds: ["ecom-5", "ecom-10"],
    contactType: "web",
    plan: "ecom-5",
    name: "Ecommerce website development",
    title: "Ecommerce Website Development in India",
    description:
      "Custom Shopify and fully custom online stores for Indian businesses: 5-page stores from ₹10,000 and 10-page stores from ₹20,000, built to convert.",
    eyebrow: "Websites & Applications",
    h1: "Ecommerce website development for Indian businesses",
    focus: "ecommerce website development",
    intro: [
      "An online store has one job: turn visitors into orders. That depends on clear product pages, a fast and simple cart and checkout, and a site that works well on the phones most shoppers use. genaitex builds custom ecommerce websites either on Shopify, as a tightly customised theme or a headless storefront, or as a fully custom storefront when your needs go beyond what a platform offers.",
      "Our custom ecommerce websites start from ₹10,000 for a 5-page store and ₹20,000 for a 10-page store. Product pages, cart, checkout extensions and payment integrations are part of the build, and we set up your domain, hosting and analytics so you launch ready to sell.",
      "Prices are starting points. The pages, the products and the payment provider you need shape the final amount, and your quote lists exactly what is included.",
    ],
    points: [
      { title: "Shopify or fully custom", body: "A customised Shopify theme, a headless Shopify storefront, or a fully custom store, whichever fits your products." },
      { title: "Product pages that sell", body: "Clear layouts, fast images and the details shoppers look for before they buy." },
      { title: "Cart, checkout and payments", body: "A simple path to purchase, with checkout extensions and payment integrations." },
      { title: "Fast on mobile", body: "Built for phones first and checked against Core Web Vitals before launch." },
      { title: "Ready to launch", body: "Domain, hosting and analytics set up, so you can see how the store performs from day one." },
      { title: "No lock-in", body: "Your code, your store accounts and your content stay yours, with documentation and a walkthrough." },
    ],
    steps: [
      { title: "Scope the store", body: "We learn what you sell and how, then agree the pages, platform and a quote." },
      { title: "Design the shopping journey", body: "Home, collection, product and checkout-related pages, designed and reviewed with you." },
      { title: "Build and connect", body: "We build the store, add payments and integrations, and share a live preview as it takes shape." },
      { title: "Test and launch", body: "Speed, accessibility and search checks, then go-live and handover." },
    ],
    forWho: [
      "Brands launching their first online store",
      "Businesses moving from social media or marketplaces to their own store",
      "Stores on a slow or hard-to-change theme that want a faster custom build",
      "Merchants who need Shopify features plus a custom experience",
    ],
    faqs: [
      {
        q: "How much does ecommerce website development cost in India?",
        a: "Our custom ecommerce websites start from ₹10,000 (about $120) for a 5-page store and ₹20,000 (about $235) for a 10-page store. The final price depends on what the store needs and is confirmed in your quote.",
      },
      {
        q: "Should I choose Shopify or a fully custom store?",
        a: "Shopify is a strong choice when you want reliable checkout, inventory and apps without managing servers, and we can customise it deeply. A fully custom store makes sense when you need behaviour or integrations a platform cannot offer. We recommend the simpler option that meets your needs.",
      },
      {
        q: "What is included in the 5-page and 10-page prices?",
        a: "The number refers to the pages designed and built for the store. Your quote lists exactly which pages are included, so you know what you are getting before you commit.",
      },
      {
        q: "Can you connect payments to my store?",
        a: "Yes. Payment integrations are part of the build. We confirm which payment provider fits your business and market when we scope the store.",
      },
      {
        q: "Will my online store be fast?",
        a: "Speed is part of how we build. Each store is checked against Core Web Vitals before it goes live, and we use fast image handling and lean code so product pages load quickly on phones.",
      },
      {
        q: "Who owns the store after launch?",
        a: "You do. Your code, your store accounts and your content stay yours, and we give you documentation and a walkthrough so you are never locked in.",
      },
    ],
    related: ["static-website-design", "ai-product-ads", "marketing"],
    updated,
  },
  {
    slug: "web-app-development",
    service: "websites-applications",
    tierIds: ["app"],
    contactType: "web",
    plan: "app",
    name: "Web app development",
    title: "Web App & Dashboard Development",
    description:
      "Custom web applications, dashboards and customer portals built around how your team works, from first version to production. Quoted per project.",
    eyebrow: "Websites & Applications",
    h1: "Web app and dashboard development",
    focus: "web app development",
    intro: [
      "Some businesses outgrow spreadsheets, inboxes and off-the-shelf tools. A custom web application puts your process into software that fits it: a dashboard your team opens every morning, a portal where customers manage their own account, or an internal tool that replaces a tangle of manual steps.",
      "genaitex designs and builds web apps, dashboards and customer portals from a first working version to production. We build with modern, typed and tested code (Next.js, Node.js and PostgreSQL among others), share a live preview link from the first week, and shape the product around how your team actually works.",
      "Web apps are quoted per project because the scope varies so much. Tell us what you need and we reply with a clear quote.",
    ],
    points: [
      { title: "Built around your process", body: "We start from how your team works, then design the software to match." },
      { title: "From MVP to production", body: "Begin with a focused first version, then grow it as the real needs become clear." },
      { title: "Dashboards and portals", body: "Reporting views for your team and self-service portals for your customers." },
      { title: "Clean, tested code", body: "Typed, tested code in short iterations, with a live preview so you see real progress." },
      { title: "Connected to your tools", body: "APIs and webhooks link the app to your store, CRM, email, payments and spreadsheets." },
      { title: "You own it", body: "Your code, your accounts and your data, with documentation and a walkthrough." },
    ],
    steps: [
      { title: "Understand the work", body: "We map how the work happens today and where software would help most." },
      { title: "Design the screens", body: "Wireframes and designs for the key screens, reviewed with you before building." },
      { title: "Build in short steps", body: "Working software every step of the way, with a live preview link." },
      { title: "Launch and support", body: "Checks, go-live, handover and optional ongoing care for fixes and new features." },
    ],
    forWho: [
      "Teams running their operations on spreadsheets and messages",
      "Businesses that want customers to manage orders or accounts online",
      "Founders building a first version of a software product",
      "Companies that need a dashboard over data from several tools",
    ],
    faqs: [
      {
        q: "What is a web app, and how is it different from a website?",
        a: "A website mainly presents information. A web app lets people do things: sign in, manage records, place requests, see their own data. It runs in the browser, so there is nothing to install.",
      },
      {
        q: "How much does a web app cost?",
        a: "Web apps and dashboards are quoted per project, because the scope changes the effort so much. Tell us what you need and we reply with a quote.",
      },
      {
        q: "Can we start with a small first version?",
        a: "Yes, and we are happy to start there. A focused first version gets real feedback quickly, and the product then grows around what your team and customers actually use.",
      },
      {
        q: "What do you need from us to give a quote?",
        a: "A short description of the problem, who will use the app, any tools it must connect to, and examples of how the work is done today. Screenshots of current spreadsheets or tools help a lot.",
      },
      {
        q: "Can the app connect to our existing tools?",
        a: "Yes. We connect apps to the tools you already use through APIs and webhooks, such as your store, CRM, email, payments and spreadsheets.",
      },
      {
        q: "Who owns the code?",
        a: "You do. Your code, accounts and data are yours, and we hand over documentation and a walkthrough so you are never locked in.",
      },
    ],
    related: ["ai-automation-integrations", "custom-ui-design", "crm-setup"],
    updated,
  },
  {
    slug: "ai-automation-integrations",
    service: "ai-automation-integrations",
    contactType: "ai",
    name: "AI automation and integrations",
    title: "AI Automation & Integrations for Business",
    description:
      "AI assistants grounded in your own content, document search and workflow automation that connect your store, CRM, email and payments, with human review.",
    eyebrow: "AI, automation & integrations",
    h1: "AI automation and integrations for your business",
    focus: "AI automation",
    intro: [
      "AI earns its place when it removes work your team repeats every day: answering the same questions, searching through documents, copying data between tools. genaitex adds AI where it helps and keeps a person in the loop where answers matter.",
      "We build assistants that answer from your own content and data, search that understands questions rather than just keywords, and automation and integrations that connect the tools you already use. Guardrails such as usage limits and logging are built in from the start, with sensible handling of your data.",
      "Because every business has different tools and processes, AI and automation projects are quoted per project. Describe the task you want to take off your team and we reply with a plan and a quote.",
    ],
    points: [
      { title: "Assistants that use your content", body: "AI chat and answers grounded in your own documents and data, not generic guesses." },
      { title: "Search that understands questions", body: "Find the right answer in documents and knowledge bases quickly." },
      { title: "Workflow automation", body: "Remove manual steps between the tools your team already uses." },
      { title: "Integrations", body: "Your store, CRM, email, payments and spreadsheets connected through APIs and webhooks." },
      { title: "A person in the loop", body: "Human hand-off and review for the answers and actions that matter." },
      { title: "Guardrails", body: "Usage limits, logging and sensible data handling from the start." },
    ],
    steps: [
      { title: "Pick the right task", body: "We find the repetitive work where automation or AI will help most, and where it should not be used." },
      { title: "Design the flow", body: "We map the steps, the data it needs and where a person reviews the result." },
      { title: "Build and test", body: "We build it, test it on real examples and add limits and logging." },
      { title: "Launch and improve", body: "Go-live, a walkthrough for your team, and adjustments as you see how it performs." },
    ],
    forWho: [
      "Businesses with repetitive work that eats team time",
      "Teams with lots of documents and policies people keep asking about",
      "Support teams that answer the same questions every day",
      "Companies whose tools do not talk to each other",
    ],
    faqs: [
      {
        q: "What is AI automation?",
        a: "AI automation means using AI together with ordinary software automation to handle repetitive tasks: sorting enquiries, drafting replies, finding answers in documents, or moving data between tools. A person stays in control of what matters.",
      },
      {
        q: "Will an AI assistant give wrong answers?",
        a: "Any AI can be wrong. We reduce the risk by grounding the assistant in your own content, adding human hand-off and review for important answers, and testing it on real questions. We are upfront about what it can and cannot do.",
      },
      {
        q: "Is my business data safe?",
        a: "We build with sensible data handling, usage limits and logging, and we discuss what data an assistant will see before building. We agree these details with you in the quote.",
      },
      {
        q: "Which tools can you connect?",
        a: "Most tools that offer an API or webhooks: your online store, CRM, email, payments and spreadsheets are common examples. Tell us what you use and we confirm what can be connected.",
      },
      {
        q: "How much does AI and automation cost?",
        a: "These projects are quoted per project because the scope varies widely. Describe the task and the tools involved, and we reply with a plan and a quote.",
      },
      {
        q: "Do we need technical staff to use it?",
        a: "No. We give your team a walkthrough, and the result is built to be used by the people who do the work.",
      },
    ],
    related: ["crm-setup", "web-app-development", "marketing"],
    updated,
  },
  {
    slug: "custom-ui-design",
    service: "custom-ui-design",
    contactType: "design",
    name: "Custom UI design",
    title: "Custom UI Design for Websites & Apps",
    description:
      "Clear, distinctive interfaces for websites, web apps and dashboards: wireframes, responsive designs, a design system and clickable prototypes.",
    eyebrow: "Custom UI designs",
    h1: "Custom UI design for websites and apps",
    focus: "UI design",
    intro: [
      "Good interface design is where a product starts to feel premium and easy to use. People decide within moments whether a website or app feels trustworthy and clear, and a consistent, well-considered interface is a large part of that.",
      "genaitex designs interfaces for websites, web apps and dashboards: layouts, components, states and a visual language that stays consistent from the first screen to the last. You review clickable prototypes before anything is built, so you see and refine the product first.",
      "The designs are ready for developers to build, or we build them for you. UI design projects are quoted per project; tell us what you are making and we reply with a quote.",
    ],
    points: [
      { title: "Research and wireframes", body: "Goals, audience and competitor review first, then the structure of each screen." },
      { title: "High-fidelity screens", body: "Polished, responsive designs for phone, tablet and desktop." },
      { title: "A design system", body: "Colours, type, components and states that stay consistent as the product grows." },
      { title: "Clickable prototypes", body: "Click through the product and refine it before any code is written." },
      { title: "Accessible by design", body: "Contrast, focus states and readable type considered from the start." },
      { title: "Developer-ready handoff", body: "Designs prepared for building, or we build them for you." },
    ],
    steps: [
      { title: "Understand your users", body: "We review your goals, audience and competitors to shape the design." },
      { title: "Wireframe the structure", body: "Low-fidelity layouts to agree the flow before the visual design." },
      { title: "Design and prototype", body: "High-fidelity screens and a clickable prototype for you to review." },
      { title: "Hand off or build", body: "A design system and developer-ready files, or we build it for you." },
    ],
    forWho: [
      "Founders who need a standout interface before building",
      "Teams with a tired product that deserves a redesign",
      "Businesses planning a new website or web app",
      "Developers who want a design they can build from",
    ],
    faqs: [
      {
        q: "What is UI design?",
        a: "UI (user interface) design is how a product looks and how its parts are laid out: screens, buttons, forms, colours and type. It works together with UX (the overall experience), and we consider both while designing.",
      },
      {
        q: "What will I receive?",
        a: "Wireframes, high-fidelity designs for the key screens, a design system (colours, type, components and states), and a clickable prototype, prepared so a developer can build from them.",
      },
      {
        q: "Do you design for mobile as well as desktop?",
        a: "Yes. Designs are responsive and cover phone, tablet and desktop.",
      },
      {
        q: "Can you build what you design?",
        a: "Yes. You can take the designs to your own developers, or genaitex can build the website or app from them.",
      },
      {
        q: "How do revisions work?",
        a: "You review the designs and prototype and we refine them until they feel right. We confirm the scope of the design work in the quote.",
      },
      {
        q: "How much does UI design cost?",
        a: "UI design is quoted per project, based on the number of screens and the depth of the design system. Tell us what you are making and we reply with a quote.",
      },
    ],
    related: ["static-website-design", "web-app-development", "ready-made-ui-websites"],
    updated,
  },
  {
    slug: "crm-setup",
    service: "crm-setup",
    contactType: "crm",
    name: "CRM setup",
    title: "CRM Setup for Small Businesses in India",
    description:
      "CRM setup around how you sell: the right tool, pipelines, website lead capture, follow-up automation, reports and training. HubSpot, Zoho CRM or Pipedrive.",
    eyebrow: "CRM setup",
    h1: "CRM setup for small and growing businesses",
    focus: "CRM setup",
    intro: [
      "A CRM (customer relationship management) system only helps if it matches how your team really sells. Many small businesses keep leads in inboxes, chat threads and spreadsheets, so follow-ups are missed and nobody can see what is happening. A well-set-up CRM puts every lead, conversation and next step in one place.",
      "genaitex chooses and sets up the right CRM with you, for example HubSpot, Zoho CRM or Pipedrive. We build your pipeline, fields and user roles around your sales process, connect your website forms so leads arrive automatically, set up follow-up emails and tasks, import and tidy your existing contacts, and train your team.",
      "CRM setups are quoted per project because teams differ. Tell us how you sell today and we reply with a plan and a quote.",
    ],
    points: [
      { title: "The right CRM for you", body: "We help you choose a tool that suits your team and budget." },
      { title: "Pipelines built for how you sell", body: "Stages, fields and user roles shaped around your process." },
      { title: "Website lead capture", body: "Your website forms connected straight into the CRM." },
      { title: "Follow-up automation", body: "Emails and tasks that remind and reach out for you." },
      { title: "Contacts imported and tidied", body: "Your existing contacts brought in cleanly." },
      { title: "Reports and training", body: "Dashboards you will read, plus a walkthrough for your team." },
    ],
    steps: [
      { title: "Map how you sell", body: "We learn your sales steps, your team and where leads come from." },
      { title: "Choose and configure", body: "We pick the tool and set up the pipeline, fields and roles." },
      { title: "Connect and automate", body: "Website forms, email and follow-up tasks are connected and tested." },
      { title: "Import and train", body: "We bring in your contacts and walk your team through it." },
    ],
    forWho: [
      "Small teams whose leads live in inboxes and spreadsheets",
      "Businesses whose enquiries come from a website, ads and messages",
      "Sales teams that need a clear view of their pipeline",
      "Companies moving from one CRM to another",
    ],
    faqs: [
      {
        q: "What is a CRM?",
        a: "A CRM is software that keeps your leads, customers, conversations and follow-ups in one place, so your team always knows who to contact next and what has already been said.",
      },
      {
        q: "Which CRM should my business use?",
        a: "It depends on your team size, budget and how you sell. We work with tools such as HubSpot, Zoho CRM and Pipedrive, and we help you choose the one that fits rather than the one that is most popular.",
      },
      {
        q: "Can my website forms feed into the CRM?",
        a: "Yes. We connect your website forms and other lead sources, so new enquiries appear in the CRM automatically.",
      },
      {
        q: "Can you import my existing contacts?",
        a: "Yes. We import and tidy your existing contacts so you start with clean data.",
      },
      {
        q: "Will you train my team?",
        a: "Yes. A walkthrough for your team is part of the setup, so people know how to use it from the first day.",
      },
      {
        q: "How much does CRM setup cost?",
        a: "CRM setup is quoted per project, based on your team, your process and the tools involved. Tell us how you sell today and we reply with a quote.",
      },
    ],
    related: ["ai-automation-integrations", "marketing", "web-app-development"],
    updated,
  },
  {
    slug: "ai-product-ads",
    service: "ai-product-ads",
    contactType: "ads",
    name: "AI product advertisements",
    title: "AI Product Ads & Images for Ecommerce",
    description:
      "Product visuals, lifestyle scenes and short video ads made with AI from your real product photos and reviewed by a person, in the sizes your channels need.",
    eyebrow: "AI product advertisements",
    h1: "AI product ads and images for ecommerce brands",
    focus: "AI product ads",
    intro: [
      "Online brands need fresh creative all the time: product pictures, lifestyle scenes and short videos for the store, social media and ads. A studio shoot for every idea is slow and expensive. AI makes it practical to try more ideas, as long as the product still looks like the real product.",
      "genaitex creates product visuals, lifestyle scenes, short video ads and creative variations with AI, starting from your real product photos so the product is shown accurately. A person reviews every asset for quality and brand fit before it reaches you, and we deliver the sizes and formats your ad channels and product pages need.",
      "Projects are quoted per project, depending on how many products and assets you need. Share your products and your goals and we reply with a quote.",
    ],
    points: [
      { title: "Product images and scenes", body: "Your products shown in your brand's look and in lifestyle settings." },
      { title: "Short video ads", body: "Videos for social media, ads and your store." },
      { title: "Creative variations", body: "Several versions to test against each other." },
      { title: "Right sizes and formats", body: "Delivered for your ad channels and product pages." },
      { title: "Accurate to your product", body: "Built from your real product photos, so the product is shown as it is." },
      { title: "Reviewed by a person", body: "Every asset checked for quality and brand fit before delivery." },
    ],
    steps: [
      { title: "Share your products", body: "Send your product photos and tell us your brand, channels and goals." },
      { title: "Plan the creative", body: "We agree the scenes, formats and variations to produce." },
      { title: "Create and review", body: "We generate the assets and a person reviews each one." },
      { title: "Deliver and iterate", body: "You receive ready-to-use files, and we adjust based on what performs." },
    ],
    forWho: [
      "Ecommerce and product brands that need fresh creative often",
      "Stores that want more ad variations to test",
      "Brands that want lifestyle images without a new shoot every time",
      "Small teams on a practical creative budget",
    ],
    faqs: [
      {
        q: "Will the product in the images look accurate?",
        a: "We start from your real product photos, so the product is shown as it is, and a person reviews every asset for accuracy, quality and brand fit before delivery.",
      },
      {
        q: "Can AI product ads replace a photoshoot?",
        a: "For many ideas, such as new scenes, variations and short videos, AI creative can reduce the need for a fresh shoot. Some products and campaigns are still best served by real photography, and we will tell you honestly which is which.",
      },
      {
        q: "What formats do you deliver?",
        a: "We prepare the sizes and formats your ad channels and product pages need, for example for social media, your online store and paid ads.",
      },
      {
        q: "Do you make videos too?",
        a: "Yes. Short video ads for social media and your store are part of the service.",
      },
      {
        q: "Can I test different versions?",
        a: "Yes. Creative variations are part of the service, so you can test several versions and learn what works for your audience.",
      },
      {
        q: "How much does it cost?",
        a: "AI product ads are quoted per project, based on the number of products and assets. Share your products and goals and we reply with a quote.",
      },
    ],
    related: ["ecommerce-website-development", "marketing", "custom-ui-design"],
    updated,
  },
  {
    slug: "marketing",
    service: "marketing",
    contactType: "marketing",
    name: "Digital marketing",
    title: "Digital Marketing & SEO Services in India",
    description:
      "SEO, content, social, email and paid ads planned around your goals and tracked so you see what works. No promised rankings, just steady work and clear reports.",
    eyebrow: "Marketing",
    h1: "Digital marketing and SEO services in India",
    focus: "digital marketing",
    intro: [
      "A great website needs visitors who are ready to act. Marketing is how the right people find it: search visibility, useful content, social media, email and paid ads, planned around your goals and your budget and measured so you can see what is working.",
      "genaitex plans and runs marketing around the website we build or the one you already have. That includes SEO (technical fixes, on-page work and content), social media content and posting, email campaigns and automations, and paid ads on search and social with conversion tracking, followed by a clear report on what is working.",
      "We are straight about what is realistic. We never promise rankings or specific results, because no one honest can. Marketing is quoted per project; tell us your goals and we reply with a plan and a quote.",
    ],
    points: [
      { title: "A plan built on your goals", body: "Your audience, your budget and the channels worth your time." },
      { title: "SEO", body: "Technical fixes, on-page work and content that help search engines and people find you." },
      { title: "Social media", body: "Content and posting that fit your brand." },
      { title: "Email", body: "Campaigns and automations that stay in touch with customers." },
      { title: "Paid ads", body: "Search and social campaigns with conversion tracking." },
      { title: "Clear reporting", body: "Analytics and a plain report on what is working and what to change." },
    ],
    steps: [
      { title: "Set the goals", body: "We agree what success means for you and what you can invest." },
      { title: "Fix the foundations", body: "Technical and on-page SEO, analytics and conversion tracking come first." },
      { title: "Publish and promote", body: "Content, social, email and ads, run steadily and measured." },
      { title: "Report and refine", body: "Regular reports, and changes based on what the numbers show." },
    ],
    forWho: [
      "Businesses with a website or store that want steady enquiries and orders",
      "Companies about to launch a new site",
      "Brands that want clear reporting instead of vague promises",
      "Teams without in-house marketing time",
    ],
    faqs: [
      {
        q: "Do you guarantee rankings?",
        a: "No. Search rankings depend on many factors outside anyone's control, and any agency that guarantees a position is not being honest. We do the technical, on-page and content work well, track what happens, and report plainly.",
      },
      {
        q: "What does SEO include?",
        a: "Technical fixes so search engines can read your site, on-page work such as titles, headings and internal links, and content that answers what your customers search for.",
      },
      {
        q: "How long does SEO take?",
        a: "Search results usually take months to build, not days, and depend on your competition. We set expectations honestly when we plan the work.",
      },
      {
        q: "Which channels do you work on?",
        a: "Search (SEO), content, social media, email, and paid ads on search and social. We recommend the mix that fits your goals and budget rather than doing everything.",
      },
      {
        q: "How will I know what is working?",
        a: "We set up analytics and conversion tracking and send a clear report on what is working and what we will change.",
      },
      {
        q: "Do I need a new website first?",
        a: "Marketing works best on a fast, clear website. If yours holds results back, we can improve it or build a new one, and we tell you honestly if it is the first thing to fix.",
      },
    ],
    related: ["static-website-design", "ai-product-ads", "crm-setup"],
    updated,
  },
  {
    slug: "ready-made-ui-websites",
    service: "websites-applications",
    tierIds: ["ready"],
    contactType: "ready",
    plan: "ready",
    name: "Ready-made UI and websites",
    title: "Ready-made UI & Websites to Buy and Launch",
    description:
      "Finished UI designs and websites by genaitex that you can choose, have adapted to your brand and launch faster than a custom build. Browse and book.",
    eyebrow: "Ready-made UI & websites",
    h1: "Ready-made UI designs and websites, adapted to your brand",
    focus: "ready-made websites",
    intro: [
      "Not every project needs to start from a blank page. genaitex creates finished UI designs and websites in advance, and you can choose one that fits your business and launch faster than a fully custom build would allow.",
      "We adapt the design to your brand, so it looks like yours rather than a copy of someone else's. You get the polish of a designed and tested site without waiting for every page to be designed from scratch. If your needs grow beyond the ready-made design, it can become the starting point for a custom project.",
      "Tell us what your business does and what you need, and we point you to the designs that fit. Prices depend on the design and the changes you need, and your quote confirms what is included before you commit.",
    ],
    points: [
      { title: "Finished and designed", body: "Complete UI designs and websites, created by our team, ready to choose from." },
      { title: "Adapted to your brand", body: "Your name, colours, content and details brought into the design." },
      { title: "A faster start", body: "A quicker route to launch than a fully custom build." },
      { title: "Room to grow", body: "Extend it into a custom project later, with the same team." },
      { title: "Built to our standards", body: "Fast, accessible and search-ready, like everything we build." },
      { title: "Clear quote", body: "What is included, and the price, confirmed before you commit." },
    ],
    steps: [
      { title: "Tell us what you need", body: "Your business, your audience and the kind of site or interface you want." },
      { title: "Choose a design", body: "We point you to the ready-made designs that fit, and you pick one." },
      { title: "We adapt it", body: "Your brand, content and details are brought into the design." },
      { title: "Launch", body: "Checks, go-live on your domain and a walkthrough." },
    ],
    forWho: [
      "Businesses that want a professional site quickly",
      "Founders who want to launch while they validate an idea",
      "Teams on a tighter budget than a fully custom design",
      "Anyone who would rather pick a finished design than start from nothing",
    ],
    faqs: [
      {
        q: "What are ready-made UI designs and websites?",
        a: "They are finished designs and websites that genaitex creates in advance. You choose one that fits your business, and we adapt it to your brand and launch it.",
      },
      {
        q: "How is this different from a custom website?",
        a: "A custom website is designed from scratch around your brief. A ready-made design starts from a finished one, so it is a faster route to launch, with the changes you need made to it.",
      },
      {
        q: "Can the design be changed?",
        a: "Yes. We adapt it to your brand, and larger changes can grow into a custom project if you need them.",
      },
      {
        q: "How much does it cost?",
        a: "The price depends on the design and the changes you need. We confirm the price and exactly what is included in your quote before you commit.",
      },
      {
        q: "How do I choose a design?",
        a: "Contact us with what your business does and what you need, and we will point you to the designs that fit.",
      },
      {
        q: "Do I need to be technical?",
        a: "No. We handle the adaptation and launch, and give you a walkthrough when it is live.",
      },
    ],
    related: ["static-website-design", "custom-ui-design", "ecommerce-website-development"],
    updated,
  },
];

export const getSeoPage = (slug: string) => seoPages.find((p) => p.slug === slug);
