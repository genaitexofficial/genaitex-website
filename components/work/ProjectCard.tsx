import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { GlowCard } from "@/components/ui/GlowCard";
import { BrowserMockup } from "./BrowserMockup";
import { categoryLabels, type Project } from "@/lib/projects";

export function hostFor(p: Pick<Project, "title" | "slug" | "url" | "isSample">) {
  if (p.url) return p.url.replace(/^https?:\/\//, "").replace(/\/$/, "");
  return `${p.title.toLowerCase().replace(/[^a-z0-9]+/g, "")}.example`;
}

/**
 * Only the title is a link; its ::after stretches over the whole card so the entire card is clickable.
 * That keeps the link's accessible name short while the visual card stays one big target.
 * `headingLevel` lets each page keep a valid heading order (h2 under an h1, h3 under an h2).
 */
export function ProjectCard({
  project,
  headingLevel: Heading = "h3",
}: {
  project: Project;
  headingLevel?: "h2" | "h3";
}) {
  return (
    <GlowCard className="group h-full p-3">
      <div className="flex h-full flex-col">
        <div className="overflow-hidden rounded-2xl">
          <BrowserMockup
            variant={project.mock}
            accent={project.accent}
            host={hostFor(project)}
            className="transition-transform duration-700 ease-out group-hover:scale-[1.03]"
          />
        </div>

        <div className="flex flex-1 flex-col px-3 pb-3 pt-6">
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <span className="rounded-full border border-line px-3 py-1 font-mono text-[11px] uppercase tracking-wider text-violet-soft">
              {categoryLabels[project.category]}
            </span>
            {project.isSample && (
              <span className="rounded-full border border-line px-3 py-1 font-mono text-[11px] uppercase tracking-wider text-subtle">
                Concept
              </span>
            )}
          </div>

          <div className="flex items-start justify-between gap-4">
            <Heading className="text-2xl font-semibold tracking-tight">
              <Link
                href={`/work/${project.slug}`}
                className="outline-none after:absolute after:inset-0 after:rounded-3xl focus-visible:after:outline focus-visible:after:outline-2 focus-visible:after:outline-offset-2 focus-visible:after:outline-cyan"
              >
                {project.title}
              </Link>
            </Heading>
            <ArrowUpRight
              aria-hidden
              className="mt-1 h-5 w-5 shrink-0 text-subtle transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-cyan"
            />
          </div>
          <p className="mt-2 text-pretty leading-relaxed text-muted">{project.summary}</p>

          <ul className="mt-auto flex flex-wrap gap-2 pt-5">
            {project.stack.slice(0, 4).map((s) => (
              <li
                key={s}
                className="rounded-md bg-white/[0.05] px-2.5 py-1 font-mono text-xs text-muted"
              >
                {s}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </GlowCard>
  );
}
