"use client";

import { useSyncExternalStore } from "react";
import { perfStats } from "./perf";

const wanted = () => new URLSearchParams(window.location.search).has("perf");

/**
 * A small corner readout of how smoothly the scene is drawing on this device: frames per second, the average
 * gap between frames, and the quality step the governor has settled on (0 = full). Shown only when the URL has
 * `?perf`; otherwise it renders nothing and subscribes to nothing.
 */
export function PerfBadge() {
  const show = useSyncExternalStore(() => () => {}, wanted, () => false);
  return show ? <Readout /> : null;
}

function Readout() {
  const { fps, ms, quality } = useSyncExternalStore(perfStats.subscribe, perfStats.get, perfStats.get);
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed bottom-3 left-3 z-[60] rounded-full border border-line-strong bg-panel/90 px-3 py-1.5 font-mono text-[11px] tabular-nums text-fg"
    >
      {fps.toFixed(0)} fps · {ms.toFixed(1)} ms · quality {quality}
    </div>
  );
}
