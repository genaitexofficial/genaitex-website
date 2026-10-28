"use client";

import { useEffect, useSyncExternalStore } from "react";
import { clsx } from "clsx";
import { getServerSnapshot, getSnapshot, setCurrency, subscribe, type Currency } from "./store";

export function useCurrency(): Currency {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

/**
 * A small ₹ / $ switch for the prices on the site. Keeps <html data-currency> in step with the choice (also
 * when another tab changes it), and the choice is remembered.
 */
export function CurrencyToggle({ className }: { className?: string }) {
  const currency = useCurrency();
  useEffect(() => {
    document.documentElement.dataset.currency = currency;
  }, [currency]);

  return (
    <div
      role="group"
      aria-label="Show prices in"
      className={clsx("inline-flex h-10 items-center rounded-full border border-line p-0.5 font-mono text-xs", className)}
    >
      {(["inr", "usd"] as const).map((c) => (
        <button
          key={c}
          type="button"
          onClick={() => setCurrency(c)}
          aria-pressed={currency === c}
          aria-label={c === "inr" ? "Indian rupees" : "US dollars"}
          className={clsx(
            "h-8 min-w-8 rounded-full px-2.5 transition-colors",
            currency === c ? "bg-fg text-ink" : "text-muted hover:text-fg",
          )}
        >
          {c === "inr" ? "₹" : "$"}
        </button>
      ))}
    </div>
  );
}
