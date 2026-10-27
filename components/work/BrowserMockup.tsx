import { clsx } from "clsx";
import type { Accent, MockVariant } from "@/lib/projects";

const accents: Record<Accent, [string, string]> = {
  violet: ["#8b5cf6", "#d946ef"],
  cyan: ["#22d3ee", "#3b82f6"],
  emerald: ["#34d399", "#22d3ee"],
  amber: ["#fbbf24", "#fb7185"],
  rose: ["#fb7185", "#c084fc"],
  blue: ["#60a5fa", "#818cf8"],
};

const grad = "bg-[linear-gradient(135deg,var(--a),var(--b))]";
const line = "rounded-full bg-white/[0.14]";

/** Decorative device frame with a wireframe "screenshot". Pure CSS, so there are no image files to maintain. */
export function BrowserMockup({
  variant,
  accent,
  host,
  className,
}: {
  variant: MockVariant;
  accent: Accent;
  host: string;
  className?: string;
}) {
  const [a, b] = accents[accent];

  return (
    <div
      aria-hidden
      style={{ "--a": a, "--b": b } as React.CSSProperties}
      className={clsx(
        "relative overflow-hidden rounded-2xl border border-line-strong bg-surface-2 shadow-2xl shadow-black/50",
        className,
      )}
    >
      {/* soft accent glow behind the screen */}
      <div className="absolute -right-1/4 -top-1/3 h-3/4 w-3/4 bg-[radial-gradient(closest-side,var(--a),transparent)] opacity-40" />

      {/* title bar */}
      <div className="relative flex items-center gap-3 border-b border-line bg-black/30 px-4 py-2.5">
        <div className="flex gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
          <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
          <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
        </div>
        <div className="mx-auto max-w-[60%] flex-1 truncate rounded-md bg-white/[0.06] px-3 py-1 text-center font-mono text-[10px] text-subtle">
          {host}
        </div>
        <div className="w-10" />
      </div>

      {/* screen */}
      <div className="relative aspect-[16/10] p-[4%]">
        {variant === "storefront" && <Storefront />}
        {variant === "landing" && <Landing />}
        {variant === "dashboard" && <Dashboard />}
        {variant === "app" && <ChatApp />}
      </div>
    </div>
  );
}

function Storefront() {
  return (
    <div className="flex h-full flex-col gap-[4%]">
      <div className="flex items-center justify-between">
        <div className={clsx("h-3 w-[14%]", line)} />
        <div className="flex gap-[3%]">
          <div className={clsx("h-2 w-8", line)} />
          <div className={clsx("h-2 w-8", line)} />
          <div className={clsx("h-2 w-8", line)} />
        </div>
      </div>
      <div className={clsx("relative flex flex-[1.3] items-center overflow-hidden rounded-xl px-[6%]", grad)}>
        <div className="space-y-2">
          <div className="h-3 w-24 rounded-full bg-black/40" />
          <div className="h-2 w-32 rounded-full bg-black/25" />
          <div className="mt-3 h-5 w-16 rounded-full bg-black/55" />
        </div>
        <div className="absolute -right-4 -bottom-6 h-[120%] aspect-square rounded-full bg-black/20" />
        <div className="absolute right-[10%] top-[18%] h-[64%] aspect-[3/4] rounded-xl bg-white/25 backdrop-blur" />
      </div>
      <div className="grid flex-1 grid-cols-3 gap-[3%]">
        {[0, 1, 2].map((i) => (
          <div key={i} className="flex flex-col gap-1.5">
            <div className="flex-1 rounded-lg bg-white/[0.07]" />
            <div className={clsx("h-1.5 w-3/4", line)} />
            <div className={clsx("h-1.5 w-1/3", grad, "rounded-full opacity-80")} />
          </div>
        ))}
      </div>
    </div>
  );
}

