"use client";

import { useRef, useState, type KeyboardEvent } from "react";
import Link from "next/link";
import { ArrowRight, Check, Clock } from "lucide-react";
import { clsx } from "clsx";
import { Button } from "@/components/ui/Button";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ServiceIcon } from "@/components/ui/ServiceIcon";
import { services } from "@/lib/services";

/** The four options carry the same A / T / G / C base letters as the stage's cards. */
const letters = ["A", "T", "G", "C"];

/**
 * "Choose your starting point": pick one of the four options to see what's included, who it is for and
 * the tech behind it, then jump into the contact form with that option already selected.
 */
export function OptionPicker({
  id = "options",
  heading = "Choose your starting point",
  description = "Every project begins with one of four building blocks. Pick the closest fit to see exactly what is included, then tell us about it.",
}: {
  id?: string;
  heading?: React.ReactNode;
  description?: React.ReactNode;
}) {
  const [selected, setSelected] = useState(0);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);

  const select = (index: number, focus = false) => {
    const i = (index + services.length) % services.length;
    setSelected(i);
    if (focus) tabs.current[i]?.focus();
  };

  const onKeyDown = (e: KeyboardEvent, index: number) => {
    const keys: Record<string, number> = {
      ArrowRight: index + 1,
      ArrowDown: index + 1,
      ArrowLeft: index - 1,
      ArrowUp: index - 1,
      Home: 0,
      End: services.length - 1,
    };
    if (e.key in keys) {
      e.preventDefault();
      select(keys[e.key], true);
    }
  };

  const s = services[selected];

  return (
    <section id={id} aria-labelledby={`${id}-title`} className="mx-auto max-w-7xl px-5 py-28 sm:px-8">
      <SectionHeading
        eyebrow="Options"
        title={<span id={`${id}-title`}>{heading}</span>}
        description={description}
      />

      <div
        role="tablist"
        aria-label="Project options"
        className="dna-node mt-12 grid grid-cols-2 gap-3 lg:grid-cols-4"
      >
        {services.map((svc, i) => {
          const on = i === selected;
          return (
            <button
              key={svc.slug}
              ref={(el) => {
                tabs.current[i] = el;
              }}
              id={`${id}-tab-${svc.slug}`}
              role="tab"
              type="button"
              aria-selected={on}
              aria-controls={`${id}-panel`}
              tabIndex={on ? 0 : -1}
              onClick={() => select(i)}
              onKeyDown={(e) => onKeyDown(e, i)}
              className={clsx(
                "group relative flex flex-col items-start gap-3 rounded-2xl border p-4 text-left transition-colors sm:p-5",
                on
                  ? "picker-active border-cyan/60"
                  : "border-line bg-wash/[0.02] hover:border-line-strong hover:bg-wash/[0.04]",
              )}
            >
              <span className="flex w-full items-center justify-between">
                <ServiceIcon name={svc.icon} className="h-10 w-10 rounded-xl" />
                <span
                  aria-hidden
                  className={clsx(
                    "grid h-7 w-7 place-items-center rounded-full border font-mono text-xs transition-colors",
                    on ? "border-cyan/70 text-cyan" : "border-line-strong text-subtle",
                  )}
                >
                  {letters[i]}
                </span>
              </span>
              <span className="text-base font-semibold tracking-tight sm:text-lg">{svc.title}</span>
              <span className="hidden text-sm leading-snug text-muted sm:block">{svc.summary}</span>
            </button>
          );
        })}
      </div>

      <div
        id={`${id}-panel`}
        role="tabpanel"
        aria-labelledby={`${id}-tab-${s.slug}`}
        tabIndex={0}
        key={s.slug}
        className="glass dna-node mt-6 animate-fade-in rounded-3xl p-6 sm:p-10"
      >
        <div className="grid gap-10 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
          <div>
            <h3 className="text-2xl font-semibold tracking-tight sm:text-3xl">{s.title}</h3>
            <p className="mt-4 text-pretty leading-relaxed text-muted">{s.pitch}</p>
            <p className="mt-5 text-pretty leading-relaxed text-muted">
              <span className="font-medium text-fg">Ideal for: </span>
              {s.idealFor}
            </p>
            {s.timeline && (
              <p className="mt-4 flex items-center gap-2 text-sm text-muted">
                <Clock className="h-4 w-4 text-cyan" aria-hidden />
                <span>
                  <span className="font-medium text-fg">Typical timeline: </span>
                  {s.timeline}
                </span>
              </p>
            )}
            <ul className="mt-6 flex flex-wrap gap-2" aria-label="Technologies">
              {s.stack.map((t) => (
                <li key={t} className="rounded-md bg-wash/[0.05] px-2.5 py-1 font-mono text-xs text-muted">
                  {t}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="eyebrow mb-5">What&apos;s included</h4>
            <ul className="space-y-3.5">
              {s.includes.map((item) => (
                <li key={item} className="flex gap-3 leading-relaxed text-muted">
                  <Check className="mt-1 h-4 w-4 shrink-0 text-cyan" aria-hidden />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-wrap items-center gap-3 border-t border-line pt-8">
          <Button href={`/contact?type=${s.contactType}`} size="lg">
            {s.startLabel}
            <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" aria-hidden />
          </Button>
          <Link
            href={`/services#${s.slug}`}
            className="rounded-full border border-line-strong px-6 py-3.5 text-sm text-fg transition-colors hover:border-cyan/50"
          >
            Full details
          </Link>
        </div>
      </div>
    </section>
  );
}
