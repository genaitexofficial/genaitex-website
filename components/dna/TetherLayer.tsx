"use client";

import { useEffect, useRef } from "react";
import { useDna } from "./DnaProvider";

const SVG = "http://www.w3.org/2000/svg";

/**
 * Ties the chapter card to the DNA on phones and tablets: a thin line from the targeted base pair (the
 * reticle, in the middle of the helix) down to the top of the active chapter's text card, with a dot where it
 * meets the card. It fades in and out with the chapter stage.
 *
 * It lives in the backdrop, behind the content, so the line simply tucks under the card. It is drawn
 * imperatively (no React renders per frame) and only runs on phones/tablets with motion allowed.
 */
export function TetherLayer() {
  const { director, stage } = useDna();
  const svg = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const root = svg.current;
    if (!root) return;
    const mq = window.matchMedia("(max-width: 1023px) and (prefers-reduced-motion: no-preference)");

    const g = document.createElementNS(SVG, "g");
    const path = document.createElementNS(SVG, "path");
    const dot = document.createElementNS(SVG, "circle");
    path.setAttribute("fill", "none");
    path.setAttribute("style", "stroke: rgb(var(--accent) / 0.7)");
    path.setAttribute("stroke-width", "1.5");
    dot.setAttribute("r", "2");
    dot.setAttribute("style", "fill: rgb(var(--accent) / 0.9)");
    g.append(path, dot);
    g.setAttribute("opacity", "0");
    root.append(g);

    let raf = 0;
    let last = 0;
    // The active chapter's card, remembered between frames (looking it up every frame is needless work)
    let card: HTMLElement | null = null;
    const activeCard = () => {
      if (card?.isConnected && card.closest("li")?.getAttribute("data-state") === "active") return card;
      return (card = document.querySelector<HTMLElement>('li[data-state="active"] [data-dna-reticle]'));
    };
    const tick = (t: number) => {
      raf = requestAnimationFrame(tick);
      if (document.hidden || t - last < (director.moving ? 0 : 66)) return;
      last = t;
      const inStage = stage.get();
      const el = inStage > 0.05 ? activeCard() : null;
      if (!el) return g.setAttribute("opacity", "0");
      const b = el.getBoundingClientRect();
      const rt = director.reticle;
      const ax = Math.min(Math.max(rt.x, b.left + 28), b.right - 28);
      path.setAttribute("d", `M${rt.x.toFixed(1)} ${(rt.y + 26).toFixed(1)}L${ax.toFixed(1)} ${b.top.toFixed(1)}`);
      dot.setAttribute("cx", ax.toFixed(1));
      dot.setAttribute("cy", b.top.toFixed(1));
      g.setAttribute("opacity", Math.min(1, inStage).toFixed(2));
    };

    const start = () => {
      raf = requestAnimationFrame(tick);
    };
    const stop = () => {
      cancelAnimationFrame(raf);
      g.setAttribute("opacity", "0");
    };
    const onChange = () => {
      stop();
      if (mq.matches) start();
    };
    if (mq.matches) start();
    mq.addEventListener("change", onChange);

    return () => {
      mq.removeEventListener("change", onChange);
      stop();
      g.remove();
    };
  }, [director, stage]);

  return <svg ref={svg} aria-hidden className="absolute inset-0 h-full w-full overflow-visible" />;
}
