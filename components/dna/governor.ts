import { perfStats } from "./perf";

/** Quality steps: 0 is full resolution; each step after it trades resolution (not frame rate) for speed. */
export const QUALITY_STEPS = 4;
/** Resolution scale at each step. */
export const QUALITY_SCALE = [1, 0.85, 0.72, 0.6] as const;

/** The average gap between frames above which (about 45 fps) the scene steps down, and below which it may step up. */
const SLOW_MS = 22;
const FAST_MS = 18.5;
const DOWN_AFTER = 1000;
const UP_AFTER = 6000;
const STALL_MS = 2000;

/**
 * Watches how long frames take and keeps the scene smooth on any device: when it cannot keep up it drops the
 * resolution a step (after a second of slow frames), and when there is plenty of headroom it climbs back
 * (after several seconds). If a step up is followed straight away by a step down, the next climb waits longer,
 * so it never flickers between two levels. With `climb: false` (phones) it only ever steps down. Call `tick` once per
 * drawn frame.
 */
export function createGovernor(onChange: (quality: number) => void, options: { climb?: boolean } = {}) {
  const canClimb = options.climb ?? true;
  let quality = 0;
  let avg = 1000 / 60;
  let last = 0;
  let slowSince = 0;
  let fastSince = 0;
  let climbedAt = 0;
  let climbBlockUntil = 0;
  let wait = UP_AFTER;
  let statStart = 0;
  let statFrames = 0;

  const move = (to: number) => {
    quality = to;
    avg = (SLOW_MS + FAST_MS) / 2; // judge the new level on fresh frames
    slowSince = fastSince = 0;
    onChange(quality);
  };

  return {
    get quality() {
      return quality;
    },
    tick(now: number) {
      const gap = last ? now - last : 0;
      last = now;
      if (gap > STALL_MS) {
        // a tab that was hidden, or a long pause: not a measure of speed
        slowSince = fastSince = 0;
        statStart = 0;
        return;
      }
      if (gap > 0) {
        avg += (gap - avg) * 0.06;
        statFrames++;
      }

      if (avg > SLOW_MS) {
        fastSince = 0;
        slowSince ||= now;
        if (now - slowSince > DOWN_AFTER && quality < QUALITY_STEPS - 1) {
          if (climbedAt && now - climbedAt < 10_000) {
            wait = Math.min(wait * 2, 60_000);
            climbBlockUntil = now + wait;
          }
          move(quality + 1);
        }
      } else if (avg < FAST_MS) {
        slowSince = 0;
        fastSince ||= now;
        if (canClimb && now - fastSince > UP_AFTER && now > climbBlockUntil && quality > 0) {
          climbedAt = now;
          move(quality - 1);
        }
      } else {
        slowSince = fastSince = 0;
      }

      if (!statStart) statStart = now;
      if (now - statStart >= 500) {
        perfStats.set({ fps: (statFrames * 1000) / (now - statStart), ms: avg, quality });
        statStart = now;
        statFrames = 0;
      }
    },
  };
}
