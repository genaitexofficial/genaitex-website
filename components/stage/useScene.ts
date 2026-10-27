"use client";

import { useEffect, useState, useSyncExternalStore, type RefObject } from "react";

export function useMediaQuery(query: string) {
  return useSyncExternalStore(
    (onChange) => {
      const m = window.matchMedia(query);
      m.addEventListener("change", onChange);
      return () => m.removeEventListener("change", onChange);
    },
    () => window.matchMedia(query).matches,
    () => false,
  );
}

type NavigatorHints = Navigator & { deviceMemory?: number; connection?: { saveData?: boolean } };

/** Phones that are fast enough, with enough memory, and not on Data Saver get the lite scene. */
function canRunLite() {
  const n = navigator as NavigatorHints;
  if (n.connection?.saveData) return false;
  if (n.hardwareConcurrency && n.hardwareConcurrency < 4) return false;
  if (n.deviceMemory && n.deviceMemory < 4) return false;
  return true;
}

function useCapableDevice() {
  return useSyncExternalStore(
    () => () => {},
    canRunLite,
    () => false,
  );
}

export type SceneTier = "full" | "lite" | null;

/**
 * full: screens ≥ 768px · lite: capable phones · null: reduced motion or weak devices,
 * which keep the CSS backdrop and never download a renderer.
 */
export function useSceneTier(): SceneTier {
  const wide = useMediaQuery("(min-width: 768px)");
  const reduced = useMediaQuery("(prefers-reduced-motion: reduce)");
  const capable = useCapableDevice();
  if (reduced) return null;
  if (wide) return "full";
  return capable ? "lite" : null;
}

/**
 * True once the page has finished loading and the browser is idle, so the scene never competes
 * with the headline, text or hydration.
 */
export function useAfterLoad(enabled: boolean) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!enabled) return;
    let cancelled = false;
    let idle: number | undefined;
    let timer: ReturnType<typeof setTimeout> | undefined;

    const mount = () => !cancelled && setReady(true);
    const whenIdle = () => {
      if ("requestIdleCallback" in window) idle = window.requestIdleCallback(mount, { timeout: 2500 });
      else timer = setTimeout(mount, 1500);
    };

    if (document.readyState === "complete") whenIdle();
    else window.addEventListener("load", whenIdle, { once: true });

    return () => {
      cancelled = true;
      window.removeEventListener("load", whenIdle);
      if (idle !== undefined) window.cancelIdleCallback(idle);
      if (timer) clearTimeout(timer);
    };
  }, [enabled]);

  return enabled && ready;
}

/** False while the element is off screen or the tab is hidden, so the scene stops rendering. */
export function useSceneActive(ref: RefObject<Element | null>) {
  const [inView, setInView] = useState(true);
  const [tabVisible, setTabVisible] = useState(true);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: 0 });
    io.observe(el);
    const onVisibility = () => setTabVisible(!document.hidden);
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      io.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [ref]);

  return inView && tabVisible;
}
