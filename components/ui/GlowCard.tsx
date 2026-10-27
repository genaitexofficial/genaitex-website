"use client";

import { clsx } from "clsx";

/** A card whose background spotlight follows the pointer (styles live in globals.css). */
export function GlowCard({
  className,
  children,
  ...rest
}: React.HTMLAttributes<HTMLDivElement>) {
  function onMove(e: React.PointerEvent<HTMLDivElement>) {
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`);
    e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`);
  }

  return (
    <div
      {...rest}
      onPointerMove={onMove}
      className={clsx("glow-card rounded-3xl", className)}
    >
      {children}
    </div>
  );
}
