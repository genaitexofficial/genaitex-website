import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ProjectCard } from "@/components/work/ProjectCard";
import { featuredProjects } from "@/lib/projects";

export function FeaturedWork() {
  return (
    <section className="mx-auto max-w-7xl px-5 py-24 sm:px-8">
      <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
        <SectionHeading
          eyebrow="Selected work"
          title={
            <>
              Built to look <span className="text-gradient">sharp</span> and perform even better.
            </>
          }
        />
        <Reveal>
          <Button href="/work" variant="secondary">
            All projects <ArrowRight className="h-4 w-4" />
          </Button>
        </Reveal>
      </div>

      <div className="mt-14 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {featuredProjects.map((p, i) => (
          <Reveal key={p.slug} delay={i * 0.1} className="h-full">
            <ProjectCard project={p} />
          </Reveal>
        ))}
      </div>
    </section>
  );
}
