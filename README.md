# genaitex

Website and portfolio for **genaitex**, a studio building websites and applications, AI and automation, custom UI designs, CRM setups, AI product advertisements and marketing.

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
| **Home and Services scroll story**: chapter titles, copy, the four option cards per chapter (some with prices, `includes` and a `book` link), info cards, the sixth card or fifth glass block (`extra`), buttons, and the "5 years / one team / 95+" proof strip on Home scroll 1 (`proof`) | `lib/chapters.ts` (`homeChapters`, `servicesChapters`) |
| The six services: what's included, who it's for, tech, price list, optional timeline, button wording | `lib/services.ts` |
| Prices (in rupees), the rupee-to-dollar rate and the dollar rounding | `websitePricing` in `lib/services.ts`; `INR_PER_USD` and `usd()` in `lib/pricing.ts` |
| Process steps, "why us" principles, tech marquee | `lib/services.ts` |
| **SEO**: the nine service pages (copy, FAQs, related links), the search title and description of the home page, the structured data | `lib/seoPages.ts`, `lib/site.ts` (`seoTitle`, `seoDescription`, `location`, `socials`), `lib/jsonld.ts` |
| **Insights** articles (drafts until you publish them) | `lib/insights.ts` |
| Portfolio projects and case studies | `lib/projects.ts` |
| Form options (project types, budgets, timelines), `?type=` shortcuts and rules | `lib/validation.ts` |
| About page copy and tech stack | `app/about/page.tsx` |
| DNA helix look (size, turns, colours of the four bases) | `lib/helix.ts` |
| How deep the camera zooms at each chapter (`zoom`, `focus`, `roll`) | the `camera` key of each chapter in `lib/chapters.ts` |
| How the DNA moves everywhere else on the site (zoom, sway, dimming) | `AMBIENT` in `lib/helix.ts`, and the ambient values in `components/dna/director.ts` |
| Chapter overlay (reticle, brackets, flash) | `components/stage/StageHud.tsx` |
| Scanlines and speed streaks | `components/dna/DnaBackdrop.tsx`, `app/globals.css` |
| Phone/tablet: zoom-out and spin of the central helix | `ZOOM_TOP`, `ZOOM_FLOOR`, `ZOOM_OUT_SPAN`, `SPIN_PHONE` in `components/dna/director.ts` |
| Phone/tablet: how content appears out of the DNA, readability veil | `.dna-node` and `@keyframes dna-bud/dna-fold` in `app/globals.css` |
| Colours, fonts, glow/grid utilities | `app/globals.css`, `app/layout.tsx` |
| Logo mark | `components/ui/Logo.tsx`, `app/icon.svg` |

