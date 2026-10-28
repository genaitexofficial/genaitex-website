import { site } from "@/lib/site";

/**
 * Theme state shared by React (ThemeProvider, the toggle) and by code outside React (the DNA canvases).
 * The visitor's choice (`auto`, `day` or `night`) lives in localStorage; Auto follows the device's
 * light/dark setting. The themes apply at every screen width (see globals.css).
 */
export type ThemeMode = "auto" | "day" | "night";
export type ResolvedTheme = "day" | "night";
/** What the scene should look like right now: a theme, or the original blue look (only when themes are switched off). */
export type SceneTheme = ResolvedTheme | "legacy";

export const STORAGE_KEY = "genaitex-theme";
const EVENT = "genaitex:theme";
const DARK = "(prefers-color-scheme: dark)";

function readMode(): ThemeMode {
  try {
    const v = localStorage.getItem(STORAGE_KEY);
    return v === "day" || v === "night" ? v : "auto";
  } catch {
    return "auto";
  }
}

export const resolve = (mode: ThemeMode): ResolvedTheme =>
  mode === "auto" ? (window.matchMedia(DARK).matches ? "night" : "day") : mode;

export function setMode(mode: ThemeMode) {
  try {
    if (mode === "auto") localStorage.removeItem(STORAGE_KEY);
    else localStorage.setItem(STORAGE_KEY, mode);
  } catch {
    // storage blocked: the choice just lasts for this page view
  }
  window.dispatchEvent(new Event(EVENT));
}

export function subscribe(onChange: () => void) {
  const dark = window.matchMedia(DARK);
  window.addEventListener("storage", onChange);
  window.addEventListener(EVENT, onChange);
  dark.addEventListener("change", onChange);
  return () => {
    window.removeEventListener("storage", onChange);
    window.removeEventListener(EVENT, onChange);
    dark.removeEventListener("change", onChange);
  };
}

/** "mode:resolved", e.g. "auto:night": a string so useSyncExternalStore sees a stable snapshot. */
export function getSnapshot(): string {
  const mode = readMode();
  return `${mode}:${resolve(mode)}`;
}
export const getServerSnapshot = () => "auto:day";

/** The theme the DNA scene should use now (for the canvases, which live outside React's render). */
export function getSceneTheme(): SceneTheme {
  return site.desktopThemes ? resolve(readMode()) : "legacy";
}

/** Source of the inline script in app/layout.tsx that sets data-theme before first paint. */
export const themeScript = `(function(){try{var d=document.documentElement;${
  site.desktopThemes
    ? `var m=localStorage.getItem("${STORAGE_KEY}");if(m!=="day"&&m!=="night")m="auto";var t=m==="auto"?(matchMedia("${DARK}").matches?"night":"day"):m;d.dataset.theme=t;d.dataset.mode=m;`
    : `d.dataset.theme="legacy";`
}}catch(e){}})();`;
