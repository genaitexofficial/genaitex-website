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
    // Where the card is, measured when the chapter changes and then a few times a second: reading layout every frame while
    // the page scrolls forces the browser to recalculate it every frame. The card only moves by a few px as it fades in.
    const spot = { left: 0, right: 0, top: 0, at: -1e9 };
    const activeCard = () => {
      if (card?.isConnected && card.closest("li")?.getAttribute("data-state") === "active") return card;
      spot.at = -1e9;
      return (card = document.querySelector<HTMLElement>('li[data-state="active"] [data-dna-reticle]'));
    };
    // The Home glass stack covers the helix on its scroll, so the line has nothing to tie to there
    let stack: HTMLElement | null = null;
    let lookedFor = -1e9;
    const stackShown = (t: number) => {
      if (!stack?.isConnected && t - lookedFor > 500) {
        lookedFor = t;
        stack = document.querySelector<HTMLElement>("[data-stack]");
      }
      return stack?.dataset.stack === "on";
    };
    const tick = (t: number) => {
      raf = requestAnimationFrame(tick);
      if (document.hidden || t - last < (director.moving ? 0 : 66)) return;
      last = t;
      const inStage = stage.get();
      const el = inStage > 0.05 && !stackShown(t) ? activeCard() : null;
      if (!el) return g.setAttribute("opacity", "0");
      if (t - spot.at > 250) {
        const b = el.getBoundingClientRect();
        spot.left = b.left;
        spot.right = b.right;
        spot.top = b.top;
        spot.at = t;
      }
      const rt = director.reticle;
      const ax = Math.min(Math.max(rt.x, spot.left + 28), spot.right - 28);
      path.setAttribute("d", `M${rt.x.toFixed(1)} ${(rt.y + 26).toFixed(1)}L${ax.toFixed(1)} ${spot.top.toFixed(1)}`);
      dot.setAttribute("cx", ax.toFixed(1));
      dot.setAttribute("cy", spot.top.toFixed(1));
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
