import type { MotionValue } from "motion/react";
import { ambientAt, cameraAt, type CameraKey } from "@/lib/helix";

/** A pinned chapter stage on the current page: it takes over the camera while it is on screen. */
export interface StageSlot {
  /** 0..1 through the pinned stage (chapter 1 to chapter N). */
  progress: MotionValue<number>;
  /** 0..1 as the stage wrapper travels from entering the viewport (0) to leaving it (1). */
  presence: MotionValue<number>;
  keys: readonly CameraKey[];
  /** The tall wrapper; its on-screen rectangle is where the stage is visible, which phones reveal the scene in. */
  element: HTMLElement;
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
  /** Phones: the screen rows (px) the chapter stage covers, where the full-screen scene is revealed. */
  revealTop: MotionValue<number>;
  revealBottom: MotionValue<number>;
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
  /** Helix size relative to a full-height desktop view (1 = desktop; narrower phones scale down to fit the width). */
  fit: number;
  /** CSS px from the top of the canvas that can actually be seen (the whole height on large screens). */
  visible: number;
  /** True while anything is still changing, so renderers can run at full rate. */
  moving: boolean;
}

const clamp = (n: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, n));
const clamp01 = (n: number) => (n < 0 ? 0 : n > 1 ? 1 : n);
const smooth01 = (x: number) => x * x * (3 - 2 * x);
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/** Wide layouts (the helix pushed right of the text column) start here, as in the stage's CSS. */
const WIDE = 1024;
const STAGE_CX = 66.7;
/** On phones the chapter helix is centred this far down the screen, with the text floating below it. */
const PHONE_STAGE_CY = 0.34;
/**
 * Outside the stages, phones pin the helix in a window across the top of the screen (content scrolls
 * underneath). The window is `--win` in globals.css: clamp(150px, 34svh, 320px). The navbar covers its top.
 */
const NAV_PX = 64;
const WIN_FRAC = 0.34;
const WIN_MIN = 150;
const WIN_MAX = 320;
/** World units visible top to bottom at the default camera distance, and the helix's share of a phone's width. */
const VIEW_UNITS = 4.47;
const PHONE_WIDTH_SHARE = 0.42;

/**
 * The camera brain for the page-long DNA scene. Each frame a renderer asks it for the camera: while a
 * chapter stage is on screen the camera follows the chapter keyframes (bright; beside the text on large
 * screens, full-screen with the text floating below on phones); everywhere else it follows the ambient path
 * (dimmed behind the content on large screens; bright in a pinned window at the top on phones). Between the
 * two it blends smoothly, and the result is eased so jumps (a route change, a restored scroll position) glide.
 */
export function createDirector(out: DirectorOutputs) {
  let stage: StageSlot | null = null;
  let svh = 0;
  let state: Omit<Camera, "fit" | "moving" | "stage" | "visible"> | null = null;
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
    const win = Math.min(WIN_MAX, Math.max(WIN_MIN, WIN_FRAC * small));
    const ambient = {
      zoom: wide ? amb.zoom : amb.zoom * 0.85,
      slide: amb.focus,
      roll: amb.roll,
      cx: wide ? 50 + amb.side * 20 : 50 + amb.side * 10,
      cy: wide ? 50 : (((NAV_PX + win) / 2) / height) * 100, // phones: the middle of the visible window
      dim: wide ? 0.36 : 1,
    };

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
    // Phones reveal the full-screen scene only where the stage is, so it never covers neighbouring content.
    let visible = height;
    if (!wide) {
      const r = stage?.element.getBoundingClientRect();
      const top = r ? clamp(r.top, 0, window.innerHeight) : 0;
      const bottom = r ? Math.max(top, clamp(r.bottom, 0, window.innerHeight)) : 0;
      out.revealTop.set(top);
      out.revealBottom.set(bottom);
      visible = Math.min(height, Math.max(win, bottom));
    }

    return {
      ...state,
      stage: lastStage,
      fit: wide ? 1 : Math.min(1, (PHONE_WIDTH_SHARE * width * VIEW_UNITS) / height),
      visible,
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
