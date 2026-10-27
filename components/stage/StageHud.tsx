"use client";

import { useTransform, type MotionValue } from "motion/react";
import * as m from "motion/react-m";
import { clsx } from "clsx";
import { useDna } from "@/components/dna/DnaProvider";
import type { HudState } from "@/components/dna/hud";

const pad = (n: number, width = 2) => String(n).padStart(width, "0");

/**
 * A sci-fi instrument overlay for the chapter stage: corner brackets and a targeting reticle on the base
 * pair at the centre of view, live readouts and a flash on each chapter change. (The scanlines, scan sweep
 * and speed streaks are part of the page-long backdrop.) Purely decorative (aria-hidden), and every number
 * comes from the real scene: the zoom is the camera's zoom, SEQ and PAIR are the targeted rung's position
 * and bases.
 *
 * It is fixed to the viewport in the box the helix is centred in (on phones a region around 34% of the screen
 * height, on large screens everything, with the reticle where the helix is centred) and fades with the stage,
 * so it only shows while the chapters are in control of the camera.
 */
export function StageHud({
  hud,
  progress,
  active,
  total,
  changes,
}: {
  hud: HudState;
  progress: MotionValue<number>;
  active: number;
  total: number;
  /** How many times the chapter has changed: re-keys the flash so it replays once per change. */
  changes: number;
}) {
  const zoom = useTransform(hud.zoom, (z) => z.toFixed(1));
  const seq = useTransform(hud.seq, (t) => pad(Math.round(t * 339) + 1, 3));
  const { stage } = useDna();
  const rulerY = useTransform(progress, (p) => `${-p * 480}px`);

  const line = "block whitespace-nowrap";

  return (
    <m.div
      aria-hidden
      style={{ opacity: stage }}
      className="pointer-events-none fixed inset-x-0 top-14 h-[calc(68svh-7rem)] [--cx:50%] motion-reduce:hidden lg:inset-y-0 lg:top-0 lg:h-svh lg:[--cx:66.7%]"
    >
      {changes > 0 && <div key={changes} className="absolute inset-0 animate-flash bg-cyan/30" />}

      {/* Corner brackets framing the helix */}
      <div className="absolute left-[var(--cx)] top-1/2 h-[62%] w-[min(90%,34rem)] -translate-x-1/2 -translate-y-1/2 lg:h-[66%] lg:w-[min(46vw,42rem)]">
        <span className="absolute left-0 top-0 h-5 w-5 border-l border-t border-cyan/60" />
        <span className="absolute right-0 top-0 h-5 w-5 border-r border-t border-cyan/60" />
        <span className="absolute bottom-0 left-0 h-5 w-5 border-b border-l border-cyan/60" />
        <span className="absolute bottom-0 right-0 h-5 w-5 border-b border-r border-cyan/60" />

        {/* Tick ruler that scrolls with the page (large screens) */}
        <div className="absolute -right-5 top-6 hidden h-24 w-2.5 overflow-hidden lg:block">
          <m.div
            style={{ y: rulerY }}
            className="h-[700px] w-full bg-[repeating-linear-gradient(to_bottom,rgba(125,211,252,0.55)_0,rgba(125,211,252,0.55)_1px,transparent_1px,transparent_8px)]"
          />
        </div>
      </div>

      {/* Targeting reticle on the base pair at the centre of view */}
      <div className="absolute left-[var(--cx)] top-1/2 -translate-x-1/2 -translate-y-1/2">
        <svg width="132" height="132" viewBox="0 0 132 132" fill="none" className="text-cyan">
          <circle cx="66" cy="66" r="24" stroke="currentColor" strokeOpacity="0.8" strokeWidth="1" />
          <circle
            cx="66"
            cy="66"
            r="44"
            stroke="currentColor"
            strokeOpacity="0.45"
            strokeWidth="1"
            strokeDasharray="3 9"
            className="origin-center animate-[spin_26s_linear_infinite]"
          />
          <path
            d="M66 8v26M66 98v26M8 66h26M98 66h26"
            stroke="currentColor"
            strokeOpacity="0.7"
            strokeWidth="1"
          />
          <circle cx="66" cy="66" r="2.2" fill="currentColor" />
        </svg>
        <p className="absolute left-[calc(100%-18px)] top-[calc(50%-34px)] font-mono text-[10px] tracking-[0.2em] text-cyan">
          <span className="mb-1 block h-px w-8 bg-cyan/60" />
          <m.span>{hud.pair}</m.span>
        </p>
      </div>

      {/* Readouts: bottom-left of the frame on phones, top-right on large screens */}
      <div
        className={clsx(
          "absolute left-9 top-9 font-mono text-[10px] leading-5 tracking-[0.2em] text-cyan/80 [text-shadow:0_0_8px_#050914,0_0_3px_#050914]",
          "lg:left-auto lg:right-24 lg:top-24 lg:rounded-md lg:bg-[#050914]/60 lg:px-2.5 lg:py-1.5 lg:text-right",
        )}
      >
        <span className={line}>
          ZOOM <span className="text-fg">×<m.span>{zoom}</m.span></span>
        </span>
        <span className={clsx(line, "hidden lg:block")}>
          SEQ <span className="text-fg"><m.span>{seq}</m.span></span> / 340
        </span>
        <span className={line}>
          CH <span className="text-fg">{pad(active + 1)}</span> / {pad(total)}
        </span>
      </div>
    </m.div>
  );
}