**Prices and timelines:** the site states "From" prices for Websites & Applications (Static website ₹2,000; Custom Ecommerce 5 pages ₹10,000; 10 pages ₹20,000) and "Custom quote" for the other services; the ready-made UIs and websites (`ready` in `websitePricing`) have no price and read "Browse & book", so add `inr` there when you set one. Amounts are written once, in rupees (`websitePricing` in `lib/services.ts`, shown on the Services and Home stages and in the option picker) and shown in rupees or dollars: both are in the page (`components/currency/Price.tsx`) and CSS shows the one matching `<html data-currency>`, which an inline script sets before first paint (the visitor's saved choice from the navbar ₹ / $ switch, else rupees for visitors in India by time zone or language, dollars for everyone else). Dollar amounts are a fixed approximate conversion (`INR_PER_USD`, about ₹85 = $1, rounded to the nearest $5) and are labelled approximate; to quote exact dollars, change `usd()`. The contact form's budget ranges follow the currency (`budgetsInr` / `budgetsUsd` in `lib/validation.ts`). Each option in `lib/services.ts` also has an optional `timeline` field; set it only when it is a commitment you are happy to make, and it will appear in the option picker.

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
| `NEXT_PUBLIC_CITY`, `NEXT_PUBLIC_REGION`, `NEXT_PUBLIC_COUNTRY` | Where the studio is based (city and region; country such as `IN`). Published in the structured data only when set. |
| `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION`, `NEXT_PUBLIC_BING_SITE_VERIFICATION` | The `content` value of the Search Console / Bing Webmaster "HTML tag" verification (see `SEO.md`) |
| `SHOW_DRAFT_INSIGHTS` | Set to `1` when building to include the draft Insights articles (preview only) |
| `NEXT_PUBLIC_DESKTOP_THEMES` | Set to `off` to drop the off-white/silver/ash Day and Night themes and the navbar button, and keep the original dark-blue look on desktop too (default: on) |

## SEO

Every page has its own title, description, canonical URL and share card (`pageMetadata` in `lib/seo.ts`); structured data (Organization, WebSite, ProfessionalService, Breadcrumbs, Service + FAQ on service pages, Article on insights) comes from `lib/jsonld.ts`; the nine service pages live under `/services/<slug>` (`lib/seoPages.ts`); `/insights` shows articles from `lib/insights.ts` once one is published (they all ship as drafts; see the file's header). `npm run seo:check` (with the site built and running, `BASE=http://localhost:3000`) checks all of it page by page. **`SEO.md` explains what is built in and the to-do list for the parts only you can do** (Search Console, Google Business Profile, real projects and reviews, redirects).

## Deploy to Vercel and connect the domain

The repo is at `genaitexofficial/genaitex-website`. Once it is imported, every push to `main` redeploys automatically.

1. **Import:** at [vercel.com/new](https://vercel.com/new), sign in with GitHub, choose the repo and click **Deploy** (Next.js is auto-detected; no build settings to change).
2. **Environment variables** (*Project → Settings → Environment Variables*, then redeploy): add `RESEND_API_KEY` and `CONTACT_TO_EMAIL=genaitexofficial@gmail.com`. The public details (email, WhatsApp, domain) already default to the right values in `lib/site.ts`.
3. **Domains** (*Project → Settings → Domains*): add `genaitex.com` and `www.genaitex.com`, then add `genaitex.in` and set it to **redirect to genaitex.com** so there is only one canonical site.
4. **DNS at Spaceship** (*Domains → Manage → DNS records*): add the records Vercel shows for each domain, using the exact values on screen. They are typically an `A` record for the root and a `CNAME` for `www` (and the same pair for `genaitex.in`). Remove any conflicting default parking records first. Propagation usually takes minutes, occasionally up to a few hours.
5. **Resend** (resend.com → Domains): add `genaitex.com`, copy the SPF/DKIM records into Spaceship DNS, and verify. Then set `CONTACT_FROM_EMAIL` to `genaitex <hello@genaitex.com>` in Vercel. Until then, leave it unset: `onboarding@resend.dev` only delivers to the email your Resend account was created with, so sign up to Resend with `genaitexofficial@gmail.com` for testing.
6. Submit `https://genaitex.com/sitemap.xml` in Google Search Console.

## How it is built

- **Desktop themes** (screens 1024px and wider; phones and tablets keep the dark-blue look):
  - **Day** is off-white with silver and ash panels and deep-ash text; **Night** is charcoal-ash with silver and off-white text. Both are monochrome, with hairline borders, soft layered shadows and a brushed-metal gradient on the main button and logo.
  - **The sun/moon button** in the navbar cycles **Auto → Day → Night**. Auto follows the visitor's device setting (`prefers-color-scheme`) and changes live; the choice is remembered in `localStorage` (`genaitex-theme`). `<html data-theme="day|night" data-mode="auto|day|night">` is set by a tiny inline script before the first paint, so there is no flash of the wrong theme (`components/theme/`, script source in `store.ts`).
  - Colours are tokens (`--color-*` and friends in `app/globals.css`): the original values are the defaults and the desktop themes override them under `@media (min-width: 1024px)`, so nothing below that width changes. Edit a theme in the `:root[data-theme="day"]` / `"night"` blocks. Text pairs are checked to WCAG AA (body and muted text at least 4.5:1, large text at least 3:1).
  - **Bead finishes** (`lib/finishes.ts`, `components/dna/matcap.ts`): the helix beads wear one of three finishes on desktop, **polished silver chrome**, **frosted pearl** or **gunmetal with silver highlights**. Each chapter of a stage wears the next one (chrome, pearl, gunmetal, chrome, pearl) and the beads morph between them during the swipe, with the same pacing as the camera; outside a stage they keep cycling with the distance scrolled (a full cycle takes about six screens, `SCREENS_PER_FINISH`). The base pairs differ by lightness, not hue. WebGL paints them with procedurally generated matcap textures blended by weight; the 2D renderer cross-fades pre-rendered sprite sets. Add `?finish=chrome`, `?finish=pearl` or `?finish=gunmetal` to the URL to lock one for review; `data-dna-finish` on `[data-dna-backdrop]` shows which is showing most.
- **Smoothness** (everything is built so motion never stutters, on any device):
  - **Springs, not easing.** The camera follows the scroll with critically damped springs (`components/dna/spring.ts`, used by `director.ts`): no overshoot, speed changes continuously, so a wheel notch, a flick or a stop glides, and the result is the same at 30, 60 or 144 fps. The spin is integrated from a smoothed frame time, so one slow frame never makes the helix jump. Tune the feel with `FOLLOW_FAST`, `FOLLOW_SLOW` and `FINISH_EASE` at the top of `director.ts`.
  - **Quality governor** (`components/dna/governor.ts`). If frames run long (average over ~22 ms for a second) the scene lowers its resolution one step (3D: pixel ratio; 2D: canvas size; at the lowest step the 3D beads use a lower-poly sphere and the 2D strand is thinned), and it climbs back after several seconds of headroom, never flickering between two levels. A slow device loses sharpness, not smoothness.
  - **Cheap compositing.** No `backdrop-filter` anywhere except the four Liquid Glass blocks on Home scroll 1 (panels use a slightly more opaque backing instead; re-blurring a live canvas every frame is what makes scrolling stutter, so those four blocks drop their blur on a device that cannot keep up, see below), no blend modes, the backdrop is its own contained layer, callout dots and lines move with transforms only, and a chapter change re-renders only the two chapters whose state changed (`ChapterItem` is memoized).
  - **See it on your device:** add `?perf` to any URL for a small readout of frames per second, frame time and the governor's quality step (0 = full). `data-dna-fps` and `data-dna-quality` on `[data-dna-backdrop]` expose the same for tests.
- **Page-long DNA** (`components/dna/`): one DNA scene is fixed to the screen from the top of every page to the bottom (`DnaBackdrop`, mounted in `app/layout.tsx`, so it persists and glides across navigation instead of restarting). It never takes clicks. A small camera **director** (`director.ts`) decides what the camera does each frame from the scroll position: inside a chapter stage it follows that stage's chapter keyframes; everywhere else it follows the ambient path (`AMBIENT` in `lib/helix.ts`), zooming, swaying and turning as you scroll; between the two it blends smoothly, and the result is eased so route changes and restored scroll positions glide. How it is laid out depends on the screen:
  - **Large screens (1024px and up):** the scene sits behind all page content, bright in a chapter stage (helix to the right of the text) and dimmed behind the content elsewhere. Panels (`.glass`, `.glow-card`) carry their own dark backing so text stays readable.
  - **Phones and tablets:** the helix stays **big and central**, on the chapters' diagonal, behind the content, and **zooms out slowly** as you scroll (from ×1.2 at the top of a page to a floor of ×0.62 after about twelve screens of scrolling, then it holds; scrolling back up zooms back in) while it **spins steadily**, even when you stop. Chapter 5 eases straight into this, so nothing flies away. Content blocks **appear out of it**:
    - Any element with the `.dna-node` class (the `Reveal` wrapper, the option picker's panel and tabs, page headings, project cards) starts small and faint, pulled toward the helix, and settles as it scrolls in; leaving at the top it drifts back toward the helix and melts away, in step with the scroll (CSS scroll-driven animations in `globals.css`; where a browser lacks them the blocks just fade in).
    - Text stays readable over the bright helix through a soft dark veil behind each block (`.dna-node::before`), a text shadow, slightly darker `.glass` / `.glow-card` backings, and a backing on the footer. No full-width rules cut across the DNA.
    - Inside a chapter stage the helix **zooms in to fill the screen**; the text is a glass card on it with a line (`TetherLayer`) to the targeted base pair, and the option chips float around the helix tied to nearby rungs (`phoneSlots` in `StageParts.tsx`), like the desktop callouts.
    - Reduced motion gets the plain layout (no scene, no veil, no grow-out). The zoom-out and spin numbers are the `ZOOM_*` and `SPIN_*` constants at the top of `components/dna/director.ts`.
- **Scroll stage** (`components/stage/`): Home and Services are scroll-driven stories. A tall wrapper holds a sticky stage; scroll position picks the active chapter, and the stage registers itself with the director so its chapters steer the camera. The page always scrolls natively (no scroll hijacking). There is no left-hand menu: chapters are reached by scrolling, the previous/next arrows, and (on Home) the option cards, which are real buttons and links; keyboard focus never enters a hidden chapter.
  - **Home layout vs Services layout** (large screens only). Services, and Home scrolls 2-5, show the **floating option cards** around the DNA with lines to it, the info card, the reticle, the DNA centred at 66.7% and the text lined up with the logo. **Home scroll 1** (`stackFirst` option of `ChapterStage`; the layout is picked per chapter by `layoutOf`) is different: the text sits hard left (3rem from the edge), the DNA is centred at 62% (`stageCx` in `StageParts.tsx`; `StageSlot.cx` of the director takes one value per chapter and the DNA glides between them), and the four options are **big Liquid Glass blocks with just their headings (`StageStack`), stacked in the middle of the DNA**; no info card, lines, dots or reticle (the lines, reticle and scrim fade with opacity as you move between scroll 1 and 2). The blocks wear the site's own finishes, **pearl, silver, ash and gunmetal** (`--stack-N` tokens in `app/globals.css`, per theme), and jump to their chapter on click. Phones and tablets keep the floating pills on both pages.
  - **Liquid Glass** (`.liquid-glass` in `app/globals.css`, used by the Home stack blocks and by every floating card on large screens): a tinted translucent fill over a soft white gloss, `backdrop-filter: blur(18px) saturate(1.8)`, a bright specular rim and sheen, a soft shadow. Day uses dark text, Night white, and the fills are tuned so the heading keeps ≥ 4.5:1 contrast against the real pixels behind it over all three bead finishes. The blur is the one costly effect on the site (the DNA behind it is redrawn every frame), so `components/stage/glassBlur.ts` turns it off for the rest of the visit, in favour of an opaque frosted fill, once the scene's frame governor has kept the resolution lowered for four seconds; the same fill is used where `backdrop-filter` is unsupported or the visitor prefers reduced transparency. Add `?glass=blur` or `?glass=flat` to the URL to force one. The stack lives on the stage, not inside the chapter, and on large screens the chapter's parts (text, each card) fade themselves instead of the chapter fading as a whole (`FADE` in `StageParts.tsx`), because a faded ancestor would cut a backdrop blur off from the DNA behind it; the blur is also applied only to the chapter that is showing. The cards sit on a near-solid base so their small text stays sharp; their text contrast is checked from the real pixels over all three bead finishes in both themes. Blur on the cards costs far more than on the four blocks, so the same safeguard flattens both (the stage carries `data-glass`).
  - **The cards tied to the DNA** (the four option cards and the info card of every chapter, on every screen size) are near-solid, so the helix never shows through the text, and bold: a colour edge and bar, a tinted badge, coloured price and label text, a glow, and a dot and line to a DNA base pair in the same colour. Each card position has its own colour, the same on every scroll. On large screens (the Day and Night themes) the cards are **Liquid Glass in the same tones as the Home stack** (below), by number: cards 1-4 are pearl, silver, ash and gunmetal, the sixth card (Ready-made) graphite like its scroll-1 block, the info card pearl; the dots and lines keep the darker `--slot-1` to `--slot-6` greys so they stay visible on the helix. Phones and tablets keep the original near-solid cards in the bright colours (card 1 orange, 2 pink, 3 emerald, 4 sky blue, the info card purple). A card gets its glass from `glassTone(n)` in `StageParts.tsx` (`--g`, `--glass-tint`, `--glass-ink`, `--glass-shine`, `--glass-onink`, from the `--stack-N` tokens) and the `.slot-card.liquid-glass` rules at the end of `app/globals.css`, which also point the text variables at the card's ink (so dark glass gets light text) and turn the **Book** button into an ink-coloured pill. The legacy look (`.slot-card` / `.slot-chip` / `.slot-dot`, `--c` and `--t`, `--slot-N`, `--slot-text-N`) is what phones and tablets use.
  - **Card layout on large screens** (`calloutSlots`, `textEdge` in `StageParts.tsx`): cards 1 and 2 hang from the top, 3 and 4 stand on the bottom, the info card sits in the middle at the right with the DNA's reticle in the open beside it. A chapter with a sixth card (`extra`: Home scroll 2 and the Services websites chapter, from 1280px) reorders the left column: card 3 moves to the middle (`extraSlots`) and the sixth card takes the bottom-left corner. The left-hand cards keep clear of the text column, so nothing overlaps at any size from 1024px up (the sixth card and the info card need 1280px). A card can carry `includes` (three short points, shown on screens at least 1280 x 860) and a `book` link (a "Book" button to `/contact?...` with the option preselected); Home scroll 2 and the Services websites chapter use them on cards 1-3, and `extra` for "Ready-made UI & websites" (no price, "Ready to launch", "Browse & book"). The connector lines start inside their card, so they come out of its edge whatever its height. Each dot picks its own free base pair: the director is told where the cards are (`setKeepOut`, measured by `ChapterStage`) and the renderers skip base pairs under a card, off screen or already taken; with none free, a dot rests under its own card and its line is not drawn.
- **One DOM, three layouts**, chosen by CSS media queries so nothing shifts after hydration: a pinned desktop stage with floating option cards; a compact phone layout (helix on top, option chips below); and, for `prefers-reduced-motion`, plain stacked sections with no canvas.
- **The DNA helix** (`lib/helix.ts`): a glossy beaded double helix with dotted A/T/G/C base-pair rungs.
  - Real GPU (desktops, tablets and capable phones): the three.js scene, lazy-loaded, with callout lines (in chapter stages, large screens) that attach to actual rungs. It draws on every display frame while the tab is visible (the helix is always turning, and the camera answers a scroll at once) and stops while the tab is hidden. On phones it also waits for the page to load and the browser to idle. Phones must also pass the capability checks (not Data Saver, at least 4 cores, at least 4 GB where reported).
  - No GPU (headless browsers, VMs, remote desktops: detected by renderer name): a 2D-canvas version of the same helix, a few KB, no three.js. It also draws every frame, with no per-frame allocation and a linear-time depth sort, and uses 1x density on phones.
  - Reduced motion, Data Saver or weak phones: no canvas at all (the page keeps its static haze and grid).
  - The scene pauses when the tab is hidden.
- **Zoom per chapter:** each chapter has a camera keyframe (`zoom`, `focus`, `roll` in `lib/chapters.ts`). `cameraAt()` in `lib/helix.ts` blends between them (holds for a quarter of each step, eases through the middle half, zoom blended in log space), and both renderers get the result from the director, so they always agree. On Home the helix goes ×1.5 → ×2.4 → ×4 → ×6 (a single base pair) and pulls back to ×1.3 at the end. The three.js scene zooms optically (`camera.zoom`), so perspective stays clean.
- **Chapter overlay** (decorative and `aria-hidden`, `components/stage/StageHud.tsx`): a targeting reticle on the base pair nearest the centre (plus corner brackets and a tick ruler on large screens) and a soft glow that swells and fades once per chapter change (about 0.8s, a gentle pulse, well inside the flashing-content limit); it fades in and out with the stage. There are no page counters or zoom readouts; the pager has previous/next arrows and announces the position to screen readers. The page-long backdrop adds faint scanlines (no blend mode) and speed streaks while the zoom moves. Every number is real: `ZOOM` is the camera zoom, `SEQ` and the pair label (for example `A–T`) are the targeted rung's position and bases in the helix data, and `CH` is the chapter. Values flow through motion values (`components/stage/hud.ts`), so there is no React re-render per frame. Hidden under reduced motion.
- **Swipe settle on touch screens** (`components/stage/useMagneticSettle.ts`): when a swipe ends and scrolling goes idle, the page eases to a chapter, so one swipe is about one chapter (a forward swipe past ~12% of a step lands on the next one). It only runs on coarse pointers with motion allowed, never while a finger is down, and never at the very start or end of the stage, so it can't trap anyone. Mouse, trackpad and keyboard scrolling stay completely free.
- **Option picker** (`components/stage/OptionPicker.tsx`): accessible tabs (arrow keys, Home/End) showing what's included, who it's for and the tech. Its button opens `/contact?type=web|ai|design|crm|ads|marketing` with that service preselected (`type=ready` preselects "Ready-made UI & websites", the pre-built UIs and websites we sell) (older `static|shopify|custom` links still work), and each price row (five, the last being "Ready-made UI & websites" with "Browse & book" in place of a price) opens `/contact?type=web&plan=static|ecom-5|ecom-10` (or `type=ready&plan=ready`), which also starts the message with the chosen package; the contact page stays statically prerendered (`useSearchParams` inside `<Suspense>`).
- **Deep links:** chapter ids match the service slugs, so `/services#crm-setup` lands on the right chapter (old ids such as `#shopify-storefronts` are mapped by `chapterAliases`) (handled in `ChapterStage`, since a pinned stage can't be scrolled to natively).
- **Other pages:** a scroll-progress hairline under the navbar, and a parallax project mockup. Their DNA is the page-long backdrop, so every page has the effect with no per-page setup.
- **Cache Components** is enabled (Next.js 16). Pages are prerendered; the contact API is the only dynamic route.
- Motion is loaded lazily (`LazyMotion`); validation uses **zod/mini**, shared by the form and the API route.
- The contact route has a honeypot field, a body-size cap and a best-effort per-IP rate limit (per serverless instance; use a shared store such as Upstash if you need strict limits).
- Accessibility: skip link, visible focus states, labelled form fields with `aria-invalid`, valid heading order, reduced-motion support everywhere.
- Sample data uses `.example` hostnames in the browser mockups. Nothing links to a fake live site.

## Testing the 3D scene locally

Headless browsers render WebGL in software, which the site deliberately detects and avoids. To exercise the three.js path in a test, set `window.__FORCE_WEBGL = true` before the page loads (for example with Playwright's `addInitScript`).

To check the phone and tablet layout, emulate a device (Playwright `isMobile`, `hasTouch`, 390x844 and 820x1180) and read `[data-dna-backdrop]`: `data-dna-tier` is `full`, `lite` or `none`, and `data-dna-zoom`, `data-dna-pair` and `data-dna-seq` expose the camera zoom and targeted base pair a few times a second. The zoom should fall steadily down a long page; with the 2D renderer the canvas pixels should show the helix in the middle of the screen and change between two frames at the same scroll position (it spins). The one tether line is the `<g>` in the SVG inside the backdrop (`opacity` > 0 only in chapters). Software 3D is slow in headless browsers, so poll for state changes rather than using short fixed waits.

To check the page-long scene, load any page with the 2D renderer (the default in headless browsers) and read pixels from the `canvas` at several scroll positions: it should be drawn at the top, middle and bottom of every page, and `[data-dna-dim]` (the scene's opacity) should be 1 in a chapter stage and about 0.3 to 0.4 elsewhere.

To test the swipe settle, emulate a touch device and send real touch events (for example Playwright with `isMobile` and `hasTouch`, then CDP `Input.dispatchTouchEvent`: `touchStart`, a series of `touchMove`, `touchEnd`). After about a second the scroll position should rest on a chapter centre.
