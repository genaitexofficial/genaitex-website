"use client";

import dynamic from "next/dynamic";
import { Component, useEffect, useRef, useState, useSyncExternalStore } from "react";

// three.js is only fetched on capable devices, after the page is already usable.
const HeroCanvas = dynamic(() => import("./HeroCanvas"), { ssr: false });

function useMediaQuery(query: string) {
  return useSyncExternalStore(
    (onChange) => {
      const m = window.matchMedia(query);
      m.addEventListener("change", onChange);
      return () => m.removeEventListener("change", onChange);
    },
    () => window.matchMedia(query).matches,
    () => false,
  );
}

/** If WebGL is unavailable the scene silently disappears and the CSS backdrop remains. */
class SceneBoundary extends Component<{ children: React.ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}

export function HeroScene() {
  const wide = useMediaQuery("(min-width: 768px)");
  const reduced = useMediaQuery("(prefers-reduced-motion: reduce)");
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(true);

  // Pause rendering whenever the hero scrolls off screen to save battery and GPU.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), {
      threshold: 0,
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} aria-hidden className="absolute inset-0">
      {/* Static backdrop: always present, and the only visual on small / reduced-motion devices */}
      <div className="absolute left-1/2 top-1/2 h-[min(80vw,560px)] w-[min(80vw,560px)] -translate-x-1/2 -translate-y-1/2 animate-float rounded-full bg-[radial-gradient(circle_at_35%_30%,rgba(34,211,238,0.35),rgba(139,92,246,0.28)_45%,transparent_70%)]" />
      {wide && !reduced && (
        <SceneBoundary>
          <HeroCanvas active={visible} />
        </SceneBoundary>
      )}
    </div>
  );
}
