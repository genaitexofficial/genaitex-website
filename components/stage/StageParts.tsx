"use client";

import {
  ArrowRight,
  Bot,
  ChartColumn,
  Check,
  ChevronLeft,
  ChevronRight,
  CodeXml,
  FileText,
  Gauge,
  Globe,
  ImageIcon,
  Layers,
  LifeBuoy,
  Mail,
  Megaphone,
  Package,
  Palette,
  Pencil,
  Plug,
  Rocket,
  Search,
  Server,
  ShieldCheck,
  Sparkles,
  Store,
  Users,
  Video,
  Workflow,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { clsx } from "clsx";
import Link from "next/link";
import * as m from "motion/react-m";
import { useEffect, useMemo, useRef, type CSSProperties } from "react";
import { useMotionValue, useTransform, type MotionValue } from "motion/react";
import type { Anchor } from "@/components/dna/anchors";
import type { Callout, Chapter, IconKey } from "@/lib/chapters";
import { Price } from "@/components/currency/Price";
import { useGlassFlat } from "./glassBlur";

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
  users: Users,
  megaphone: Megaphone,
  sparkles: Sparkles,
  mail: Mail,
  image: ImageIcon,
  video: Video,
};

export function ChapterIcon({ name, className }: { name: IconKey; className?: string }) {
  const Icon = icons[name];
  return <Icon aria-hidden className={className} />;
}

/**
 * Where the four option cards sit around the centrepiece on large screens: two along the top, two along the
 * bottom, with the sixth card and the info card between them on either side of the DNA's targeting reticle.
 * The left-hand cards keep clear of the text column (`--edge`, set on each card), top cards hang from the top
 * and bottom cards stand on the bottom, so their height never matters. `line` is [x, y of where the connector
 * starts, then the spot (percent of the stage) where it prefers to meet a base pair]; it starts inside the card
 * (which covers it), so it comes out of the card's edge whatever the card's height.
 */
export const calloutSlots = [
  { pos: "motion-safe:lg:left-[max(41%,var(--edge))] motion-safe:lg:top-[max(8.5%,5.25rem)]", line: [52, 14, 60, 40] },
  { pos: "motion-safe:lg:left-[67%] motion-safe:xl:left-[64%] motion-safe:lg:top-[max(8.5%,5.25rem)]", line: [70, 14, 73, 40] },
  { pos: "motion-safe:lg:left-[max(41%,var(--edge))] motion-safe:lg:bottom-[max(6%,1.5rem)]", line: [52, 88, 60, 60] },
  { pos: "motion-safe:lg:left-[67%] motion-safe:xl:left-[64%] motion-safe:lg:bottom-[max(6%,1.5rem)]", line: [70, 88, 73, 60] },
] as const;

/** The right edge of the text column plus a gap: the left-hand cards start no further left than this. */
export const textEdge = "calc(max(2rem, (100vw - 80rem) / 2 + 2rem) + min(28rem, 36vw) + 1.5rem)";

/**
 * How a chapter presents its four options on large screens: `float` = cards floating around the DNA, with lines to
 * it (every chapter of Services, and Home scrolls 2-5); `list` = just the headings, as a glass stack in the middle
 * of the DNA (Home scroll 1). Phones and tablets always get the floating pills.
 */
export type StageLayout = "float" | "list";

/** Where the DNA is centred (percent of the width) on large screens, per layout. */
export const stageCx: Record<StageLayout, number> = { float: 66.7, list: 62 };

/**
 * The same four options on phones and tablets: small pills floating around the helix in the upper part of
 * the screen. `x`/`y` place a pill (percent of the stage); `line` is [pill attachment x, y, then the spot where
 * the line prefers to meet a base pair].
 */
export const phoneSlots = [
  { x: "4%", y: "10%", line: [26, 16, 30, 25] },
  { x: "52%", y: "17%", line: [74, 23, 72, 31] },
  { x: "4%", y: "36%", line: [26, 36, 28, 31] },
  { x: "52%", y: "41%", line: [74, 41, 72, 36] },
] as const;

/**
 * Previous / next arrows (no visible counter; the position is announced to screen readers). Bottom centre on
 * phones, bottom right from tablet width.
 */
