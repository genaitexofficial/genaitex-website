"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useSyncExternalStore } from "react";
import { site } from "@/lib/site";
import {
  getServerSnapshot,
  getSnapshot,
  setMode,
  subscribe,
  type ResolvedTheme,
  type ThemeMode,
} from "./store";

interface ThemeContextValue {
  mode: ThemeMode;
  resolved: ResolvedTheme;
  /** Auto, then Day, then Night, then back to Auto. */
  cycle: () => void;
  /** Pick a mode directly (the switch in the mobile menu). */
  set: (mode: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function useTheme(): ThemeContextValue {
  const value = useContext(ThemeContext);
  if (!value) throw new Error("useTheme must be used inside <ThemeProvider>");
  return value;
}

/**
 * Keeps <html data-theme> in step with the visitor's choice. The inline script in app/layout.tsx has already
 * set it before first paint; this handles changes afterwards (the button, or the device switching between
 * light and dark while on Auto), with a brief cross-fade.
 */
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const snapshot = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const [mode, resolved] = snapshot.split(":") as [ThemeMode, ResolvedTheme];

  useEffect(() => {
    if (!site.desktopThemes) return;
    const root = document.documentElement;
    // While hydrating, this render can still hold the server's snapshot ("auto:day"), so read the visitor's real choice
    const now = () => getSnapshot().split(":") as [ThemeMode, ResolvedTheme];
    const [actualMode, actual] = now();
    root.dataset.mode = actualMode;
    if (root.dataset.theme === actual) return;
    // Phones and tablets: one GPU cross-fade of the whole page (View Transitions) where the browser has it, otherwise an
    // instant switch. A colour transition on every element at once stutters on a phone.
    if (!window.matchMedia("(min-width: 1024px)").matches) {
      const start = (document as Document & { startViewTransition?: (update: () => void) => unknown }).startViewTransition;
      if (start && window.matchMedia("(prefers-reduced-motion: no-preference)").matches) start.call(document, () => (root.dataset.theme = now()[1]));
      else root.dataset.theme = actual;
      return;
    }
    root.classList.add("theme-fade");
    root.dataset.theme = actual;
    const timer = window.setTimeout(() => root.classList.remove("theme-fade"), 450);
    return () => window.clearTimeout(timer);
  }, [mode, resolved]);

  const cycle = useCallback(() => setMode(mode === "auto" ? "day" : mode === "day" ? "night" : "auto"), [mode]);
  const value = useMemo(() => ({ mode, resolved, cycle, set: setMode }), [mode, resolved, cycle]);
  return <ThemeContext value={value}>{children}</ThemeContext>;
}
