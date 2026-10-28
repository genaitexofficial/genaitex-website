import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { processSteps } from "@/lib/services";

export function Process() {
  return (
    <section className="relative mx-auto max-w-7xl px-5 py-28 sm:px-8">
      <SectionHeading
        eyebrow="How we work"
        title={
          <>
            A clear process, <span className="text-gradient">no surprises.</span>
          </>
        }
        description="Five stages, a live preview link from day one, and a fixed scope agreed up front."
      />

      <ol className="relative mt-16 grid gap-10 lg:grid-cols-5 lg:gap-6">
        {/* connecting line (desktop) */}
        <div
          aria-hidden
          className="absolute left-0 right-0 top-[19px] hidden h-px step-rule lg:block"
        />
        {processSteps.map((step, i) => (
          <li key={step.title}>
            <Reveal delay={i * 0.08} className="relative">
              <span className="relative z-10 mb-6 flex h-10 w-10 items-center justify-center rounded-full border border-line-strong bg-surface font-mono text-sm text-cyan">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="text-xl font-semibold tracking-tight">{step.title}</h3>
              <p className="mt-3 text-pretty text-sm leading-relaxed text-muted">{step.body}</p>
            </Reveal>
          </li>
        ))}
      </ol>
    </section>
  );
}
