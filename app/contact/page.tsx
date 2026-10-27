import type { Metadata } from "next";
import { Clock, Mail, MessageCircle } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Reveal } from "@/components/ui/Reveal";
import { Suspense } from "react";
import { ContactForm } from "@/components/contact/ContactForm";
import { ContactFormWithPrefill } from "@/components/contact/ContactFormWithPrefill";
import { site, whatsappLink } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact",
  description: `Start a project with ${site.name}. Tell us what you're building and we'll reply with next steps.`,
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  const wa = whatsappLink();

  return (
    <>
      <PageHeader
        eyebrow="Contact"
        title={
          <>
            Let&apos;s build something <span className="text-gradient">great.</span>
          </>
        }
        description="Share a few details about your project. The more context you give, the more useful our first reply will be."
      />

      <section className="mx-auto grid max-w-7xl gap-12 px-5 pb-12 sm:px-8 lg:grid-cols-[1fr_1.5fr] lg:gap-16">
        <Reveal>
          <ul className="space-y-8">
            <li className="flex gap-4">
              <Mail className="mt-1 h-5 w-5 shrink-0 text-cyan" aria-hidden />
              <div>
                <h2 className="font-medium">Email</h2>
                <a
                  href={`mailto:${site.email}`}
                  className="mt-1 block break-all text-muted underline decoration-white/20 underline-offset-4 transition-colors hover:text-fg hover:decoration-cyan"
                >
                  {site.email}
                </a>
              </div>
            </li>
            {wa && (
              <li className="flex gap-4">
                <MessageCircle className="mt-1 h-5 w-5 shrink-0 text-cyan" aria-hidden />
                <div>
                  <h2 className="font-medium">WhatsApp</h2>
                  <a
                    href={wa}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-1 block text-muted underline decoration-white/20 underline-offset-4 transition-colors hover:text-fg hover:decoration-cyan"
                  >
                    Message us directly
                  </a>
                </div>
              </li>
            )}
            <li className="flex gap-4">
              <Clock className="mt-1 h-5 w-5 shrink-0 text-cyan" aria-hidden />
              <div>
                <h2 className="font-medium">Response time</h2>
                <p className="mt-1 text-muted">Usually within one business day.</p>
              </div>
            </li>
          </ul>

          <div className="mt-12 rounded-2xl border border-line p-6">
            <h2 className="eyebrow mb-3">What happens next</h2>
            <ol className="list-decimal space-y-2 pl-5 text-sm leading-relaxed text-muted marker:text-subtle">
              <li>We read your message and reply with questions or a call link.</li>
              <li>We agree scope, timeline and a fixed quote.</li>
              <li>Design begins, with a live preview link along the way.</li>
            </ol>
          </div>
        </Reveal>

        <Reveal delay={0.1} className="relative">
          <Suspense fallback={<ContactForm />}>
            <ContactFormWithPrefill />
          </Suspense>
        </Reveal>
      </section>
    </>
  );
}
