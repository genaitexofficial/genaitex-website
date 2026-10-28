"use client";

import { useEffect, useRef, useSyncExternalStore } from "react";
import { FINISHES } from "@/lib/finishes";
import { baseColors, buildHelix, HELIX_TILT } from "@/lib/helix";
import { getSceneTheme, subscribe, type SceneTheme } from "@/components/theme/store";
import type { Anchor } from "./anchors";
import type { Director } from "./director";
import { createGovernor, QUALITY_SCALE } from "./governor";
import { createHudWriter, type HudState } from "./hud";
import { drawSprite } from "./matcap";

/**
 * The 2D-canvas renderer for the page-long scene: the same DNA double helix and the same fly-through zoom,
 * drawn from pre-rendered sphere sprites. No three.js or WebGL, so it costs a few KB and little CPU. Used on
 * capable phones and on wide screens without a GPU.
 *
 * It draws on every display frame (the helix is always turning), without allocating anything per frame, and
 * the frame-time governor lowers the canvas resolution if a device cannot keep up. Zoomed in, most beads are
 * off screen and skipped, so deep zoom is cheaper, not dearer.
 */

const CAMERA = 6;
/** Beads are sorted far to near by depth into this many buckets (the helix is under one unit deep each way). */
const BUCKETS = 256;
const DEPTH = 1;
const baseKeys = ["A", "T", "G", "C"] as const;

/** A soft, glossy sphere sprite in the given colour (a highlight in the upper left, a dark rim). */
function sphereSprite(color: string, glossy: boolean, size: number) {
  const c = document.createElement("canvas");
  c.width = c.height = size;
  const g = c.getContext("2d")!;
  const grad = g.createRadialGradient(size * 0.38, size * 0.35, size * 0.04, size / 2, size / 2, size / 2);
  if (glossy) {
    grad.addColorStop(0, "#d6ecff");
    grad.addColorStop(0.25, color);
    grad.addColorStop(0.8, "#0b2f86");
    grad.addColorStop(1, "rgba(5,20,70,0)");
  } else {
    grad.addColorStop(0, "#ffffff");
    grad.addColorStop(0.35, color);
    grad.addColorStop(1, "rgba(0,0,0,0)");
  }
  g.fillStyle = grad;
  g.fillRect(0, 0, size, size);
  return c;
}

/** One look of the beads at the two sprite resolutions: index 0 is a backbone bead, 1..4 the four bases. */
interface SpriteSet {
  small: HTMLCanvasElement[];
  large: HTMLCanvasElement[];
}

/** The original blue beads (phones and tablets). */
function legacySprites(): SpriteSet {
  const colorList = ["#2b6fe0", ...baseKeys.map((k) => baseColors[k])];
  // Two resolutions: small sprites for ordinary beads, large ones so zoomed-in beads stay sharp.
  return {
    small: colorList.map((c, i) => sphereSprite(c, i === 0, 64)),
    large: colorList.map((c, i) => sphereSprite(c, i === 0, 192)),
  };
}

/** One finish of the desktop themes, built the first time it is needed. */
function finishSprites(finish: number, night: boolean): SpriteSet {
  const make = (size: number) => [0, 1, 2, 3, 4].map((kind) => drawSprite(FINISHES[finish], night, kind, size));
  return { small: make(64), large: make(192) };
}

const serverTheme = (): SceneTheme => "legacy";

