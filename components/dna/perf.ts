/** Live frame statistics for the scene: shown by the `?perf` badge, and mirrored to data attributes for tests. */
export interface PerfStats {
  /** Frames per second drawn over the last half second. */
  fps: number;
  /** Average gap between frames, in milliseconds. */
  ms: number;
  /** 0 = full quality; higher steps trade resolution for speed (see governor.ts). */
  quality: number;
}

let stats: PerfStats = { fps: 0, ms: 0, quality: 0 };
const listeners = new Set<() => void>();

export const perfStats = {
  get: () => stats,
  set(next: PerfStats) {
    stats = next;
    listeners.forEach((l) => l());
  },
  subscribe(listener: () => void) {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  },
};
