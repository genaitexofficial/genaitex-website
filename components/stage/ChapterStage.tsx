"use client";

import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import Link from "next/link";
import { useMotionValueEvent, useScroll } from "motion/react";
import { clsx } from "clsx";
import { Button } from "@/components/ui/Button";
import type { Chapter } from "@/lib/chapters";
import { StageScrim } from "./StageScrim";
import {
  calloutSlots,
  ChapterIcon,
  AnchorLines,
  ChapterRail,
  InfoCard,
  Pager,
  ProgressTrack,
  ScrollHint,
} from "./StageParts";
import { useDna } from "@/components/dna/DnaProvider";
import { useMediaQuery } from "@/components/dna/useScene";
import { useMagneticSettle } from "./useMagneticSettle";
import { StageHud } from "./StageHud";

/**
 * A scroll-driven story. The page scrolls natively (no scroll hijacking): a tall wrapper holds a
 * sticky stage, and scroll position picks the active chapter. The DNA behind it is the site-wide backdrop
 * (components/dna): while this stage is on screen it takes its camera from the chapters' keyframes.
 *
 * One DOM serves every mode, chosen by CSS media queries so nothing shifts after hydration:
 *  - motion allowed: pinned stage (large screens: floating option cards; phones: compact chips)
 *  - reduced motion: chapters simply stack as normal sections, with no canvas
 */
