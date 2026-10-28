import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { CTA } from "@/components/home/CTA";
import { ArticleBody } from "@/components/seo/ArticleBody";
import { JsonLd } from "@/components/seo/JsonLd";
import { articleJsonLd } from "@/lib/jsonld";
import { articles, getArticle, readingMinutes } from "@/lib/insights";
import { pageMetadata } from "@/lib/seo";
import { getSeoPage } from "@/lib/seoPages";

// Every article gets a route (a draft that is not shown answers 404), so the list is never empty
export function generateStaticParams() {
  return articles.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: PageProps<"/insights/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const a = getArticle(slug);
  if (!a) return {};
  return pageMetadata({
    title: a.title,
    description: a.description,
    path: `/insights/${a.slug}`,
    type: "article",
    publishedTime: a.published,
    modifiedTime: a.updated ?? a.published,
    ownImage: true,
  });
}

const dateFormat = new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });

export default async function ArticlePage({ params }: PageProps<"/insights/[slug]">) {
  const { slug } = await params;
  const a = getArticle(slug);
  if (!a) notFound();
  const related = a.related.map((s) => getSeoPage(s)).filter((p) => !!p);

  return (
    <>
      <JsonLd
        data={articleJsonLd({
          title: a.title,
          description: a.description,
          path: `/insights/${a.slug}`,
          published: a.published,
          updated: a.updated,
        })}
      />
      <PageHeader
        crumbs={[
          { name: "Insights", path: "/insights" },
          { name: a.title, path: `/insights/${a.slug}` },
        ]}
        eyebrow={`${a.category} · ${dateFormat.format(new Date(a.published))} · ${readingMinutes(a)} min read`}
        title={a.title}
        description={a.description}
      />
      <article className="mx-auto max-w-3xl px-5 pb-16 sm:px-8">
        <div className="dna-node">
          <ArticleBody blocks={a.blocks} />
        </div>
      </article>

      {related.length > 0 && (
        <section className="mx-auto max-w-7xl px-5 pb-8 sm:px-8">
          <SectionHeading eyebrow="Related" title="Services mentioned in this guide" />
          <ul className="mt-10 grid gap-5 sm:grid-cols-3">
            {related.map((p) => (
              <li key={p.slug}>
                <Link
                  href={`/services/${p.slug}`}
                  className="dna-node group flex h-full flex-col rounded-3xl border border-line p-7 transition-colors hover:border-line-strong"
                >
                  <span className="text-lg font-semibold tracking-tight">{p.name}</span>
                  <span className="mt-2 flex-1 text-pretty text-sm leading-relaxed text-muted">{p.description}</span>
                  <span className="mt-5 inline-flex items-center gap-1.5 text-sm text-fg">
                    Read more{" "}
                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" aria-hidden />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
      <CTA />
    </>
  );
}