export function Pager({
  total,
  active,
  onSelect,
}: {
  total: number;
  active: number;
  onSelect: (index: number) => void;
}) {
  return (
    <div className="absolute bottom-5 left-1/2 z-20 hidden -translate-x-1/2 items-center gap-3 motion-safe:flex md:left-auto md:right-8 md:translate-x-0">
      <button
        type="button"
        onClick={() => onSelect(active - 1)}
        disabled={active === 0}
        aria-label="Previous chapter"
        className="rounded-full p-2 text-muted transition-colors hover:text-fg disabled:opacity-30"
      >
        <ChevronLeft className="h-5 w-5" aria-hidden />
      </button>
      <p className="sr-only" aria-live="polite">
        Chapter {active + 1} of {total}
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

/**
 * Home scroll 1 on large screens: the four options as big blocks of Liquid Glass in the site's own finishes (pearl,
 * silver, ash, gunmetal), with just their headings (and prices), stacked in the middle of the DNA. It lives on the stage, not inside the chapter, so no
 * ancestor fades with opacity: a faded ancestor would cut the glass off from the DNA behind it (the blur would
 * show nothing). Each block fades itself instead. The blur is dropped for an opaque frosted fill on a device that
 * cannot keep up (see glassBlur.ts).
 */
export function StageStack({
  chapter,
  on,
  onJump,
}: {
  chapter: Chapter;
  on: boolean;
  onJump: (target: number | string) => void;
}) {
  const flat = useGlassFlat();
  return (
    <ul
      aria-label={`${chapter.eyebrow}: list`}
      inert={!on}
      data-glass={flat ? "flat" : "blur"}
      style={{ "--cx": `${stageCx.list}%` } as CSSProperties}
      className="group/stack hidden motion-safe:lg:absolute motion-safe:lg:left-[var(--cx)] motion-safe:lg:top-1/2 motion-safe:lg:flex motion-safe:lg:w-[min(35rem,40%)] motion-safe:lg:-translate-x-1/2 motion-safe:lg:-translate-y-1/2 motion-safe:lg:flex-col motion-safe:lg:gap-2.5"
      data-stack={on ? "on" : "off"}
    >
      {[...chapter.callouts, ...(chapter.extra ? [chapter.extra] : [])].map((co, k) => {
        const Item = co.jumpTo ? "button" : "div";
        return (
          <li
            key={co.title}
            style={
              {
                "--c": `var(--stack-${k + 1})`,
                "--glass-tint": `var(--stack-tint-${k + 1})`,
                "--glass-ink": `var(--stack-ink-${k + 1})`,
                "--glass-shine": `var(--stack-shine-${k + 1})`,
              } as CSSProperties
            }
          >
            <Item
              {...(co.jumpTo ? { type: "button" as const, onClick: () => onJump(co.jumpTo!) } : {})}
              className={clsx(
                "liquid-glass flex min-h-[4.5rem] w-full items-center justify-between gap-4 rounded-[1.75rem] px-6 py-3 text-left xl:min-h-[5.25rem] xl:px-7",
                "transition-[opacity,translate] duration-[450ms] ease-out group-data-[stack=off]/stack:translate-y-6 group-data-[stack=off]/stack:opacity-0",
                co.jumpTo && "hover:-translate-y-0.5",
              )}
            >
              <span className="min-w-0 text-balance text-3xl font-semibold leading-[1.05] tracking-tight xl:text-[2.5rem]">
                {co.title}
              </span>
              {co.price && (
                <Price
                  inr={co.price.inr}
                  className="shrink-0 rounded-full bg-[rgb(var(--glass-ink)/0.1)] px-3 py-1 font-mono text-sm font-semibold tracking-wide shadow-[inset_0_0_0_1px_rgb(var(--glass-ink)/0.2)]"
                />
              )}
            </Item>
          </li>
        );
      })}
    </ul>
  );
}

/**
 * What a card covers and its Book link. Large screens and the stacked layout only: phones keep the compact chip.
 * The points need some height, so they wait for a screen at least 860px tall (the Book link is always there).
 */
export function CardExtras({ includes, book, title }: { includes?: string[]; book?: Callout["book"]; title: string }) {
  if (!includes && !book) return null;
  return (
    <div className="hidden lg:col-span-2 lg:block motion-reduce:col-span-2 motion-reduce:block">
      {includes && (
        <ul className="mt-2.5 hidden space-y-1 text-[11.5px] leading-snug text-muted xl:[@media(min-height:860px)]:block motion-reduce:block">
          {includes.map((t) => (
            <li key={t} className="flex gap-1.5">
              <Check aria-hidden className="mt-[3px] h-3 w-3 shrink-0 text-[rgb(var(--t))]" />
              {t}
            </li>
          ))}
        </ul>
      )}
      {book && (
        <Link
          href={book.href}
          aria-label={`${book.label}: ${title}`}
          className="btn-primary mt-3 inline-flex h-8 items-center gap-1.5 rounded-full px-3.5 text-xs font-semibold"
        >
          {book.label}
          <ArrowRight aria-hidden className="h-3.5 w-3.5" />
        </Link>
      )}
    </div>
  );
}

/** The sixth card (e.g. "Ready-made UI & websites"): left of the DNA's reticle, mirroring the info card on the right. */
export function ExtraCard({ card }: { card: Callout }) {
  return (
    <aside
      aria-label={card.title}
      style={{ "--c": "var(--slot-6)", "--t": "var(--slot-text-6)", "--edge": textEdge } as CSSProperties}
      className="slot-card hidden w-64 rounded-3xl p-4 motion-reduce:mt-4 motion-reduce:block motion-reduce:w-full motion-reduce:max-w-sm motion-safe:xl:absolute motion-safe:xl:left-[max(41%,var(--edge))] motion-safe:xl:top-1/2 motion-safe:xl:block motion-safe:xl:w-[17rem] motion-safe:xl:-translate-y-1/2"
    >
      <div className="flex items-start gap-2.5">
        <span aria-hidden className="slot-chip mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-lg">
          <ChapterIcon name={card.icon} className="h-[18px] w-[18px]" />
        </span>
        <div className="min-w-0">
          <p className="font-medium text-fg">{card.title}</p>
          {card.tag && (
            <p className="mt-0.5 font-mono text-[11px] font-medium tracking-wide text-[rgb(var(--t))]">{card.tag}</p>
          )}
          <p className="mt-1 text-xs leading-snug text-muted">{card.detail}</p>
          <CardExtras includes={card.includes} book={card.book} title={card.title} />
        </div>
      </div>
    </aside>
  );
}

/** Right-hand info card (the screenshot's "Genetic Code" card): the fifth card colour, bold like the option cards. */
export function InfoCard({ card, layout = "float" }: { card: Chapter["card"]; layout?: StageLayout }) {
  return (
    <aside
      aria-label={card.title}
      style={{ "--c": "var(--slot-5)", "--t": "var(--slot-text-5)" } as CSSProperties}
      className={clsx(
        "slot-card hidden w-64 rounded-3xl p-5 motion-reduce:mt-6 motion-reduce:block motion-reduce:w-full motion-reduce:max-w-sm xl:w-[17rem]",
        // the Home list shows headings only: no info card beside the DNA
        layout === "float" && "motion-safe:xl:absolute motion-safe:xl:right-[6.5rem] motion-safe:xl:top-1/2 motion-safe:xl:-translate-y-1/2 motion-safe:xl:block",
      )}
    >
      <p className="font-mono text-xs font-medium uppercase tracking-[0.18em] text-[rgb(var(--t))]">{card.title}</p>
      <p className="mt-3 text-pretty text-sm leading-relaxed text-muted">{card.body}</p>
      {card.meter && (
        <div className="mt-5">
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-[rgb(var(--c)/0.18)]">
            <div className="h-full rounded-full bg-[rgb(var(--c))]" style={{ width: `${card.meter.fill * 100}%` }} />
          </div>
          <p className="mt-2 flex justify-between font-mono text-[11px] uppercase tracking-widest text-subtle">
            <span>{card.meter.label}</span>
            <span className="font-medium text-[rgb(var(--t))]">{card.meter.value}</span>
          </p>
        </div>
      )}
    </aside>
  );
}

/** The size in px of the box the callout lines are drawn in (they are laid out in percent of it). */
interface BoxSize {
  w: MotionValue<number>;
  h: MotionValue<number>;
}

/**
 * Both the dot and the line are moved with transforms only (never `left/top` or SVG attributes), so following a
 * turning rung costs the compositor a matrix per frame and nothing is laid out or repainted.
 */
const slotColour = (k: number) => ({ "--c": `var(--slot-${k + 1})` }) as CSSProperties;

function AnchorDot({ anchor, size, k }: { anchor: Anchor; size: BoxSize; k: number }) {
  const x = useTransform([anchor.x, size.w], ([ax, w]: number[]) => (ax / 100) * w);
  const y = useTransform([anchor.y, size.h], ([ay, h]: number[]) => (ay / 100) * h);
  return (
    <m.span
      aria-hidden
      style={{ x, y, ...slotColour(k) }}
      className="absolute left-0 top-0 -ml-[6px] -mt-[6px] h-3 w-3 rounded-full slot-dot"
    />
  );
}

/**
 * A line from a fixed point on the card to the anchor: a rotated, stretched div, so it is compositor-only. Its
 * start is a plain percentage position (it never moves); only the angle and length follow the DNA.
 */
function AnchorLine({ anchor, from, size, k }: { anchor: Anchor; from: readonly number[]; size: BoxSize; k: number }) {
  const dx = useTransform([anchor.x, size.w], ([ax, w]: number[]) => ((ax - from[0]) / 100) * w);
  const dy = useTransform([anchor.y, size.h], ([ay, h]: number[]) => ((ay - from[1]) / 100) * h);
  const angle = useTransform([dx, dy], ([vx, vy]: number[]) => (Math.atan2(vy, vx) * 180) / Math.PI);
  const length = useTransform([dx, dy], ([vx, vy]: number[]) => Math.hypot(vx, vy));
  return (
    <m.div
      aria-hidden
      style={{ left: `${from[0]}%`, top: `${from[1]}%`, rotate: angle, transformOrigin: "0 0", ...slotColour(k) }}
      className="absolute"
    >
      <m.div
        style={{ scaleX: length, transformOrigin: "0 0", backgroundColor: "rgb(var(--c) / 0.85)" }}
        className="h-[1.5px] w-px"
      />
    </m.div>
  );
}

/**
 * Connector lines from the option cards to the helix rungs they point at. Large screens use the desktop
 * layout; phones and tablets use their own (`phoneSlots`), so each is drawn in its own box.
 */
export function AnchorLines({ anchors, listShown = false }: { anchors: Anchor[]; listShown?: boolean }) {
  return (
    <>
      {/* on large screens the lines serve the floating cards, so they fade away while the glass stack is showing */}
      <AnchorSet
        anchors={anchors}
        slots={calloutSlots}
        className={clsx("hidden motion-safe:lg:block transition-opacity duration-500", listShown && "motion-safe:lg:opacity-0")}
      />
      <AnchorSet anchors={anchors} slots={phoneSlots} className="motion-safe:lg:hidden" />
    </>
  );
}

function AnchorSet({
  anchors,
  slots,
  className,
}: {
  anchors: Anchor[];
  slots: readonly { line: readonly number[] }[];
  className: string;
}) {
  const box = useRef<HTMLDivElement>(null);
  const w = useMotionValue(0);
  const h = useMotionValue(0);
  const size = useMemo(() => ({ w, h }), [w, h]);
  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const measure = () => {
      w.set(el.clientWidth);
      h.set(el.clientHeight);
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, [w, h]);

  return (
    <div ref={box} aria-hidden className={clsx("pointer-events-none absolute inset-0", className)}>
      {anchors.map((a, k) => (
        <AnchorLine key={`line-${k}`} anchor={a} from={slots[k].line} size={size} k={k} />
      ))}
      {anchors.map((a, k) => (
        <AnchorDot key={`dot-${k}`} anchor={a} size={size} k={k} />
      ))}
    </div>
  );
}
