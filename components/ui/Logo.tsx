import { clsx } from "clsx";
import { site } from "@/lib/site";

/** Wordmark: "gen" + highlighted "ai" + "tex", with a small gradient glyph. */
export function Logo({ className }: { className?: string }) {
  return (
    <span className={clsx("inline-flex items-center gap-2.5", className)}>
      <svg viewBox="0 0 64 64" className="h-7 w-7" aria-hidden>
        <defs>
          <linearGradient id="logo-g" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" style={{ stopColor: "var(--logo-a)" }} />
            <stop offset="1" style={{ stopColor: "var(--logo-b)" }} />
          </linearGradient>
        </defs>
        {/* </> code mark */}
        <path
          d="M23 19 9 32l14 13M41 19l14 13-14 13M36 13 28 51"
          fill="none"
          stroke="url(#logo-g)"
          strokeWidth="6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <span className="text-xl font-semibold tracking-tight">
        gen<span className="text-gradient">ai</span>tex
        <span className="sr-only"> ({site.name})</span>
      </span>
    </span>
  );
}
