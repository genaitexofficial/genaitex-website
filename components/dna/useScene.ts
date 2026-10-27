"use client";

import { useEffect, useState, useSyncExternalStore } from "react";

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

/** Phones that are fast enough, with enough memory, and not on Data Saver get a scene at all. */
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
 * True when WebGL is backed by a real GPU. Software renderers (SwiftShader, llvmpipe: headless browsers,
 * VMs, some remote desktops) cannot keep up with the 3D scene, so those visitors get the 2D renderer.
 */
function hasHardwareGL() {
  if ((window as { __FORCE_WEBGL?: boolean }).__FORCE_WEBGL) return true;
  try {
    const canvas = document.createElement("canvas");
    const gl = (canvas.getContext("webgl2") || canvas.getContext("webgl")) as WebGLRenderingContext | null;
    if (!gl) return false;
    const info = gl.getExtension("WEBGL_debug_renderer_info");
    const renderer = info ? String(gl.getParameter(info.UNMASKED_RENDERER_WEBGL)) : "";
    gl.getExtension("WEBGL_lose_context")?.loseContext();
    return !/swiftshader|llvmpipe|softpipe|software|basic render/i.test(renderer);
  } catch {
    return false;
  }
}

let gpuCache: boolean | undefined;
function useHardwareGL() {
  return useSyncExternalStore(
    () => () => {},
    () => (gpuCache ??= hasHardwareGL()),
    () => false,
  );
}

export type SceneTier = "full" | "lite" | null;

/**
 * full: any device with a real GPU (three.js, the same scene on phones as on desktop; phones must also pass
 * the capability checks) · lite: the same helix as a 2D canvas, no three.js, for devices without a GPU
 * (headless browsers, VMs) and for wide screens that lack one · null: reduced motion or weak phones, which
 * keep the CSS backdrop and never download a renderer.
 */
export function useSceneTier(): SceneTier {
  const wide = useMediaQuery("(min-width: 768px)");
  const reduced = useMediaQuery("(prefers-reduced-motion: reduce)");
  const capable = useCapableDevice();
  const gpu = useHardwareGL();
  if (reduced) return null;
  if (!wide && !capable) return null;
  return gpu ? "full" : "lite";
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

/** False while the tab is hidden, so the scene stops rendering. */
export function useTabVisible() {
  return useSyncExternalStore(
    (onChange) => {
      document.addEventListener("visibilitychange", onChange);
      return () => document.removeEventListener("visibilitychange", onChange);
    },
    () => !document.hidden,
    () => true,
  );
}
