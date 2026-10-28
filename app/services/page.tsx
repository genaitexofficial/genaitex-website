import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/PageHeader";
import { ChapterStage } from "@/components/stage/ChapterStage";
import { OptionPicker } from "@/components/stage/OptionPicker";
import { CTA } from "@/components/home/CTA";
import { ServiceDirectory } from "@/components/seo/ServiceDirectory";
import { JsonLd } from "@/components/seo/JsonLd";
import { collectionJsonLd } from "@/lib/jsonld";
import { servicesChapters } from "@/lib/chapters";
import { pageMetadata } from "@/lib/seo";
import { seoPages } from "@/lib/seoPages";

export const metadata: Metadata = pageMetadata({
  title: "Website, AI Automation, CRM & Marketing Services",
  description:
    "Static websites from ₹2,000, custom ecommerce, web apps, AI automation, UI design, CRM setup, AI product ads and marketing, with clear starting prices.",
  path: "/services",
});

export default function ServicesPage() {
  return (
    <>
      <JsonLd
        data={collectionJsonLd({
          name: "genaitex services",
          description: "Websites, AI automation, CRM, design, advertising and marketing services from genaitex.",
          path: "/services",
          items: seoPages.map((p) => ({ name: p.name, path: `/services/${p.slug}` })),
        })}
      />
      <PageHeader
        crumbs={[{ name: "Services", path: "/services" }]}
        eyebrow="Services"
        title={
          <>
            Everything you need to <span className="text-gradient">launch and grow.</span>
          </>
        }
        description="Six building blocks, one team. Scroll through each service, then choose your starting point."
      />
      <ChapterStage chapters={servicesChapters} label="Our services in detail" firstHeading="h2" />
      <OptionPicker id="start" heading="Ready to start?" description="Pick the closest fit and tell us about your project. We reply with next steps, usually within one business day." />
      <ServiceDirectory />
      <CTA />
    </>
  );
}
