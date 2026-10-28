import Link from "next/link";
import { clsx } from "clsx";
import { JsonLd } from "./JsonLd";
import { breadcrumbJsonLd, type Crumb } from "@/lib/jsonld";

/**
 * A breadcrumb trail (Home is added) and its BreadcrumbList data. The last crumb is the current page. Positioned by
 * the caller (the page header places it in the gap above the heading, so no page shifts).
 */
export function Breadcrumbs({ crumbs, className }: { crumbs: Crumb[]; className?: string }) {
  const all: Crumb[] = [{ name: "Home", path: "/" }, ...crumbs];
  return (
    <>
      <nav aria-label="Breadcrumb" className={clsx("font-mono text-[11px] uppercase tracking-[0.16em] text-subtle", className)}>
        <ol className="flex flex-wrap items-center gap-x-2 gap-y-1">
          {all.map((c, i) => {
            const last = i === all.length - 1;
            return (
              <li key={c.path} className="flex items-center gap-2">
                {last ? (
                  <span aria-current="page" className="text-muted">
                    {c.name}
                  </span>
                ) : (
                  <Link href={c.path} className="transition-colors hover:text-fg">
                    {c.name}
                  </Link>
                )}
                {!last && <span aria-hidden>/</span>}
              </li>
            );
          })}
        </ol>
      </nav>
      <JsonLd data={breadcrumbJsonLd(crumbs)} />
    </>
  );
}
