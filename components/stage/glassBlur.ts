import { useSyncExternalStore } from "react";
import { perfStats } from "@/components/dna/perf";

/**
 * The Home glass stack's backdrop blur is the one expensive effect on the site (the DNA behind it is redrawn
 * every frame, so the blur is too). It is on while the device keeps up. If the scene's frame governor has had to
 * lower the resolution and stays lowered for a few seconds, the glass drops to an opaque frosted fill for the rest
 * of the visit, so the page never trades smoothness for the effect. `?glass=blur` or `?glass=flat` forces one
 * (for tests and comparisons).
 */
const SLOW_FOR = 4000;

let flat = false;
let forced: boolean | null | undefined; // undefined = the URL has not been read yet
const listeners = new Set<() => void>();

const read = () => {
  if (forced === undefined) {
    const v = typeof window === "undefined" ? null : new URLSearchParams(window.location.search).get("glass");
    forced = v === "flat" ? true : v === "blur" ? false : null;
  }
  return forced ?? flat;
};

function subscribe(listener: () => void) {
  listeners.add(listener);
  let timer: ReturnType<typeof setTimeout> | undefined;
  const watch = () => {
    if (perfStats.get().quality >= 1) {
      timer ??= setTimeout(() => {
        flat = true;
        listeners.forEach((l) => l());
      }, SLOW_FOR);
    } else if (timer) {
      clearTimeout(timer);
      timer = undefined;
    }
  };
  watch();
  const off = perfStats.subscribe(watch);
  return () => {
    listeners.delete(listener);
    off();
    if (timer) clearTimeout(timer);
  };
}

/** True when the glass should drop its blur for an opaque frosted fill. */
export const useGlassFlat = () => useSyncExternalStore(subscribe, read, () => false);
