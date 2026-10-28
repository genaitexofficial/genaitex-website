import { site } from "@/lib/site";
import { hasLiveInsights, visibleArticles } from "@/lib/insights";

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

/** RSS feed of the published articles (there is no feed until one is published). */
export function GET() {
  if (!hasLiveInsights) return new Response("Not found", { status: 404 });
  const items = visibleArticles();
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
<channel>
<title>${esc(site.name)} insights</title>
<link>${site.url}/insights</link>
<description>Guides on websites, AI automation, CRM and growth from ${esc(site.name)}.</description>
<language>en-IN</language>
<atom:link href="${site.url}/insights/feed.xml" rel="self" type="application/rss+xml"/>
${items
  .map(
    (a) => `<item>
<title>${esc(a.title)}</title>
<link>${site.url}/insights/${a.slug}</link>
<guid isPermaLink="true">${site.url}/insights/${a.slug}</guid>
<pubDate>${new Date(a.published).toUTCString()}</pubDate>
<description>${esc(a.description)}</description>
</item>`,
  )
  .join("\n")}
</channel>
</rss>
`;
  return new Response(xml, { headers: { "Content-Type": "application/rss+xml; charset=utf-8" } });
}
