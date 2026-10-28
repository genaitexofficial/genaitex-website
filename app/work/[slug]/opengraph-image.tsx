import { ogSize, renderOg } from "@/lib/ogImage";
import { categoryLabels, getProject, projects } from "@/lib/projects";

export const size = ogSize;
export const contentType = "image/png";
export const alt = "genaitex project";

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = getProject(slug);
  return renderOg({
    eyebrow: project ? `${project.isSample ? "Concept project" : "Project"} · ${categoryLabels[project.category]}` : "Work",
    title: project ? `${project.title}: ${project.tagline}` : "Work",
  });
}
