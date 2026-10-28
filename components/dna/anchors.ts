import { useMemo } from "react";
import { useMotionValue, type MotionValue } from "motion/react";

/**
 * A callout line's free end. The renderer writes the screen position (percent of the stage) of the helix
 * rung nearest the target into x/y every frame, so the line follows the rung as it turns. Large screens aim
 * at `target`; phones lay the options out differently and aim at `phone`.
 */
export interface Anchor {
  x: MotionValue<number>;
  y: MotionValue<number>;
  /** Where on the stage (percent) the line prefers to end, on large screens. */
  target: { x: number; y: number };
  /** The same, on phones and tablets. */
  phone: { x: number; y: number };
  /**
   * Where the line starts, inside its card (percent of the stage, large screens). When no base pair is free for the
   * dot (all are under cards or off screen) it rests here, so the line has no length and is not drawn.
   */
  rest: { x: number; y: number };
}

/** Four anchors (one per option card). Hooks must run in a fixed order, so they are written out. */
export function useAnchors(
  targets: readonly [number, number][],
  phoneTargets: readonly [number, number][],
  rests: readonly [number, number][],
): Anchor[] {
  const x0 = useMotionValue(targets[0][0]);
  const y0 = useMotionValue(targets[0][1]);
  const x1 = useMotionValue(targets[1][0]);
  const y1 = useMotionValue(targets[1][1]);
  const x2 = useMotionValue(targets[2][0]);
  const y2 = useMotionValue(targets[2][1]);
  const x3 = useMotionValue(targets[3][0]);
  const y3 = useMotionValue(targets[3][1]);
  return useMemo(
    () =>
      [
        [x0, y0],
        [x1, y1],
        [x2, y2],
        [x3, y3],
      ].map(([x, y], k) => ({
        x,
        y,
        target: { x: targets[k][0], y: targets[k][1] },
        phone: { x: phoneTargets[k][0], y: phoneTargets[k][1] },
        rest: { x: rests[k][0], y: rests[k][1] },
      })),
    // targets are module constants
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [x0, y0, x1, y1, x2, y2, x3, y3],
  );
}
