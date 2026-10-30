# genaitex SEO: what is built in, and what only you can do

SEO is slow and honest work. Nothing here guarantees a position in search results; new pages usually take weeks to be indexed and months to rank. What the site does is remove everything technical that could hold it back, give every service its own page, and give you a to-do list for the parts that need your accounts and your real projects.

## 1. What is already built into the site

| Area | What it does | Where |
| --- | --- | --- |
| Titles, descriptions, canonicals | Every page has its own search-led title, description, canonical URL and share card (Open Graph / Twitter), so no page is shared or listed under the home page's title | `lib/seo.ts` (`pageMetadata`), each page's `metadata` |
| India first | `<html lang="en-IN">`, `en_IN` locale, "in India" wording in titles and descriptions, rupee starting prices | `app/layout.tsx`, `lib/site.ts` (`seoTitle`, `seoDescription`) |
| Structured data | Organization (logo, email and WhatsApp contact; profiles and address only when you add them), WebSite, ProfessionalService with an offer catalogue; BreadcrumbList on every inner page; Service with starting prices and FAQPage on service pages; Article on insights | `lib/jsonld.ts`, `components/seo/` |
| A page per service | Nine pages under `/services/<name>`, each with its own copy, FAQs, related links and share image, so each can rank for its own search | `lib/seoPages.ts`, `components/seo/ServicePage.tsx` |
| Internal links | Footer, the services hub, the option picker, related-service blocks and breadcrumbs all link to the service pages | `Footer.tsx`, `ServiceDirectory.tsx`, `OptionPicker.tsx` |
| Sitemap, robots, feeds | `/sitemap.xml` (dates only where real), `/robots.txt`, `/insights/feed.xml` once an article is published, `/llms.txt` (a plain summary for AI crawlers) | `app/sitemap.ts`, `app/robots.ts`, `public/llms.txt` |
| Icons and manifest | SVG and PNG icons (192, 512, Apple 180), web manifest | `app/icons/`, `app/apple-icon.tsx`, `app/manifest.ts` |
| Verification tags | Search Console and Bing codes from environment variables | `lib/site.ts`, `.env.example` |
| Insights | `/insights` with five **draft** guides (hidden until you publish them) | `lib/insights.ts` |
| Speed | Pages are pre-rendered; Lighthouse performance, accessibility, best practices and SEO scores are near 100 | (already there) |

## 2. Do these first (about an hour)

1. **Tell the site where you are and who you are.** In Vercel, Project, Settings, Environment Variables, add `NEXT_PUBLIC_CITY`, `NEXT_PUBLIC_REGION`, `NEXT_PUBLIC_COUNTRY` (for example `IN`), and add your social profile links to `socials` in `lib/site.ts`. They appear in the structured data and the footer. Until then nothing about a place is published.
2. **Google Search Console** (free, essential).
   1. Go to search.google.com/search-console and add a **Domain** property for `genaitex.com`.
   2. Verify with the DNS record it shows (a TXT record at your domain registrar), or choose "URL prefix", then "HTML tag", copy only the `content="..."` value into the Vercel variable `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION`, redeploy, and click Verify.
   3. Open **Sitemaps** and submit `sitemap.xml`.
   4. Open **URL Inspection**, paste each important URL (home, the nine service pages, About, Contact) and click **Request indexing**.
3. **Bing Webmaster Tools**: sign in, choose "Import from Google Search Console". (Bing also feeds other search engines.)
4. **Domain redirects.** In Vercel, Project, Settings, Domains: make sure `www.genaitex.com` and `genaitex.in` redirect to `genaitex.com` (308), never serve a copy. I cannot check these from the build environment, so please confirm in a browser.
5. **Check how it looks in results.** Paste a few URLs into Google's Rich Results Test (search.google.com/test/rich-results) and into a share previewer (for example LinkedIn's Post Inspector); you should see the page's own title, description and card.

## 3. Build trust (the biggest ranking factor you control)

