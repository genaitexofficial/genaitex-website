"use client";

import {
  Bot,
  ChartColumn,
  ChevronLeft,
  ChevronRight,
  CodeXml,
  FileText,
  Gauge,
  Globe,
  Layers,
  LifeBuoy,
  Package,
  Palette,
  Pencil,
  Plug,
  Rocket,
  Search,
  Server,
  ShieldCheck,
  Store,
  Workflow,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { clsx } from "clsx";
import * as m from "motion/react-m";
import { useTransform, type MotionValue } from "motion/react";
import type { Anchor } from "./anchors";
import type { Chapter, IconKey } from "@/lib/chapters";

const icons: Record<IconKey, LucideIcon> = {
  globe: Globe,
  store: Store,
  code: CodeXml,
  bot: Bot,
  search: Search,
  palette: Palette,
  layers: Layers,
  pencil: Pencil,
  plug: Plug,
  workflow: Workflow,
  gauge: Gauge,
  chart: ChartColumn,
  shield: ShieldCheck,
  "life-buoy": LifeBuoy,
  "file-text": FileText,
  server: Server,
  package: Package,
  zap: Zap,
  rocket: Rocket,
};

export function ChapterIcon({ name, className }: { name: IconKey; className?: string }) {
  const Icon = icons[name];
  return <Icon aria-hidden className={className} />;
}

/** Where the four option cards sit around the centrepiece on large screens (percent of the stage). */
export const calloutSlots = [
  { x: "41%", y: "8%", line: [48.5, 19, 54, 36] },
  { x: "64%", y: "22%", line: [66.5, 33, 71, 45] },
  { x: "36%", y: "79%", line: [53, 79, 58, 62] },
  { x: "62%", y: "80%", line: [64, 80, 65, 62] },
] as const;

/** Left chapter rail: numbered labels with a progress line. Large screens only. */
export function ChapterRail({
  chapters,
  active,
  progress,
  onSelect,
}: {
  chapters: Chapter[];
  active: number;
  progress: MotionValue<number>;
  onSelect: (index: number) => void;
}) {
  return (
    <nav
      aria-label="Chapters"
      className="absolute left-8 top-1/2 hidden -translate-y-1/2 motion-safe:lg:block"
    >
      <div className="relative pl-6">
        <div aria-hidden className="absolute bottom-1 left-0 top-1 w-px bg-line">
          <m.div className="h-full w-px origin-top bg-cyan" style={{ scaleY: progress }} />
        </div>
        <ol className="space-y-7">
          {chapters.map((c, i) => (
            <li key={c.id} className="relative">
              <span
                aria-hidden
                className={clsx(
                  "absolute -left-[1.72rem] top-1.5 h-2 w-2 rounded-full transition-all duration-300",
                  i === active ? "scale-125 bg-cyan shadow-[0_0_12px_2px_rgba(34,211,238,0.7)]" : "bg-line-strong",
                )}
              />
              <button
                type="button"
                onClick={() => onSelect(i)}
                aria-current={i === active ? "step" : undefined}
                className={clsx(
                  "group block text-left transition-colors",
                  i === active ? "text-fg" : "text-subtle hover:text-fg",
                )}
              >
                <span className="block font-mono text-[11px] tracking-widest text-cyan/80">{c.number}</span>
                <span className="block text-xs uppercase tracking-[0.18em]">{c.label}</span>
              </button>
            </li>
          ))}
        </ol>
      </div>
    </nav>
  );
}

/** Right-hand scroll indicator with chapter numbers. Extra-large screens only. */
export function ProgressTrack({
  chapters,
  active,
  progress,
  onSelect,
}: {
  chapters: Chapter[];
  active: number;
  progress: MotionValue<number>;
  onSelect: (index: number) => void;
}) {
  return (
    <div className="absolute right-8 top-1/2 hidden -translate-y-1/2 flex-col items-center gap-4 motion-safe:xl:flex">
      <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-subtle [writing-mode:vertical-rl]">
        Scroll
      </span>
      <div aria-hidden className="relative h-24 w-px bg-line-strong">
        <m.div className="h-full w-px origin-top bg-cyan" style={{ scaleY: progress }} />
      </div>
      <ol className="space-y-3 text-center">
        {chapters.map((c, i) => (
          <li key={c.id}>
            <button
              type="button"
              onClick={() => onSelect(i)}
              aria-label={`Go to chapter ${c.number}: ${c.label}`}
              className={clsx(
                "font-mono text-xs transition-colors",
                i === active ? "text-cyan" : "text-subtle hover:text-fg",
              )}
            >
              {c.number}
            </button>
          </li>
        ))}
      </ol>
    </div>
  );
}

/** Bottom-right pager: previous / next, current position, and dots on small screens. */
export function Pager({
  total,
  active,
  onSelect,
}: {
  total: number;
  active: number;
  onSelect: (index: number) => void;
}) {
  const pad = (n: number) => String(n).padStart(2, "0");
  return (
    <div className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 items-center gap-4 motion-safe:flex md:left-auto md:right-8 md:translate-x-0">
      <button
        type="button"
        onClick={() => onSelect(active - 1)}
        disabled={active === 0}
        aria-label="Previous chapter"
        className="rounded-full p-2 text-muted transition-colors hover:text-fg disabled:opacity-30"
      >
        <ChevronLeft className="h-5 w-5" aria-hidden />
      </button>
      <p className="font-mono text-sm tabular-nums" aria-live="polite">
        <span className="text-fg">{pad(active + 1)}</span>
        <span className="text-subtle"> / {pad(total)}</span>
      </p>
      <button
        type="button"
        onClick={() => onSelect(active + 1)}
        disabled={active === total - 1}
        aria-label="Next chapter"
        className="rounded-full p-2 text-muted transition-colors hover:text-fg disabled:opacity-30"
      >
        <ChevronRight className="h-5 w-5" aria-hidden />
      </button>
    </div>
  );
}

/** "Scroll to explore" hint that fades away once the visitor starts scrolling. */
export function ScrollHint({ visible }: { visible: boolean }) {
  return (
    <div
      aria-hidden
      className={clsx(
        "absolute bottom-7 left-8 hidden items-center gap-4 transition-opacity duration-500 motion-safe:lg:flex",
        visible ? "opacity-100" : "opacity-0",
      )}
    >
      <span className="relative flex h-9 w-9 items-center justify-center rounded-full border border-line-strong">
        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-cyan" />
      </span>
      <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-muted">Scroll to explore</span>
      <span className="h-px w-16 bg-line-strong" />
    </div>
  );
}

/** Right-hand info card (the screenshot's "Genetic Code" card). */
export function InfoCard({ card }: { card: Chapter["card"] }) {
  return (
    <aside className="glass hidden w-64 rounded-3xl bg-[#050914]/80 p-5 motion-reduce:mt-6 motion-reduce:block motion-reduce:w-full motion-reduce:max-w-sm motion-safe:xl:absolute motion-safe:xl:right-[6.5rem] motion-safe:xl:top-[44%] motion-safe:xl:block">
      <h3 className="font-mono text-xs uppercase tracking-[0.18em] text-fg">{card.title}</h3>
      <p className="mt-3 text-pretty text-sm leading-relaxed text-muted">{card.body}</p>
      {card.meter && (
        <div className="mt-5">
          <div className="h-1 w-full overflow-hidden rounded-full bg-line-strong">
            <div
              className="h-full rounded-full bg-[linear-gradient(90deg,#8b5cf6,#22d3ee)]"
              style={{ width: `${card.meter.fill * 100}%` }}
            />
          </div>
          <p className="mt-2 flex justify-between font-mono text-[11px] uppercase tracking-widest text-subtle">
            <span>{card.meter.label}</span>
            <span className="text-cyan">{card.meter.value}</span>
          </p>
        </div>
      )}
    </aside>
  );
}

const pct = (v: number) => `${v}%`;

function AnchorDot({ anchor }: { anchor: Anchor }) {
  const left = useTransform(anchor.x, pct);
  const top = useTransform(anchor.y, pct);
  return (
    <m.span
      aria-hidden
      style={{ left, top }}
      className="absolute h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan shadow-[0_0_14px_3px_rgba(34,211,238,0.65)]"
    />
  );
}

/** Connector lines from the option cards to the helix rungs they point at (large screens). */
export function AnchorLines({ anchors }: { anchors: Anchor[] }) {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 hidden motion-safe:lg:block">
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full">
        {anchors.map((a, k) => (
          <m.line
            key={k}
            x1={calloutSlots[k].line[0]}
            y1={calloutSlots[k].line[1]}
            x2={a.x}
            y2={a.y}
            stroke="rgba(34,211,238,0.45)"
            strokeWidth="1"
            vectorEffect="non-scaling-stroke"
          />
        ))}
      </svg>
      {anchors.map((a, k) => (
        <AnchorDot key={k} anchor={a} />
      ))}
    </div>
  );
}
