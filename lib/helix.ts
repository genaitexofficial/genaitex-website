/**
 * Geometry of the DNA double helix used by the scroll stage.
 *
 * Pure functions with no three.js import, shared by the WebGL (desktop) and 2D-canvas (phone)
 * renderers. The helix runs along the Y axis; beads are small spheres: a glossy sugar-phosphate
 * backbone on each strand, and dotted base-pair rungs joining them.
 */

export interface HelixParams {
  /** Backbone beads per strand. */
  steps: number;
  radius: number;
  /** Rise per step along the axis. */
  pitch: number;
  /** Rotation per step (radians). */
  turn: number;
  /** Phase offset of the second strand; not π, so the major and minor grooves show like the real thing. */
  offsetB: number;
  /** A rung every `rungEvery` steps. */
  rungEvery: number;
  beadsPerHalfRung: number;
  backboneRadius: number;
  rungRadius: number;
}

/**
 * Beads overlap along each strand so the backbone reads as a continuous glossy tube. One turn is about
 * 42 steps, with the strands 2.4 rad apart (not π), so the grooves look like real B-DNA.
 */
export const HELIX_FULL: HelixParams = {
  steps: 340,
  radius: 0.85,
  pitch: 0.0425,
  turn: 0.15,
  offsetB: 2.4,
  rungEvery: 5,
  beadsPerHalfRung: 6,
  backboneRadius: 0.085,
  rungRadius: 0.03,
};

/** The same helix with under half the beads (about 360), for the 2D canvas renderer. */
export const HELIX_LITE: HelixParams = {
  steps: 120,
  radius: 0.85,
  pitch: 0.12,
  turn: 0.425,
  offsetB: 2.4,
  rungEvery: 4,
  beadsPerHalfRung: 2,
  backboneRadius: 0.14,
  rungRadius: 0.06,
};

/** Colour slot of a bead: 0 = backbone, 1..4 = the four bases (A, T, G, C). */
export type Base = "A" | "T" | "G" | "C";
export const baseColors: Record<Base, string> = {
  A: "#22d3ee",
  T: "#a78bfa",
  G: "#60a5fa",
  C: "#67e8f9",
};
const baseOrder: Base[] = ["A", "T", "G", "C"];
/** Complementary pairs, as in real DNA: A with T, G with C. */
const partner: Record<Base, Base> = { A: "T", T: "A", G: "C", C: "G" };

export interface Bead {
  x: number;
  y: number;
  z: number;
  r: number;
  /** 0 = backbone, 1..4 = base A, T, G, C. */
  color: number;
}

export interface Rung {
  /** Midpoint of the rung (where the two bases meet), in helix space. */
  mid: [number, number, number];
  /** The two bases this rung joins, e.g. ["A", "T"]. */
  pair: [Base, Base];
  /** Position along the helix, 0..1. */
  t: number;
}

export function mulberry32(seed: number) {
  let a = seed;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const strandPoint = (P: HelixParams, strand: 0 | 1, i: number): [number, number, number] => {
  const a = i * P.turn + (strand === 1 ? P.offsetB : 0);
  return [P.radius * Math.cos(a), (i - P.steps / 2) * P.pitch, P.radius * Math.sin(a)];
};

/** Build every bead of the helix, plus the rung midpoints used to anchor callout lines. */
export function buildHelix(lite = false) {
  const P = lite ? HELIX_LITE : HELIX_FULL;
  const rand = mulberry32(21);
  const beads: Bead[] = [];
  const rungs: Rung[] = [];

  for (const strand of [0, 1] as const) {
    for (let i = 0; i < P.steps; i++) {
      const [x, y, z] = strandPoint(P, strand, i);
      beads.push({ x, y, z, r: P.backboneRadius, color: 0 });
    }
  }

  for (let i = 1; i < P.steps - 1; i += P.rungEvery) {
    const a = strandPoint(P, 0, i);
    const b = strandPoint(P, 1, i);
    const left = baseOrder[Math.floor(rand() * 4)];
    const right = partner[left];
    const n = P.beadsPerHalfRung;
    for (let k = 0; k < n; k++) {
      // Each half runs from its backbone bead toward the middle, leaving a small gap at the join.
      const t = (k + 0.7) / (n * 2 + 0.4);
      for (const [from, to, base] of [
        [a, b, left],
        [b, a, right],
      ] as const) {
        beads.push({
          x: from[0] + (to[0] - from[0]) * t,
          y: from[1] + (to[1] - from[1]) * t,
          z: from[2] + (to[2] - from[2]) * t,
          r: P.rungRadius,
          color: baseOrder.indexOf(base) + 1,
        });
      }
    }
    rungs.push({ mid: [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2, (a[2] + b[2]) / 2], pair: [left, right], t: i / (P.steps - 1) });
  }

  return { beads, rungs };
}

/** Where the camera looks and how far it is zoomed in, at one chapter. */
export interface CameraKey {
  /** Optical zoom: 1 = the whole helix in view, 6 = a single base pair filling the screen. */
  zoom: number;
  /** Where along the helix axis the camera looks (world units; 0 = the middle). */
  focus: number;
  /** A touch of camera roll in radians, for a more handheld, cinematic feel. */
  roll?: number;
}

const clamp01 = (n: number) => (n < 0 ? 0 : n > 1 ? 1 : n);
const easeInOutCubic = (x: number) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);

