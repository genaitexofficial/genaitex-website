import { BASE_SHADE, FINISHES, type Finish, type FinishWeights } from "@/lib/finishes";

/**
 * Procedural bead finishes for the desktop themes: each is a lit sphere painted onto a canvas, once per
 * finish and theme. The WebGL renderer uses them as matcaps (so every bead gets the same lighting for free),
 * and the 2D renderer cuts them into sprites. `body` is the backbone; `bead` is a touch lighter (Night) or
 * darker (Day) so the little base-pair beads stay readable against the page.
 */
export type Role = "body" | "bead";
type Ctx = CanvasRenderingContext2D;

const TAU = Math.PI * 2;

function makeCanvas(size: number) {
  const c = document.createElement("canvas");
  c.width = c.height = size;
  return c;
}

const stops = (g: CanvasGradient, list: readonly (readonly [number, string])[]) => {
  list.forEach(([at, color]) => g.addColorStop(at, color));
  return g;
};

/** A radial gradient whose bright end sits at (x, y) (fractions of the size) and spreads to the sphere's edge. */
function lit(g: Ctx, s: number, x: number, y: number, list: readonly (readonly [number, string])[]) {
  const grad = g.createRadialGradient(x * s, y * s, 0, s / 2, s / 2, s / 2);
  return stops(grad, list);
}

/** A soft round highlight (white, fading out). */
function glint(g: Ctx, s: number, x: number, y: number, r: number, alpha: number) {
  const grad = g.createRadialGradient(x * s, y * s, 0, x * s, y * s, r * s);
  stops(grad, [
    [0, `rgba(255,255,255,${alpha})`],
    [0.45, `rgba(255,255,255,${alpha * 0.45})`],
    [1, "rgba(255,255,255,0)"],
  ]);
  g.fillStyle = grad;
  g.fillRect(0, 0, s, s);
}

/** Darken toward the edge so the sphere reads as round against any page colour. */
function edge(g: Ctx, s: number, from: number, rgb: string, alpha: number) {
  const grad = g.createRadialGradient(s / 2, s / 2, (s / 2) * from, s / 2, s / 2, s / 2);
  stops(grad, [
    [0, `rgba(${rgb},0)`],
    [1, `rgba(${rgb},${alpha})`],
  ]);
  g.fillStyle = grad;
  g.fillRect(0, 0, s, s);
}

/** Polished silver chrome: a bright studio sky, a crisp dark horizon, a lighter floor, and a hard highlight. */
function chrome(g: Ctx, s: number, night: boolean) {
  const sky = g.createLinearGradient(s * 0.25, 0, s * 0.75, s);
  stops(
    sky,
    night
      ? [
          [0, "#f9fafb"],
          [0.34, "#c3c8cf"],
          [0.47, "#2f3237"],
          [0.52, "#121315"],
          [0.6, "#79808a"],
          [1, "#e6e9ed"],
        ]
      : [
          [0, "#fdfdfd"],
          [0.34, "#b3b9c1"],
          [0.47, "#41454b"],
          [0.52, "#232529"],
          [0.6, "#8b919a"],
          [1, "#d6dadf"],
        ],
  );
  g.fillStyle = sky;
  g.fillRect(0, 0, s, s);
  edge(g, s, 0.58, night ? "0,0,0" : "24,26,30", night ? 0.5 : 0.46);
  glint(g, s, 0.33, 0.27, 0.17, 0.98);
  glint(g, s, 0.7, 0.76, 0.13, 0.28);
}

/** Frosted pearl: soft, milky and diffuse, with a faint warm and cool sheen and no hard reflections. */
function pearl(g: Ctx, s: number, night: boolean) {
  g.fillStyle = lit(
    g,
    s,
    0.36,
    0.3,
    night
      ? [
          [0, "#ffffff"],
          [0.2, "#f6f3ee"],
          [0.5, "#d3cec7"],
          [0.8, "#97938e"],
          [1, "#5b5a58"],
        ]
      : [
          [0, "#ffffff"],
          [0.2, "#fbf9f5"],
          [0.5, "#e1ddd6"],
          [0.8, "#b0aca6"],
          [1, "#7b7874"],
        ],
  );
  g.fillRect(0, 0, s, s);
  // pearlescent sheen: a hint of champagne top right, cool silver bottom left, a bounce of light low right
  const warm = g.createRadialGradient(s * 0.72, s * 0.3, 0, s * 0.72, s * 0.3, s * 0.3);
  stops(warm, [
    [0, "rgba(255,226,200,0.2)"],
    [1, "rgba(255,226,200,0)"],
  ]);
  g.fillStyle = warm;
  g.fillRect(0, 0, s, s);
  const cool = g.createRadialGradient(s * 0.3, s * 0.74, 0, s * 0.3, s * 0.74, s * 0.34);
  stops(cool, [
    [0, "rgba(214,224,236,0.22)"],
    [1, "rgba(214,224,236,0)"],
  ]);
  g.fillStyle = cool;
  g.fillRect(0, 0, s, s);
  glint(g, s, 0.68, 0.76, 0.2, 0.3);
  glint(g, s, 0.34, 0.28, 0.22, 0.75);
}

