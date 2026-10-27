import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { GlowCard } from "@/components/ui/GlowCard";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ServiceIcon } from "@/components/ui/ServiceIcon";
import { services } from "@/lib/services";

export function ServicesGrid() {
  return (
    <section className="mx-auto max-w-7xl px-5 py-28 sm:px-8">
      <SectionHeading
        eyebrow="What we build"
        title={
          <>
            Three ways we help you <span className="text-gradient">grow online.</span>
          </>
        }
        description="Whether you need a sharp presence, a store that sells, or software that does something no template can, we design and build it end to end."
      />

      <div className="mt-14 grid gap-6 lg:grid-cols-3">
        {services.map((s, i) => (
          <Reveal key={s.slug} delay={i * 0.1} className="h-full">
            <GlowCard className="group flex h-full flex-col p-8">
              <ServiceIcon name={s.icon} />
              <h3 className="mt-7 text-2xl font-semibold tracking-tight">{s.title}</h3>
              <p className="mt-3 text-pretty leading-relaxed text-muted">{s.summary}</p>

              <ul className="mt-6 space-y-3 text-sm text-muted">
                {s.includes.slice(0, 3).map((item) => (
                  <li key={item} className="flex gap-3">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-cyan" aria-hidden />
                    {item}
                  </li>
                ))}
              </ul>

              <Link
                href={`/services#${s.slug}`}
                className="mt-auto inline-flex items-center gap-2 pt-8 text-sm font-medium text-fg"
              >
                <span className="underline decoration-white/20 underline-offset-4 transition-colors group-hover:decoration-cyan">
                  Explore {s.title.toLowerCase()}
                </span>
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden />
              </Link>
            </GlowCard>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
