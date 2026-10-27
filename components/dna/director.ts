import type { MotionValue } from "motion/react";
import { ambientAt, cameraAt, type CameraKey } from "@/lib/helix";

/** A pinned chapter stage on the current page: it takes over the camera while it is on screen. */
export interface StageSlot {
  /** 0..1 through the pinned stage (chapter 1 to chapter N). */
  progress: MotionValue<number>;
  /** 0..1 as the stage wrapper travels from entering the viewport (0) to leaving it (1). */
  presence: MotionValue<number>;
  keys: readonly CameraKey[];
}

/** Values the director publishes every frame for the backdrop and HUD to bind to. */
export interface DirectorOutputs {
  /** Opacity of the whole scene: 1 inside the stage, lower behind page content. */
  dim: MotionValue<number>;
  /** Where the helix is centred, in percent of the viewport. */
  cx: MotionValue<number>;
  cy: MotionValue<number>;
  /** 0..1: how much the chapter stage is in control (drives the HUD's visibility). */
  stage: MotionValue<number>;
}

export interface Camera {
  zoom: number;
  /** Helix-axis offset the camera looks at (world units). */
  slide: number;
  roll: number;
  /** Helix rotation from scrolling alone (radians); renderers add a slow clock drift. */
  angle: number;
  /** Where the helix is centred, in percent of the canvas. */
  cx: number;
  cy: number;
  dim: number;
  /** Stage weight 0..1. */
  stage: number;
  /** Fraction of the canvas height the helix is sized for (phones size it to the stage's top 40%). */
  fit: number;
  /** True while anything is still changing, so renderers can run at full rate. */
  moving: boolean;
}

const clamp01 = (n: number) => (n < 0 ? 0 : n > 1 ? 1 : n);
const smooth01 = (x: number) => x * x * (3 - 2 * x);
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/** Wide layouts (the helix pushed right of the text column) start here, as in the stage's CSS. */
const WIDE = 1024;
const STAGE_CX = 66.7;
/** The phone stage's scene box: starts below the navbar and covers 40% of the screen. */
const PHONE_TOP_PX = 56;
const PHONE_BOX = 0.4;

/**
 * The camera brain for the page-long DNA scene. Each frame a renderer asks it for the camera: while a
 * chapter stage is on screen the camera follows the chapter keyframes (bright, at the side of the text);
 * everywhere else it follows the ambient path, dimmed behind the content. Between the two it blends
 * smoothly, and the result is eased so jumps (a route change, a restored scroll position) glide.
 */
export function createDirector(out: DirectorOutputs) {
  let stage: StageSlot | null = null;
  let svh = 0;
  let state: Omit<Camera, "fit" | "moving" | "stage"> | null = null;
  let lastTime = 0;
  let lastStage = 0;

  const sample = (width: number, height: number): Camera => {
    const now = performance.now();
    const dt = lastTime ? Math.min(0.1, (now - lastTime) / 1000) : 0;
    lastTime = now;

    const wide = width >= WIDE;
    const small = svh || window.innerHeight;
    const g = window.scrollY / small;

    // Ambient camera (outside the stage)
    const amb = ambientAt(g);
    const ambient = {
      zoom: wide ? amb.zoom : amb.zoom * 0.75, // phones show a little more of the helix behind the text
      slide: amb.focus,
      roll: amb.roll,
      cx: wide ? 50 + amb.side * 20 : 50 + amb.side * 8,
      cy: 50,
      dim: wide ? 0.36 : 0.32,
    };

    // Stage camera (chapter keyframes), blended in as the stage arrives and out as it leaves
    let target = ambient;
    let weight = 0;
    if (stage) {
      const p = clamp01(stage.progress.get());
      const cam = cameraAt(p, stage.keys);
      const edge = 1 / (stage.keys.length + 1);
      const presence = stage.presence.get();
      weight = smooth01(clamp01(presence / edge)) * smooth01(clamp01((1 - presence) / edge));
      const chapter = {
        zoom: cam.zoom,
        slide: cam.focus + (p - 0.5) * 0.8,
        roll: cam.roll,
        cx: wide ? STAGE_CX : 50,
        cy: wide ? 50 : ((PHONE_TOP_PX + (PHONE_BOX / 2) * small) / height) * 100,
        dim: 1,
      };
      target = {
        zoom: Math.exp(lerp(Math.log(ambient.zoom), Math.log(chapter.zoom), weight)),
        slide: lerp(ambient.slide, chapter.slide, weight),
        roll: lerp(ambient.roll, chapter.roll, weight),
        cx: lerp(ambient.cx, chapter.cx, weight),
        cy: lerp(ambient.cy, chapter.cy, weight),
        dim: lerp(ambient.dim, chapter.dim, weight),
      };
    }
    const goal = { ...target, angle: g * Math.PI };

    // Ease toward the goal (exponential smoothing; the first frame snaps)
    let moving = false;
    if (!state) {
      state = goal;
      moving = true;
    } else {
      const fast = 1 - Math.exp(-dt / 0.09);
      const slow = 1 - Math.exp(-dt / 0.25);
      const prev = state;
      state = {
        zoom: Math.exp(lerp(Math.log(prev.zoom), Math.log(goal.zoom), fast)),
        slide: lerp(prev.slide, goal.slide, fast),
        roll: lerp(prev.roll, goal.roll, fast),
        angle: lerp(prev.angle, goal.angle, fast),
        cx: lerp(prev.cx, goal.cx, slow),
        cy: lerp(prev.cy, goal.cy, slow),
        dim: lerp(prev.dim, goal.dim, slow),
      };
      moving =
        Math.abs(Math.log(state.zoom / prev.zoom)) > 2e-4 ||
        Math.abs(state.slide - prev.slide) > 2e-4 ||
        Math.abs(state.angle - prev.angle) > 2e-4 ||
        Math.abs(state.cx - prev.cx) > 0.01 ||
        Math.abs(state.dim - prev.dim) > 1e-3;
    }
    lastStage = lerp(lastStage, weight, dt ? 1 - Math.exp(-dt / 0.12) : 1);

    out.dim.set(state.dim);
    out.cx.set(state.cx);
    out.cy.set(state.cy);
    out.stage.set(lastStage);

    return {
      ...state,
      stage: lastStage,
      fit: wide ? 1 : (PHONE_BOX * small) / height,
      moving,
    };
  };

  return {
    sample,
    /** Called with the chapter stage on the current page, or null when it leaves. */
    setStage(next: StageSlot | null) {
      stage = next;
    },
    /** The small-viewport height in px (the stage's `100svh`), which never changes as mobile toolbars slide. */
    setSvh(px: number) {
      svh = px;
    },
  };
}

export type Director = ReturnType<typeof createDirector>;
