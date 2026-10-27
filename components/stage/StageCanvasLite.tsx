"use client";

import { useEffect, useRef } from "react";
import type { MotionValue } from "motion/react";
import { baseColors, buildHelix, HELIX_TILT, helixPose } from "@/lib/helix";
import type { Anchor } from "./anchors";

/**
 * The 2D-canvas renderer for the stage: the same DNA double helix drawn from pre-rendered sphere
 * sprites. No three.js or WebGL, so it costs a few KB and little CPU. Used on capable phones and on wide
 * screens without a GPU.
 *
 * It only works hard while the helix is moving: full frame rate during scrolling, a slow gentle drift
 * otherwise, which keeps the main thread and battery calm.
 */

const MOVING_MS = 1000 / 30;
const IDLE_MS = 1000 / 12;
const CAMERA = 6;
const baseKeys = ["A", "T", "G", "C"] as const;

/** A soft, glossy sphere sprite in the given colour (a highlight in the upper left, a dark rim). */
function sphereSprite(color: string, glossy: boolean) {
  const size = 64;
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

export default function StageCanvasLite({
  progress,
  anchors,
  active,
}: {
  progress: MotionValue<number>;
  anchors: Anchor[];
  active: boolean;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    // Phones get the sparse bead set; wide screens (which only land here without a GPU) can afford the full one.
    const { beads, rungs } = buildHelix(!window.matchMedia("(min-width: 1024px)").matches);
    const sprites = [
      sphereSprite("#2b6fe0", true),
      ...baseKeys.map((k) => sphereSprite(baseColors[k], false)),
    ];
    const n = beads.length;
    const sx = new Float32Array(n);
    const sy = new Float32Array(n);
    const sz = new Float32Array(n);
    const ss = new Float32Array(n);
    const order = Uint16Array.from({ length: n }, (_, i) => i);
    const cosT = Math.cos(HELIX_TILT);
    const sinT = Math.sin(HELIX_TILT);
    const easedAnchors = anchors.map((a) => ({ x: a.target.x, y: a.target.y }));

    let w = 0;
    let h = 0;
    let dpr = 1;
    let last = 0;
    let lastProgress = -1;
    let raf = 0;
    const start = performance.now();

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = Math.max(1, Math.round(w * dpr));
      canvas.height = Math.max(1, Math.round(h * dpr));
    };

    const draw = (now: number) => {
      const wide = w >= 1024; // the canvas fills the stage, with the helix pushed right of the text column
      const pose = helixPose(progress.get(), (now - start) / 1000);
      const cosA = Math.cos(pose.angle);
      const sinA = Math.sin(pose.angle);
      const scale = wide ? h / 4.6 : h / 3.4;
      const cx = wide ? w * 0.66 : w / 2;
      const cy = h / 2;

      const toScreen = (x: number, y: number, z: number) => {
        const x1 = x * cosA + z * sinA;
        const z1 = -x * sinA + z * cosA;
        const y1 = y + pose.slide;
        const x2 = x1 * cosT - y1 * sinT;
        const y2 = x1 * sinT + y1 * cosT;
        const p = CAMERA / (CAMERA - z1);
        return { x: cx + x2 * p * scale, y: cy - y2 * p * scale, z: z1, p };
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
        ctx.globalAlpha = Math.max(0.35, Math.min(1, 0.7 + sz[i] * 0.3));
        ctx.drawImage(sprites[beads[i].color], sx[i] - size / 2, sy[i] - size / 2, size, size);
      }
      ctx.globalAlpha = 1;

      // Large screens: attach each callout line to the rung nearest its target zone, as the 3D scene does.
      if (wide) {
        anchors.forEach((a, k) => {
          let best = Infinity;
          let bx = a.target.x;
          let by = a.target.y;
          for (const r of rungs) {
            const q = toScreen(r.mid[0], r.mid[1], r.mid[2]);
            const px = (q.x / w) * 100;
            const py = (q.y / h) * 100;
            const d = (px - a.target.x) ** 2 + (py - a.target.y) ** 2;
            if (d < best) {
              best = d;
              bx = px;
              by = py;
            }
          }
          const e = easedAnchors[k];
          e.x += (bx - e.x) * 0.2;
          e.y += (by - e.y) * 0.2;
          a.x.set(e.x);
          a.y.set(e.y);
        });
      }
    };

    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      const p = progress.get();
      const moving = Math.abs(p - lastProgress) > 0.0004;
      if (now - last < (moving ? MOVING_MS : IDLE_MS)) return;
      last = now;
      lastProgress = p;
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
  }, [active, progress, anchors]);

  return <canvas ref={canvasRef} aria-hidden className="h-full w-full animate-fade-in" />;
}
