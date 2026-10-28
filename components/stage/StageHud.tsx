"use client";

import { useTransform, type MotionValue } from "motion/react";
import * as m from "motion/react-m";
import { useDna } from "@/components/dna/DnaProvider";

/**
 * A sci-fi instrument overlay for the chapter stage: a targeting reticle on the base pair at the centre of
 * view (with corner brackets and a tick ruler on large screens) and a flash on each chapter change. There
 * are no readouts. (The scanlines and speed streaks are part of the page-long backdrop.) Purely decorative
 * (aria-hidden).
 *
 * It is fixed to the viewport in the box the helix is centred in (on phones a region around 34% of the screen
 * height, on large screens everything, with the reticle where the helix is centred) and fades with the stage,
 * so it only shows while the chapters are in control of the camera.
 */
export function StageHud({
  progress,
  changes,
}: {
  progress: MotionValue<number>;
  /** How many times the chapter has changed: re-keys the flash so it replays once per change. */
  changes: number;
}) {
  const { stage } = useDna();
  const rulerY = useTransform(progress, (p) => `${-p * 480}px`);

  return (
    <m.div
      aria-hidden
      style={{ opacity: stage }}
      className="pointer-events-none fixed inset-x-0 top-14 h-[calc(68svh-7rem)] [--cx:50%] motion-reduce:hidden lg:inset-y-0 lg:top-0 lg:h-svh lg:[--cx:66.7%]"
    >
      {changes > 0 && <div key={changes} className="absolute inset-0 animate-flash bg-cyan/30" />}

      {/* Corner brackets framing the helix */}
      <div className="absolute left-[var(--cx)] top-1/2 hidden h-[66%] w-[min(46vw,42rem)] -translate-x-1/2 -translate-y-1/2 lg:block">
        <span className="absolute left-0 top-0 h-5 w-5 border-l border-t border-cyan/60" />
        <span className="absolute right-0 top-0 h-5 w-5 border-r border-t border-cyan/60" />
        <span className="absolute bottom-0 left-0 h-5 w-5 border-b border-l border-cyan/60" />
        <span className="absolute bottom-0 right-0 h-5 w-5 border-b border-r border-cyan/60" />

        {/* Tick ruler that scrolls with the page (large screens) */}
        <div className="absolute -right-5 top-6 hidden h-24 w-2.5 overflow-hidden lg:block">
          <m.div
            style={{ y: rulerY }}
            className="h-[700px] w-full bg-[repeating-linear-gradient(to_bottom,var(--ruler)_0,var(--ruler)_1px,transparent_1px,transparent_8px)]"
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
      </div>
    </m.div>
  );
}
