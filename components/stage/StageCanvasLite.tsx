"use client";

import { useEffect, useRef } from "react";
import type { MotionValue } from "motion/react";
import { baseColors, buildHelix, HELIX_TILT, helixPose } from "@/lib/helix";

/**
 * Phone renderer for the stage: the same DNA double helix, drawn with the plain 2D canvas API from
 * pre-rendered sphere sprites. No three.js or WebGL, so it costs a few KB and little CPU.
 */

const FRAME_MS = 1000 / 30; // plenty for a slow turn, and spares the battery
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
  active,
}: {
  progress: MotionValue<number>;
  active: boolean;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const { beads } = buildHelix(true);
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

    let w = 0;
    let h = 0;
    let dpr = 1;
    let last = 0;
    let raf = 0;
    const start = performance.now();

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = Math.max(1, Math.round(w * dpr));
      canvas.height = Math.max(1, Math.round(h * dpr));
    };

    const draw = (now: number) => {
      const pose = helixPose(progress.get(), (now - start) / 1000);
      const cosA = Math.cos(pose.angle);
      const sinA = Math.sin(pose.angle);
      const scale = h / 3.4;

      for (let i = 0; i < n; i++) {
        const b = beads[i];
        // spin about the helix axis, slide along it, then lean the whole helix
        const x1 = b.x * cosA + b.z * sinA;
        const z1 = -b.x * sinA + b.z * cosA;
        const y1 = b.y + pose.slide;
        const x2 = x1 * cosT - y1 * sinT;
        const y2 = x1 * sinT + y1 * cosT;
        const p = CAMERA / (CAMERA - z1);
        sx[i] = w / 2 + x2 * p * scale;
        sy[i] = h / 2 - y2 * p * scale;
        sz[i] = z1;
        ss[i] = b.r * 2.6 * p * scale;
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
    };

    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      if (now - last < FRAME_MS) return;
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
  }, [active, progress]);

  return <canvas ref={canvasRef} aria-hidden className="h-full w-full animate-fade-in" />;
}
