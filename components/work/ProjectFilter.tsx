"use client";

import { useState } from "react";
import { AnimatePresence, LazyMotion } from "motion/react";
import * as m from "motion/react-m";
import { clsx } from "clsx";
import { ProjectCard } from "./ProjectCard";
import { categoryLabels, type Category, type Project } from "@/lib/projects";

type Filter = "all" | Category;

// Layout animations need the larger feature set; load it only where the filter grid is used.
const loadMax = () => import("./motion-max").then((mod) => mod.default);

const filters: { id: Filter; label: string }[] = [
  { id: "all", label: "All work" },
  { id: "static", label: categoryLabels.static },
  { id: "shopify", label: categoryLabels.shopify },
  { id: "custom", label: categoryLabels.custom },
];

type GridProps = { projects: Project[]; headingLevel?: "h2" | "h3" };

export function ProjectFilter(props: GridProps) {
  return (
    <LazyMotion features={loadMax} strict>
      <FilterGrid {...props} />
    </LazyMotion>
  );
}

function FilterGrid({ projects, headingLevel }: GridProps) {
  const [active, setActive] = useState<Filter>("all");
  const visible = active === "all" ? projects : projects.filter((p) => p.category === active);

  return (
    <div>
      <div role="group" aria-label="Filter projects by type" className="flex flex-wrap gap-2">
        {filters.map((f) => {
          const count = f.id === "all" ? projects.length : projects.filter((p) => p.category === f.id).length;
          return (
            <button
              key={f.id}
              type="button"
              aria-pressed={active === f.id}
              onClick={() => setActive(f.id)}
              className={clsx(
                "rounded-full border px-5 py-2.5 text-sm transition-colors",
                active === f.id
                  ? "border-transparent bg-fg text-ink"
                  : "border-line text-muted hover:border-line-strong hover:text-fg",
              )}
            >
              {f.label}
              <span className={clsx("ml-2 font-mono text-xs", active === f.id ? "text-ink/60" : "text-subtle")}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      <m.ul layout className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {visible.map((p) => (
            <m.li
              key={p.slug}
              layout
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="dna-node h-full">
                <ProjectCard project={p} headingLevel={headingLevel} />
              </div>
            </m.li>
          ))}
        </AnimatePresence>
      </m.ul>
    </div>
  );
}
