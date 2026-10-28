import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/PageHeader";
import { Reveal } from "@/components/ui/Reveal";
import { GlowCard } from "@/components/ui/GlowCard";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { WhyUs } from "@/components/home/WhyUs";
import { CTA } from "@/components/home/CTA";
import { pageMetadata } from "@/lib/seo";
import { site } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: "About genaitex: a Web, AI & Growth Studio",
  description:
    "One team that designs, builds and launches websites, AI automation, CRM setups and marketing, with 5 years in the field. Meet genaitex.",
  path: "/about",
});

const stackGroups = [
  { label: "Frontend", items: ["Next.js", "React", "Astro", "TypeScript", "Tailwind CSS", "Motion"] },
  { label: "Commerce", items: ["Shopify", "Liquid", "Hydrogen", "Storefront API", "Stripe"] },
  { label: "Backend & data", items: ["Node.js", "PostgreSQL", "GraphQL", "REST APIs", "Webhooks"] },
  { label: "AI & automation", items: ["LLM APIs", "Retrieval (RAG)", "Workflow automation"] },
  { label: "Delivery", items: ["Vercel", "Cloudflare", "GitHub Actions", "Lighthouse CI"] },
];

export default function AboutPage() {
  return (
    <>
      <PageHeader
        crumbs={[{ name: "About", path: "/about" }]}
        eyebrow="About"
        title={
          <>
            A small studio with <span className="text-gradient">big-agency standards.</span>
          </>
        }
        description={`${site.name} designs and builds websites, storefronts and software for businesses that care how their brand shows up online.`}
      />

      <section id="story" className="mx-auto grid max-w-7xl gap-12 px-5 pb-12 sm:px-8 lg:grid-cols-2 lg:gap-20">
        <Reveal>
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">What we do</h2>
          <div className="mt-6 space-y-5 text-pretty text-lg leading-relaxed text-muted">
            <p>
              We are developers first. Every site, store and application we ship is hand-built,
              typed, tested and tuned for speed, rather than assembled from a template and left to
              chance.
            </p>
            <p>
              That craft covers websites and applications, AI, automation and integrations, custom UI designs, CRM setup, AI product advertisements and marketing.
              Different problems, but the same approach: understand the goal, design it properly,
              and build it to last.
            </p>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">How we think</h2>
          <div className="mt-6 space-y-5 text-pretty text-lg leading-relaxed text-muted">
            <p>
              A website is a business tool, so we start with what it needs to achieve (more
              enquiries, more orders, less manual work) and let that drive every design and
              engineering decision.
            </p>
            <p>
              You get a direct line to the people doing the work, a preview link from the first
              week, and a clean handover when we are done: the code, the accounts and the
              documentation are yours.
            </p>
          </div>
        </Reveal>
      </section>

      <div id="principles">
        <WhyUs />
      </div>

      <section id="toolbox" className="mx-auto max-w-7xl px-5 py-20 sm:px-8">
        <SectionHeading
          eyebrow="Toolbox"
          title={
            <>
              The stack behind <span className="text-gradient">the work.</span>
            </>
          }
          description="We pick the simplest tool that does the job well, and we are comfortable going deep when a project needs it."
        />
        <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {stackGroups.map((g, i) => (
            <Reveal key={g.label} delay={i * 0.06} className="h-full">
              <GlowCard className="h-full p-7">
                <h3 className="eyebrow mb-5">{g.label}</h3>
                <ul className="flex flex-wrap gap-2">
                  {g.items.map((t) => (
                    <li
                      key={t}
                      className="rounded-md bg-wash/[0.05] px-3 py-1.5 font-mono text-sm text-muted"
                    >
                      {t}
                    </li>
                  ))}
                </ul>
              </GlowCard>
            </Reveal>
          ))}
        </div>
      </section>

      <CTA />
    </>
  );
}
