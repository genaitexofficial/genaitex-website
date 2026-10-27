"use client";

import dynamic from "next/dynamic";
import { Component, useEffect, useRef } from "react";
import { useTransform } from "motion/react";
import * as m from "motion/react-m";
import { useDna } from "./DnaProvider";
import { useAfterLoad, useSceneTier, useTabVisible } from "./useScene";

// Both renderers are fetched on demand, after the page is already usable.
// Desktop gets three.js; phones get a tiny 2D-canvas version with no three.js at all.
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
 * bottom. It lives in the root layout, so it persists (and glides) across navigation. The camera follows
 * the scroll position: bright and zoomed per chapter inside a chapter stage, dimmed behind the content
 * everywhere else. Sits behind all page content, so it never intercepts clicks or covers text.
 */
export function DnaBackdrop() {
  const { director, hud, anchors, dim, cx, cy, stage } = useDna();
  const tier = useSceneTier();
  const liteReady = useAfterLoad(tier === "lite");
  const active = useTabVisible();
  const show = tier === "full" || (tier === "lite" && liteReady);

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

  const cxPct = useTransform(cx, (v) => `${v}%`);
  const cyPct = useTransform(cy, (v) => `${v}%`);
  // The glow follows the helix by transform (not left/top), so moving it never counts as a layout shift.
  const orbX = useTransform(cx, (v) => `${v}vw`);
  const orbY = useTransform(cy, (v) => `${v}lvh`);
  const streaks = useTransform(hud.speed, (s) => Math.min(0.85, s));
  // the scan sweep is bold in the chapter stage and a quiet hint behind ordinary page content
  const sweep = useTransform(stage, [0, 1], [0.3, 1]);

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-x-0 top-0 -z-10 h-lvh overflow-hidden"
      data-dna-backdrop
    >
      <div ref={probe} className="invisible absolute left-0 top-0 h-svh w-px" />

      {/* Blue-violet haze and a faint grid, behind everything, with or without the scene */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_70%_at_68%_45%,rgba(34,150,255,0.14),transparent_70%),radial-gradient(ellipse_50%_60%_at_8%_0%,rgba(40,80,255,0.14),transparent_70%)]" />
      <div className="bg-grid absolute inset-0 opacity-50" />

      {/* The scene: a glow, then the helix; its opacity and centre follow the camera director */}
      <m.div data-dna-dim className="absolute inset-0" style={{ opacity: dim }}>
        <m.div
          className="absolute left-0 top-0 h-[min(110vw,820px)] w-[min(110vw,820px)] -translate-x-1/2 -translate-y-1/2"
          style={{ x: orbX, y: orbY }}
        >
          <div className="h-full w-full animate-float bg-[radial-gradient(closest-side,rgba(34,150,255,0.34),rgba(20,90,220,0.16)_55%,transparent)] motion-reduce:animate-none" />
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

      {/* Instrument texture: scanlines, a slow scan sweep, and speed streaks while the zoom moves */}
      {show && tier && (
        <m.div
          className="absolute inset-0 motion-reduce:hidden"
          style={{ "--cx": cxPct, "--cy": cyPct } as React.CSSProperties}
        >
          <div className="hud-scanlines absolute inset-0" />
          <m.div className="absolute inset-0" style={{ opacity: sweep }}>
            <div className="hud-sweep absolute inset-x-0 animate-hud-sweep" />
          </m.div>
          <m.div className="hud-streaks absolute inset-0" style={{ opacity: streaks }} />
        </m.div>
      )}
    </div>
  );
}
