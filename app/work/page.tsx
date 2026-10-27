import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/PageHeader";
import { ProjectFilter } from "@/components/work/ProjectFilter";
import { CTA } from "@/components/home/CTA";
import { projects } from "@/lib/projects";

export const metadata: Metadata = {
  title: "Work",
  description:
    "Selected static websites, Shopify storefronts and custom web applications from genaitex.",
  alternates: { canonical: "/work" },
};

export default function WorkPage() {
  const hasConcepts = projects.some((p) => p.isSample);

  return (
    <>
      <PageHeader
        eyebrow="Portfolio"
        title={
          <>
            Work that <span className="text-gradient">earns its place.</span>
          </>
        }
        description="Static sites, Shopify storefronts and custom software: a look at the kind of work we build."
      />

      <section className="mx-auto max-w-7xl px-5 pb-12 sm:px-8">
        <ProjectFilter projects={projects} headingLevel="h2" />
        {hasConcepts && (
          <p className="mt-10 max-w-2xl text-sm leading-relaxed text-subtle">
            Projects marked <span className="font-mono text-xs text-muted">CONCEPT</span> are
            illustrative builds that show our approach and the kind of result we aim for.
          </p>
        )}
      </section>

      <CTA />
    </>
  );
}
