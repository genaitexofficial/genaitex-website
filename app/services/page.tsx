import type { Metadata } from "next";
import { Check } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Reveal } from "@/components/ui/Reveal";
import { GlowCard } from "@/components/ui/GlowCard";
import { ServiceIcon } from "@/components/ui/ServiceIcon";
import { Button } from "@/components/ui/Button";
import { Process } from "@/components/home/Process";
import { CTA } from "@/components/home/CTA";
import { services } from "@/lib/services";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Static websites, custom Shopify storefronts and bespoke web development: designed and built end to end.",
  alternates: { canonical: "/services" },
};

export default function ServicesPage() {
  return (
    <>
      <PageHeader
        eyebrow="Services"
        title={
          <>
            Everything you need to <span className="text-gradient">launch and grow.</span>
          </>
        }
        description="From a single sharp landing page to a full headless storefront or a custom platform, one team takes it from idea to live."
      />

      <div className="mx-auto max-w-7xl space-y-8 px-5 pb-12 sm:px-8">
        {services.map((s) => (
          <section key={s.slug} id={s.slug} aria-labelledby={`${s.slug}-title`}>
            <Reveal>
              <GlowCard className="grid gap-10 p-8 sm:p-12 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
                <div>
                  <ServiceIcon name={s.icon} />
                  <h2
                    id={`${s.slug}-title`}
                    className="mt-7 text-3xl font-semibold tracking-tight sm:text-4xl"
                  >
                    {s.title}
                  </h2>
                  <p className="mt-5 text-pretty text-lg leading-relaxed text-muted">{s.pitch}</p>
                  <p className="mt-6 text-pretty leading-relaxed text-muted">
                    <span className="font-medium text-fg">Ideal for: </span>
                    {s.idealFor}
                  </p>

                  <ul className="mt-8 flex flex-wrap gap-2" aria-label="Technologies">
                    {s.stack.map((t) => (
                      <li
                        key={t}
                        className="rounded-md bg-white/[0.05] px-2.5 py-1 font-mono text-xs text-muted"
                      >
                        {t}
                      </li>
                    ))}
                  </ul>

                  <div className="mt-10">
                    <Button href="/contact">Discuss this project</Button>
                  </div>
                </div>

                <div>
                  <h3 className="eyebrow mb-6">What&apos;s included</h3>
                  <ul className="space-y-4">
                    {s.includes.map((item) => (
                      <li key={item} className="flex gap-3.5 leading-relaxed text-muted">
                        <Check className="mt-1 h-4 w-4 shrink-0 text-cyan" aria-hidden />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </GlowCard>
            </Reveal>
          </section>
        ))}
      </div>

      <Process />
      <CTA />
    </>
  );
}
