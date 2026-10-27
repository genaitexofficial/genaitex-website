import { Gauge, Layers, MessageCircle, ShieldCheck } from "lucide-react";
import { GlowCard } from "@/components/ui/GlowCard";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { principles } from "@/lib/services";

const icons = [Gauge, Layers, MessageCircle, ShieldCheck];

export function WhyUs() {
  return (
    <section className="mx-auto max-w-7xl px-5 py-24 sm:px-8">
      <div className="grid gap-14 lg:grid-cols-[1fr_1.5fr] lg:gap-20">
        <SectionHeading
          className="lg:sticky lg:top-28 lg:self-start"
          eyebrow="Why genaitex"
          title={
            <>
              Engineering rigour, <span className="text-gradient">design taste.</span>
            </>
          }
          description="Great sites are built on the details people never see: clean code, fast delivery and honest communication. That is the standard we hold every project to."
        />

        <div className="grid gap-5 sm:grid-cols-2">
          {principles.map((p, i) => {
            const Icon = icons[i];
            return (
              <Reveal key={p.title} delay={i * 0.08} className="h-full">
                <GlowCard className="h-full p-7">
                  <Icon className="h-6 w-6 text-violet-soft" aria-hidden />
                  <h3 className="mt-5 text-lg font-semibold tracking-tight">{p.title}</h3>
                  <p className="mt-2 text-pretty text-sm leading-relaxed text-muted">{p.body}</p>
                </GlowCard>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
