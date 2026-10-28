import { renderIcon } from "@/lib/iconImage";

const sizes = [192, 512];

export function generateStaticParams() {
  return sizes.map((s) => ({ size: String(s) }));
}

export async function GET(_req: Request, ctx: { params: Promise<{ size: string }> }) {
  const { size } = await ctx.params;
  const px = Number(size);
  if (!sizes.includes(px)) return new Response("Not found", { status: 404 });
  return renderIcon(px);
}
