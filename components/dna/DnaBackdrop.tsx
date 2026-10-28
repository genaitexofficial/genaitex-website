"use client";

import dynamic from "next/dynamic";
import { Component, useEffect, useRef } from "react";
import { useTransform } from "motion/react";
import * as m from "motion/react-m";
import { TetherLayer } from "./TetherLayer";
import { useDna } from "./DnaProvider";
import { useAfterLoad, useMediaQuery, useSceneTier, useTabVisible } from "./useScene";

// Both renderers are fetched on demand, after the page is already usable.
// Real GPUs get three.js (on phones too); devices without one get a tiny 2D-canvas version.
const DnaCanvas = dynamic(() => import("./DnaCanvas"), { ssr: false });
const DnaCanvasLite = dynamic(() => import("./DnaCanvasLite"), { ssr: false });

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


/**
 * The DNA double helix behind the whole site, fixed to the viewport from the top of every page to the
 * bottom. It lives in the root layout, so it persists (and glides) across navigation, and sits behind all
 * page content, so it never intercepts a tap and no layer ever cuts across it. The camera follows the scroll
 * position (see director.ts):
 *
 * - Large screens: bright and zoomed per chapter inside a chapter stage; dimmed behind the content elsewhere.
 * - Phones and tablets: full-screen inside a chapter stage; everywhere else it stays big and central, slowly
 *   zooming out and spinning as you scroll, and the content appears out of it (`.dna-node` in globals.css).
 */
export function DnaBackdrop() {
  const { director, hud, anchors, dim, cx, cy, finish } = useDna();
  const tier = useSceneTier();
  const wide = useMediaQuery("(min-width: 768px)");
  const active = useTabVisible();
  // Everything except 3D on tablets and desktops waits for the page to load and the browser to idle.
  const defer = tier === "lite" || (tier === "full" && !wide);
  const ready = useAfterLoad(defer);
  const show = tier !== null && (!defer || ready);

  // The stage is laid out in `svh`, which stays put as mobile toolbars slide; measure it with a probe.
  const probe = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = probe.current;
    if (!el) return;
    const measure = () => director.setSvh(el.clientHeight);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [director]);

  // test hooks: the camera zoom and targeted pair, a few times a second (not per frame)
  const root = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    let last = 0;
    const write = () => {
      const now = performance.now();
      if (now - last < 250) return;
      last = now;
      el.dataset.dnaZoom = hud.zoom.get().toFixed(2);
      el.dataset.dnaPair = hud.pair.get();
      el.dataset.dnaSeq = String(Math.round(hud.seq.get() * 339) + 1);
    };
    const writeFinish = (name: string) => (el.dataset.dnaFinish = name);
    writeFinish(finish.get());
    const offs = [
      hud.zoom.on("change", write),
      hud.pair.on("change", write),
      hud.seq.on("change", write),
      finish.on("change", writeFinish),
    ];
    return () => offs.forEach((off) => off());
  }, [hud, finish]);

  const orbX = useTransform(cx, (v) => `${v}vw`);
  const orbY = useTransform(cy, (v) => `${v}lvh`);
  const streaks = useTransform(hud.speed, (s) => Math.min(0.85, s));
  const cxPct = useTransform(cx, (v) => `${v}%`);
  const cyPct = useTransform(cy, (v) => `${v}%`);

  return (
    <>
      {/* Blue-violet haze and a faint grid, behind everything, with or without the scene */}
      <div aria-hidden className="pointer-events-none fixed inset-x-0 top-0 -z-10 h-lvh overflow-hidden">
        <div className="dna-haze absolute inset-0" />
        <div className="bg-grid absolute inset-0 opacity-50" />
      </div>

      <div
        ref={root}
        aria-hidden
        data-dna-backdrop
        data-dna-tier={tier ?? "none"}
        className="pointer-events-none fixed inset-x-0 top-0 -z-10 h-lvh overflow-hidden"
      >
        <div ref={probe} className="invisible absolute left-0 top-0 h-svh w-px" />

        {/* The scene: a glow, then the helix; its opacity and centre follow the camera director */}
        <m.div data-dna-dim className="absolute inset-0" style={{ opacity: dim }}>
          <m.div
            className="absolute left-0 top-0 h-[min(110vw,820px)] w-[min(110vw,820px)] -translate-x-1/2 -translate-y-1/2"
            style={{ x: orbX, y: orbY }}
          >
            <div className="dna-orb h-full w-full animate-float motion-reduce:animate-none" />
          </m.div>
          {show && tier && (
            <div className="absolute inset-0 animate-fade-in">
              <SceneBoundary>
                {tier === "full" ? (
                  <DnaCanvas director={director} anchors={anchors} hud={hud} active={active} />
                ) : (
                  <DnaCanvasLite director={director} anchors={anchors} hud={hud} active={active} />
                )}
              </SceneBoundary>
            </div>
          )}
        </m.div>

        {/* Instrument texture: faint scanlines, and speed streaks while the zoom moves */}
        {show && tier && (
          <m.div
            className="absolute inset-0 motion-reduce:hidden"
            style={{ "--cx": cxPct, "--cy": cyPct } as React.CSSProperties}
          >
            <div className="hud-scanlines absolute inset-0" />
            <m.div className="hud-streaks absolute inset-0" style={{ opacity: streaks }} />
          </m.div>
        )}

        {/* The chapter card's line to the targeted base pair (phones and tablets) */}
        {show && tier && <TetherLayer />}
      </div>
    </>
  );
}
