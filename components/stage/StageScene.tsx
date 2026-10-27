"use client";

import dynamic from "next/dynamic";
import { Component, type RefObject } from "react";
import type { MotionValue } from "motion/react";
import type { Anchor } from "./anchors";
import { useAfterLoad, useSceneActive, useSceneTier } from "./useScene";

// Both renderers are fetched on demand, after the page is already usable.
// Desktop gets three.js; phones get a tiny 2D-canvas version with no three.js at all.
const StageCanvas = dynamic(() => import("./StageCanvas"), { ssr: false });
const StageCanvasLite = dynamic(() => import("./StageCanvasLite"), { ssr: false });

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
 * The centrepiece behind the stage content. On phones it occupies the top part of the screen so the
 * text below stays clean; from tablet width up it fills the stage.
 */
export function StageScene({
  progress,
  anchors,
  watch,
}: {
  progress: MotionValue<number>;
  anchors: Anchor[];
  /** The element whose visibility pauses rendering. */
  watch: RefObject<Element | null>;
}) {
  const tier = useSceneTier();
  const liteReady = useAfterLoad(tier === "lite");
  const active = useSceneActive(watch);
  const show = tier === "full" || (tier === "lite" && liteReady);

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-x-0 top-14 h-[40%] motion-reduce:hidden max-lg:[mask-image:linear-gradient(to_bottom,transparent_0%,#000_14%,#000_72%,transparent_100%)] lg:inset-0 lg:h-full"
    >
      {/* Soft blue glow behind the helix (also the only visual until the scene loads) */}
      <div className="absolute left-1/2 top-1/2 h-[min(110vw,820px)] w-[min(110vw,820px)] -translate-x-1/2 -translate-y-1/2 animate-float bg-[radial-gradient(closest-side,rgba(34,150,255,0.34),rgba(20,90,220,0.16)_55%,transparent)] lg:left-[66%]" />
      {show && tier && (
        <SceneBoundary>
          {tier === "full" ? (
            <StageCanvas progress={progress} anchors={anchors} active={active} />
          ) : (
            <StageCanvasLite progress={progress} anchors={anchors} active={active} />
          )}
        </SceneBoundary>
      )}
    </div>
  );
}
