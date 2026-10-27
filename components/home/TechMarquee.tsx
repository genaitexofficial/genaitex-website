import { techMarquee } from "@/lib/services";

export function TechMarquee() {
  return (
    <section aria-label="Technologies we work with" className="border-y border-line py-8">
      <p className="eyebrow mb-6 text-center !text-subtle">Technologies we work with</p>
      <div
        className="group flex overflow-hidden [mask-image:linear-gradient(to_right,transparent,#000_12%,#000_88%,transparent)]"
      >
        {[0, 1].map((copy) => (
          <ul
            key={copy}
            aria-hidden={copy === 1}
            className="flex min-w-full shrink-0 animate-marquee items-center justify-around gap-12 pr-12 group-hover:[animation-play-state:paused]"
          >
            {techMarquee.map((name) => (
              <li
                key={name}
                className="whitespace-nowrap font-mono text-lg text-subtle transition-colors hover:text-fg"
              >
                {name}
              </li>
            ))}
          </ul>
        ))}
      </div>
    </section>
  );
}
