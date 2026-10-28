import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { Button } from "@/components/ui/Button";
import { Year } from "./Year";
import { seoPages } from "@/lib/seoPages";
import { site, whatsappLink } from "@/lib/site";

export function Footer() {
  const wa = whatsappLink();

  return (
    <footer className="relative mt-32 border-t border-line">
      <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div className="max-w-sm">
            <Logo />
            <p className="mt-5 text-pretty leading-relaxed text-muted">
              {site.description}
            </p>
            <div className="mt-6">
              <Button href="/contact" variant="secondary">
                Start a project <ArrowUpRight className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div>
            <h2 className="eyebrow mb-5">Explore</h2>
            <ul className="space-y-3">
              {site.nav.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="text-muted transition-colors hover:text-fg">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="eyebrow mb-5">Services</h2>
            <ul className="space-y-3">
              {seoPages.map((p) => (
                <li key={p.slug}>
                  <Link
                    href={`/services/${p.slug}`}
                    className="text-muted transition-colors hover:text-fg"
                  >
                    {p.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="eyebrow mb-5">Get in touch</h2>
            <ul className="space-y-3">
              <li>
                <a
                  href={`mailto:${site.email}`}
                  className="break-all text-muted transition-colors hover:text-fg"
                >
                  {site.email}
                </a>
              </li>
              {wa && (
                <li>
                  <a
                    href={wa}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted transition-colors hover:text-fg"
                  >
                    WhatsApp
                  </a>
                </li>
              )}
              {site.socials.map((s) => (
                <li key={s.href}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted transition-colors hover:text-fg"
                  >
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-3 border-t border-line pt-8 text-sm text-subtle sm:flex-row sm:items-center sm:justify-between">
          <p>
            © <Year /> {site.name}. All rights reserved.
          </p>
          <p className="font-mono text-xs">Designed &amp; built by genaitex.</p>
        </div>
      </div>
    </footer>
  );
}
