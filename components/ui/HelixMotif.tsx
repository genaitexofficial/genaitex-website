import { clsx } from "clsx";

/**
 * A decorative DNA double helix in plain SVG (no JavaScript, no canvas), used to carry the stage's
 * genetics theme onto the inner pages. Two beaded strands with dotted base-pair rungs.
 */
function build() {
  const H = 640;
  const cx = 110;
  const amp = 64;
  const turns = 3.4;
  const n = 120;
  const point = (i: number, phase: number): [number, number] => {
    const t = i / n;
    return [cx + amp * Math.sin(t * turns * 2 * Math.PI + phase), t * H];
  };
  const beads: { x: number; y: number; z: number }[] = [];
  const rungs: { x1: number; y1: number; x2: number; y2: number }[] = [];
  for (let i = 0; i <= n; i++) {
    const [ax, ay] = point(i, 0);
    const [bx, by] = point(i, Math.PI);
    // depth from the sine's derivative: the strand heading toward the viewer is drawn larger
    const depth = Math.cos((i / n) * turns * 2 * Math.PI);
    beads.push({ x: ax, y: ay, z: depth }, { x: bx, y: by, z: -depth });
    if (i % 4 === 0) rungs.push({ x1: ax, y1: ay, x2: bx, y2: by });
  }
  beads.sort((p, q) => p.z - q.z);
  return { beads, rungs, H };
}

const { beads, rungs, H } = build();

export function HelixMotif({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden
      viewBox={`0 0 220 ${H}`}
      className={clsx(
        "pointer-events-none [mask-image:linear-gradient(to_bottom,transparent,#000_18%,#000_82%,transparent)]",
        className,
      )}
    >
      <defs>
        <linearGradient id="helix-rung" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#22d3ee" />
          <stop offset="1" stopColor="#a78bfa" />
        </linearGradient>
      </defs>
      {rungs.map((r, i) => (
        <line
          key={i}
          x1={r.x1}
          y1={r.y1}
          x2={r.x2}
          y2={r.y2}
          stroke="url(#helix-rung)"
          strokeWidth="2.2"
          strokeDasharray="1 7"
          strokeLinecap="round"
          opacity="0.9"
        />
      ))}
      {beads.map((b, i) => (
        <circle
          key={i}
          cx={b.x}
          cy={b.y}
          r={3.4 + b.z * 1.4}
          fill="#2b6fe0"
          opacity={0.45 + (b.z + 1) * 0.25}
        />
      ))}
    </svg>
  );
}
