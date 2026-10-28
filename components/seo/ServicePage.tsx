import Link from "next/link";
import { ArrowRight, Check, Plus } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { GlowCard } from "@/components/ui/GlowCard";
import { Button } from "@/components/ui/Button";
import { Price } from "@/components/currency/Price";
import { CTA } from "@/components/home/CTA";
import { JsonLd } from "./JsonLd";
import { faqJsonLd, serviceJsonLd } from "@/lib/jsonld";
import { getSeoPage, type SeoPage } from "@/lib/seoPages";
import { services, websitePricing } from "@/lib/services";

/** One service page: what it is, what you get, starting prices, how it works, who it is for, FAQs, related pages. */
export function ServicePage({ page }: { page: SeoPage }) {
  const service = services.find((s) => s.slug === page.service);
  const tiers = (page.tierIds ?? []).map((id) => websitePricing.find((t) => t.id === id)).filter((t) => !!t);
  const contact = `/contact?type=${page.contactType}${page.plan ? `&plan=${page.plan}` : ""}`;
  const ctaLabel = page.slug === "ready-made-ui-websites" ? "Browse & book" : (service?.startLabel ?? "Start a project");
  const related = page.related.map((slug) => getSeoPage(slug)).filter((p) => !!p);

  return (
    <>
      <JsonLd data={serviceJsonLd(page)} />
      <JsonLd data={faqJsonLd(page.faqs)} />

      <PageHeader
        eyebrow={page.eyebrow}
        title={page.h1}
        description={page.description}
        crumbs={[
          { name: "Services", path: "/services" },
          { name: page.name, path: `/services/${page.slug}` },
        ]}
      />

      {/* Overview */}
      <section className="mx-auto max-w-7xl px-5 pb-8 sm:px-8">
        <div className="grid gap-12 lg:grid-cols-[1.5fr_1fr] lg:gap-16">
          <Reveal>
            <div className="space-y-6 text-pretty text-lg leading-relaxed text-muted">
              {page.intro.map((p) => (
                <p key={p.slice(0, 24)}>{p}</p>
              ))}
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <GlowCard className="p-7 lg:sticky lg:top-28">
              <h2 className="eyebrow mb-5">{tiers.length > 0 ? "Starting prices" : "Pricing"}</h2>
              {tiers.length > 0 ? (
                <ul className="space-y-5">
                  {tiers.map((t) => (
                    <li key={t.id} className="border-b border-line pb-5 last:border-0 last:pb-0">
                      <p className="font-medium text-fg">{t.label}</p>
                      {t.detail && <p className="mt-1 text-sm text-muted">{t.detail}</p>}
                      <p className="mt-2 font-mono text-lg tracking-tight text-cyan">
                        {t.priceLabel ?? <Price inr={t.inr} />}
                      </p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-pretty leading-relaxed text-muted">
                  Priced per project. Tell us what you need and we reply with a clear quote, usually within one business
                  day.
                </p>
              )}
              {tiers.length > 0 && (
                <p className="mt-5 text-sm text-subtle">
                  Prices are starting points; the final amount is confirmed in your quote.
                </p>
              )}
              <div className="mt-6">
                <Button href={contact} size="lg" className="w-full">
                  {ctaLabel} <ArrowRight className="h-5 w-5" aria-hidden />
                </Button>
              </div>
            </GlowCard>
          </Reveal>
        </div>
      </section>

      {/* What you get */}
      <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8">
        <SectionHeading eyebrow="What you get" title={`What\u2019s included with ${page.name.toLowerCase()}`} />
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {page.points.map((p, i) => (
            <Reveal key={p.title} delay={(i % 3) * 0.08} className="h-full">
              <GlowCard className="h-full p-7">
                <Check className="h-5 w-5 text-cyan" aria-hidden />
                <h3 className="mt-4 text-lg font-semibold tracking-tight">{p.title}</h3>
                <p className="mt-2 text-pretty text-sm leading-relaxed text-muted">{p.body}</p>
              </GlowCard>
            </Reveal>
          ))}
        </div>
        {service && service.stack.length > 0 && (
          <Reveal className="mt-10">
            <p className="eyebrow mb-4">Built with</p>
            <ul className="flex flex-wrap gap-2">
              {service.stack.map((t) => (
                <li key={t} className="rounded-full border border-line px-4 py-2 text-sm text-muted">
                  {t}
                </li>
              ))}
            </ul>
          </Reveal>
        )}
      </section>

      {/* How it works + who it is for */}
      <section className="mx-auto max-w-7xl px-5 py-12 sm:px-8">
        <div className="grid gap-14 lg:grid-cols-[1.4fr_1fr] lg:gap-20">
          <div>
            <SectionHeading eyebrow="How it works" title={`How a ${page.name.toLowerCase()} project runs`} />
            <ol className="mt-10 space-y-8">
              {page.steps.map((s, i) => (
                <li key={s.title}>
                  <Reveal delay={i * 0.06} className="flex gap-5">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-line-strong bg-surface font-mono text-sm text-cyan">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <div>
                      <h3 className="text-lg font-semibold tracking-tight">{s.title}</h3>
                      <p className="mt-1 text-pretty text-muted">{s.body}</p>
                    </div>
                  </Reveal>
                </li>
              ))}
            </ol>
          </div>
          <div>
            <SectionHeading eyebrow="Who it is for" title="Is this right for you?" />
            <Reveal delay={0.1}>
              <ul className="mt-10 space-y-4">
                {page.forWho.map((t) => (
                  <li key={t} className="flex gap-3 text-pretty leading-relaxed text-muted">
                    <ArrowRight className="mt-1 h-4 w-4 shrink-0 text-cyan" aria-hidden />
                    {t}
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="mx-auto max-w-4xl px-5 py-24 sm:px-8">
        <SectionHeading eyebrow="Questions" title={`${page.name}: common questions`} />
        <div className="mt-12 divide-y divide-line rounded-3xl border border-line">
          {page.faqs.map((f) => (
            <details key={f.q} className="group px-6 py-5 sm:px-8">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-6 text-lg font-medium tracking-tight [&::-webkit-details-marker]:hidden">
                {f.q}
                <Plus
                  className="h-5 w-5 shrink-0 text-muted transition-transform duration-300 group-open:rotate-45"
                  aria-hidden
                />
              </summary>
              <p className="mt-4 max-w-3xl text-pretty leading-relaxed text-muted">{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* Related */}
      {related.length > 0 && (
        <section className="mx-auto max-w-7xl px-5 pb-8 sm:px-8">
          <SectionHeading eyebrow="Related" title="Related services" />
          <ul className="mt-10 grid gap-5 sm:grid-cols-3">
            {related.map((p) => (
              <li key={p.slug}>
                <Link
                  href={`/services/${p.slug}`}
                  className="group flex h-full flex-col rounded-3xl border border-line p-7 transition-colors hover:border-line-strong"
                >
                  <span className="text-lg font-semibold tracking-tight">{p.name}</span>
                  <span className="mt-2 flex-1 text-pretty text-sm leading-relaxed text-muted">{p.description}</span>
                  <span className="mt-5 inline-flex items-center gap-1.5 text-sm text-fg">
                    Read more <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" aria-hidden />
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
