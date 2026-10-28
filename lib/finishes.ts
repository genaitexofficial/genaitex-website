import type { SceneTheme } from "@/components/theme/store";
import { clamp01, easeInOutCubic } from "./helix";

/**
 * The three finishes of the DNA beads: polished silver chrome, frosted pearl, and gunmetal with
 * silver highlights. Each chapter of a stage wears the next finish and the beads morph between them during the
 * swipe; outside a stage they keep cycling with the distance scrolled. Pure, so the camera director and both
 * renderers share it.
 */
export const FINISHES = ["chrome", "pearl", "gunmetal"] as const;
export type Finish = (typeof FINISHES)[number];
/** How much of each finish is showing (chrome, pearl, gunmetal); sums to 1. */
export type FinishWeights = [number, number, number];

/** Outside a chapter stage, viewport heights of scrolling each finish holds (a full cycle is six screens). */
export const SCREENS_PER_FINISH = 2;

/** Lightness of base pair A, T, G, C relative to the finish: the four bases differ by tone, not by hue. */
export const BASE_SHADE = [1, 0.74, 0.88, 0.58] as const;

/** The finish named in a `?finish=` query string (for reviewing one at a time), as an index, or null. */
export function parseFinish(search: string): number | null {
  const name = new URLSearchParams(search).get("finish");
  const i = (FINISHES as readonly (string | null)[]).indexOf(name);
  return i < 0 ? null : i;
}

/**
 * The blend at position `t` along a sequence of finishes (item k wears finish k % 3): each item holds for a
 * quarter of the step, eases through the middle half, then holds the next, like the chapter camera does.
 * `wrap` lets the sequence run on forever; otherwise it ends at item `count - 1`.
 */
export function finishWeights(t: number, count: number, wrap: boolean, out: FinishWeights) {
  const i = wrap ? Math.floor(Math.max(0, t)) : Math.min(Math.floor(Math.max(0, t)), Math.max(count - 2, 0));
  const e = easeInOutCubic(clamp01((t - i - 0.25) / 0.5));
  out[0] = out[1] = out[2] = 0;
  out[i % 3] += 1 - e;
  out[(i + 1) % 3] += e;
  return out;
}

/** What the scene looks like around the beads, per theme (`legacy` is the original blue look, used only with the themes switched off). */
export const SCENE_LOOK: Record<
  SceneTheme,
  { fog: string; halo: string; haloOpacity: number; dust: string; dustOpacity: number; additive: boolean }
> = {
  legacy: { fog: "#050914", halo: "#7dd3fc", haloOpacity: 0.3, dust: "#7dd3fc", dustOpacity: 0.55, additive: true },
  night: { fog: "#0e0f11", halo: "#e4e7ec", haloOpacity: 0.1, dust: "#cfd3da", dustOpacity: 0.4, additive: true },
  day: { fog: "#f3f1ec", halo: "#26282c", haloOpacity: 0.07, dust: "#5b5f66", dustOpacity: 0.32, additive: false },
};