- **Replace the concept projects with real ones.** Most projects in `lib/projects.ts` are labelled concepts (EN3RGY is the first real one). Real work, with a live link, what you did, and a short quote from the client (with their permission), is the strongest trust signal for both visitors and search engines. Set `isSample: false`, add `url`, and rewrite the copy with real details and results.
- **Google Business Profile.** Create one as a *service-area business* (you can hide your street address). Use your real name, website, email or phone and service areas; verify it; add photos and the services you offer. Keep the name, contact details and city identical everywhere.
- **Profiles.** LinkedIn company page first, then Instagram or X if you will actually post. Link them from the footer (`socials` in `lib/site.ts`), which also puts them in the structured data.
- **Directories where you can show real work**: for example Clutch, GoodFirms, DesignRush, Sulekha. Only list what you can back up; ask happy clients for honest reviews there.
- **Backlinks** come from being useful: guest articles, community and startup groups you take part in, partner and supplier pages, local business associations. Do not buy links; it can get the site penalised.

## 4. Content: publish the Insights guides

The five guides in `lib/insights.ts` are written from facts already on the site (no statistics, no invented clients). They are drafts, so they are not live.

To publish one: read it, edit anything that is not right, set `status: "published"`, set `published` to the real date, and push. The sitemap, the RSS feed and the "Insights" link in the navigation switch on by themselves. After that, one useful guide a month beats many thin ones: answer a question a customer actually asked you, link to the matching service page, and update old guides when prices or services change.

To preview the drafts in a production build, build with `SHOW_DRAFT_INSIGHTS=1`.

## 5. What each page is about (keyword map)

These are the phrases people typically use to look for each service, not measured search volumes. After a few weeks, Search Console's **Performance** report shows the real queries; adjust the wording of titles and headings to match what people actually type.

| Page | Main phrase | Also helps | Searcher's intent |
| --- | --- | --- | --- |
| Home | website, AI automation and growth studio in India | website development company India | Find a studio |
| `/services/static-website-design` | static website design | business website cost India, landing page design | Buy a simple website |
| `/services/ecommerce-website-development` | ecommerce website development India | Shopify store development, online store cost India | Build an online store |
| `/services/web-app-development` | web app development | dashboard development, customer portal development | Commission software |
| `/services/ai-automation-integrations` | AI automation for business | AI chatbot for business, workflow automation | Automate work with AI |
| `/services/custom-ui-design` | UI design for websites and apps | website redesign, design system | Get an interface designed |
| `/services/crm-setup` | CRM setup for small business | HubSpot setup, Zoho CRM setup, Pipedrive setup | Organise sales |
| `/services/ai-product-ads` | AI product ads | AI product photography, ecommerce ad creatives | Get ad creative |
| `/services/marketing` | digital marketing and SEO services India | SEO services, social media marketing | Get found |
| `/services/ready-made-ui-websites` | ready-made website | website templates with setup, pre-built website | Launch quickly on a budget |

## 6. Monthly routine (30 minutes)

1. Search Console, **Performance**: which queries and pages gained or lost impressions? Note two queries to write about.
2. **Pages** report: any URLs "not indexed"? Open one in URL Inspection and read the reason.
3. **Core Web Vitals** report: anything flagged poor? (The site is fast; this catches regressions.)
4. Publish or update one Insights guide; add a real project or review if you have one.
5. Check that prices and services in the copy still match what you offer (`lib/services.ts`, `lib/seoPages.ts`).

## 7. For developers

- Add a service page: add an entry to `lib/seoPages.ts` (and list it in `related` of its neighbours). It is generated, linked in the footer and hub, added to the sitemap and given its structured data.
- Check the whole site the way a search engine reads it: build, start the server, then run `npm run seo:check` (checks titles, descriptions, canonicals, share tags, headings, structured data, breadcrumbs, links, sitemap, robots, icons and the Insights rules for every page).
- Lighthouse: `npx lighthouse http://localhost:3100/services/crm-setup --only-categories=seo,accessibility,performance,best-practices`.