/** Gunmetal: near-black steel with a silver rim light and a sharp, small highlight. */
function gunmetal(g: Ctx, s: number, night: boolean) {
  g.fillStyle = lit(
    g,
    s,
    0.35,
    0.3,
    night
      ? [
          [0, "#a3a9b2"],
          [0.1, "#70767f"],
          [0.3, "#40444b"],
          [0.62, "#1f2125"],
          [1, "#0b0c0e"],
        ]
      : [
          [0, "#b3b8c0"],
          [0.1, "#7a7f88"],
          [0.3, "#45494f"],
          [0.62, "#24262a"],
          [1, "#111214"],
        ],
  );
  g.fillRect(0, 0, s, s);
  // silver rim light along the lower right edge
  const rim = g.createLinearGradient(s * 0.95, s * 0.95, s * 0.35, s * 0.35);
  stops(rim, [
    [0, night ? "rgba(232,235,240,0.9)" : "rgba(222,226,232,0.75)"],
    [0.55, "rgba(232,235,240,0)"],
  ]);
  g.strokeStyle = rim;
  g.lineWidth = s * 0.06;
  g.beginPath();
  g.arc(s / 2, s / 2, s * 0.47, 0, TAU);
  g.stroke();
  glint(g, s, 0.33, 0.27, 0.24, 0.32);
  glint(g, s, 0.33, 0.27, 0.085, 1);
}

const DRAW: Record<Finish, (g: Ctx, s: number, night: boolean) => void> = { chrome, pearl, gunmetal };

/** The full square a matcap texture needs: the sphere fills the disc, and the corners repeat its edge colour. */
export function drawMatcap(finish: Finish, night: boolean, role: Role, size: number) {
  const c = makeCanvas(size);
  const g = c.getContext("2d")!;
  g.save();
  g.beginPath();
  g.arc(size / 2, size / 2, size / 2, 0, TAU);
  g.clip();
  DRAW[finish](g, size, night);
  if (role === "bead") {
    g.globalCompositeOperation = night ? "screen" : "multiply";
    g.fillStyle = night ? "rgba(255,255,255,0.2)" : "#c9cacd";
    g.fillRect(0, 0, size, size);
  }
  g.restore();
  // fill the corners with the colour at the edge of the disc, so a sample past it is never transparent
  const edgePixel = g.getImageData(Math.round(size * 0.5), size - 2, 1, 1).data;
  g.globalCompositeOperation = "destination-over";
  g.fillStyle = `rgb(${edgePixel[0]},${edgePixel[1]},${edgePixel[2]})`;
  g.fillRect(0, 0, size, size);
  return c;
}

/**
 * A soft sprite of one bead for the 2D renderer: `kind` 0 is a backbone bead, 1..4 a base (A, T, G, C), which
 * differ in lightness only.
 */
export function drawSprite(finish: Finish, night: boolean, kind: number, size: number) {
  const matcap = drawMatcap(finish, night, kind === 0 ? "body" : "bead", size);
  const c = makeCanvas(size);
  const g = c.getContext("2d")!;
  g.drawImage(matcap, 0, 0);
  if (kind > 0) {
    g.globalCompositeOperation = "source-atop";
    g.fillStyle = `rgba(0,0,0,${1 - BASE_SHADE[kind - 1]})`;
    g.fillRect(0, 0, size, size);
  }
  // feather the rim so beads overlap softly
  g.globalCompositeOperation = "destination-in";
  const mask = g.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  stops(mask, [
    [0, "#000"],
    [0.86, "#000"],
    [1, "rgba(0,0,0,0)"],
  ]);
  g.fillStyle = mask;
  g.fillRect(0, 0, size, size);
  return c;
}

/**
 * The three finishes painted into one canvas in proportion to their weights, for the WebGL matcap texture:
 * the beads morph from one finish to the next as the weights move.
 */
export class MatcapBlend {
  readonly canvas = makeCanvas(128);
  private readonly ctx = this.canvas.getContext("2d")!;
  private readonly layers: HTMLCanvasElement[];
  private readonly applied: FinishWeights = [-1, -1, -1];
  /** Called after every repaint (the WebGL side marks its texture for upload). */
  onChange: (() => void) | null = null;

  constructor(night: boolean, role: Role) {
    this.layers = FINISHES.map((f) => drawMatcap(f, night, role, 128));
    this.update([1, 0, 0]);
  }

  /** Repaint for these weights if they moved. */
  update(w: Readonly<FinishWeights>) {
    if (w.every((v, i) => Math.abs(v - this.applied[i]) < 0.002)) return;
    const g = this.ctx;
    g.clearRect(0, 0, 128, 128);
    let total = 0;
    w.forEach((v, i) => {
      this.applied[i] = v;
      if (v < 0.004) return;
      total += v;
      g.globalAlpha = v / total; // painting each layer over the last at this share is an exact weighted mix
      g.drawImage(this.layers[i], 0, 0);
    });
    g.globalAlpha = 1;
    this.onChange?.();
  }
}
