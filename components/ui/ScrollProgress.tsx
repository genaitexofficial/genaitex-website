"use client";

import { useScroll } from "motion/react";
import * as m from "motion/react-m";

/** A hairline under the navbar that fills as the page is scrolled. */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  return (
    <m.div
      aria-hidden
      style={{ scaleX: scrollYProgress }}
      className="fixed inset-x-0 top-16 z-40 h-px origin-left bg-[linear-gradient(90deg,#8b5cf6,#22d3ee)] motion-reduce:hidden"
    />
  );
}
