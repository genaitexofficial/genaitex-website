import { HelixMotif } from "./HelixMotif";
import { Reveal } from "./Reveal";

/** Hero block for inner pages. Renders the page's single <h1>. */
export function PageHeader({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: React.ReactNode;
  description?: React.ReactNode;
}) {
  return (
    <header className="relative isolate overflow-hidden pb-16 pt-36 sm:pt-44">
      <div aria-hidden className="bg-grid absolute inset-0 -z-10" />
      <div
        aria-hidden
        className="absolute -top-40 left-1/2 -z-10 h-[640px] w-[1000px] -translate-x-1/2 bg-[radial-gradient(closest-side,rgba(139,92,246,0.22),transparent)]"
      />
      <HelixMotif className="absolute right-[4%] top-8 -z-10 hidden h-[560px] w-[190px] rotate-[24deg] opacity-60 md:block lg:right-[10%]" />
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <p className="eyebrow mb-5">{eyebrow}</p>
        <h1 className="max-w-4xl text-balance text-5xl font-semibold leading-[1.04] tracking-tight sm:text-6xl lg:text-7xl">
          {title}
        </h1>
        {description && (
          <Reveal delay={0.1}>
            <p className="mt-8 max-w-2xl text-pretty text-lg leading-relaxed text-muted sm:text-xl">
              {description}
            </p>
          </Reveal>
        )}
      </div>
    </header>
  );
}