/**
 * Interpolates the chapter camera keys at scroll progress `p` (0..1).
 * Each step holds its view for the first quarter of the swipe, eases through the middle half, then
 * holds the next view for the last quarter, so every chapter reads clearly before the next fly-through.
 * Zoom is interpolated in log space, so the dolly feels even rather than rushing at the end.
 */
export function cameraAt(p: number, keys: readonly CameraKey[]) {
  const last = keys.length - 1;
  const t = clamp01(p) * last;
  const i = Math.min(Math.floor(t), Math.max(last - 1, 0));
  const e = easeInOutCubic(clamp01((t - i - 0.25) / 0.5));
  const a = keys[i];
  const b = keys[Math.min(i + 1, last)];
  return {
    zoom: Math.exp(Math.log(a.zoom) + (Math.log(b.zoom) - Math.log(a.zoom)) * e),
    focus: a.focus + (b.focus - a.focus) * e,
    roll: (a.roll ?? 0) + ((b.roll ?? 0) - (a.roll ?? 0)) * e,
  };
}

/** A waypoint on the ambient path the camera follows outside the chapter stage. */
export interface AmbientKey extends CameraKey {
  /** Which side of the page the helix leans toward: -1 left, 0 centre, 1 right. */
  side: number;
}

/**
 * Outside the chapter stage (the rest of the Home page, every other page) the helix keeps going: the camera
 * glides along this cycle of waypoints as you scroll, zooming in and out and swaying side to side. Zooms stay
 * moderate and the scene is dimmed there, so text on top stays readable.
 */
const AMBIENT: readonly AmbientKey[] = [
  { zoom: 1.5, focus: 0, roll: 0.02, side: 1 },
  { zoom: 2.5, focus: 2, roll: -0.05, side: -1 },
  { zoom: 1.3, focus: -1.4, roll: 0.06, side: 1 },
  { zoom: 3.1, focus: 1.2, roll: -0.04, side: -1 },
  { zoom: 1.8, focus: -2.2, roll: 0.05, side: 1 },
  { zoom: 2.8, focus: 0.6, roll: -0.06, side: -1 },
];

/** Viewport heights of scrolling between two ambient waypoints. */
export const AMBIENT_STEP = 1.3;

/** The ambient camera `g` viewport-heights down the page (same hold-and-ease rhythm as the chapters). */
export function ambientAt(g: number) {
  const t = Math.max(0, g) / AMBIENT_STEP;
  const i = Math.floor(t);
  const e = easeInOutCubic(clamp01((t - i - 0.25) / 0.5));
  const a = AMBIENT[i % AMBIENT.length];
  const b = AMBIENT[(i + 1) % AMBIENT.length];
  return {
    zoom: Math.exp(Math.log(a.zoom) + (Math.log(b.zoom) - Math.log(a.zoom)) * e),
    focus: a.focus + (b.focus - a.focus) * e + Math.sin(g * 0.8) * 0.25,
    roll: (a.roll ?? 0) + ((b.roll ?? 0) - (a.roll ?? 0)) * e,
    side: a.side + (b.side - a.side) * e,
  };
}

/** The helix leans from lower-left to upper-right, like the reference image. */
export const HELIX_TILT = -0.62;
