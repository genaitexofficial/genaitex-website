import { useMemo } from "react";
import { useMotionValue, type MotionValue } from "motion/react";
import type { Base } from "@/lib/helix";

/**
 * Live values the renderers write every frame and the HUD reads. They are motion values, so the HUD
 * text and effects update without re-rendering React.
 */
export interface HudState {
  /** Current optical zoom (1 = the whole helix in view). */
  zoom: MotionValue<number>;
  /** Position of the targeted base pair along the helix, 0..1. */
  seq: MotionValue<number>;
  /** The targeted base pair, e.g. "A–T". */
  pair: MotionValue<string>;
  /** How fast the zoom is changing: 0 = still, 1 = fast. Drives the speed streaks. */
  speed: MotionValue<number>;
}

export function useHudState(): HudState {
  const zoom = useMotionValue(1);
  const seq = useMotionValue(0);
  const pair = useMotionValue("A–T");
  const speed = useMotionValue(0);
  return useMemo(() => ({ zoom, seq, pair, speed }), [zoom, seq, pair, speed]);
}

/**
 * Returns a function the renderer calls each frame with the current zoom and the base pair nearest the
 * reticle. It also derives a smoothed "zoom speed" from the change in log-zoom per second.
 */
export function createHudWriter(hud: HudState) {
  let prevLog = 0;
  let prevTime = 0;
  let speed = 0;
  return (zoom: number, rung: { pair: [Base, Base]; t: number } | null, nowMs: number) => {
    const lz = Math.log(zoom);
    const dt = Math.max(0.001, (nowMs - prevTime) / 1000);
    const rate = prevTime ? Math.abs(lz - prevLog) / dt : 0;
    speed += (Math.min(1, rate / 2.5) - speed) * (1 - Math.exp(-dt / 0.075));
    prevLog = lz;
    prevTime = nowMs;
    hud.zoom.set(zoom);
    // the streaks' opacity: only rewritten when it visibly changes
    if (Math.abs(speed - hud.speed.get()) > 0.004 || (speed < 0.004 && hud.speed.get() !== 0)) hud.speed.set(speed < 0.004 ? 0 : speed);
    if (rung) {
      hud.seq.set(rung.t);
      hud.pair.set(`${rung.pair[0]}–${rung.pair[1]}`);
    }
  };
}
