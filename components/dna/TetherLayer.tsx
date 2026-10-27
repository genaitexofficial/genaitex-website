"use client";

import { useEffect, useRef } from "react";
import { spinePx } from "./director";
import { useDna } from "./DnaProvider";

const POOL = 6; // content tethers; one more group is kept for the chapter card's line to the reticle
const SVG = "http://www.w3.org/2000/svg";

/**
 * Ties the page's content to the DNA on phones and tablets. Every `.dna-node` that is on screen (cards,
 * headings, forms: see Reveal) gets a thin line from its left edge to the nearest base pair of the spine,
 * with a glowing dot on the rung. The line follows the card as it grows out of the spine and as it scrolls,
 * sliding along the helix from rung to rung. At most a handful are drawn at once (the ones nearest the middle
 * of the screen), and they fade out while a chapter stage has the screen (it has its own tethers).
 *
 * It lives in the backdrop, behind the content, so a line simply tucks under the card it belongs to.
 * It is drawn imperatively (no React renders per frame) and only runs on phones/tablets with motion allowed.
 */
export function TetherLayer() {
  const { director, stage } = useDna();
  const svg = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const root = svg.current;
    if (!root) return;
    const mq = window.matchMedia("(max-width: 1023px) and (prefers-reduced-motion: no-preference)");

    // A fixed pool of groups (line + two dots), reused every frame
    const slots = Array.from({ length: POOL + 1 }, () => {
      const g = document.createElementNS(SVG, "g");
      const path = document.createElementNS(SVG, "path");
      const rung = document.createElementNS(SVG, "circle");
      const card = document.createElementNS(SVG, "circle");
      path.setAttribute("fill", "none");
      path.setAttribute("stroke", "rgba(103,232,249,0.7)");
      path.setAttribute("stroke-width", "1.5");
      rung.setAttribute("r", "3.2");
      rung.setAttribute("fill", "#67e8f9");
      rung.setAttribute("style", "filter: drop-shadow(0 0 5px rgba(34,211,238,0.9))");
      card.setAttribute("r", "2");
      card.setAttribute("fill", "rgba(103,232,249,0.9)");
      g.append(path, rung, card);
      g.setAttribute("opacity", "0");
      root.append(g);
      return { g, path, rung, card };
    });
    const hide = () => slots.forEach((s) => s.g.setAttribute("opacity", "0"));
    const reticleSlot = slots[POOL];

    const seen = new Set<Element>(); // nodes currently intersecting the viewport
    const known = new Set<Element>();
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (e.isIntersecting) seen.add(e.target);
        else seen.delete(e.target);
      }
    });
    const scan = () => {
      const now = new Set(document.querySelectorAll(".dna-node"));
      now.forEach((el) => {
        if (!known.has(el)) {
          known.add(el);
          io.observe(el);
        }
      });
      known.forEach((el) => {
        if (!now.has(el)) {
          known.delete(el);
          seen.delete(el);
          io.unobserve(el);
        }
      });
    };

    const eased = new WeakMap<Element, { x: number; y: number }>();
    let raf = 0;
    let scanTimer = 0;
    let last = 0;

    const tick = (t: number) => {
      raf = requestAnimationFrame(tick);
      if (document.hidden || t - last < (director.moving ? 0 : 66)) return;
      last = t;

      const r = director.rungs;
      const inStage = stage.get();
      const open = 1 - inStage;
      if (!r.w || r.x.length === 0) return hide();

      // Chapter stage: a line from the targeted base pair (the reticle) down to the text card
      const card = inStage > 0.05 ? document.querySelector<HTMLElement>('li[data-state="active"] [data-dna-reticle]') : null;
      if (card) {
        const b = card.getBoundingClientRect();
        const rt = director.reticle;
        const ax = Math.min(Math.max(rt.x, b.left + 28), b.right - 28);
        reticleSlot.path.setAttribute("d", `M${rt.x.toFixed(1)} ${(rt.y + 26).toFixed(1)}L${ax.toFixed(1)} ${b.top.toFixed(1)}`);
        reticleSlot.rung.setAttribute("cx", rt.x.toFixed(1));
        reticleSlot.rung.setAttribute("cy", rt.y.toFixed(1));
        reticleSlot.rung.setAttribute("r", "0");
        reticleSlot.card.setAttribute("cx", ax.toFixed(1));
        reticleSlot.card.setAttribute("cy", b.top.toFixed(1));
        reticleSlot.g.setAttribute("opacity", Math.min(1, inStage).toFixed(2));
      } else {
        reticleSlot.g.setAttribute("opacity", "0");
      }
      if (open < 0.02) {
        for (let i = 0; i < POOL; i++) slots[i].g.setAttribute("opacity", "0");
        return;
      }

      const vh = window.innerHeight;
      const candidates: { el: Element; b: DOMRect }[] = [];
      for (const el of seen) {
        if (!el.isConnected) continue;
        const b = el.getBoundingClientRect();
        if (el.hasAttribute("data-no-tether")) continue;
        if (b.height < 88 || b.width < 140 || b.bottom < 76 || b.top > vh - 28) continue;
        candidates.push({ el, b });
      }
      // a block inside another block shares its outer block's line
      const outer = candidates.filter((c) => !candidates.some((o) => o !== c && o.el.contains(c.el)));
      candidates.length = 0;
      candidates.push(...outer);
      candidates.sort((a, b) => a.b.top - b.b.top);
      // keep the POOL nearest the middle of the screen, in page order
      const mid = vh * 0.55;
      const chosen =
        candidates.length > POOL
          ? candidates
              .map((c) => ({ c, d: Math.abs((c.b.top + c.b.bottom) / 2 - mid) }))
              .sort((a, b) => a.d - b.d)
              .slice(0, POOL)
              .map((x) => x.c)
              .sort((a, b) => a.b.top - b.b.top)
          : candidates;

      const spineX = 0.24 * spinePx(window.innerWidth);
      chosen.forEach(({ el, b }, i) => {
        const s = slots[i];
        const ay = Math.min(Math.max(mid, b.top + 28), b.bottom - 28);
        const ax = b.left - 4;
        // nearest base pair to this height, leaning toward the spine's right-hand side (the card side)
        let best = Infinity;
        let px = 0;
        let py = 0;
        for (let k = 0; k < r.x.length; k++) {
          const rx = (r.x[k] / 100) * r.w;
          const ry = (r.y[k] / 100) * r.h;
          const d = (ry - ay) ** 2 + 0.15 * (rx - spineX) ** 2;
          if (d < best) {
            best = d;
            px = rx;
            py = ry;
          }
        }
        const prev = eased.get(el);
        const cur = prev ?? { x: px, y: py };
        cur.x += (px - cur.x) * 0.3;
        cur.y += (py - cur.y) * 0.3;
        eased.set(el, cur);

        const dx = Math.max(24, ax - cur.x);
        s.path.setAttribute(
          "d",
          `M${cur.x.toFixed(1)} ${cur.y.toFixed(1)}C${(cur.x + dx * 0.55).toFixed(1)} ${cur.y.toFixed(1)} ${(ax - dx * 0.55).toFixed(1)} ${ay.toFixed(1)} ${ax.toFixed(1)} ${ay.toFixed(1)}`,
        );
        s.rung.setAttribute("cx", cur.x.toFixed(1));
        s.rung.setAttribute("cy", cur.y.toFixed(1));
        s.card.setAttribute("cx", ax.toFixed(1));
        s.card.setAttribute("cy", ay.toFixed(1));
        // fade with how much of the node is on screen
        const shown = Math.min(b.bottom, vh) - Math.max(b.top, 0);
        const vis = Math.max(0, Math.min(1, shown / Math.min(b.height, 160)));
        s.g.setAttribute("opacity", (vis * open).toFixed(2));
      });
      for (let i = chosen.length; i < POOL; i++) slots[i].g.setAttribute("opacity", "0");
    };

    const start = () => {
      scan();
      scanTimer = window.setInterval(scan, 700);
      raf = requestAnimationFrame(tick);
    };
    const stop = () => {
      cancelAnimationFrame(raf);
      window.clearInterval(scanTimer);
      hide();
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
      io.disconnect();
      slots.forEach((s) => s.g.remove());
    };
  }, [director, stage]);

  return <svg ref={svg} aria-hidden className="absolute inset-0 h-full w-full overflow-visible" />;
}
