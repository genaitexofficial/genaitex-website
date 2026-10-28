"use client";

import { Moon, Sun, SunMoon } from "lucide-react";
import { site } from "@/lib/site";
import { useTheme } from "./ThemeProvider";

const next = { auto: "Day", day: "Night", night: "Auto" } as const;

/**
 * One sun/moon button: each click cycles Auto (follows the device), Day, Night. Desktop only: the new
 * themes apply from 1024px up, so there is nothing to switch on phones and tablets.
 */
export function ThemeToggle() {
  const { mode, resolved, cycle } = useTheme();
  if (!site.desktopThemes) return null;

  const state =
    mode === "auto" ? `Auto, following your device (${resolved} now)` : mode === "day" ? "Day" : "Night";
  const label = `Theme: ${state}. Switch to ${next[mode]}.`;
  const Icon = mode === "auto" ? SunMoon : mode === "day" ? Sun : Moon;

  return (
    <button
      type="button"
      onClick={cycle}
      aria-label={label}
      title={label}
      data-theme-toggle={mode}
      className="hidden h-10 w-10 items-center justify-center rounded-full border border-line text-muted transition-colors hover:border-line-strong hover:text-fg lg:inline-flex"
    >
      <Icon className="h-[18px] w-[18px]" aria-hidden />
    </button>
  );
}
