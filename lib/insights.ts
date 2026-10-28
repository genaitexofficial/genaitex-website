/**
 * Insights: plain-language articles that answer what the studio's buyers search for. Each links to the matching
 * service page. They use only what the site already states about genaitex (see lib/services.ts): no statistics,
 * client stories or guarantees are invented.
 *
 * Every article ships as a DRAFT. Drafts are shown while developing (`next dev`) and are left out of the production
 * site, sitemap, feed and navigation. To publish one, read it, edit anything that is not right, set `status` to
 * "published" and give it its real publication date. The Insights link appears in the navigation once one is live.
 * To preview the drafts in a production build, build with SHOW_DRAFT_INSIGHTS=1.
 */
export type Block =
  | { type: "h2"; text: string }
  | { type: "p"; text: string }
  | { type: "ul"; items: string[] }
  | { type: "ol"; items: string[] }
  | { type: "note"; text: string };

export interface Article {
  slug: string;
  title: string;
  /** Meta description, 120-155 characters. */
  description: string;
  category: string;
  status: "draft" | "published";
  /** ISO date; for a draft this is the date it was written. Set the real date when publishing. */
  published: string;
  updated?: string;
  /** Slugs of service pages (lib/seoPages.ts) to link to at the end. */
  related: string[];
  blocks: Block[];
}

