"use client";

import dynamic from "next/dynamic";
import { Component, useEffect, useRef, useState, useSyncExternalStore } from "react";

// Both scenes are fetched on demand, after the page is already usable.
// Desktop gets the full three.js scene; phones get a tiny 2D-canvas version with no three.js at all.
const HeroCanvas = dynamic(() => import("./HeroCanvas"), { ssr: false });
const HeroCanvasLite = dynamic(() => import("./HeroCanvasLite"), { ssr: false });

function useMediaQuery(query: string) {
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

/** Phones that are fast enough, with enough memory, and not on Data Saver get the lite 3D scene. */
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

/**
 * Resolves true once the page has finished loading and the browser is idle, so the 3D scene
 * never competes with the headline, text or hydration on phones.
 */
function useAfterLoad(enabled: boolean) {
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

/** If WebGL is unavailable the scene silently disappears and the CSS backdrop remains. */
class SceneBoundary extends Component<{ children: React.ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}

export function HeroScene() {
  const wide = useMediaQuery("(min-width: 768px)");
  const reduced = useMediaQuery("(prefers-reduced-motion: reduce)");
  const capable = useCapableDevice();
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(true);
  const [tabVisible, setTabVisible] = useState(true);

  // full: desktop and tablets. lite: capable phones. none: everything else keeps the CSS glow.
  const tier = reduced ? null : wide ? "full" : capable ? "lite" : null;
  const liteReady = useAfterLoad(tier === "lite");
  const show = tier === "full" || (tier === "lite" && liteReady);

  // Pause rendering whenever the hero scrolls off screen or the tab is hidden, to save battery and GPU.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), {
      threshold: 0,
    });
    io.observe(el);
    const onVisibility = () => setTabVisible(!document.hidden);
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      io.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return (
    <div ref={ref} aria-hidden className="absolute inset-0">
      {/* Static backdrop: always present, and the only visual until (or instead of) the 3D scene */}
      <div className="absolute left-1/2 top-1/2 h-[min(80vw,560px)] w-[min(80vw,560px)] -translate-x-1/2 -translate-y-1/2 animate-float rounded-full bg-[radial-gradient(circle_at_35%_30%,rgba(34,211,238,0.35),rgba(139,92,246,0.28)_45%,transparent_70%)]" />
      {show && tier && (
        <SceneBoundary>
          {tier === "full" ? (
            <HeroCanvas active={inView && tabVisible} />
          ) : (
            <HeroCanvasLite active={inView && tabVisible} />
          )}
        </SceneBoundary>
      )}
    </div>
  );
}
