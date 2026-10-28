import { Check } from "lucide-react";
import type { Block } from "@/lib/insights";

/** The body of an Insights article: headings, paragraphs, lists and a closing note, in a readable column. */
export function ArticleBody({ blocks }: { blocks: Block[] }) {
  return (
    <div className="space-y-6 text-pretty text-lg leading-relaxed text-muted">
      {blocks.map((b, i) => {
        switch (b.type) {
          case "h2":
            return (
              <h2 key={i} className="!mt-14 text-balance text-3xl font-semibold leading-tight tracking-tight text-fg">
                {b.text}
              </h2>
            );
          case "p":
            return <p key={i}>{b.text}</p>;
          case "ul":
            return (
              <ul key={i} className="space-y-3">
                {b.items.map((t) => (
                  <li key={t} className="flex gap-3">
                    <Check className="mt-1.5 h-4 w-4 shrink-0 text-cyan" aria-hidden />
                    <span>{t}</span>
                  </li>
                ))}
              </ul>
            );
          case "ol":
            return (
              <ol key={i} className="space-y-3">
                {b.items.map((t, n) => (
                  <li key={t} className="flex gap-4">
                    <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-line-strong font-mono text-xs text-cyan">
                      {n + 1}
                    </span>
                    <span>{t}</span>
                  </li>
                ))}
              </ol>
            );
          case "note":
            return (
              <p key={i} className="rounded-2xl border border-line-strong bg-wash/[0.04] px-6 py-5 text-base text-fg">
                {b.text}
              </p>
            );
        }
      })}
    </div>
  );
}
