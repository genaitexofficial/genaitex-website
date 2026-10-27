"use client";

import { LazyMotion, MotionConfig } from "motion/react";

// The animation engine loads in its own chunk after first paint, so it never competes with
// hydration. Components use the lightweight `m.*` elements, which stay inert until it arrives.
const loadFeatures = () => import("./motion-features").then((mod) => mod.default);

/** Makes every motion component honour the visitor's reduced-motion setting. */
export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <MotionConfig reducedMotion="user">
      <LazyMotion features={loadFeatures} strict>
        {children}
      </LazyMotion>
    </MotionConfig>
  );
}
