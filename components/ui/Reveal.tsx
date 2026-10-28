"use client";

import { clsx } from "clsx";
import * as m from "motion/react-m";

interface RevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  y?: number;
}

/**
 * Fades and lifts content into view the first time it scrolls on screen. On phones and tablets it is also a
 * `.dna-node`: it appears out of the DNA as it scrolls in and melts back into it as it leaves (globals.css).
 */
export function Reveal({ children, className, delay = 0, y = 24 }: RevealProps) {
  return (
    <m.div
      className={clsx("dna-node", className)}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </m.div>
  );
}
