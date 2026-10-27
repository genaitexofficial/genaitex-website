import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, ArrowUpRight, Check } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";
import { GlowCard } from "@/components/ui/GlowCard";
import { BrowserMockup } from "@/components/work/BrowserMockup";
import { hostFor } from "@/components/work/ProjectCard";
import { CTA } from "@/components/home/CTA";
import { Parallax } from "@/components/ui/Parallax";
import { SectionRail } from "@/components/ui/SectionRail";
import { categoryLabels, getNextProject, getProject, projects } from "@/lib/projects";

const railItems = [
  { id: "overview", label: "Overview" },
  { id: "built", label: "What we built" },
  { id: "next", label: "Next project" },
];

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/work/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return {};
  return {
    title: project.title,
    description: project.summary,
    alternates: { canonical: `/work/${project.slug}` },
  };
}

export default async function CaseStudyPage({ params }: PageProps<"/work/[slug]">) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  const next = getNextProject(project.slug);

  return (
    <>
      <SectionRail items={railItems} />
      <header className="relative isolate overflow-hidden pb-12 pt-32 sm:pt-40">
        <div aria-hidden className="bg-grid absolute inset-0 -z-10" />
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <Link
            href="/work"
            className="mb-10 inline-flex items-center gap-2 text-sm text-muted transition-colors hover:text-fg"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden /> All work
          </Link>

          <div className="mb-6 flex flex-wrap items-center gap-2">
            <span className="rounded-full border border-line px-3 py-1 font-mono text-[11px] uppercase tracking-wider text-violet-soft">
              {categoryLabels[project.category]}
            </span>
            {project.isSample && (
              <span className="rounded-full border border-line px-3 py-1 font-mono text-[11px] uppercase tracking-wider text-subtle">
                Concept
              </span>
            )}
          </div>

          <h1 className="max-w-4xl text-balance text-5xl font-semibold leading-[1.04] tracking-tight sm:text-6xl lg:text-7xl">
            {project.title}
          </h1>
          <p className="mt-6 max-w-2xl text-pretty text-xl leading-relaxed text-muted">
            {project.tagline}
          </p>

          <dl className="mt-10 grid gap-6 border-t border-line pt-8 sm:grid-cols-3">
            <div>
              <dt className="eyebrow !text-subtle">For</dt>
              <dd className="mt-2 text-fg">{project.client}</dd>
            </div>
            <div>
              <dt className="eyebrow !text-subtle">Type</dt>
              <dd className="mt-2 text-fg">{categoryLabels[project.category]}</dd>
            </div>
            <div>
              <dt className="eyebrow !text-subtle">Live site</dt>
              <dd className="mt-2 text-fg">
                {project.url ? (
                  <a
                    href={project.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 underline decoration-white/20 underline-offset-4 hover:decoration-cyan"
                  >
                    {hostFor(project)} <ArrowUpRight className="h-4 w-4" aria-hidden />
                  </a>
                ) : (
                  <span className="text-muted">Not public</span>
                )}
              </dd>
            </div>
          </dl>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <Parallax distance={36}>
          <Reveal>
            <BrowserMockup
              variant={project.mock}
              accent={project.accent}
              host={hostFor(project)}
              className="mx-auto max-w-5xl"
            />
          </Reveal>
        </Parallax>

        <div id="overview" className="mx-auto mt-24 grid max-w-5xl gap-16 lg:grid-cols-2">
          <Reveal>
            <h2 className="eyebrow mb-4">The challenge</h2>
            <p className="text-pretty text-lg leading-relaxed text-muted">{project.challenge}</p>
          </Reveal>
          <Reveal delay={0.1}>
            <h2 className="eyebrow mb-4">Our solution</h2>
            <p className="text-pretty text-lg leading-relaxed text-muted">{project.solution}</p>
          </Reveal>
        </div>

        <div id="built" className="mx-auto mt-20 grid max-w-5xl gap-6 lg:grid-cols-[1.4fr_1fr]">
          <Reveal className="h-full">
            <GlowCard className="h-full p-8 sm:p-10">
              <h2 className="eyebrow mb-6">What we built</h2>
              <ul className="space-y-4">
                {project.highlights.map((h) => (
                  <li key={h} className="flex gap-3.5 leading-relaxed text-muted">
                    <Check className="mt-1 h-4 w-4 shrink-0 text-cyan" aria-hidden />
                    {h}
                  </li>
                ))}
              </ul>
            </GlowCard>
          </Reveal>
          <Reveal delay={0.1} className="h-full">
            <GlowCard className="h-full p-8 sm:p-10">
              <h2 className="eyebrow mb-6">Tech stack</h2>
              <ul className="flex flex-wrap gap-2">
                {project.stack.map((t) => (
                  <li
                    key={t}
                    className="rounded-md bg-white/[0.05] px-3 py-1.5 font-mono text-sm text-muted"
                  >
                    {t}
                  </li>
                ))}
              </ul>
            </GlowCard>
          </Reveal>
        </div>

        <div id="next" className="mx-auto mt-24 max-w-5xl">
          <Reveal>
            <Link
              href={`/work/${next.slug}`}
              className="group flex items-center justify-between gap-6 rounded-3xl border border-line p-8 transition-colors hover:border-line-strong sm:p-10"
            >
              <span>
                <span className="eyebrow !text-subtle">Next project</span>
                <span className="mt-2 block text-3xl font-semibold tracking-tight sm:text-4xl">
                  {next.title}
                </span>
              </span>
              <ArrowRight
                className="h-8 w-8 shrink-0 text-subtle transition-all group-hover:translate-x-1 group-hover:text-cyan"
                aria-hidden
              />
            </Link>
          </Reveal>
        </div>

      </div>

      <CTA />
    </>
  );
}