export function ChapterStage({
  chapters,
  label,
  firstHeading = "h1",
}: {
  chapters: Chapter[];
  label: string;
  firstHeading?: "h1" | "h2";
}) {
  const wrapperRef = useRef<HTMLElement>(null);
  const last = chapters.length - 1;
  const { scrollYProgress } = useScroll({ target: wrapperRef, offset: ["start start", "end end"] });
  const { scrollYProgress: presence } = useScroll({ target: wrapperRef, offset: ["start end", "end start"] });
  const [active, setActive] = useState(0);
  const [changes, setChanges] = useState(0);
  const pinned = useMediaQuery("(prefers-reduced-motion: no-preference)");
  const { director, hud, anchors } = useDna();
  useMagneticSettle(wrapperRef, chapters.length);
  const keys = useMemo(() => chapters.map((c) => c.camera), [chapters]);

  // While this stage is on the page, the site-wide DNA takes its camera from the chapters.
  useEffect(() => {
    director.setStage({ progress: scrollYProgress, presence, keys });
    return () => director.setStage(null);
  }, [director, scrollYProgress, presence, keys]);

  const indexAt = (p: number) => Math.min(last, Math.max(0, Math.round(p * last)));
  const shown = useRef(0);
  useMotionValueEvent(scrollYProgress, "change", (p) => {
    const next = indexAt(p);
    if (next === shown.current) return;
    shown.current = next;
    setActive(next);
    setChanges((n) => n + 1);
  });

  // Pick up the right chapter when the page loads already scrolled (reload, back button, anchor).
  useEffect(() => {
    const id = requestAnimationFrame(() => {
      // restoring a scrolled page (reload, back button) is not a chapter change, so no glitch
      shown.current = indexAt(scrollYProgress.get());
      setActive(shown.current);
    });
    return () => cancelAnimationFrame(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const scrollToChapter = (target: number | string, instant = false) => {
    const index =
      typeof target === "number" ? target : chapters.findIndex((c) => c.id === target);
    const i = Math.min(last, Math.max(0, index));
    const wrapper = wrapperRef.current;
    if (!wrapper) return;
    const smooth = !instant && window.matchMedia("(prefers-reduced-motion: no-preference)").matches;
    const motion = window.matchMedia("(prefers-reduced-motion: no-preference)").matches;
    if (motion) {
      const range = wrapper.offsetHeight - window.innerHeight;
      const top = wrapper.getBoundingClientRect().top + window.scrollY + (last ? (i / last) * range : 0);
      window.scrollTo({ top, behavior: smooth ? "smooth" : "auto" });
    } else {
      document.getElementById(`chapter-${chapters[i].id}`)?.scrollIntoView();
    }
  };

  // Links like /services#shopify-storefronts target a chapter, which lives inside a pinned stage, so the
  // browser cannot scroll to it natively. Handle the hash on load, on hash changes, and on same-page clicks.
  const goToHash = () => {
    const i = chapters.findIndex((c) => c.id === window.location.hash.slice(1));
    if (i >= 0) scrollToChapter(i, true);
  };
  useEffect(() => {
    const raf = requestAnimationFrame(goToHash);
    const onClick = (e: MouseEvent) => {
      const a = (e.target as Element | null)?.closest?.("a[href*='#']") as HTMLAnchorElement | null;
      if (!a || a.target === "_blank") return;
      const url = new URL(a.href, window.location.href);
      if (url.origin !== window.location.origin || url.pathname !== window.location.pathname) return;
      const i = chapters.findIndex((c) => c.id === url.hash.slice(1));
      if (i < 0) return;
      e.preventDefault();
      window.history.pushState(null, "", url.hash);
      scrollToChapter(i);
    };
    window.addEventListener("hashchange", goToHash);
    document.addEventListener("click", onClick);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("hashchange", goToHash);
      document.removeEventListener("click", onClick);
    };
    // chapters is a module constant; the handlers read refs and location at call time
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <section
      ref={wrapperRef}
      aria-label={label}
      style={{ "--n": chapters.length } as CSSProperties}
      className="relative motion-safe:h-[calc(var(--n)*100svh)]"
    >
      <div className="relative isolate overflow-hidden motion-safe:sticky motion-safe:top-0 motion-safe:h-svh">
        <StageScrim />

        {pinned && (
          <>
            <StageHud hud={hud} progress={scrollYProgress} active={active} total={chapters.length} changes={changes} />
            <AnchorLines anchors={anchors} />
            <ChapterRail chapters={chapters} active={active} progress={scrollYProgress} onSelect={scrollToChapter} />
            <ProgressTrack chapters={chapters} active={active} progress={scrollYProgress} onSelect={scrollToChapter} />
            <ScrollHint visible={active === 0} />
            <Pager total={chapters.length} active={active} onSelect={scrollToChapter} />
          </>
        )}

        <ol className="relative motion-safe:absolute motion-safe:inset-0">
          {chapters.map((c, i) => {
            const state = i < active ? "before" : i > active ? "after" : "active";
            const Heading = i === 0 ? firstHeading : "h2";
            return (
              <li
                key={c.id}
                id={`chapter-${c.id}`}
                data-state={state}
                inert={pinned && state !== "active"}
                aria-labelledby={`chapter-${c.id}-title`}
                className={clsx(
                  // stacked (reduced motion): ordinary sections
                  "group/ch relative flex flex-col px-5 py-20 sm:px-8",
                  // pinned: every chapter fills the stage and fades in/out by state
                  "motion-safe:absolute motion-safe:inset-0 motion-safe:justify-end motion-safe:py-0 motion-safe:pb-20 motion-safe:pt-[calc(40%+3.5rem)]",
                  "motion-safe:transition-[opacity,transform] motion-safe:duration-700 motion-safe:ease-out",
                  "motion-safe:data-[state=before]:pointer-events-none motion-safe:data-[state=before]:-translate-y-6 motion-safe:data-[state=before]:opacity-0",
                  "motion-safe:data-[state=after]:pointer-events-none motion-safe:data-[state=after]:translate-y-6 motion-safe:data-[state=after]:opacity-0",
                  "lg:motion-safe:justify-center lg:motion-safe:pb-0 lg:motion-safe:pt-16 lg:motion-safe:pl-[13rem]",
                )}
              >
                {/* Text group: a normal block on large screens; on phones its children join the column (via
                    `contents`) so the option chips, a sibling below, can sit between the intro and the buttons. */}
                <div className="max-lg:contents motion-safe:lg:absolute motion-safe:lg:left-[13rem] motion-safe:lg:top-1/2 motion-safe:lg:w-[28rem] motion-safe:lg:-translate-y-1/2">
                  <div className="order-1 max-w-xl">
                    <p className="eyebrow mb-3">
                      <span className="text-cyan">{c.number}</span> · {c.eyebrow}
                    </p>
                    <Heading
                      id={`chapter-${c.id}-title`}
                      className={clsx(
                        "text-balance text-3xl font-semibold leading-[1.08] tracking-tight sm:text-4xl xl:text-5xl",
                        changes > 0 && "group-data-[state=active]/ch:animate-glitch",
                      )}
                    >
                      {c.title}
                    </Heading>
                    <p className="mt-4 max-w-md text-pretty leading-relaxed text-muted [@media(max-height:720px)]:hidden">
                      {c.lead}
                    </p>
                    <p className="mt-3 hidden max-w-md text-pretty text-sm leading-relaxed text-subtle lg:block motion-safe:max-xl:hidden">
                      {c.body}
                    </p>
                  </div>

                  <div className="order-3 mt-6 flex flex-wrap items-center gap-3 lg:mt-8">
                    <Button href={c.cta.href} size="md">
                      {c.cta.label}
                    </Button>
                    {c.secondary &&
                      (c.secondary.href.startsWith("#") ? (
                        <a
                          href={c.secondary.href}
                          className="hidden rounded-full border border-line-strong px-5 py-2.5 text-sm text-fg transition-colors hover:border-cyan/50 sm:inline-flex"
                        >
                          {c.secondary.label}
                        </a>
                      ) : (
                        <Link
                          href={c.secondary.href}
                          className="hidden rounded-full border border-line-strong px-5 py-2.5 text-sm text-fg transition-colors hover:border-cyan/50 sm:inline-flex"
                        >
                          {c.secondary.label}
                        </Link>
                      ))}
                  </div>
                </div>

                {/* Option cards: chips on phones, floating cards on large screens, a grid when stacked */}
                <ul
                  className={clsx(
                    "order-2 mt-5 flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
                    "motion-safe:lg:contents",
                    "motion-reduce:mt-8 motion-reduce:grid motion-reduce:grid-cols-1 motion-reduce:overflow-visible sm:motion-reduce:grid-cols-2",
                  )}
                  aria-label={`${c.eyebrow}: options`}
                >
                  {c.callouts.map((co, k) => {
                    const slot = calloutSlots[k];
                    const Wrapper = co.jumpTo ? "button" : "div";
                    return (
                      <li
                        key={co.title}
                        style={{ "--x": slot.x, "--y": slot.y } as CSSProperties}
                        className={clsx(
                          "shrink-0 motion-safe:lg:absolute motion-safe:lg:left-[var(--x)] motion-safe:lg:top-[var(--y)] motion-safe:lg:w-60",
                        )}
                      >
                        <Wrapper
                          {...(co.jumpTo
                            ? { type: "button" as const, onClick: () => scrollToChapter(co.jumpTo!) }
                            : {})}
                          className={clsx(
                            "glass flex w-full items-center gap-3 rounded-full px-4 py-2.5 text-left text-sm transition-colors lg:bg-[#050914]/75",
                            "lg:items-start lg:rounded-2xl lg:p-4 motion-reduce:items-start motion-reduce:rounded-2xl motion-reduce:p-4",
                            co.jumpTo && "hover:border-cyan/50 hover:bg-white/[0.07]",
                          )}
                        >
                          {co.base ? (
                            <span
                              aria-hidden
                              className="grid h-6 w-6 shrink-0 place-items-center rounded-full border border-cyan/60 font-mono text-xs text-cyan lg:mt-0.5 lg:h-7 lg:w-7 lg:text-sm motion-reduce:mt-0.5 motion-reduce:h-7 motion-reduce:w-7"
                            >
                              {co.base}
                            </span>
                          ) : (
                            <ChapterIcon
                              name={co.icon}
                              className="h-4 w-4 shrink-0 text-cyan lg:mt-0.5 lg:h-6 lg:w-6 motion-reduce:mt-0.5 motion-reduce:h-6 motion-reduce:w-6"
                            />
                          )}
                          <span className="min-w-0">
                            <span className="block font-medium text-fg">{co.title}</span>
                            <span className="hidden text-xs leading-snug text-muted lg:mt-1 lg:block motion-reduce:mt-1 motion-reduce:block">
                              {co.detail}
                            </span>
                            {co.pairs && (
                              <span className="hidden font-mono text-[10px] uppercase tracking-wider text-cyan/80 lg:mt-2 lg:block motion-reduce:mt-2 motion-reduce:block">
                                Pairs with {co.pairs}
                              </span>
                            )}
                          </span>
                        </Wrapper>
                      </li>
                    );
                  })}
                </ul>

                <InfoCard card={c.card} />
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
