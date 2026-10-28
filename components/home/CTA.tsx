import { ArrowRight, Mail } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { site, whatsappLink } from "@/lib/site";

export function CTA() {
  const wa = whatsappLink();

  return (
    <section className="mx-auto max-w-7xl px-5 pt-12 sm:px-8">
      <Reveal>
        <div className="relative isolate overflow-hidden rounded-[2rem] border border-line-strong bg-surface px-6 py-20 text-center sm:px-16">
          <div
            aria-hidden
            className="absolute inset-0 -z-10 cta-glow"
          />
          <div aria-hidden className="bg-grid absolute inset-0 -z-10 opacity-60" />

          <p className="eyebrow mb-5">Let&apos;s build it</p>
          <h2 className="mx-auto max-w-3xl text-balance text-4xl font-semibold leading-[1.08] tracking-tight sm:text-6xl">
            Have a project in mind? <span className="text-gradient">Let&apos;s talk.</span>
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-pretty text-lg text-muted">
            Tell us what you&apos;re building. You&apos;ll get a thoughtful reply with next steps,
            usually within one business day.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button href="/contact" size="lg">
              Start a project <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Button>
            <Button href={`mailto:${site.email}`} size="lg" variant="secondary">
              <Mail className="h-5 w-5" /> {site.email}
            </Button>
            {wa && (
              <Button href={wa} size="lg" variant="ghost">
                Chat on WhatsApp
              </Button>
            )}
          </div>
        </div>
      </Reveal>
    </section>
  );
}
