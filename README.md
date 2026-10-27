# genaitex

Website and portfolio for **genaitex**, a development studio building static websites, custom Shopify storefronts and bespoke web software.

Next.js (App Router) · TypeScript · Tailwind CSS v4 · Motion · three.js (hero) · Resend (contact emails)

## Run it

```bash
npm install
cp .env.example .env.local   # optional locally; see "Environment variables"
npm run dev                  # http://localhost:3000
npm run build && npm start   # production build
npm run lint
```

With no `RESEND_API_KEY` the contact form works in development by logging the message to the terminal. In production a missing key returns an error telling the visitor to email you, so a lead is never silently dropped.

## Make it yours: where to edit

| What | File |
|---|---|
| Brand name, tagline, email, WhatsApp, socials, nav, "now booking" pill | `lib/site.ts` (or the `NEXT_PUBLIC_*` env vars) |
| Services, process steps, "why us" principles, tech marquee | `lib/services.ts` |
| Portfolio projects and case studies | `lib/projects.ts` |
| Form options (project types, budgets, timelines) and rules | `lib/validation.ts` |
| About page copy and tech stack | `app/about/page.tsx` |
| Colours, fonts, glow/grid utilities | `app/globals.css`, `app/layout.tsx` |
| Logo mark | `components/ui/Logo.tsx`, `app/icon.svg` |

### Replace the sample projects

Every project in `lib/projects.ts` ships as a **concept** (`isSample: true`), which shows a "Concept" label in the UI. For each real project:

1. Edit the entry: title, client, summary, challenge, solution, stack, highlights.
2. Add `url: "https://..."` (shows a live-site link), and set `isSample: false`.
3. Choose a `mock` (`storefront | landing | dashboard | app`) and `accent` colour for its preview, or swap `BrowserMockup` for real screenshots in `ProjectCard` and the case-study page.
4. Set `featured: true` on up to three projects to show them on the home page.

New slugs appear automatically on `/work`, in the sitemap and as case-study pages.

## Environment variables

See `.env.example`.

| Variable | Purpose |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | Canonical URL (sitemap, Open Graph, structured data). Set to your real domain. |
| `NEXT_PUBLIC_CONTACT_EMAIL` | Shown on the site and used as the fallback address in error messages (default `genaitexofficial@gmail.com`) |
| `NEXT_PUBLIC_WHATSAPP` | Digits with country code (default `919912377803`). Empty hides WhatsApp links. |
| `RESEND_API_KEY` | Enables contact-form email delivery |
| `CONTACT_TO_EMAIL` | Inbox that receives inquiries (defaults to `NEXT_PUBLIC_CONTACT_EMAIL`) |
| `CONTACT_FROM_EMAIL` | Sender, on a domain verified in Resend |

## Deploy to Vercel and connect the domain

The repo is at `genaitexofficial/genaitex-website`. Once it is imported, every push to `main` redeploys automatically.

1. **Import:** at [vercel.com/new](https://vercel.com/new), sign in with GitHub, choose the repo and click **Deploy** (Next.js is auto-detected; no build settings to change).
2. **Environment variables** (*Project → Settings → Environment Variables*, then redeploy): add `RESEND_API_KEY` and `CONTACT_TO_EMAIL=genaitexofficial@gmail.com`. The public details (email, WhatsApp, domain) already default to the right values in `lib/site.ts`.
3. **Domains** (*Project → Settings → Domains*): add `genaitex.com` and `www.genaitex.com`, then add `genaitex.in` and set it to **redirect to genaitex.com** so there is only one canonical site.
4. **DNS at Spaceship** (*Domains → Manage → DNS records*): add the records Vercel shows for each domain, using the exact values on screen. They are typically an `A` record for the root and a `CNAME` for `www` (and the same pair for `genaitex.in`). Remove any conflicting default parking records first. Propagation usually takes minutes, occasionally up to a few hours.
5. **Resend** (resend.com → Domains): add `genaitex.com`, copy the SPF/DKIM records into Spaceship DNS, and verify. Then set `CONTACT_FROM_EMAIL` to `genaitex <hello@genaitex.com>` in Vercel. Until then, leave it unset: `onboarding@resend.dev` only delivers to the email your Resend account was created with, so sign up to Resend with `genaitexofficial@gmail.com` for testing.
6. Submit `https://genaitex.com/sitemap.xml` in Google Search Console.

## How it is built

- **Cache Components** is enabled (Next.js 16). Pages are prerendered; the contact API is the only dynamic route.
- **Motion** loads lazily (`LazyMotion`), and **three.js is only downloaded on screens ≥ 768px** without a reduced-motion preference. Smaller screens get a CSS-only hero backdrop. The scene pauses when scrolled off screen.
- Validation uses **zod/mini**, shared by the form and the API route.
- The contact route has a honeypot field, a body-size cap and a best-effort per-IP rate limit (per serverless instance; use a shared store such as Upstash if you need strict limits).
- Accessibility: skip link, visible focus states, labelled form fields with `aria-invalid`, valid heading order, reduced-motion support everywhere.
- Sample data uses `.example` hostnames in the browser mockups. Nothing links to a fake live site.
