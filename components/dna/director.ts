import type { MotionValue } from "motion/react";
import {
  FINISHES,
  finishWeights,
  parseFinish,
  SCREENS_PER_FINISH,
  type FinishWeights,
} from "@/lib/finishes";
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
  /** Opacity of the whole scene: 1 inside the stage and on phones, lower behind page content on large screens. */
  dim: MotionValue<number>;
  /** Where the helix is centred, in percent of the viewport. */
  cx: MotionValue<number>;
  cy: MotionValue<number>;
  /** 0..1: how much the chapter stage is in control (drives the HUD's visibility). */
  stage: MotionValue<number>;
  /** Name of the bead finish that is showing most (chrome, pearl or gunmetal), for tests and styling. */
  finish: MotionValue<string>;
}

export interface Camera {
  zoom: number;
  /** Helix-axis offset the camera looks at (world units). */
  slide: number;
  roll: number;
  /** Helix rotation about its axis (radians): turns with the scroll, plus a steady spin over time. */
  angle: number;
  /** Where the helix is centred, in percent of the canvas. */
  cx: number;
  cy: number;
  dim: number;
  /** Stage weight 0..1. */
  stage: number;
  /** How much of each bead finish is showing (chrome, pearl, gunmetal; sums to 1). Desktop themes only. */
  finish: Readonly<FinishWeights>;
  /** Helix size relative to a full-height desktop view (1 = desktop; narrower phones scale down to fit the width). */
  fit: number;
  /** True while anything is still changing, so renderers can run at full rate. */
  moving: boolean;
}

/** Where the renderer last drew every base pair (the rung midpoints), in percent of the canvas. */
export interface RungPositions {
  x: Float32Array;
  y: Float32Array;
  /** Canvas size in px, to convert the percentages. */
  w: number;
  h: number;
}

const clamp01 = (n: number) => (n < 0 ? 0 : n > 1 ? 1 : n);
const smooth01 = (x: number) => x * x * (3 - 2 * x);
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/** Wide layouts (the helix pushed right of the text column) start here, as in the stage's CSS. */
const WIDE = 1024;
const STAGE_CX = 66.7;
/** On phones the chapter helix is centred this far down the screen, with the text card below it. */
const PHONE_STAGE_CY = 0.34;
/** World units visible top to bottom at the default camera distance, and the helix's share of a phone's width. */
const VIEW_UNITS = 4.47;
const PHONE_WIDTH_SHARE = 0.42;

/**
 * Phones and tablets, outside a chapter stage: the helix stays big and central (on the chapters' diagonal)
 * and slowly zooms out as you scroll, from ZOOM_TOP at the top of a page down to ZOOM_FLOOR after about
 * ZOOM_OUT_SPAN viewport heights, where it holds. It keeps spinning even when you stop. The content appears
 * out of it (see `.dna-node` in globals.css).
 */
const ZOOM_TOP = 1.2;
const ZOOM_FLOOR = 0.62;
const ZOOM_OUT_SPAN = 12;
/** Steady spin, radians per second: a little livelier on phones and tablets, where the helix is the star. */
const SPIN_DESKTOP = 0.12;
const SPIN_PHONE = 0.22;
/** How quickly the bead finish follows its goal, in seconds. */
const FINISH_EASE = 0.25;

/**
 * The camera brain for the page-long DNA scene. Each frame a renderer asks it for the camera: while a
 * chapter stage is on screen the camera follows the chapter keyframes (bright; beside the text on large
 * screens, full-screen on phones); everywhere else it follows the ambient path (dimmed, swaying, behind the
 * content on large screens; central and slowly zooming out on phones and tablets). Between the two it blends
 * smoothly, and the result is eased so jumps (a route change, a restored scroll position) glide.
 */
