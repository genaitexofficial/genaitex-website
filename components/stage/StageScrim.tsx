/**
 * Keeps the chapter text readable over the page-long DNA scene on large screens: a soft panel on the left
 * (the helix sits on the right). Phones use a glass card for the text instead, so nothing darkens the helix.
 * Belongs to the stage, so it scrolls away with it.
 *
 * A stage with a glass-stack chapter (`stack`) also has a narrower panel for it (text hard left, a shorter
 * column), cross-faded with the wide one by `listShown`.
 */
export function StageScrim({ stack = false, listShown = false }: { stack?: boolean; listShown?: boolean }) {
  const panel = "absolute inset-y-0 left-0 bg-[linear-gradient(90deg,rgb(var(--scrim)/0.9),rgb(var(--scrim)/0.72)_55%,transparent)] transition-opacity duration-500";
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 hidden motion-safe:lg:block">
      <div className={`${panel} w-[58%] ${listShown ? "opacity-0" : ""}`} />
      {stack && <div className={`${panel} w-[46%] ${listShown ? "" : "opacity-0"}`} />}
    </div>
  );
}
