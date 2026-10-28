import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Reveal } from "@/components/ui/Reveal";
import { CTA } from "@/components/home/CTA";
import { JsonLd } from "@/components/seo/JsonLd";
import { collectionJsonLd } from "@/lib/jsonld";
import { hasLiveInsights, readingMinutes, visibleArticles } from "@/lib/insights";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Insights on Websites, AI Automation & Growth",
  description:
    "Plain-language guides from genaitex on website costs, online stores, AI automation, CRM and choosing between ready-made and custom builds.",
  path: "/insights",
  feed: "/insights/feed.xml",
});

const dateFormat = new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });

export default function InsightsPage() {
  // No articles published yet: there is no page (rather than a thin one)
  if (!hasLiveInsights) notFound();
  const items = visibleArticles();

  return (
    <>
      <JsonLd
        data={collectionJsonLd({
          name: "genaitex insights",
          description: "Guides on websites, AI automation, CRM and growth from genaitex.",
          path: "/insights",
          items: items.map((a) => ({ name: a.title, path: `/insights/${a.slug}` })),
        })}
      />
      <PageHeader
        crumbs={[{ name: "Insights", path: "/insights" }]}
        eyebrow="Insights"
        title={
          <>
            Plain answers on <span className="text-gradient">websites, AI and growth.</span>
          </>
        }
        description="Short guides for people deciding what to build, what it costs and what to ask for."
      />
      <section className="mx-auto max-w-4xl px-5 pb-12 sm:px-8">
        <ul className="space-y-5">
          {items.map((a, i) => (
            <li key={a.slug}>
              <Reveal delay={i * 0.05}>
                <Link
                  href={`/insights/${a.slug}`}
                  className="group block rounded-3xl border border-line p-7 transition-colors hover:border-line-strong sm:p-9"
                >
                  <p className="eyebrow mb-3">
                    {a.category} · {dateFormat.format(new Date(a.published))} · {readingMinutes(a)} min read
                  </p>
                  <h2 className="text-balance text-2xl font-semibold tracking-tight sm:text-3xl">{a.title}</h2>
                  <p className="mt-3 text-pretty text-muted">{a.description}</p>
                  <span className="mt-5 inline-flex items-center gap-1.5 text-sm text-fg">
                    Read the guide{" "}
                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" aria-hidden />
                  </span>
                </Link>
              </Reveal>
            </li>
          ))}
        </ul>
      </section>
      <CTA />
    </>
  );
}
