import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/PageHeader";
import { ChapterStage } from "@/components/stage/ChapterStage";
import { OptionPicker } from "@/components/stage/OptionPicker";
import { CTA } from "@/components/home/CTA";
import { servicesChapters } from "@/lib/chapters";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Static websites, custom Shopify storefronts, custom development and AI & automation: designed and built end to end.",
  alternates: { canonical: "/services" },
};

export default function ServicesPage() {
  return (
    <>
      <PageHeader
        eyebrow="Services"
        title={
          <>
            Everything you need to <span className="text-gradient">launch and grow.</span>
          </>
        }
        description="Four building blocks, one team. Scroll through each option, then choose your starting point."
      />
      <ChapterStage chapters={servicesChapters} label="Our services in detail" firstHeading="h2" />
      <OptionPicker id="start" heading="Ready to start?" description="Pick the closest fit and tell us about your project. We reply with next steps, usually within one business day." />
      <CTA />
    </>
  );
}
