"use client";

import { useEffect, useRef } from "react";

/** A soft glow that trails the cursor. Mouse users only, and skipped for reduced motion. */
export function CursorGlow() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduced) return;

    let raf = 0;
    let x = 0;
    let y = 0;

    const onMove = (e: PointerEvent) => {
      x = e.clientX;
      y = e.clientY;
      if (raf) return;
      raf = requestAnimationFrame(() => {
        el.style.transform = `translate3d(${x - 300}px, ${y - 300}px, 0)`;
        el.style.opacity = "1";
        raf = 0;
      });
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 -z-10 h-[600px] w-[600px] rounded-full opacity-0 transition-opacity duration-500"
      style={{
        background:
          "radial-gradient(circle, rgba(139,92,246,0.13) 0%, rgba(34,211,238,0.05) 40%, transparent 70%)",
        willChange: "transform",
      }}
    />
  );
}
