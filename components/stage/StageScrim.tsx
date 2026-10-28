/**
 * Keeps the chapter text readable over the page-long DNA scene on large screens: a soft panel on the left
 * (the helix sits on the right). Phones use a glass card for the text instead, so nothing darkens the helix.
 * Belongs to the stage, so it scrolls away with it.
 */
export function StageScrim({ layout = "float" }: { layout?: "float" | "list" }) {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 hidden motion-safe:lg:block">
      <div
        className={`absolute inset-y-0 left-0 bg-[linear-gradient(90deg,rgb(var(--scrim)/0.9),rgb(var(--scrim)/0.72)_55%,transparent)] ${layout === "list" ? "w-[46%]" : "w-[58%]"}`}
      />
    </div>
  );
}
