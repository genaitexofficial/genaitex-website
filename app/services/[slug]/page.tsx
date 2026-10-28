import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ServicePage } from "@/components/seo/ServicePage";
import { pageMetadata } from "@/lib/seo";
import { getSeoPage, seoPages } from "@/lib/seoPages";

export function generateStaticParams() {
  return seoPages.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/services/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const page = getSeoPage(slug);
  if (!page) return {};
  return pageMetadata({ title: page.title, description: page.description, path: `/services/${page.slug}`, ownImage: true });
}

export default async function ServiceDetailPage({ params }: PageProps<"/services/[slug]">) {
  const { slug } = await params;
  const page = getSeoPage(slug);
  if (!page) notFound();
  return <ServicePage page={page} />;
}
