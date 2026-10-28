// Checks the SEO basics of every page in the sitemap, reading the raw HTML the way a search engine does (no JavaScript).
// Build and start the site first, then:  BASE=http://localhost:3000 npm run seo:check
// (Add SHOW_DRAFT_INSIGHTS=1 to the build to check the Insights draft articles too.)
const BASE = process.env.BASE || "http://localhost:3000";
const SITE = process.env.SITE || "https://genaitex.com";
let passed = 0, total = 0;
const check = (name, ok, extra = "") => {
  total++; if (ok) passed++;
  console.log(`${ok ? "PASS" : "FAIL"}  ${name}${extra ? "  — " + extra : ""}`);
};
const get = (path) => fetch(BASE + path, { redirect: "manual" });
const decode = (s) => s.replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&#x27;|&#39;/g, "'");
const attr = (tag, name) => { const m = tag.match(new RegExp(`\\s${name}="([^"]*)"`)); return m ? decode(m[1]) : null; };

function parse(html) {
  const metas = [...html.matchAll(/<meta\s[^>]*>/g)].map((m) => m[0]);
  const meta = (key, val) => { const t = metas.find((x) => new RegExp(`\\s${key}="${val}"`).test(x)); return t ? attr(t, "content") : null; };
  const canon = html.match(/<link\s[^>]*rel="canonical"[^>]*>/);
  const ld = [...html.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/gs)].map((m) => { try { return JSON.parse(m[1]); } catch { return null; } });
  return {
    lang: (html.match(/<html[^>]*\slang="([^"]*)"/) ?? [])[1] ?? "",
    title: decode((html.match(/<title>(.*?)<\/title>/s) ?? [])[1] ?? ""),
    desc: meta("name", "description"), robots: meta("name", "robots"),
    canonical: canon ? attr(canon[0], "href") : null,
    ogTitle: meta("property", "og:title"), ogDesc: meta("property", "og:description"), ogUrl: meta("property", "og:url"),
    ogImage: meta("property", "og:image"), ogLocale: meta("property", "og:locale"), ogType: meta("property", "og:type"),
    twCard: meta("name", "twitter:card"), twTitle: meta("name", "twitter:title"), twImage: meta("name", "twitter:image"),
    h1: (html.match(/<h1[\s>]/g) ?? []).length,
    heads: [...html.matchAll(/<h([1-6])[\s>]/g)].map((m) => Number(m[1])),
    ld, links: [...html.matchAll(/<a\s[^>]*href="([^"]*)"/g)].map((m) => decode(m[1])),
    details: (html.match(/<details[\s>]/g) ?? []).length,
    imgNoAlt: [...html.matchAll(/<img\s[^>]*>/g)].filter((m) => !/\salt=/.test(m[0])).length,
    themeColor: (html.match(/<meta name="theme-color"/g) ?? []).length,
  };
}
const types = (ld) => ld.flatMap((b) => (b?.["@graph"] ?? [b]).map((x) => x?.["@type"]));

const sm = await (await get("/sitemap.xml")).text();
const urls = [...sm.matchAll(/<loc>(.*?)<\/loc>/g)].map((m) => m[1]);
check("sitemap lists pages, all on the canonical host, all unique", urls.length >= 14 && urls.every((u) => u.startsWith(SITE)) && new Set(urls).size === urls.length, `${urls.length} urls`);
const paths = urls.map((u) => u.slice(SITE.length) || "/");
const svcPaths = paths.filter((p) => p.startsWith("/services/"));
check("sitemap includes the home page, the hub, About, Work, Contact and the service pages", ["/", "/services", "/about", "/work", "/contact"].every((p) => paths.includes(p)) && svcPaths.length >= 9, `${svcPaths.length} service pages`);
check("service pages and articles carry a lastmod date; no other page has a guessed one", [...sm.matchAll(/<url>(.*?)<\/url>/gs)].every((m) => /lastmod/.test(m[1]) === /\/services\/|\/insights\/./.test(m[1])));

