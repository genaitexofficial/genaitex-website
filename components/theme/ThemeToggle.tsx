"use client";

import { Moon, Sun, SunMoon } from "lucide-react";
import { clsx } from "clsx";
import { site } from "@/lib/site";
import type { ThemeMode } from "./store";
import { useTheme } from "./ThemeProvider";

const next = { auto: "Day", day: "Night", night: "Auto" } as const;

/**
 * One sun/moon button: each click cycles Auto (follows the device), Day, Night. It sits in the navbar from
 * tablet width up; phones get the three-way `ThemeSwitch` in the menu instead.
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
      className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-line text-muted transition-colors hover:border-line-strong hover:text-fg"
    >
      <Icon className="h-[18px] w-[18px]" aria-hidden />
    </button>
  );
}

const options: { mode: ThemeMode; label: string; Icon: typeof Sun }[] = [
  { mode: "auto", label: "Auto", Icon: SunMoon },
  { mode: "day", label: "Day", Icon: Sun },
  { mode: "night", label: "Night", Icon: Moon },
];

/** Auto / Day / Night as a three-way switch, for the mobile menu (Auto follows the device's light or dark setting). */
export function ThemeSwitch({ className }: { className?: string }) {
  const { mode, resolved, set } = useTheme();
  if (!site.desktopThemes) return null;

  return (
    <div className={className}>
      <p id="theme-switch-label" className="eyebrow mb-3">
        Theme{mode === "auto" ? ` · following your device (${resolved})` : ""}
      </p>
      <div
        role="radiogroup"
        aria-labelledby="theme-switch-label"
        data-theme-switch={mode}
        className="grid grid-cols-3 gap-1 rounded-full border border-line p-1"
      >
        {options.map(({ mode: m, label, Icon }) => (
          <button
            key={m}
            type="button"
            role="radio"
            aria-checked={mode === m}
            onClick={() => set(m)}
            className={clsx(
              "inline-flex h-11 items-center justify-center gap-2 rounded-full text-sm font-medium transition-colors",
              mode === m ? "bg-wash/[0.12] text-fg" : "text-muted hover:text-fg",
            )}
          >
            <Icon className="h-4 w-4" aria-hidden />
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}
