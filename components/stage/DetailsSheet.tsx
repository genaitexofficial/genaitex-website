"use client";

import { useEffect, useId, useRef, type CSSProperties } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { ArrowRight, Check, X } from "lucide-react";
import { Price } from "@/components/currency/Price";
import type { Callout, Chapter } from "@/lib/chapters";
import { ChapterIcon, glassTone } from "./StageParts";

/** What the sheet is showing: the card, its glass tone (1..5), the chapter's call to action, and what to give focus back to. */
export interface SheetTarget {
  card: Callout;
  tone: number;
  cta: Chapter["cta"];
  /** The id of the chapter the card is on: the sheet only shows while that chapter does. */
  chapter: string;
  opener: HTMLElement | null;
}

const focusable = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * Phones and tablets: tapping a compact glass card opens this sheet with what the card covers and its Book link (a
 * bottom sheet on phones, a centred panel on tablets). The compact cards only show a name and a price, so this is
 * where the detail, the includes and the Book button live. Nothing here is new content: it is the same card data the
 * large-screen cards show inline; a card without its own Book link offers the chapter's call to action instead.
 *
 * It is a modal dialog: the page behind stops scrolling, Tab stays inside, Escape or a tap outside closes it, and
 * focus goes back to the card that opened it. It is rendered in a portal so it sits above the navbar.
 */
export function DetailsSheet({ target, onClose }: { target: SheetTarget | null; onClose: () => void }) {
  const dialog = useRef<HTMLDivElement>(null);
  const titleId = useId();
  const open = target !== null;

  useEffect(() => {
    if (!open) return;
    const dlg = dialog.current;
    const opener = target?.opener ?? null;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    dlg?.querySelector<HTMLElement>("[data-sheet-close]")?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        onClose();
        return;
      }
      if (e.key !== "Tab" || !dlg) return;
      const items = [...dlg.querySelectorAll<HTMLElement>(focusable)];
      if (!items.length) return;
      const first = items[0];
      const last = items[items.length - 1];
      const at = document.activeElement;
      if (e.shiftKey && (at === first || !dlg.contains(at))) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && (at === last || !dlg.contains(at))) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey, true);
    return () => {
      document.removeEventListener("keydown", onKey, true);
      document.body.style.overflow = prevOverflow;
      if (opener?.isConnected) opener.focus({ preventScroll: true });
    };
    // `target` is read once per opening; closing and reopening remounts it
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  if (!target) return null;
  const { card, tone, cta } = target;
  const action = card.book ?? cta;

  return createPortal(
    <div className="fixed inset-0 z-[80]" data-details-sheet>
      <div
        aria-hidden
        onClick={onClose}
        className="absolute inset-0 bg-[rgb(var(--scrim)/0.62)] motion-safe:animate-[sheet-fade_0.25s_ease-out]"
      />
      <div
        ref={dialog}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        style={{ "--c": `var(--slot-${tone})`, ...glassTone(tone) } as CSSProperties}
        className="slot-card liquid-glass absolute inset-x-0 bottom-0 max-h-[88svh] overflow-y-auto overscroll-contain rounded-t-[1.75rem] px-5 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-5 motion-safe:max-md:animate-[sheet-up_0.3s_cubic-bezier(0.22,1,0.36,1)] md:inset-x-auto md:bottom-auto md:left-1/2 md:top-1/2 md:w-[28rem] md:max-w-[calc(100vw-3rem)] md:-translate-x-1/2 md:-translate-y-1/2 md:rounded-[1.75rem] md:p-6 motion-safe:md:animate-[sheet-pop_0.25s_ease-out]"
      >
        <div className="flex items-start gap-3">
          <span aria-hidden className="slot-chip mt-0.5 grid h-10 w-10 shrink-0 place-items-center rounded-xl">
            <ChapterIcon name={card.icon} className="h-5 w-5" />
          </span>
          <div className="min-w-0 flex-1">
            <h2 id={titleId} className="text-balance text-lg font-semibold leading-tight tracking-tight text-fg">
              {card.title}
            </h2>
            {card.price ? (
              <Price
                inr={card.price.inr}
                className="mt-1 block font-mono text-xs font-medium tracking-wide text-[rgb(var(--t))]"
              />
            ) : (
              card.tag && (
                <p className="mt-1 font-mono text-xs font-medium tracking-wide text-[rgb(var(--t))]">{card.tag}</p>
              )
            )}
          </div>
          <button
            type="button"
            data-sheet-close
            onClick={onClose}
            aria-label="Close details"
            className="-mr-2 -mt-2 grid h-11 w-11 shrink-0 place-items-center rounded-full text-fg transition-colors hover:bg-[rgb(var(--glass-ink)/0.1)]"
          >
            <X aria-hidden className="h-5 w-5" />
          </button>
        </div>

        <p className="mt-4 text-pretty text-[15px] leading-relaxed text-muted">{card.detail}</p>

        {card.includes && (
          <ul className="mt-4 space-y-2 text-sm leading-snug text-muted">
            {card.includes.map((t) => (
              <li key={t} className="flex gap-2">
                <Check aria-hidden className="mt-0.5 h-4 w-4 shrink-0 text-[rgb(var(--t))]" />
                {t}
              </li>
            ))}
          </ul>
        )}

        <Link
          href={action.href}
          onClick={onClose}
          aria-label={card.book ? `${action.label}: ${card.title}` : undefined}
          className="btn-primary mt-6 inline-flex h-12 w-full items-center justify-center gap-2 rounded-full px-6 text-sm font-semibold md:w-auto"
        >
          {action.label}
          <ArrowRight aria-hidden className="h-4 w-4" />
        </Link>
      </div>
    </div>,
    document.body,
  );
}
