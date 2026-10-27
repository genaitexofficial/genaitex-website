"use client";

import { useEffect, useRef } from "react";
import { baseColors, buildHelix, HELIX_TILT } from "@/lib/helix";
import type { Anchor } from "./anchors";
import type { Director } from "./director";
import { createHudWriter, type HudState } from "./hud";

/**
 * The 2D-canvas renderer for the page-long scene: the same DNA double helix and the same fly-through zoom,
 * drawn from pre-rendered sphere sprites. No three.js or WebGL, so it costs a few KB and little CPU. Used on
 * capable phones and on wide screens without a GPU.
 *
 * It only works hard while the camera is moving: full frame rate during scrolling, a slow gentle drift
 * otherwise, which keeps the main thread and battery calm. Zoomed in, most beads are off screen and
 * skipped, so deep zoom is cheaper, not dearer.
 */

const MOVING_MS = 1000 / 30;
const IDLE_MS = 1000 / 12;
const CAMERA = 6;
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

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    // Phones get the sparse bead set; wide screens (which only land here without a GPU) can afford the full one.
    const { beads, rungs } = buildHelix(!window.matchMedia("(min-width: 1024px)").matches);
    const colorList = ["#2b6fe0", ...baseKeys.map((k) => baseColors[k])];
    // Two resolutions: small sprites for ordinary beads, large ones so zoomed-in beads stay sharp.
    const small = colorList.map((c, i) => sphereSprite(c, i === 0, 64));
    const large = colorList.map((c, i) => sphereSprite(c, i === 0, 192));
    const n = beads.length;
    const sx = new Float32Array(n);
    const sy = new Float32Array(n);
    const sz = new Float32Array(n);
    const ss = new Float32Array(n);
    const order = Uint16Array.from({ length: n }, (_, i) => i);
    const rx = new Float32Array(rungs.length);
    const ry = new Float32Array(rungs.length);
    const easedAnchors = anchors.map((a) => ({ x: a.target.x, y: a.target.y }));
    const writeHud = createHudWriter(hud);

    let w = 0;
    let h = 0;
    let dpr = 1;
    let last = 0;
    let moving = true;
    let raf = 0;
    const start = performance.now();

    const resize = () => {
      // phones get 1x: the beads are soft gradients, and it cuts the fill cost by more than half
      dpr = Math.min(window.devicePixelRatio || 1, canvas.clientWidth >= 1024 ? 1.5 : 1);
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = Math.max(1, Math.round(w * dpr));
      canvas.height = Math.max(1, Math.round(h * dpr));
    };

    const draw = (now: number) => {
      const wide = w >= 1024; // large screens only: the helix sits right of the text column in a chapter
      const cam = director.sample(w, h);
      moving = cam.moving;
      const angle = cam.angle + ((now - start) / 1000) * 0.12;
      const slide = cam.slide;
      const cosA = Math.cos(angle);
      const sinA = Math.sin(angle);
      const tilt = HELIX_TILT + cam.roll;
      const cosT = Math.cos(tilt);
      const sinT = Math.sin(tilt);
      const scale = (h / 4.6) * cam.fit * cam.zoom;
      const cx = (cam.cx / 100) * w;
      const cy = (cam.cy / 100) * h;

      const toScreen = (x: number, y: number, z: number) => {
        const x1 = x * cosA + z * sinA;
        const z1 = -x * sinA + z * cosA;
        const y1 = y + slide;
        const x2 = x1 * cosT - y1 * sinT;
        const y2 = x1 * sinT + y1 * cosT;
        const q = CAMERA / (CAMERA - z1);
        return { x: cx + x2 * q * scale, y: cy - y2 * q * scale, z: z1, p: q };
      };

      for (let i = 0; i < n; i++) {
        const b = beads[i];
        const q = toScreen(b.x, b.y, b.z);
        sx[i] = q.x;
        sy[i] = q.y;
        sz[i] = q.z;
        ss[i] = b.r * 2.6 * q.p * scale;
      }
      // far beads first, so near beads overlap them
      order.sort((a, b) => sz[a] - sz[b]);

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);
      for (let k = 0; k < n; k++) {
        const i = order[k];
        const size = ss[i];
        if (sx[i] < -size || sx[i] > w + size || sy[i] < -size || sy[i] > h + size) continue;
        ctx.globalAlpha = Math.max(0.3, Math.min(1, 0.7 + sz[i] * 0.3));
        const set = size > 70 ? large : small;
        ctx.drawImage(set[beads[i].color], sx[i] - size / 2, sy[i] - size / 2, size, size);
      }
      ctx.globalAlpha = 1;

      // Project every rung once: used for the callout lines (large screens) and the targeted base pair.
      for (let i = 0; i < rungs.length; i++) {
        const q = toScreen(rungs[i].mid[0], rungs[i].mid[1], rungs[i].mid[2]);
        rx[i] = (q.x / w) * 100;
        ry[i] = (q.y / h) * 100;
      }
      director.publishRungs(rx, ry, w, h);
      if (cam.stage > 0.02) {
        anchors.forEach((a, k) => {
          const aim = wide ? a.target : a.phone;
          const r = director.stageRatio(h); // stage percentages are of svh, rung percentages of the canvas
          let best = Infinity;
          let bx = aim.x;
          let by = aim.y * r;
          for (let i = 0; i < rungs.length; i++) {
            const d = (rx[i] - aim.x) ** 2 + (ry[i] - aim.y * r) ** 2;
            if (d < best) {
              best = d;
              bx = rx[i];
              by = ry[i];
            }
          }
          const e = easedAnchors[k];
          e.x += (bx - e.x) * 0.2;
          e.y += (by - e.y) * 0.2;
          a.x.set(e.x);
          a.y.set(e.y / r);
        });
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
      if (now - last < (moving ? MOVING_MS : IDLE_MS)) return;
      last = now;
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