export function createDirector(out: DirectorOutputs) {
  let stage: StageSlot | null = null;
  let svh = 0;
  let state: Omit<Camera, "fit" | "moving" | "stage" | "finish"> | null = null;
  let lastTime = 0;
  let lastStage = 0;
  let drift = 0; // accumulated steady spin (radians)
  const finish: FinishWeights = [1, 0, 0];
  const finishGoal: FinishWeights = [1, 0, 0];
  const finishScratch: FinishWeights = [1, 0, 0];
  let finishLock: number | null | undefined; // `?finish=` on the first visit: undefined = not read yet
  let moving = true;
  const rungs: RungPositions = { x: new Float32Array(0), y: new Float32Array(0), w: 0, h: 0 };
  /** Where the targeting reticle (the middle of the helix) is, in px of the canvas. */
  const reticle = { x: 0, y: 0 };

  const sample = (width: number, height: number): Camera => {
    const now = performance.now();
    const dt = lastTime ? Math.min(0.1, (now - lastTime) / 1000) : 0;
    lastTime = now;

    const wide = width >= WIDE;
    const small = svh || window.innerHeight;
    const g = window.scrollY / small;
    const fit = wide ? 1 : Math.min(1, (PHONE_WIDTH_SHARE * width * VIEW_UNITS) / height);

    // Ambient camera (outside the stage)
    const amb = ambientAt(g);
    let ambient;
    if (wide) {
      ambient = { zoom: amb.zoom, slide: amb.focus, roll: amb.roll, cx: 50 + amb.side * 20, cy: 50, dim: 0.36 };
    } else {
      // Central and bright, on the chapters' diagonal, zooming out slowly with the distance scrolled (the same
      // pace on every page). The slide stays small so the ends of the helix never come into view.
      const out = smooth01(clamp01(g / ZOOM_OUT_SPAN));
      ambient = {
        zoom: Math.exp(lerp(Math.log(ZOOM_TOP), Math.log(ZOOM_FLOOR), out)),
        slide: 0.4 * Math.sin(g * 0.5),
        roll: amb.roll * 0.3,
        cx: 50,
        cy: ((0.44 * small) / height) * 100,
        dim: 0.8,
      };
    }
    const ambientSpin = wide ? SPIN_DESKTOP : SPIN_PHONE;

    // Bead finish: the ambient cycle follows the distance scrolled; a stage overrides it chapter by chapter
    finishWeights(g / SCREENS_PER_FINISH, 3, true, finishGoal);

    // Stage camera (chapter keyframes), blended in as the stage arrives and out as it leaves
    let target = ambient;
    let weight = 0;
    if (stage) {
      const p = clamp01(stage.progress.get());
      const cam = cameraAt(p, stage.keys);
      const edge = 1 / (stage.keys.length + 1);
      const presence = stage.presence.get();
      // Starts once the stage is half way into view (and ends half way out), so a stage peeking in at the
      // bottom of a short page does not pull the camera or show its HUD.
      const ramp = (x: number) => smooth01(clamp01(x * 2 - 1));
      weight = ramp(presence / edge) * ramp((1 - presence) / edge);
      if (weight > 0) {
        finishWeights(p * (stage.keys.length - 1), stage.keys.length, false, finishScratch);
        for (let k = 0; k < 3; k++) finishGoal[k] = lerp(finishGoal[k], finishScratch[k], weight);
      }
      const chapter = {
        zoom: cam.zoom,
        slide: cam.focus + (p - 0.5) * 0.8,
        roll: cam.roll,
        cx: wide ? STAGE_CX : 50,
        cy: wide ? 50 : ((PHONE_STAGE_CY * small) / height) * 100,
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
    drift += lerp(ambientSpin, SPIN_DESKTOP, weight) * dt;

    if (finishLock === undefined) finishLock = parseFinish(window.location.search);
    if (finishLock !== null) finishGoal.forEach((_, k) => (finishGoal[k] = k === finishLock ? 1 : 0));
    let finishMoving = false;
    const finishEase = !state || !dt ? 1 : 1 - Math.exp(-dt / FINISH_EASE);
    for (let k = 0; k < 3; k++) {
      const next = lerp(finish[k], finishGoal[k], finishEase);
      if (Math.abs(next - finish[k]) > 1e-3) finishMoving = true;
      finish[k] = next;
    }
    out.finish.set(FINISHES[finish.indexOf(Math.max(...finish))]);

    // Ease toward the goal (exponential smoothing; the first frame snaps)
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
        Math.abs(state.roll - prev.roll) > 2e-4 ||
        Math.abs(state.cx - prev.cx) > 0.01 ||
        Math.abs(state.dim - prev.dim) > 1e-3 ||
        finishMoving;
    }
    lastStage = lerp(lastStage, weight, dt ? 1 - Math.exp(-dt / 0.12) : 1);

    out.dim.set(state.dim);
    out.cx.set(state.cx);
    out.cy.set(state.cy);
    out.stage.set(lastStage);

    reticle.x = (state.cx / 100) * width;
    reticle.y = (state.cy / 100) * height;
    return { ...state, angle: state.angle + drift, stage: lastStage, fit, finish, moving };
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
    /**
     * The chapter stage is `100svh` tall but the canvas is `100lvh`, which differ on phones while the toolbar
     * is showing. Multiply a stage percentage by this to get the canvas percentage (divide to go back).
     */
    stageRatio(canvasHeight: number) {
      return (svh || window.innerHeight) / canvasHeight;
    },
    /** Renderers report where every base pair was drawn, so the tether lines can attach to real rungs. */
    publishRungs(x: Float32Array, y: Float32Array, w: number, h: number) {
      rungs.x = x;
      rungs.y = y;
      rungs.w = w;
      rungs.h = h;
    },
    rungs,
    reticle,
    /** True while the camera is still changing (last sampled frame). */
    get moving() {
      return moving;
    },
  };
}

export type Director = ReturnType<typeof createDirector>;