export default function DnaCanvasLite({
  director,
  anchors,
  hud,
  active,
}: {
  director: Director;
  anchors: Anchor[];
  hud: HudState;
  active: boolean;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const theme = useSyncExternalStore(subscribe, getSceneTheme, serverTheme);
  const themeRef = useRef(theme);
  useEffect(() => {
    themeRef.current = theme;
  }, [theme]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    // Phones get the sparse bead set; wide screens (which only land here without a GPU) can afford the full one.
    const { beads, rungs } = buildHelix(!window.matchMedia("(min-width: 1024px)").matches);
    // Sprite sets are built on demand and kept: the blue set, and each finish for each theme.
    const sets = new Map<string, SpriteSet>();
    const setFor = (look: SceneTheme, finish: number) => {
      const key = look === "legacy" ? "legacy" : `${look}-${finish}`;
      let set = sets.get(key);
      if (!set) {
        set = look === "legacy" ? legacySprites() : finishSprites(finish, look === "night");
        sets.set(key, set);
      }
      return set;
    };
    const n = beads.length;
    const sx = new Float32Array(n);
    const sy = new Float32Array(n);
    const sz = new Float32Array(n);
    const ss = new Float32Array(n);
    const order = new Uint16Array(n);
    const keys = new Uint8Array(n);
    const counts = new Uint16Array(BUCKETS + 1);
    const rx = new Float32Array(rungs.length);
    const ry = new Float32Array(rungs.length);
    const easedAnchors = anchors.map((a) => ({ x: a.target.x, y: a.target.y }));
    const writeHud = createHudWriter(hud);
    const layerSet: SpriteSet[] = [];
    const layerShare: number[] = [];

    let w = 0;
    let h = 0;
    let dpr = 1;
    let quality = 0;
    let raf = 0;
    let prevNow = 0;
    const start = performance.now();

    const resize = () => {
      // phones get 1x: the beads are soft gradients, and it cuts the fill cost by more than half
      const base = Math.min(window.devicePixelRatio || 1, canvas.clientWidth >= 1024 ? 1.5 : 1);
      dpr = base * QUALITY_SCALE[quality];
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = Math.max(1, Math.round(w * dpr));
      canvas.height = Math.max(1, Math.round(h * dpr));
    };
    // If frames run long the canvas drops a resolution step (and climbs back when there is headroom).
    const governor = createGovernor((q) => {
      quality = q;
      resize();
    });

    // Per-frame camera numbers and one reused result, so projecting a bead allocates nothing
    let cosA = 1;
    let sinA = 0;
    let cosT = 1;
    let sinT = 0;
    let slide = 0;
    let scale = 1;
    let cx = 0;
    let cy = 0;
    const proj = { x: 0, y: 0, z: 0, p: 1 };
    const project = (x: number, y: number, z: number) => {
      const x1 = x * cosA + z * sinA;
      const z1 = -x * sinA + z * cosA;
      const y1 = y + slide;
      const x2 = x1 * cosT - y1 * sinT;
      const y2 = x1 * sinT + y1 * cosT;
      const q = CAMERA / (CAMERA - z1);
      proj.x = cx + x2 * q * scale;
      proj.y = cy - y2 * q * scale;
      proj.z = z1;
      proj.p = q;
      return proj;
    };

    const draw = (now: number) => {
      const wide = w >= 1024; // large screens only: the helix sits right of the text column in a chapter
      const cam = director.sample(w, h);
      const follow = 1 - Math.exp(-Math.min(0.1, prevNow ? (now - prevNow) / 1000 : 0.016) / 0.13);
      prevNow = now;
      cosA = Math.cos(cam.angle);
      sinA = Math.sin(cam.angle);
      const tilt = HELIX_TILT + cam.roll;
      cosT = Math.cos(tilt);
      sinT = Math.sin(tilt);
      slide = cam.slide;
      scale = (h / 4.6) * cam.fit * cam.zoom;
      cx = (cam.cx / 100) * w;
      cy = (cam.cy / 100) * h;

      counts.fill(0);
      for (let i = 0; i < n; i++) {
        const b = beads[i];
        const q = project(b.x, b.y, b.z);
        sx[i] = q.x;
        sy[i] = q.y;
        sz[i] = q.z;
        ss[i] = b.r * 2.6 * q.p * scale;
        const k = Math.min(BUCKETS - 1, Math.max(0, Math.floor(((q.z + DEPTH) / (2 * DEPTH)) * BUCKETS)));
        keys[i] = k;
        counts[k + 1]++;
      }
      // far beads first, so near beads overlap them (a counting sort: linear, and no allocation)
      for (let k = 1; k <= BUCKETS; k++) counts[k] += counts[k - 1];
      for (let i = 0; i < n; i++) order[counts[keys[i]]++] = i;

      // Which looks to paint: the blue set, or on desktop the finishes in proportion to their weights, each
      // laid over the last at its share of the total (an exact weighted mix; usually just one or two).
      const look = themeRef.current;
      let layers = 0;
      if (look === "legacy") {
        layerSet[0] = setFor(look, 0);
        layerShare[0] = 1;
        layers = 1;
      } else {
        let total = 0;
        for (let f = 0; f < 3; f++) {
          const v = cam.finish[f];
          if (v < 0.02) continue;
          total += v;
          layerSet[layers] = setFor(look, f);
          layerShare[layers] = v / total;
          layers++;
        }
      }

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);
      // Depth fade is the same for every bead in a bucket, so the alpha is set once per bucket and layer rather
      // than once per bead. If the device is struggling, every other backbone bead is skipped (they overlap
      // heavily, so the strand barely changes; the rest are drawn a little larger to cover) and specks are dropped.
      const thin = quality >= 2;
      const minSize = quality >= 3 ? 3 : 1.2;
      let from = 0;
      for (let bucket = 0; bucket < BUCKETS; bucket++) {
        const to = counts[bucket];
        if (to === from) continue;
        const depth = Math.max(0.3, Math.min(1, 0.7 + (-DEPTH + ((bucket + 0.5) * 2 * DEPTH) / BUCKETS) * 0.3));
        for (let l = 0; l < layers; l++) {
          ctx.globalAlpha = depth * layerShare[l];
          const { small, large } = layerSet[l];
          for (let k = from; k < to; k++) {
            const i = order[k];
            const kind = beads[i].color;
            if (thin && kind === 0 && (i & 1) === 1) continue;
            const size = thin && kind === 0 ? ss[i] * 1.35 : ss[i];
            if (size < minSize || sx[i] < -size || sx[i] > w + size || sy[i] < -size || sy[i] > h + size) continue;
            ctx.drawImage((size > 70 ? large : small)[kind], sx[i] - size / 2, sy[i] - size / 2, size, size);
          }
        }
        from = to;
      }
      ctx.globalAlpha = 1;

      // Project every rung once: used for the callout lines (large screens) and the targeted base pair.
      for (let i = 0; i < rungs.length; i++) {
        const q = project(rungs[i].mid[0], rungs[i].mid[1], rungs[i].mid[2]);
        rx[i] = (q.x / w) * 100;
        ry[i] = (q.y / h) * 100;
      }
      director.publishRungs(rx, ry, w, h);
      if (cam.stage > 0.02) {
        const r = director.stageRatio(h); // stage percentages are of svh, rung percentages of the canvas
        director.beginAnchors();
        for (let k = 0; k < anchors.length; k++) {
          const a = anchors[k];
          const aim = wide ? a.target : a.phone;
          let best = Infinity;
          let bx = wide ? a.rest.x : aim.x;
          let by = (wide ? a.rest.y : aim.y) * r;
          let pick = -1;
          for (let i = 0; i < rungs.length; i++) {
            if (wide && !director.usable(i, rx[i], ry[i] / r)) continue;
            const d = (rx[i] - aim.x) ** 2 + (ry[i] - aim.y * r) ** 2;
            if (d < best) {
              best = d;
              bx = rx[i];
              by = ry[i];
              pick = i;
            }
          }
          if (wide && pick >= 0 && best > director.reach2) {
            // nothing free near where this line wants to end: rest under its card rather than stretch across the helix
            pick = -1;
            bx = a.rest.x;
            by = a.rest.y * r;
          }
          if (wide && pick >= 0) director.claim(pick);
          const e = easedAnchors[k];
          e.x += (bx - e.x) * follow;
          e.y += (by - e.y) * follow;
          a.x.set(e.x);
          a.y.set(e.y / r);
        }
      }
      let target = 0;
      let best = Infinity;
      for (let i = 0; i < rungs.length; i++) {
        const d = (rx[i] - cam.cx) ** 2 + (ry[i] - cam.cy) ** 2;
        if (d < best) {
          best = d;
          target = i;
        }
      }
      writeHud(cam.zoom, rungs[target], now);
    };

    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      governor.tick(now);
      draw(now);
    };

    resize();
    draw(start);
    const ro = new ResizeObserver(() => {
      resize();
      draw(performance.now());
    });
    ro.observe(canvas);
    if (active) raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, [active, director, anchors, hud]);

  return <canvas ref={canvasRef} aria-hidden className="h-full w-full animate-fade-in" />;
}
