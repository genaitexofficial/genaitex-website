"use client";

import { useEffect, useRef } from "react";

/**
 * Phone version of the hero sphere: the same look (violet-to-cyan particle shell around a wireframe
 * icosahedron) drawn with the plain 2D canvas API. No three.js or WebGL, so it costs a couple of KB
 * instead of a few hundred, and almost no CPU.
 */

const POINT_COUNT = 700;
const FRAME_MS = 1000 / 30; // 30fps is plenty for a slow rotation and spares the battery
const BUCKETS = 8;
const SHELL_RADIUS = 1.75;
const WIRE_RADIUS = 1.15;

/** Small seeded PRNG so the point cloud is identical on every render. */
function mulberry32(seed: number) {
  let a = seed;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/** Violet (#8b5cf6) to cyan (#22d3ee), as an rgb() string for bucket 0..BUCKETS-1. */
function bucketColor(i: number) {
  const t = i / (BUCKETS - 1);
  return `rgb(${Math.round(lerp(139, 34, t))},${Math.round(lerp(92, 211, t))},${Math.round(lerp(246, 238, t))})`;
}

type Vec = [number, number, number];

function buildScene() {
  const rand = mulberry32(7);
  const points: { x: number; y: number; z: number; bucket: number }[] = [];
  for (let i = 0; i < POINT_COUNT; i++) {
    const u = rand() * 2 - 1;
    const theta = rand() * Math.PI * 2;
    const r = SHELL_RADIUS + (rand() - 0.5) * 0.55;
    const s = Math.sqrt(1 - u * u);
    points.push({
      x: r * s * Math.cos(theta),
      y: r * u,
      z: r * s * Math.sin(theta),
      bucket: Math.min(BUCKETS - 1, Math.floor(((u + 1) / 2) * BUCKETS)),
    });
  }
  // Draw one colour at a time, so fillStyle changes at most BUCKETS times per frame.
  points.sort((a, b) => a.bucket - b.bucket);

  // Icosahedron subdivided once (80 faces), projected onto a sphere, as unique edges.
  const t = (1 + Math.sqrt(5)) / 2;
  const verts: Vec[] = [
    [-1, t, 0], [1, t, 0], [-1, -t, 0], [1, -t, 0],
    [0, -1, t], [0, 1, t], [0, -1, -t], [0, 1, -t],
    [t, 0, -1], [t, 0, 1], [-t, 0, -1], [-t, 0, 1],
  ];
  const faces = [
    [0, 11, 5], [0, 5, 1], [0, 1, 7], [0, 7, 10], [0, 10, 11],
    [1, 5, 9], [5, 11, 4], [11, 10, 2], [10, 7, 6], [7, 1, 8],
    [3, 9, 4], [3, 4, 2], [3, 2, 6], [3, 6, 8], [3, 8, 9],
    [4, 9, 5], [2, 4, 11], [6, 2, 10], [8, 6, 7], [9, 8, 1],
  ];
  const norm = (v: Vec): Vec => {
    const l = Math.hypot(v[0], v[1], v[2]);
    return [(v[0] / l) * WIRE_RADIUS, (v[1] / l) * WIRE_RADIUS, (v[2] / l) * WIRE_RADIUS];
  };
  const mid = (a: Vec, b: Vec): Vec => norm([(a[0] + b[0]) / 2, (a[1] + b[1]) / 2, (a[2] + b[2]) / 2]);
  const key = (v: Vec) => v.map((n) => n.toFixed(4)).join(",");
  const seen = new Set<string>();
  const edges: [Vec, Vec][] = [];
  const addEdge = (a: Vec, b: Vec) => {
    const k = [key(a), key(b)].sort().join("|");
    if (!seen.has(k)) {
      seen.add(k);
      edges.push([a, b]);
    }
  };
  for (const [ia, ib, ic] of faces) {
    const a = norm(verts[ia]);
    const b = norm(verts[ib]);
    const c = norm(verts[ic]);
    const ab = mid(a, b);
    const bc = mid(b, c);
    const ca = mid(c, a);
    for (const tri of [[a, ab, ca], [b, bc, ab], [c, ca, bc], [ab, bc, ca]] as Vec[][]) {
      addEdge(tri[0], tri[1]);
      addEdge(tri[1], tri[2]);
      addEdge(tri[2], tri[0]);
    }
  }
  return { points, edges };
}

export default function HeroCanvasLite({ active }: { active: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const { points, edges } = buildScene();
    const colors = Array.from({ length: BUCKETS }, (_, i) => bucketColor(i));
    const TILT = 0.25;
    const cosT = Math.cos(TILT);
    const sinT = Math.sin(TILT);
    const CAMERA = 6;

    let w = 0;
    let h = 0;
    let dpr = 1;
    let angle = 0;
    let last = 0;
    let raf = 0;

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = Math.max(1, Math.round(w * dpr));
      canvas.height = Math.max(1, Math.round(h * dpr));
    };

    // Rotate around Y by `angle`, tilt around X, then apply a gentle perspective.
    const project = (x: number, y: number, z: number, cos: number, sin: number, scale: number) => {
      const rx = x * cos + z * sin;
      const rz = -x * sin + z * cos;
      const ty = y * cosT - rz * sinT;
      const tz = y * sinT + rz * cosT;
      const p = CAMERA / (CAMERA - tz);
      return { sx: w / 2 + rx * p * scale, sy: h / 2 - ty * p * scale, p, tz };
    };

    const draw = () => {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);
      ctx.globalCompositeOperation = "lighter";

      const scale = (Math.min(w, h) / 2 / 2.2);
      const cos = Math.cos(angle);
      const sin = Math.sin(angle);

      ctx.strokeStyle = "rgba(139,92,246,0.3)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (const [a, b] of edges) {
        const pa = project(a[0], a[1], a[2], cos, sin, scale);
        const pb = project(b[0], b[1], b[2], cos, sin, scale);
        ctx.moveTo(pa.sx, pa.sy);
        ctx.lineTo(pb.sx, pb.sy);
      }
      ctx.stroke();

      let current = -1;
      for (const pt of points) {
        if (pt.bucket !== current) {
          current = pt.bucket;
          ctx.fillStyle = colors[current];
        }
        const q = project(pt.x, pt.y, pt.z, cos, sin, scale);
        // Nearer points are larger and brighter, which sells the depth.
        ctx.globalAlpha = Math.max(0.15, Math.min(1, 0.55 + q.tz * 0.28));
        const size = 1.6 * q.p;
        ctx.fillRect(q.sx - size / 2, q.sy - size / 2, size, size);
      }
      ctx.globalAlpha = 1;
    };

    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      const dt = now - last;
      if (dt < FRAME_MS) return;
      last = now;
      angle += dt * 0.00014;
      draw();
    };

    resize();
    draw();
    const ro = new ResizeObserver(() => {
      resize();
      draw();
    });
    ro.observe(canvas);
    if (active) raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, [active]);

  return <canvas ref={canvasRef} aria-hidden className="h-full w-full animate-fade-in" />;
}
