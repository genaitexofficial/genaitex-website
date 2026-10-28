import { ogSize, renderOg } from "@/lib/ogImage";
import { getSeoPage, seoPages } from "@/lib/seoPages";

export const size = ogSize;
export const contentType = "image/png";
export const alt = "genaitex service";

export function generateStaticParams() {
  return seoPages.map((p) => ({ slug: p.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const page = getSeoPage(slug);
  return renderOg({ eyebrow: page?.eyebrow ?? "Services", title: page?.h1 ?? "Services" });
}
