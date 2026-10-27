"use client";

import { useEffect, type RefObject } from "react";

/**
 * Touch screens only: after a swipe ends and scrolling goes idle, ease to the nearest chapter, so one
 * swipe roughly equals one chapter.
 *
 * It uses the swipe's direction: a forward swipe that carries past ~12% of a step lands on the next
 * chapter; a backward swipe that carries back past ~12% lands on the previous one. It never acts while a
 * finger is down, never at the very start or end of the stage (so it can't trap you in or out of it),
 * and never for mouse, trackpad or keyboard scrolling (a mouse reports a fine pointer).
 */
export function useMagneticSettle(wrapper: RefObject<HTMLElement | null>, count: number) {
  useEffect(() => {
    const touchScreen = window.matchMedia("(pointer: coarse)").matches;
    const motionOk = window.matchMedia("(prefers-reduced-motion: no-preference)").matches;
    if (!touchScreen || !motionOk || count < 2) return;

    let timer: number | undefined;
    let touching = false;
    let lastY = window.scrollY;
    let direction = 0; // +1 while scrolling down the page, -1 while scrolling up

    const settle = () => {
      const el = wrapper.current;
      if (!el) return;
      const top = el.getBoundingClientRect().top + window.scrollY;
      const range = el.offsetHeight - window.innerHeight;
      if (range <= 0) return;
      const p = (window.scrollY - top) / range;
      if (p <= 0.004 || p >= 0.996) return; // before, after or at the ends of the stage: free scrolling

      const t = p * (count - 1);
      const base = Math.floor(t);
      const f = t - base;
      let target = Math.round(t);
      if (direction > 0) target = f > 0.12 ? base + 1 : base;
      else if (direction < 0) target = f < 0.88 ? base : base + 1;
      target = Math.min(count - 1, Math.max(0, target));

      const y = top + (target / (count - 1)) * range;
      if (Math.abs(y - window.scrollY) < 3) return;
      window.scrollTo({ top: y, behavior: "smooth" });
    };

    const schedule = () => {
      window.clearTimeout(timer);
      timer = window.setTimeout(settle, 120);
    };
    const onScroll = () => {
      const y = window.scrollY;
      if (y !== lastY) direction = y > lastY ? 1 : -1;
      lastY = y;
      if (!touching) schedule(); // momentum scrolling keeps resetting the timer until it stops
    };
    const onTouchStart = () => {
      touching = true;
      window.clearTimeout(timer);
    };
    const onTouchEnd = () => {
      touching = false;
      schedule();
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchend", onTouchEnd, { passive: true });
    window.addEventListener("touchcancel", onTouchEnd, { passive: true });
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchend", onTouchEnd);
      window.removeEventListener("touchcancel", onTouchEnd);
    };
  }, [wrapper, count]);
}
