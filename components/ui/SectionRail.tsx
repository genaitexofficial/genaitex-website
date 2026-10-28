"use client";

import { useEffect, useState } from "react";
import { clsx } from "clsx";

/**
 * A slim numbered rail pinned to the left edge on wide screens, echoing the chapter rail on the home
 * stage. Highlights the section in view; labels appear on hover or keyboard focus.
 */
export function SectionRail({ items }: { items: { id: string; label: string }[] }) {
  const [active, setActive] = useState(items[0]?.id);

  useEffect(() => {
    const els = items.map((i) => document.getElementById(i.id)).filter((el): el is HTMLElement => !!el);
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(e.target.id);
      },
      { rootMargin: "-40% 0px -55% 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [items]);

  return (
    <nav aria-label="On this page" className="fixed left-5 top-1/2 z-30 hidden -translate-y-1/2 xl:block">
      <ol className="relative space-y-5 border-l border-line pl-4">
        {items.map((item, i) => {
          const on = item.id === active;
          return (
            <li key={item.id} className="relative">
              <span
                aria-hidden
                className={clsx(
                  "absolute -left-[1.28rem] top-1.5 h-2 w-2 rounded-full transition-all duration-300",
                  on ? "dot-glow scale-125" : "bg-line-strong",
                )}
              />
              <a
                href={`#${item.id}`}
                aria-current={on ? "location" : undefined}
                className={clsx(
                  "group flex items-center gap-3 font-mono text-[11px] transition-colors",
                  on ? "text-cyan" : "text-subtle hover:text-fg",
                )}
              >
                <span className="tabular-nums">{String(i + 1).padStart(2, "0")}</span>
                <span className="pointer-events-none -ml-1 max-w-0 overflow-hidden whitespace-nowrap uppercase tracking-[0.16em] opacity-0 transition-all duration-300 group-hover:max-w-40 group-hover:opacity-100 group-focus-visible:max-w-40 group-focus-visible:opacity-100">
                  {item.label}
                </span>
              </a>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
