import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { seoPages } from "@/lib/seoPages";

/** Every service page, as plain links with a line of description: the way search engines and visitors find them. */
export function ServiceDirectory() {
  return (
    <section aria-labelledby="all-services-title" className="mx-auto max-w-7xl px-5 py-24 sm:px-8">
      <SectionHeading
        eyebrow="All services"
        title={<span id="all-services-title">Every service, in detail</span>}
        description="One page for each, with what you get, starting prices, how it works and answers to the questions people ask."
      />
      <ul className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {seoPages.map((p, i) => (
          <li key={p.slug}>
            <Reveal delay={(i % 3) * 0.06} className="h-full">
              <Link
                href={`/services/${p.slug}`}
                className="group flex h-full flex-col rounded-3xl border border-line p-7 transition-colors hover:border-line-strong"
              >
                <span className="eyebrow mb-3">{p.eyebrow}</span>
                <span className="text-xl font-semibold tracking-tight">{p.name}</span>
                <span className="mt-2 flex-1 text-pretty text-sm leading-relaxed text-muted">{p.description}</span>
                <span className="mt-5 inline-flex items-center gap-1.5 text-sm text-fg">
                  Read more <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" aria-hidden />
                </span>
              </Link>
            </Reveal>
          </li>
        ))}
      </ul>
    </section>
  );
}