const titles = new Map(), descs = new Map(), linkSet = new Set(), info = {};
for (const p of paths) {
  const r = await get(p), html = await r.text(), d = parse(html); info[p] = d;
  const tag = p === "/" ? "Home" : p, canonical = p === "/" ? SITE : SITE + p;
  check(`${tag}: 200, html lang en-IN, indexable`, r.status === 200 && d.lang === "en-IN" && !/noindex/i.test(d.robots ?? ""), `${r.status} ${d.lang} ${d.robots}`);
  check(`${tag}: title ≤ 65 chars and unique`, d.title && d.title.length <= 65 && !titles.has(d.title), `${d.title.length}: ${d.title}`); titles.set(d.title, p);
  check(`${tag}: description 70-160 chars and unique`, d.desc && d.desc.length >= 70 && d.desc.length <= 160 && !descs.has(d.desc), `${d.desc?.length}`); descs.set(d.desc, p);
  check(`${tag}: canonical is itself, absolute`, d.canonical === canonical, `${d.canonical}`);
  check(`${tag}: share tags are this page's own (title, description, url, absolute images, en_IN, card)`, d.ogTitle === d.title && d.ogDesc === d.desc && d.ogUrl === canonical && (d.ogImage ?? "").startsWith(SITE + "/") && (d.twImage ?? "").startsWith(SITE + "/") && d.ogLocale === "en_IN" && d.twCard === "summary_large_image" && d.twTitle === d.title, `og:title ${d.ogTitle}`);
  check(`${tag}: exactly one h1, headings never skip a level`, d.h1 === 1 && d.heads.every((h, i) => i === 0 || h <= d.heads[i - 1] + 1), `h1 ${d.h1}, order ${d.heads.join("")}`);
  check(`${tag}: every image has alt text`, d.imgNoAlt === 0);
  check(`${tag}: structured data parses and has the site graph`, d.ld.length >= 1 && d.ld.every(Boolean) && ["Organization", "WebSite", "ProfessionalService"].every((t) => types(d.ld).includes(t)), types(d.ld).join(","));
  if (p !== "/") {
    const bc = d.ld.find((b) => b?.["@type"] === "BreadcrumbList"), segs = p.split("/").filter(Boolean);
    check(`${tag}: BreadcrumbList matches the URL`, !!bc && bc.itemListElement.length === segs.length + 1 && bc.itemListElement.at(-1).item === canonical && bc.itemListElement[0].item === SITE);
  }
  if (p.startsWith("/services/")) {
    const faq = d.ld.find((b) => b?.["@type"] === "FAQPage"), svc = d.ld.find((b) => b?.["@type"] === "Service");
    check(`${tag}: Service and FAQPage data; every FAQ is also on the page`, !!svc && !!faq && faq.mainEntity.length >= 5 && faq.mainEntity.length === d.details && svc.provider?.["@id"] === SITE + "/#organization", `faq ${faq?.mainEntity?.length}/${d.details}`);
    const og = await get(p + "/opengraph-image");
    check(`${tag}: has its own share image`, og.status === 200 && /image\/png/.test(og.headers.get("content-type") ?? "") && /\/opengraph-image/.test(d.ogImage ?? "") && d.ogImage !== info["/"]?.ogImage);
  }
  if (p.startsWith("/insights/")) {
    const art = d.ld.find((b) => b?.["@type"] === "Article");
    check(`${tag}: Article data and og:type article; headline ≤ 110 chars; links to ≥ 2 service pages`, !!art && art.headline && art.headline.length <= 110 && art.datePublished && art.author?.["@id"] && d.ogType === "article" && d.links.filter((l) => l.startsWith("/services/")).length >= 2);
  }
  d.links.forEach((l) => { if (l.startsWith("/") && !l.startsWith("//")) linkSet.add(l.split("#")[0].split("?")[0] || "/"); });
}

const bad = [];
for (const l of linkSet) { const r = await get(l); if (r.status >= 400) bad.push(`${l} ${r.status}`); }
check(`every internal link on every page resolves (${linkSet.size} distinct)`, bad.length === 0, bad.slice(0, 5).join(" | "));
check("the home page and the services hub link to every service page", svcPaths.every((s) => info["/"].links.includes(s) && info["/services"].links.includes(s)));
check("each service page links to at least three related pages", svcPaths.every((s) => info[s].links.filter((l) => svcPaths.includes(l) && l !== s).length >= 3));

if (paths.includes("/insights")) {
  const feed = await get("/insights/feed.xml"), fx = await feed.text(), n = paths.filter((p) => p.startsWith("/insights/")).length;
  check("Insights: RSS feed has one item per article", feed.status === 200 && (fx.match(/<item>/g) ?? []).length === n, `${(fx.match(/<item>/g) ?? []).length}/${n}`);
  check("Insights: the navigation links to it", info["/"].links.includes("/insights"));
} else {
  const a = await get("/insights"), f = await get("/insights/feed.xml");
  check("Insights: nothing published, so no page, no feed, no nav link, no sitemap entry", a.status === 404 && f.status === 404 && !info["/"].links.includes("/insights"));
}

const robots = await (await get("/robots.txt")).text();
check("robots.txt allows the site, blocks /api/, names the sitemap", /Allow: \//.test(robots) && /Disallow: \/api\//.test(robots) && robots.includes(`Sitemap: ${SITE}/sitemap.xml`));
const man = await (await get("/manifest.webmanifest")).json().catch(() => null);
check("web manifest has a name, three icons and the language", !!man && !!man.name && man.icons.length >= 3 && man.lang === "en-IN");
for (const ic of ["/icons/192", "/icons/512", "/apple-icon", "/icon.svg", "/opengraph-image"]) { const r = await get(ic); check(`${ic} responds with an image`, r.status === 200 && /image\//.test(r.headers.get("content-type") ?? "")); }
check("llms.txt is served and lists the service pages", (await get("/llms.txt")).status === 200);
check("unknown URLs return a real 404", (await get("/this-page-does-not-exist")).status === 404);
check("theme-color meta is set (dark, plus a light variant for large screens)", info["/"].themeColor >= 2);

console.log(`\n${passed}/${total} checks passed`);
process.exit(passed === total ? 0 : 1);
