import { ArrowRight, Code, Globe, Store } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { HeroScene } from "./HeroScene";
import { site } from "@/lib/site";

const pillars = [
  { icon: Globe, label: "Static websites" },
  { icon: Store, label: "Shopify storefronts" },
  { icon: Code, label: "Custom development" },
];

export function Hero() {
  return (
    <section className="relative isolate flex min-h-[100svh] items-center overflow-hidden pb-20 pt-32">
      <div className="bg-grid absolute inset-0 -z-10" aria-hidden />
      <div
        aria-hidden
        className="absolute -left-40 top-0 -z-10 h-[800px] w-[800px] bg-[radial-gradient(closest-side,rgba(139,92,246,0.24),transparent)]"
      />

      {/* 3D scene sits dimmed behind the text on tablets, and fills the right side on large screens.
          Its left edge fades out so particles never run through the copy. */}
      <div className="absolute inset-y-0 right-0 -z-10 w-full opacity-40 lg:w-[60%] lg:opacity-100 lg:[mask-image:linear-gradient(to_right,transparent_0%,#000_50%)]">
        <HeroScene />
      </div>

      <div className="mx-auto w-full max-w-7xl px-5 sm:px-8">
        <div className="max-w-3xl">
          {site.availability && (
            <Reveal y={12}>
              <p className="glass mb-8 inline-flex items-center gap-3 rounded-full py-2 pl-4 pr-5 text-sm text-muted">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inset-0 animate-pulse-ring rounded-full bg-emerald-400" />
                  <span className="relative h-2 w-2 rounded-full bg-emerald-400" />
                </span>
                {site.availability}
              </p>
            </Reveal>
          )}

          {/* The headline is not animated in so it paints immediately (best LCP). */}
          <h1 className="text-balance text-5xl font-semibold leading-[1.02] tracking-tight sm:text-6xl lg:text-7xl xl:text-[5.5rem]">
            Websites &amp; storefronts{" "}
            <span className="text-gradient">engineered to convert.</span>
          </h1>

          <Reveal delay={0.15}>
            <p className="mt-8 max-w-2xl text-pretty text-lg leading-relaxed text-muted sm:text-xl">
              {site.name} is a development studio building lightning-fast static sites, custom
              Shopify storefronts and bespoke software: from first sketch to launch, and beyond.
            </p>
          </Reveal>

          <Reveal delay={0.25}>
            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <Button href="/contact" size="lg">
                Start a project
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Button>
              <Button href="/work" size="lg" variant="secondary">
                View our work
              </Button>
            </div>
          </Reveal>

          <Reveal delay={0.35}>
            <ul className="mt-14 flex flex-wrap gap-x-8 gap-y-3 font-mono text-sm text-subtle">
              {pillars.map(({ icon: Icon, label }) => (
                <li key={label} className="flex items-center gap-2.5">
                  <Icon className="h-4 w-4 text-cyan" aria-hidden />
                  {label}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
