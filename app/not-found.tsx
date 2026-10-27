import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <section className="page-top relative isolate flex min-h-[80svh] items-center overflow-hidden px-5 pb-20 pt-36 sm:px-8">
      <div aria-hidden className="bg-grid absolute inset-0 -z-10" />
      <div className="mx-auto w-full max-w-7xl">
        <p className="eyebrow mb-5">Error 404</p>
        <h1 className="text-balance text-6xl font-semibold leading-none tracking-tight sm:text-8xl">
          This page <span className="text-gradient">doesn&apos;t exist.</span>
        </h1>
        <p className="mt-8 max-w-lg text-lg text-muted">
          The link may be broken or the page may have moved. Let&apos;s get you back on track.
        </p>
        <div className="mt-10">
          <Button href="/" size="lg">
            <ArrowLeft className="h-5 w-5" aria-hidden /> Back to home
          </Button>
        </div>
      </div>
    </section>
  );
}
