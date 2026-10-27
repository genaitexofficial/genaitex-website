/**
 * Keeps the chapter text readable over the page-long DNA scene: a soft panel on the left on large screens
 * (the helix sits on the right), and on phones a panel under the helix's top 40% that fades up into it.
 * Belongs to the stage, so it scrolls away with it and leaves the helix clear behind the rest of the page.
 */
export function StageScrim() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 motion-reduce:hidden">
      <div className="absolute inset-y-0 left-0 hidden w-[58%] bg-[linear-gradient(90deg,rgba(5,9,20,0.9),rgba(5,9,20,0.72)_55%,transparent)] lg:block" />
      <div className="absolute inset-x-0 bottom-0 top-[calc(40%+2.25rem)] bg-[linear-gradient(to_bottom,transparent,rgba(5,6,10,0.94)_14%,#05060a)] lg:hidden" />
    </div>
  );
}