function Landing() {
  return (
    <div className="flex h-full flex-col gap-[5%]">
      <div className="flex items-center justify-between">
        <div className={clsx("h-3 w-[12%]", line)} />
        <div className={clsx("h-5 w-14", grad, "rounded-full")} />
      </div>
      <div className="grid flex-1 grid-cols-[1.1fr_1fr] items-center gap-[5%]">
        <div className="space-y-2.5">
          <div className="h-3.5 w-[90%] rounded-full bg-white/30" />
          <div className="h-3.5 w-[65%] rounded-full bg-white/30" />
          <div className={clsx("h-2 w-[80%]", line)} />
          <div className={clsx("h-2 w-[70%]", line)} />
          <div className="flex gap-2 pt-2">
            <div className={clsx("h-6 w-16", grad, "rounded-full")} />
            <div className="h-6 w-14 rounded-full border border-line-strong" />
          </div>
        </div>
        <div className={clsx("relative h-full overflow-hidden rounded-xl", grad)}>
          <div className="absolute inset-[12%] rounded-lg bg-black/25" />
          <div className="absolute bottom-[14%] left-[14%] h-[28%] w-[45%] rounded-md bg-white/30" />
        </div>
      </div>
      <div className="grid grid-cols-3 gap-[3%]">
        {[0, 1, 2].map((i) => (
          <div key={i} className="h-5 rounded-md bg-white/[0.07]" />
        ))}
      </div>
    </div>
  );
}

function Dashboard() {
  return (
    <div className="grid h-full grid-cols-[16%_1fr] gap-[3%]">
      <div className="flex flex-col gap-2 rounded-lg bg-white/[0.05] p-2">
        <div className={clsx("h-3 w-3/4 rounded-md", grad)} />
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className={clsx("h-1.5", line, i === 0 && "bg-white/40")} />
        ))}
      </div>
      <div className="flex flex-col gap-[4%]">
        <div className="grid grid-cols-3 gap-[3%]">
          {[0, 1, 2].map((i) => (
            <div key={i} className="space-y-1.5 rounded-lg bg-white/[0.06] p-2">
              <div className={clsx("h-1.5 w-1/2", line)} />
              <div className={clsx("h-3 w-3/4 rounded-md", i === 0 ? grad : "bg-white/30")} />
            </div>
          ))}
        </div>
        <div className="relative flex-1 overflow-hidden rounded-lg bg-white/[0.06] p-2">
          <svg viewBox="0 0 200 70" preserveAspectRatio="none" className="h-full w-full">
            <defs>
              <linearGradient id="area" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="var(--a)" stopOpacity="0.5" />
                <stop offset="1" stopColor="var(--a)" stopOpacity="0" />
              </linearGradient>
            </defs>
            <path d="M0 55 C20 50 30 20 55 28 S95 55 120 30 S165 8 200 14 V70 H0Z" fill="url(#area)" />
            <path
              d="M0 55 C20 50 30 20 55 28 S95 55 120 30 S165 8 200 14"
              fill="none"
              stroke="var(--b)"
              strokeWidth="1.8"
              vectorEffect="non-scaling-stroke"
            />
          </svg>
        </div>
      </div>
    </div>
  );
}

function ChatApp() {
  return (
    <div className="flex h-full flex-col gap-[4%]">
      <div className="flex items-center gap-2">
        <div className={clsx("h-5 w-5 rounded-full", grad)} />
        <div className={clsx("h-2 w-20", line)} />
      </div>
      <div className="flex flex-1 flex-col justify-end gap-2">
        <div className="max-w-[60%] space-y-1.5 rounded-xl rounded-bl-sm bg-white/[0.09] p-2.5">
          <div className={clsx("h-1.5 w-full", line)} />
          <div className={clsx("h-1.5 w-2/3", line)} />
        </div>
        <div className={clsx("ml-auto max-w-[48%] space-y-1.5 rounded-xl rounded-br-sm p-2.5", grad)}>
          <div className="h-1.5 w-full rounded-full bg-black/40" />
        </div>
        <div className="max-w-[68%] space-y-1.5 rounded-xl rounded-bl-sm bg-white/[0.09] p-2.5">
          <div className={clsx("h-1.5 w-full", line)} />
          <div className={clsx("h-1.5 w-5/6", line)} />
          <div className={clsx("h-1.5 w-1/2", line)} />
        </div>
      </div>
      <div className="flex items-center gap-2 rounded-full border border-line-strong px-3 py-2">
        <div className={clsx("h-1.5 flex-1", line)} />
        <div className={clsx("h-4 w-4 rounded-full", grad)} />
      </div>
    </div>
  );
}
