"use client";

import { memo, useCallback, useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import Link from "next/link";
import { useMotionValueEvent, useScroll } from "motion/react";
import { clsx } from "clsx";
import { Button } from "@/components/ui/Button";
import { Price } from "@/components/currency/Price";
import { chapterAliases, type Callout, type Chapter } from "@/lib/chapters";
import { StageScrim } from "./StageScrim";
import {
  calloutSlots,
  extraSlots,
  phoneSlots,
  stageCx,
  textEdge,
  FADE,
  GLASS_ACTIVE,
  glassTone,
  CardExtras,
  ExtraCard,
  ExtraChip,
  ChapterIcon,
  AnchorLines,
  InfoCard,
  Pager,
  ScrollHint,
  StageStack,
  type StageLayout,
} from "./StageParts";
import { useDna } from "@/components/dna/DnaProvider";
import { useMediaQuery } from "@/components/dna/useScene";
import { useMagneticSettle } from "./useMagneticSettle";
import { useGlassFlat } from "./glassBlur";
import { StageHud } from "./StageHud";
import { DetailsSheet, type SheetTarget } from "./DetailsSheet";

/**
 * One chapter of the stage. Memoized, so a chapter change re-renders only the two chapters whose state changed
 * (not all five and their option cards), which keeps the main thread free while the camera flies.
 */
const ChapterItem = memo(function ChapterItem({
  c,
  state,
  pinned,
  heading: Heading,
  layout,
  onJump,
  onOpen,
}: {
  c: Chapter;
  state: "before" | "active" | "after";
  pinned: boolean;
  heading: "h1" | "h2";
  layout: StageLayout;
  onJump: (target: number | string) => void;
  /** Phones and tablets: open the details sheet for a compact card (`tone` is its glass tone, 1..5). */
  onOpen: (card: Callout, tone: number, chapter: Chapter, opener: HTMLElement) => void;
}) {
  const list = layout === "list";
  return (
      <li
        id={`chapter-${c.id}`}
        data-state={state}
        inert={pinned && state !== "active"}
        aria-labelledby={`chapter-${c.id}-title`}
        className={clsx(
          // stacked (reduced motion): ordinary sections
          "group/ch relative flex flex-col px-5 py-20 sm:px-8",
          // pinned: every chapter fills the stage and fades in/out by state
          "motion-safe:absolute motion-safe:inset-0 motion-safe:justify-end motion-safe:py-0 motion-safe:pb-[4.25rem] motion-safe:pt-24",
          "max-lg:motion-safe:transition-[opacity,transform] max-lg:motion-safe:duration-[450ms] max-lg:motion-safe:ease-out",
          "motion-safe:data-[state=before]:pointer-events-none max-lg:motion-safe:data-[state=before]:-translate-y-6 max-lg:motion-safe:data-[state=before]:opacity-0",
          "motion-safe:data-[state=after]:pointer-events-none max-lg:motion-safe:data-[state=after]:translate-y-6 max-lg:motion-safe:data-[state=after]:opacity-0",
          "lg:motion-safe:justify-center lg:motion-safe:pb-0 lg:motion-safe:pt-16",
        )}
      >
        {/* Text group: a normal block on large screens; on phones its children join the column (via
            `contents`) so the option chips, a sibling below, can sit between the intro and the buttons. */}
        <div
          data-dna-reticle
          className={clsx(
            "max-lg:motion-reduce:contents motion-safe:lg:absolute motion-safe:lg:top-1/2 motion-safe:lg:-translate-y-1/2",
            // the Home list puts the text hard left (3rem from the edge); other stages line it up with the logo
            list
              ? "motion-safe:lg:left-12 motion-safe:lg:w-[min(28rem,36%)]"
              : "motion-safe:lg:left-[max(2rem,calc((100vw-80rem)/2+2rem))] motion-safe:lg:w-[min(28rem,36%)]",
            FADE,
            // phones with motion: the text is a Liquid Glass card sitting on the helix, tied to the targeted pair
            "max-lg:motion-safe:relative max-lg:motion-safe:isolate max-lg:motion-safe:rounded-3xl max-lg:motion-safe:p-5 [@media(max-height:720px)]:max-lg:motion-safe:p-4",
          )}
        >
          <span
            aria-hidden
            style={{ ...glassTone(1), "--glass-tint": "var(--text-tint)", "--glass-shine": "var(--text-shine)" } as CSSProperties}
            className="text-glass liquid-glass absolute inset-0 -z-10 rounded-3xl [--glass-under:var(--glass-under-card)] lg:hidden motion-reduce:hidden"
          />
          <div className="order-1 max-w-xl md:max-lg:max-w-2xl">
            <p className="eyebrow mb-3 max-lg:motion-safe:text-[11px] max-lg:motion-safe:tracking-[0.1em]">
              <span className="text-cyan">{c.number}</span> · {c.eyebrow}
            </p>
            <Heading
              id={`chapter-${c.id}-title`}
              className="text-balance text-3xl font-semibold leading-[1.08] tracking-tight max-lg:motion-safe:text-[1.75rem] sm:text-4xl max-lg:motion-safe:sm:text-[1.75rem] md:max-lg:motion-safe:text-[2rem] xl:text-5xl [@media(max-height:720px)]:max-lg:motion-safe:text-2xl"
            >
              {c.title}
            </Heading>
            <p className="mt-3 max-w-md text-pretty leading-relaxed text-muted max-lg:motion-safe:line-clamp-3 max-lg:motion-safe:text-[15px] [@media(max-height:720px)]:hidden lg:mt-4">
              {c.lead}
            </p>
            <p className="mt-3 hidden max-w-md text-pretty text-sm leading-relaxed text-subtle lg:block motion-safe:max-xl:hidden">
              {c.body}
            </p>
            {c.proof && (
              <dl className="mt-6 hidden max-w-md grid-cols-3 gap-4 border-t border-line pt-4 lg:grid motion-reduce:mt-6 motion-reduce:grid">
                {c.proof.map((p) => (
                  <div key={p.value}>
                    <dt className="text-xl font-semibold tracking-tight text-fg xl:text-2xl">{p.value}</dt>
                    <dd className="mt-1 text-pretty text-xs leading-snug text-muted">{p.label}</dd>
                  </div>
                ))}
              </dl>
            )}
          </div>

          <div className="order-3 mt-5 flex flex-wrap items-center gap-3 lg:mt-8">
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

        {/* Option cards: chips on phones, floating cards on large screens (hidden where the glass stack takes
            over), a grid when stacked */}
        <ul
          className={clsx(
            "order-2 mt-5 flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
            list ? "motion-safe:hidden" : "motion-safe:contents",
            "motion-reduce:mt-8 motion-reduce:grid motion-reduce:grid-cols-1 motion-reduce:overflow-visible sm:motion-reduce:grid-cols-2",
          )}
          aria-label={`${c.eyebrow}: options`}
        >
          {c.callouts.map((co, k) => {
            const slot = (c.extra && !list ? extraSlots : calloutSlots)[k];
            const phone = phoneSlots[k];
            const Wrapper = co.jumpTo ? "button" : "div";
            return (
              <li
                key={co.title}
                style={
                  {
                    "--edge": textEdge,
                    ...glassTone(k + 1),
                    "--px": phone.x,
                    "--py": phone.y,
                    "--c": `var(--slot-${k + 1})`,
                    "--t": `var(--slot-text-${k + 1})`,
                  } as CSSProperties
                }
                className={clsx(
                  "shrink-0 motion-safe:max-lg:absolute motion-safe:max-lg:left-[var(--px)] motion-safe:max-lg:top-[var(--py)] motion-safe:max-lg:w-[44%] motion-safe:max-lg:max-w-[15rem] md:motion-safe:max-lg:w-[36%] md:motion-safe:max-lg:max-w-[18rem]",
                  "motion-safe:lg:absolute motion-safe:lg:w-60 motion-safe:xl:w-[17rem]",
                  slot.pos,
                )}
              >
                <Wrapper
                  {...(co.jumpTo
                    ? { type: "button" as const, onClick: () => onJump(co.jumpTo!) }
                    : {})}
                  className={clsx(
                    "slot-card liquid-glass flex w-full items-center gap-2.5 rounded-full px-3.5 py-2 text-left text-sm transition-transform max-lg:motion-safe:rounded-2xl max-lg:motion-safe:text-[13px] max-lg:motion-safe:leading-tight md:max-lg:motion-safe:px-4 md:max-lg:motion-safe:py-3 md:max-lg:motion-safe:text-[15px]",
                    "lg:grid lg:grid-cols-[2rem_minmax(0,1fr)] lg:items-start lg:gap-y-0 lg:rounded-2xl lg:p-4 motion-reduce:grid motion-reduce:grid-cols-[2rem_minmax(0,1fr)] motion-reduce:items-start motion-reduce:gap-y-0 motion-reduce:rounded-2xl motion-reduce:p-4",
                    co.jumpTo && "hover:-translate-y-0.5",
                    FADE,
                    GLASS_ACTIVE,
                  )}
                >
                  <span
                    aria-hidden
                    className={clsx(
                      "slot-chip grid h-6 w-6 shrink-0 place-items-center lg:mt-0.5 lg:h-8 lg:w-8 motion-reduce:mt-0.5 motion-reduce:h-8 motion-reduce:w-8",
                      co.base ? "rounded-full font-mono text-xs lg:text-sm" : "rounded-lg",
                    )}
                  >
                    {co.base ?? <ChapterIcon name={co.icon} className="h-3.5 w-3.5 lg:h-[18px] lg:w-[18px]" />}
                  </span>
                  <span className="min-w-0">
                    <span className="block font-medium text-fg">{co.title}</span>
                    {co.price && (
                      <Price
                        inr={co.price.inr}
                        className="mt-0.5 block font-mono text-[11px] font-medium tracking-wide text-[rgb(var(--t))]"
                      />
                    )}
                    <span className="hidden text-xs leading-snug text-muted lg:mt-1 lg:block motion-reduce:mt-1 motion-reduce:block">
                      {co.detail}
                    </span>
                    {co.pairs && (
                      <span className="hidden font-mono text-[10px] uppercase tracking-wider text-[rgb(var(--t))] lg:mt-2 lg:block motion-reduce:mt-2 motion-reduce:block">
                        Pairs with {co.pairs}
                      </span>
                    )}
                    <CardExtras includes={co.includes} book={co.book} title={co.title} />
                  </span>
                  {/* phones and tablets: the whole compact card is one tap target that opens the details sheet */}
                  {!list && !co.jumpTo && (
                    <button
                      type="button"
                      aria-haspopup="dialog"
                      aria-label={`${co.title}: details`}
                      onClick={(e) => onOpen(co, k + 1, c, e.currentTarget)}
                      className="absolute inset-0 z-10 rounded-[inherit] lg:hidden motion-reduce:hidden"
                    />
                  )}
                </Wrapper>
                {/* phones and tablets: the fifth (ready-made) card sits right under the third */}
                {k === 2 && c.extra && !list && (
                  <ExtraChip card={c.extra} onOpen={(opener) => onOpen(c.extra!, 5, c, opener)} />
                )}
              </li>
            );
          })}
        </ul>

        <InfoCard card={c.card} layout={layout} />
        {c.extra && layout === "float" && <ExtraCard card={c.extra} />}
      </li>
  );
});

/** Home scroll 1 can be the glass stack (`stackFirst`); every other scroll shows the floating cards. */
const layoutOf = (stackFirst: boolean, i: number): StageLayout => (stackFirst && i === 0 ? "list" : "float");

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
  stackFirst = false,
}: {
  chapters: Chapter[];
  label: string;
  firstHeading?: "h1" | "h2";
  /** On large screens, show the first chapter's four options as a glass stack in the middle of the DNA (the other chapters keep their floating cards). */
  stackFirst?: boolean;
}) {
  const wrapperRef = useRef<HTMLElement>(null);
  const last = chapters.length - 1;
  const { scrollYProgress } = useScroll({ target: wrapperRef, offset: ["start start", "end end"] });
  const { scrollYProgress: presence } = useScroll({ target: wrapperRef, offset: ["start end", "end start"] });
  const [active, setActive] = useState(0);
  const [changes, setChanges] = useState(0);
  // Phones and tablets: the compact card whose details sheet is open
  const [sheet, setSheet] = useState<SheetTarget | null>(null);
  const openSheet = useCallback(
    (card: Callout, tone: number, chapter: Chapter, opener: HTMLElement) =>
      setSheet({ card, tone, cta: chapter.cta, chapter: chapter.id, opener }),
    [],
  );
  const closeSheet = useCallback(() => setSheet(null), []);
  const pinned = useMediaQuery("(prefers-reduced-motion: no-preference)");
  const { director, anchors } = useDna();
  useMagneticSettle(wrapperRef, chapters.length);
  const keys = useMemo(() => chapters.map((c) => c.camera), [chapters]);
  const cxs = useMemo(() => chapters.map((_, i) => stageCx[layoutOf(stackFirst, i)]), [chapters, stackFirst]);

  // While this stage is on the page, the site-wide DNA takes its camera (and its centre, per chapter) from the chapters.
  useEffect(() => {
    director.setStage({ progress: scrollYProgress, presence, keys, cx: cxs });
    return () => director.setStage(null);
  }, [director, scrollYProgress, presence, keys, cxs]);

  const listShown = stackFirst && active === 0;

  // Where the connectors start and aim: the active chapter's card positions (a chapter with a sixth card moves card 3)
  const wide = useMediaQuery("(min-width: 1280px)");
  const slots = chapters[active].extra && !listShown && wide ? extraSlots : calloutSlots;
  useEffect(() => {
    anchors.forEach((a, k) => {
      a.rest.x = slots[k].line[0];
      a.rest.y = slots[k].line[1];
      a.target.x = slots[k].line[2];
      a.target.y = slots[k].line[3];
    });
  }, [anchors, slots]);
  const glassFlat = useGlassFlat();

  // Where the active chapter's cards are (large screens), so the connector dots never end up under one.
  const stageRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage || !pinned) return;
    let live = true;
    const measure = () => {
      if (!live) return;
      const rects: number[] = [];
      if (window.innerWidth >= 1024) {
        const box = stage.getBoundingClientRect();
        stage.querySelectorAll(`#chapter-${chapters[active].id} .slot-card`).forEach((card) => {
          const b = card.getBoundingClientRect();
          if (!b.width) return;
          const pad = 14; // keep the dot's glow clear of the edge too
          rects.push(
            ((b.left - pad - box.left) / box.width) * 100,
            ((b.top - pad - box.top) / box.height) * 100,
            ((b.right + pad - box.left) / box.width) * 100,
            ((b.bottom + pad - box.top) / box.height) * 100,
          );
        });
      }
      director.setKeepOut(rects);
    };
    measure();
    const settled = setTimeout(measure, 520); // the arriving chapter slides in for 450 ms
    const observer = new ResizeObserver(measure);
    observer.observe(stage);
    document.fonts?.ready.then(measure);
    return () => {
      live = false;
      clearTimeout(settled);
      observer.disconnect();
      director.setKeepOut([]);
    };
  }, [active, chapters, director, pinned]);
  const indexAt = (p: number) => Math.min(last, Math.max(0, Math.round(p * last)));
  const shown = useRef(0);
  useMotionValueEvent(scrollYProgress, "change", (p) => {
    const next = indexAt(p);
    if (next === shown.current) return;
    shown.current = next;
    setActive(next);
    setChanges((n) => n + 1);
    setSheet(null); // a details sheet belongs to the chapter it was opened on
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

  const scrollToChapter = useCallback(
    (target: number | string, instant = false) => {
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
    },
    [chapters, last],
  );

  // Links like /services#shopify-storefronts target a chapter, which lives inside a pinned stage, so the
  // browser cannot scroll to it natively. Handle the hash on load, on hash changes, and on same-page clicks.
  const goToHash = () => {
    const hash = window.location.hash.slice(1);
    const i = chapters.findIndex((c) => c.id === (chapterAliases[hash] ?? hash));
    if (i >= 0) scrollToChapter(i, true);
  };
  useEffect(() => {
    const raf = requestAnimationFrame(goToHash);
    const onClick = (e: MouseEvent) => {
      const a = (e.target as Element | null)?.closest?.("a[href*='#']") as HTMLAnchorElement | null;
      if (!a || a.target === "_blank") return;
      const url = new URL(a.href, window.location.href);
      if (url.origin !== window.location.origin || url.pathname !== window.location.pathname) return;
      const hash = url.hash.slice(1);
      const i = chapters.findIndex((c) => c.id === (chapterAliases[hash] ?? hash));
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
      data-stage
      style={{ "--n": chapters.length } as CSSProperties}
      className="relative motion-safe:h-[calc(var(--n)*100svh)]"
    >
      <div ref={stageRef} data-glass={glassFlat ? "flat" : "blur"} className="relative isolate overflow-hidden motion-safe:sticky motion-safe:top-0 motion-safe:h-svh">
        <StageScrim stack={stackFirst} listShown={listShown} />

        {pinned && (
          <>
            <StageHud progress={scrollYProgress} changes={changes} cx={cxs[active]} reticle={!listShown} />
            <AnchorLines anchors={anchors} listShown={listShown} slots={slots} />
            <ScrollHint visible={active === 0} />
            <Pager total={chapters.length} active={active} onSelect={scrollToChapter} />
          </>
        )}

        <ol className="relative motion-safe:absolute motion-safe:inset-0">
          {chapters.map((c, i) => {
            const state = i < active ? "before" : i > active ? "after" : "active";
            return (
              <ChapterItem
                key={c.id}
                c={c}
                state={state}
                pinned={pinned}
                heading={i === 0 ? firstHeading : "h2"}
                layout={layoutOf(stackFirst, i)}
                onJump={scrollToChapter}
                onOpen={openSheet}
              />
            );
          })}
        </ol>

        {stackFirst && <StageStack chapter={chapters[0]} on={listShown} onJump={scrollToChapter} />}
      </div>
      <DetailsSheet target={sheet?.chapter === chapters[active].id ? sheet : null} onClose={closeSheet} />
    </section>
  );
}
