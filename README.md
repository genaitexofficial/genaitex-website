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
| `NEXT_PUBLIC_CONTACT_EMAIL` | Shown on the site and used as the fallback address in error messages |
| `NEXT_PUBLIC_WHATSAPP` | Digits with country code. Empty hides WhatsApp links. |
| `RESEND_API_KEY` | Enables contact-form email delivery |
| `CONTACT_TO_EMAIL` | Inbox that receives inquiries (defaults to `NEXT_PUBLIC_CONTACT_EMAIL`) |
| `CONTACT_FROM_EMAIL` | Sender, on a domain verified in Resend |

## Deploy to Vercel and connect the domain

1. Push this repo to GitHub and **Import** it in Vercel (Next.js is auto-detected).
2. Add the environment variables above under *Project → Settings → Environment Variables*, then redeploy.
3. *Settings → Domains → Add* your domain (for example `genaitex.com`) and add the DNS records Vercel displays at your registrar. Use the exact values shown there. Also add `www` and redirect it to the apex (or the reverse).
4. In Resend, add and verify your domain (SPF/DKIM records) so inquiry emails are delivered reliably. Until then `onboarding@resend.dev` only delivers to your own Resend account email.
5. Submit `https://<your-domain>/sitemap.xml` in Google Search Console.

## How it is built

- **Cache Components** is enabled (Next.js 16). Pages are prerendered; the contact API is the only dynamic route.
- **Motion** loads lazily (`LazyMotion`), and **three.js is only downloaded on screens ≥ 768px** without a reduced-motion preference. Smaller screens get a CSS-only hero backdrop. The scene pauses when scrolled off screen.
- Validation uses **zod/mini**, shared by the form and the API route.
- The contact route has a honeypot field, a body-size cap and a best-effort per-IP rate limit (per serverless instance; use a shared store such as Upstash if you need strict limits).
- Accessibility: skip link, visible focus states, labelled form fields with `aria-invalid`, valid heading order, reduced-motion support everywhere.
- Sample data uses `.example` hostnames in the browser mockups. Nothing links to a fake live site.
