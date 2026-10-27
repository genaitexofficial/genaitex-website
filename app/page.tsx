import { ChapterStage } from "@/components/stage/ChapterStage";
import { TechMarquee } from "@/components/home/TechMarquee";
import { ServicesGrid } from "@/components/home/ServicesGrid";
import { FeaturedWork } from "@/components/home/FeaturedWork";
import { Process } from "@/components/home/Process";
import { WhyUs } from "@/components/home/WhyUs";
import { CTA } from "@/components/home/CTA";
import { homeChapters } from "@/lib/chapters";

export default function Home() {
  return (
    <>
      <ChapterStage chapters={homeChapters} label="What genaitex builds" />
      <TechMarquee />
      <div id="options">
        <ServicesGrid />
      </div>
      <FeaturedWork />
      <Process />
      <WhyUs />
      <CTA />
    </>
  );
}
