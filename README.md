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
| **Home and Services scroll story**: chapter titles, copy, the four option cards, info cards, buttons | `lib/chapters.ts` (`homeChapters`, `servicesChapters`) |
| The four options: what's included, who it's for, tech, optional timeline, button wording | `lib/services.ts` |
| Process steps, "why us" principles, tech marquee | `lib/services.ts` |
| Portfolio projects and case studies | `lib/projects.ts` |
| Form options (project types, budgets, timelines), `?type=` shortcuts and rules | `lib/validation.ts` |
| About page copy and tech stack | `app/about/page.tsx` |
| DNA helix look (size, turns, colours of the four bases) | `lib/helix.ts` |
| How deep the camera zooms at each chapter (`zoom`, `focus`, `roll`) | the `camera` key of each chapter in `lib/chapters.ts` |
| How the DNA moves everywhere else on the site (zoom, sway, dimming) | `AMBIENT` in `lib/helix.ts`, and the ambient values in `components/dna/director.ts` |
| HUD wording and layout (`ZOOM`, `SEQ`, `CH`, reticle) | `components/stage/StageHud.tsx` |
| Scanlines, scan sweep, speed streaks | `components/dna/DnaBackdrop.tsx`, `app/globals.css` |
| Colours, fonts, glow/grid utilities | `app/globals.css`, `app/layout.tsx` |
| Logo mark | `components/ui/Logo.tsx`, `app/icon.svg` |

**Timelines and prices:** nothing on the site states a price or typical timeline. Each option in `lib/services.ts` has an optional `timeline` field; set it only when it is a commitment you are happy to make, and it will appear in the option picker.

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

- **Page-long DNA** (`components/dna/`): one DNA scene is fixed behind the whole site, from the top of every page to the bottom (`DnaBackdrop`, mounted in `app/layout.tsx`, so it persists and glides across navigation instead of restarting). It sits behind all content, never takes clicks, and is dimmed outside the chapter stage so text stays readable; panels (`.glass`, `.glow-card`) carry their own dark backing. A small camera **director** (`director.ts`) decides what the camera does each frame from the scroll position:
  - while a chapter stage is on screen, it follows that stage's chapter keyframes (bright, helix to the right of the text);
  - everywhere else it follows the ambient path (`AMBIENT` in `lib/helix.ts`): the helix zooms, sways side to side and turns as you scroll, with a different pose per scroll position, so every page and every section has the effect;
  - between the two it blends smoothly as the stage arrives and leaves, and the result is eased, so route changes and restored scroll positions glide.
- **Scroll stage** (`components/stage/`): Home and Services are scroll-driven stories. A tall wrapper holds a sticky stage; scroll position picks the active chapter, and the stage registers itself with the director so its chapters steer the camera. The page always scrolls natively (no scroll hijacking). The chapter rail, pager and option cards are real buttons and links, and keyboard focus never enters a hidden chapter.
- **One DOM, three layouts**, chosen by CSS media queries so nothing shifts after hydration: a pinned desktop stage with floating option cards; a compact phone layout (helix on top, option chips below); and, for `prefers-reduced-motion`, plain stacked sections with no canvas.
- **The DNA helix** (`lib/helix.ts`): a glossy beaded double helix with dotted A/T/G/C base-pair rungs.
  - Real GPU: three.js scene, lazy-loaded, with callout lines (in chapter stages) that attach to actual rungs and follow them as the helix turns. It renders every frame while the camera moves and a slow tick while the page rests.
  - Capable phones, and desktops without a GPU (headless browsers, VMs, remote desktops: detected by renderer name): a 2D-canvas version of the same helix, a few KB, no three.js. It only works hard while scrolling.
  - Reduced motion, Data Saver or weak devices: no canvas at all (the page keeps its static haze and grid).
  - The scene pauses when the tab is hidden.
- **Zoom per chapter:** each chapter has a camera keyframe (`zoom`, `focus`, `roll` in `lib/chapters.ts`). `cameraAt()` in `lib/helix.ts` blends between them (holds for a quarter of each step, eases through the middle half, zoom blended in log space), and both renderers get the result from the director, so they always agree. On Home the helix goes ×1.5 → ×2.4 → ×4 → ×6 (a single base pair) and pulls back to ×1.3 at the end. The three.js scene zooms optically (`camera.zoom`), so perspective stays clean.
- **Sci-fi HUD** (decorative and `aria-hidden`): the chapter stage's overlay (`components/stage/StageHud.tsx`) has corner brackets, a targeting reticle on the base pair nearest the centre, the readouts, and a single glitch and flash burst per chapter change (about 0.4s, so it stays well inside the flashing-content limit); it fades in and out with the stage. The page-long backdrop adds scanlines, a slow scan sweep and speed streaks while the zoom moves. Every number is real: `ZOOM` is the camera zoom, `SEQ` and the pair label (for example `A–T`) are the targeted rung's position and bases in the helix data, and `CH` is the chapter. Values flow through motion values (`components/stage/hud.ts`), so there is no React re-render per frame. Hidden under reduced motion.
- **Swipe settle on touch screens** (`components/stage/useMagneticSettle.ts`): when a swipe ends and scrolling goes idle, the page eases to a chapter, so one swipe is about one chapter (a forward swipe past ~12% of a step lands on the next one). It only runs on coarse pointers with motion allowed, never while a finger is down, and never at the very start or end of the stage, so it can't trap anyone. Mouse, trackpad and keyboard scrolling stay completely free.
- **Option picker** (`components/stage/OptionPicker.tsx`): accessible tabs (arrow keys, Home/End) showing what's included, who it's for and the tech. Its button opens `/contact?type=static|shopify|custom|ai` with that project type preselected; the contact page stays statically prerendered (`useSearchParams` inside `<Suspense>`).
- **Deep links:** chapter ids match the service slugs, so `/services#shopify-storefronts` lands on the right chapter (handled in `ChapterStage`, since a pinned stage can't be scrolled to natively).
- **Other pages:** a scroll-progress hairline under the navbar, a numbered section rail on About and case studies, and a parallax project mockup. Their DNA is the page-long backdrop, so every page has the effect with no per-page setup.
- **Cache Components** is enabled (Next.js 16). Pages are prerendered; the contact API is the only dynamic route.
- Motion is loaded lazily (`LazyMotion`); validation uses **zod/mini**, shared by the form and the API route.
- The contact route has a honeypot field, a body-size cap and a best-effort per-IP rate limit (per serverless instance; use a shared store such as Upstash if you need strict limits).
- Accessibility: skip link, visible focus states, labelled form fields with `aria-invalid`, valid heading order, reduced-motion support everywhere.
- Sample data uses `.example` hostnames in the browser mockups. Nothing links to a fake live site.

## Testing the 3D scene locally

Headless browsers render WebGL in software, which the site deliberately detects and avoids. To exercise the three.js path in a test, set `window.__FORCE_WEBGL = true` before the page loads (for example with Playwright's `addInitScript`).

To check the page-long scene, load any page with the 2D renderer (the default in headless browsers) and read pixels from the `canvas` at several scroll positions: it should be drawn at the top, middle and bottom of every page, and `[data-dna-dim]` (the scene's opacity) should be 1 in a chapter stage and about 0.3 to 0.4 elsewhere.

To test the swipe settle, emulate a touch device and send real touch events (for example Playwright with `isMobile` and `hasTouch`, then CDP `Input.dispatchTouchEvent`: `touchStart`, a series of `touchMove`, `touchEnd`). After about a second the scroll position should rest on a chapter centre.
