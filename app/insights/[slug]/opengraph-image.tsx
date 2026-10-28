import { ogSize, renderOg } from "@/lib/ogImage";
import { articles, isVisible } from "@/lib/insights";

export const size = ogSize;
export const contentType = "image/png";
export const alt = "genaitex insights";

export function generateStaticParams() {
  return articles.map((a) => ({ slug: a.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  // a draft that is not shown gets the plain card, so its title is not published through the image
  const a = articles.find((x) => x.slug === slug && isVisible(x));
  return renderOg({ eyebrow: a ? `Insights · ${a.category}` : "Insights", title: a?.title ?? "genaitex insights" });
}
