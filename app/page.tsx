import { Hero } from "@/components/home/Hero";
import { TechMarquee } from "@/components/home/TechMarquee";
import { ServicesGrid } from "@/components/home/ServicesGrid";
import { FeaturedWork } from "@/components/home/FeaturedWork";
import { Process } from "@/components/home/Process";
import { WhyUs } from "@/components/home/WhyUs";
import { CTA } from "@/components/home/CTA";

export default function Home() {
  return (
    <>
      <Hero />
      <TechMarquee />
      <ServicesGrid />
      <FeaturedWork />
      <Process />
      <WhyUs />
      <CTA />
    </>
  );
}
