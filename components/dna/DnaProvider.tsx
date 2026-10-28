"use client";

import { createContext, useContext, useMemo } from "react";
import { useMotionValue } from "motion/react";
import { calloutSlots, phoneSlots } from "@/components/stage/StageParts";
import { useAnchors, type Anchor } from "./anchors";
import { createDirector, type Director } from "./director";
import { useHudState, type HudState } from "./hud";
import type { MotionValue } from "motion/react";

/**
 * What the page-long DNA scene shares with the rest of the site: the camera director, the live HUD values
 * the renderer writes, the callout anchors a chapter stage reads, and the scene's published view state.
 */
export interface Dna {
  director: Director;
  hud: HudState;
  anchors: Anchor[];
  dim: MotionValue<number>;
  cx: MotionValue<number>;
  cy: MotionValue<number>;
  stage: MotionValue<number>;
  finish: MotionValue<string>;
}

const DnaContext = createContext<Dna | null>(null);

export function useDna(): Dna {
  const dna = useContext(DnaContext);
  if (!dna) throw new Error("useDna must be used inside <DnaProvider>");
  return dna;
}

export function DnaProvider({ children }: { children: React.ReactNode }) {
  const hud = useHudState();
  const anchors = useAnchors(
    calloutSlots.map((s) => [s.line[2], s.line[3]] as [number, number]),
    phoneSlots.map((s) => [s.line[2], s.line[3]] as [number, number]),
    calloutSlots.map((s) => [s.line[0], s.line[1]] as [number, number]),
  );
  const dim = useMotionValue(0.4);
  const cx = useMotionValue(50);
  const cy = useMotionValue(50);
  const stage = useMotionValue(0);
  const finish = useMotionValue("chrome");
  const value = useMemo<Dna>(
    () => ({ director: createDirector({ dim, cx, cy, stage, finish }), hud, anchors, dim, cx, cy, stage, finish }),
    [hud, anchors, dim, cx, cy, stage, finish],
  );
  return <DnaContext value={value}>{children}</DnaContext>;
}