export const articles: Article[] = [
  {
    slug: "how-much-does-a-website-cost-in-india",
    title: "How much does a website cost in India?",
    description:
      "What decides the price of a website in India, the three common types of project, what a quote should include and how to get an accurate one.",
    category: "Websites",
    status: "draft",
    published: "2026-10-28",
    related: ["static-website-design", "ecommerce-website-development", "web-app-development"],
    blocks: [
      {
        type: "p",
        text: "Search for the cost of a website in India and you will find prices from a few thousand rupees to several lakhs. Both can be fair, because they describe very different things. This guide explains what drives the price, so you can ask for the right quote and compare quotes properly.",
      },
      { type: "h2", text: "What decides the price of a website" },
      {
        type: "ul",
        items: [
          "The number of pages and how different they are from each other",
          "Design: made for your brand from scratch, or adapted from a finished design",
          "Features such as forms, bookings, payments, accounts and search",
          "Integrations with tools such as a CRM, email or payments",
          "Content: whether you supply the text and images or need help creating them",
          "Support after launch: updates, fixes and new features",
        ],
      },
      { type: "h2", text: "Three common types of project" },
      {
        type: "p",
        text: "A static website is a set of pre-built pages that present your business: a company site, a landing page or a portfolio. At genaitex these start from ₹2,000.",
      },
      {
        type: "p",
        text: "An online store adds products, a cart and checkout, built on Shopify or as a fully custom storefront. Our 5-page stores start from ₹10,000 and our 10-page stores from ₹20,000.",
      },
      {
        type: "p",
        text: "A web application is software that your team or customers sign in to, such as a dashboard or a customer portal. These are quoted per project because the scope varies so much.",
      },
      { type: "h2", text: "What to check is included in a price" },
      {
        type: "ul",
        items: [
          "Design that works on phone, tablet and desktop",
          "Domain, hosting and analytics set up",
          "Speed, accessibility and search checks before launch",
          "Who owns the code, the accounts and the content",
          "What happens after launch: a handover, a walkthrough and optional ongoing care",
        ],
      },
      {
        type: "p",
        text: "Two quotes are only comparable when they include the same things. A lower price that leaves out hosting, speed checks or ownership of your own files may cost more later.",
      },
      { type: "h2", text: "Ready-made or custom?" },
      {
        type: "p",
        text: "If you need to launch quickly on a smaller budget, starting from a finished design can reduce both time and cost. A fully custom design costs more but is shaped entirely around your brief. Our guide on choosing between a ready-made website and a custom build goes through how to decide.",
      },
      { type: "h2", text: "How to get an accurate quote" },
      {
        type: "ol",
        items: [
          "Write down what the site must achieve: more enquiries, online orders, a clearer brand.",
          "List the pages or screens you expect.",
          "Note any tools it must connect to.",
          "Collect a few examples of sites you like.",
          "Share it all and ask exactly what the price includes.",
        ],
      },
      {
        type: "note",
        text: "Prices on genaitex.com are starting points. The final amount is confirmed in your quote before any work begins.",
      },
    ],
  },
  {
    slug: "static-website-or-shopify-store",
    title: "Static website or Shopify store: which to choose?",
    description:
      "A plain guide to choosing between a static website and a Shopify or custom online store, with questions to ask yourself and when to start small.",
    category: "Websites",
    status: "draft",
    published: "2026-10-28",
    related: ["static-website-design", "ecommerce-website-development", "ready-made-ui-websites"],
    blocks: [
      {
        type: "p",
        text: "Both are websites, but they do different jobs. Choosing the wrong one means paying for features you do not use or missing the ones you need. This guide helps you decide.",
      },
      { type: "h2", text: "What a static website is good at" },
      {
        type: "p",
        text: "A static website presents your business. Its pages are built ahead of time and served very quickly, which makes it a strong fit for a company website, a landing page or a portfolio. It is simple to host, fast on phones and straightforward to keep running.",
      },
      { type: "h2", text: "What an online store adds" },
      {
        type: "p",
        text: "An online store lets people buy. That means products, a cart, checkout, payments, orders and usually stock to manage. It can be built on Shopify, as a customised theme or a headless storefront, or as a fully custom storefront when your needs go beyond a platform.",
      },
      { type: "h2", text: "Choose a static website when" },
      {
        type: "ul",
        items: [
          "You mainly want to explain what you do and collect enquiries",
          "Customers contact you to buy, book or ask for a quote",
          "You want the lowest cost and the simplest setup",
          "You need a landing page for a campaign or launch",
        ],
      },
      { type: "h2", text: "Choose an online store when" },
      {
        type: "ul",
        items: [
          "Customers should be able to order and pay on the site",
          "You have a catalogue of products that changes",
          "You need to manage orders, and possibly stock, in one place",
        ],
      },
      { type: "h2", text: "Shopify or fully custom?" },
      {
        type: "p",
        text: "Shopify is a strong choice when you want dependable checkout and store management without running servers, and it can be customised deeply. A fully custom store makes sense when you need behaviour or integrations that a platform cannot give you. The simpler option that meets your needs is usually the right one.",
      },
      { type: "h2", text: "Can you start with a static website and add a store later?" },
      {
        type: "p",
        text: "Yes. Many businesses begin with a clear static website, then add a store once they know what they want to sell online. Planning the design with that in mind means the store can grow out of the site you already have.",
      },
      { type: "h2", text: "A quick way to decide" },
      {
        type: "ol",
        items: [
          "Do customers need to pay on the site? If yes, you need a store.",
          "How many products do you sell? A handful may be better presented on a static page with an enquiry button; a growing catalogue needs a store.",
          "How much will you update it yourself? Tell us, and we recommend a setup that fits.",
        ],
      },
      {
        type: "note",
        text: "Static websites at genaitex start from ₹2,000, and custom stores from ₹10,000 for 5 pages and ₹20,000 for 10 pages. Final prices are confirmed in your quote.",
      },
    ],
  },
  {
    slug: "what-ai-automation-can-and-cannot-do-for-a-small-business",
    title: "What AI automation can and cannot do",
    description:
      "Where AI genuinely saves a small team time, where it falls short, and how to start with one repetitive task while keeping a person in the loop.",
    category: "AI & automation",
    status: "draft",
    published: "2026-10-28",
    related: ["ai-automation-integrations", "crm-setup", "web-app-development"],
    blocks: [
      {
        type: "p",
        text: "AI gets a lot of attention, and it is easy to either expect too much or dismiss it. For a small business the useful question is narrower: which repetitive task would you gladly hand over, and can software do it well enough to trust?",
      },
      { type: "h2", text: "Where AI helps today" },
      {
        type: "ul",
        items: [
          "Answering common questions from your own documents, such as policies, price lists and guides",
          "Drafting replies to customer messages for a person to review and send",
          "Sorting and tagging incoming enquiries so the right person sees them first",
          "Searching through large collections of documents to find an answer fast",
          "Moving information between the tools you already use, without retyping it",
        ],
      },
      { type: "h2", text: "Where it falls short" },
      {
        type: "ul",
        items: [
          "It can be wrong, and it can sound confident when it is. Important answers need a person to check them.",
          "It only knows your business if it is given your content. Without that, it guesses.",
          "It does not replace judgement on sensitive, unusual or high-stakes cases.",
          "It is not free of effort: someone should watch how it performs and adjust it.",
        ],
      },
      { type: "h2", text: "Not every task needs AI" },
      {
        type: "p",
        text: "Many repetitive jobs only need ordinary automation: when a form is submitted, create a contact, send an email and add a task. That is cheaper, more predictable and easier to maintain than AI. A good partner tells you when plain automation is enough.",
      },
      { type: "h2", text: "How to start small" },
      {
        type: "ol",
        items: [
          "Pick one task that is repetitive, clear and low risk.",
          "Decide what a good result looks like, and who reviews it.",
          "Build it with limits and logging, so you can see what it does.",
          "Run it on real examples, adjust, and only then widen it.",
        ],
      },
      { type: "h2", text: "Questions to ask before you build anything" },
      {
        type: "ul",
        items: [
          "What data will it see, and where is that data handled?",
          "Who reviews the output, and how quickly?",
          "What happens when it is wrong?",
          "How do we switch it off or change it?",
        ],
      },
      {
        type: "note",
        text: "genaitex builds assistants grounded in your own content, with human hand-off and review for answers that matter, plus usage limits and logging. Projects are quoted per project.",
      },
    ],
  },
  {
    slug: "what-is-a-crm-and-when-does-a-small-team-need-one",
    title: "What is a CRM and when do you need one?",
    description:
      "What a CRM does, the signs a small team has outgrown inboxes and spreadsheets, what to set up first and the mistakes that make a CRM fail.",
    category: "CRM",
    status: "draft",
    published: "2026-10-28",
    related: ["crm-setup", "ai-automation-integrations", "marketing"],
    blocks: [
      {
        type: "p",
        text: "A CRM, short for customer relationship management, is software that keeps your leads, customers, conversations and follow-ups in one place. For a small team it answers a simple question: who do we need to contact next, and what has already been said?",
      },
      { type: "h2", text: "Signs you may need a CRM" },
      {
        type: "ul",
        items: [
          "Leads live in inboxes, chat threads and spreadsheets",
          "Follow-ups are forgotten because nothing reminds anyone",
          "You cannot easily see how many opportunities are open or where they stand",
          "Two people contact the same customer without knowing",
          "When someone leaves, their conversations leave with them",
        ],
      },
      { type: "h2", text: "What to set up first" },
      {
        type: "ol",
        items: [
          "A pipeline: the stages a lead goes through, from first enquiry to won or lost.",
          "The few fields you really use, such as source, value and next step.",
          "Your existing contacts, imported and tidied.",
          "Your website forms, connected so new enquiries arrive automatically.",
          "Reminders and follow-up emails for the steps people forget.",
        ],
      },
      { type: "h2", text: "Mistakes that make a CRM fail" },
      {
        type: "ul",
        items: [
          "Choosing a tool before mapping how you actually sell",
          "Adding so many fields that nobody fills them in",
          "Nobody owning it, so data goes stale",
          "No training, so the team quietly returns to spreadsheets",
        ],
      },
      { type: "h2", text: "Choosing a tool" },
      {
        type: "p",
        text: "HubSpot, Zoho CRM and Pipedrive are common choices, and each suits different teams and budgets. The best tool is the one your team will actually use, set up around your own process rather than the default.",
      },
      {
        type: "note",
        text: "genaitex chooses and sets up the right CRM with you: pipeline, fields, website lead capture, follow-up automation, imported contacts, reports and a walkthrough for your team. CRM setups are quoted per project.",
      },
    ],
  },
  {
    slug: "ready-made-website-or-custom-build",
    title: "Ready-made website or custom build: how to decide",
    description:
      "When a finished, adapted website design is the smart choice, when a custom build is worth it, and how to start with one and grow into the other.",
    category: "Websites",
    status: "draft",
    published: "2026-10-28",
    related: ["ready-made-ui-websites", "custom-ui-design", "static-website-design"],
    blocks: [
      {
        type: "p",
        text: "There are two ways to get a professional website: start from a finished design, or have one made from scratch around your brief. Neither is better in general. The right choice depends on your time, your budget and how distinctive the site needs to be.",
      },
      { type: "h2", text: "What each one means" },
      {
        type: "p",
        text: "A ready-made website starts from a design that already exists. It is adapted to your brand, with your name, colours, content and details. A custom build is designed and built from a blank page for you alone.",
      },
      { type: "h2", text: "Choose ready-made when" },
      {
        type: "ul",
        items: [
          "You want to launch quickly",
          "Your budget is tighter than a fully custom project needs",
          "Your needs are fairly standard: present the business, show services, collect enquiries",
          "You want to launch now and learn what you need before investing in more",
        ],
      },
      { type: "h2", text: "Choose custom when" },
      {
        type: "ul",
        items: [
          "Your brand needs to stand out in a way a shared starting point cannot give",
          "You need unusual features or integrations",
          "The site is central to how your business works, such as a store or a web app",
        ],
      },
      { type: "h2", text: "You can start with one and grow into the other" },
      {
        type: "p",
        text: "A ready-made design can be a launch pad. When your needs grow, the same team can extend it, or replace parts of it with custom work, so you are not starting again.",
      },
      { type: "h2", text: "Questions to ask either way" },
      {
        type: "ul",
        items: [
          "What exactly is included, and what is extra?",
          "How is my brand brought into the design?",
          "Who owns the files and the accounts afterwards?",
          "What does it cost to change or extend it later?",
        ],
      },
      {
        type: "note",
        text: "genaitex creates finished UI designs and websites that you can choose and have adapted to your brand, and also builds fully custom sites. Prices are confirmed in your quote before you commit.",
      },
    ],
  },
];

/** Drafts are visible while developing, or in a build made with SHOW_DRAFT_INSIGHTS=1; published articles always are. */
const showDrafts = process.env.NODE_ENV !== "production" || process.env.SHOW_DRAFT_INSIGHTS === "1";
export const isVisible = (a: Article) => a.status === "published" || showDrafts;

/** The articles to show, newest first. */
export const visibleArticles = () =>
  articles.filter(isVisible).sort((a, b) => (a.published < b.published ? 1 : a.published > b.published ? -1 : 0));

export const getArticle = (slug: string) => articles.find((a) => a.slug === slug && isVisible(a));

/** True once at least one article is published: the navigation link and the sitemap entries depend on it. */
export const hasLiveInsights = articles.some(isVisible);

export const readingMinutes = (a: Article) => {
  const words = a.blocks
    .map((b) => ("text" in b ? b.text : b.items.join(" ")))
    .join(" ")
    .split(/\s+/).length;
  return Math.max(1, Math.round(words / 200));
};
