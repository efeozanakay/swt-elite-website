import type { SceneKind, SceneTone } from "@/lib/b2c/scenes";

/**
 * Illustrated destination artwork, drawn in code.
 *
 * The consumer pages need destination imagery the company does not own
 * yet, and reference or stock photography found online is not licensed
 * for this site. Rather than ship grey boxes or borrow photographs, each
 * destination and demo experience gets a flat, poster-style landscape in
 * the brand palette. Compositions are generated from a seed, so they are
 * deterministic (identical on server and client) and cost no network
 * requests.
 *
 * Swap for licensed photography by replacing this component's call sites
 * with <Photo>; the containers already fix the aspect ratio.
 */

const W = 800;
const H = 600;

type Palette = {
  sky: [string, string, string];
  sun: string;
  far: string;
  mid: string;
  near: string;
  sea: [string, string];
  ink: string;
  glint: string;
};

const PALETTES: Record<SceneTone, Palette> = {
  dawn: {
    sky: ["#E9DCC6", "#F1C79A", "#F6A86A"],
    sun: "#FFF1D6",
    far: "#C9A88C",
    mid: "#A27F68",
    near: "#5D4638",
    sea: ["#B58E7A", "#5E4A4A"],
    ink: "#2B211C",
    glint: "#FFE3B8",
  },
  day: {
    sky: ["#4E6E9F", "#9DB5D2", "#E6E7DF"],
    sun: "#FFF6E2",
    far: "#8EA2BC",
    mid: "#5F7695",
    near: "#2F4560",
    sea: ["#2E5C8C", "#173352"],
    ink: "#152234",
    glint: "#E9F1F8",
  },
  dusk: {
    sky: ["#1D1B15", "#7A3E26", "#F2A04A"],
    sun: "#FFD27A",
    far: "#7B4A36",
    mid: "#4C2E25",
    near: "#2A1C17",
    sea: ["#5A3528", "#1D1612"],
    ink: "#120D0B",
    glint: "#FFC56B",
  },
  night: {
    sky: ["#0B1020", "#1F3A5C", "#3C5A7E"],
    sun: "#F5F0E4",
    far: "#2B4262",
    mid: "#1C2E47",
    near: "#101B2B",
    sea: ["#1A2C45", "#0A1220"],
    ink: "#070B13",
    glint: "#FAA529",
  },
};

/** mulberry32: tiny, seedable, and stable across engines. */
function rng(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const r1 = (n: number) => Math.round(n * 10) / 10;

/** Midpoint-displacement ridge, closed to the bottom of the frame. */
function ridge(
  rand: () => number,
  base: number,
  amp: number,
  rough = 0.55,
  depth = 6,
  bottom = H
) {
  let pts: [number, number][] = [
    [-20, base - rand() * amp],
    [W + 20, base - rand() * amp],
  ];
  let disp = amp;
  for (let d = 0; d < depth; d++) {
    const next: [number, number][] = [];
    for (let i = 0; i < pts.length - 1; i++) {
      const [x1, y1] = pts[i];
      const [x2, y2] = pts[i + 1];
      next.push(pts[i], [(x1 + x2) / 2, (y1 + y2) / 2 + (rand() - 0.5) * disp]);
    }
    next.push(pts[pts.length - 1]);
    pts = next;
    disp *= rough;
  }
  return (
    `M-20,${bottom} ` +
    pts.map(([x, y]) => `L${r1(x)},${r1(Math.min(y, bottom))}`).join(" ") +
    ` L${W + 20},${bottom} Z`
  );
}

function Pine({ x, y, s, fill }: { x: number; y: number; s: number; fill: string }) {
  // Mediterranean stone pine: a bare trunk under a flat, wide crown.
  return (
    <g fill={fill}>
      <path d={`M${x - 2 * s},${y} L${x - 1 * s},${y - 46 * s} L${x + 1.5 * s},${y - 46 * s} L${x + 2.5 * s},${y} Z`} />
      <ellipse cx={x} cy={y - 50 * s} rx={30 * s} ry={9 * s} />
      <ellipse cx={x - 12 * s} cy={y - 56 * s} rx={16 * s} ry={7 * s} />
      <ellipse cx={x + 10 * s} cy={y - 57 * s} rx={18 * s} ry={7 * s} />
    </g>
  );
}

function Cypress({ x, y, s, fill }: { x: number; y: number; s: number; fill: string }) {
  return <path fill={fill} d={`M${x},${y - 90 * s} C${x + 9 * s},${y - 60 * s} ${x + 9 * s},${y - 10 * s} ${x + 3 * s},${y} L${x - 3 * s},${y} C${x - 9 * s},${y - 10 * s} ${x - 9 * s},${y - 60 * s} ${x},${y - 90 * s} Z`} />;
}

function Gulet({ x, y, s, p }: { x: number; y: number; s: number; p: Palette }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path fill={p.ink} d="M-120,0 L130,0 Q118,26 92,32 L-96,32 Q-114,22 -120,0 Z" />
      <rect x={-60} y={-14} width={92} height={14} fill={p.ink} />
      <path stroke={p.ink} strokeWidth={3} d="M-40,-14 L-40,-150 M40,-14 L40,-118 M-40,-150 L-128,0 M40,-118 L130,0" fill="none" />
      <path fill={p.glint} opacity={0.75} d="M-36,-140 L-36,-22 L28,-22 Z" />
      <path fill={p.glint} opacity={0.55} d="M44,-108 L44,-22 L96,-22 Z" />
      <rect x={-96} y={36} width={188} height={3} fill={p.glint} opacity={0.25} />
      <rect x={-70} y={46} width={130} height={2} fill={p.glint} opacity={0.18} />
    </g>
  );
}

function SeaGlints({ cx, top, p, seed }: { cx: number; top: number; p: Palette; seed: number }) {
  const rand = rng(seed);
  return (
    <g fill={p.glint}>
      {Array.from({ length: 14 }, (_, i) => {
        const y = top + 8 + i * 14 + i * i * 0.6;
        const w = 30 + rand() * 90 + i * 6;
        return <rect key={i} x={r1(cx - w / 2 + (rand() - 0.5) * 40)} y={r1(y)} width={r1(w)} height={i < 5 ? 2 : 3} opacity={0.5 - i * 0.025} />;
      })}
    </g>
  );
}

function Columns({ x, base, p, seed, count = 6 }: { x: number; base: number; p: Palette; seed: number; count?: number }) {
  const rand = rng(seed);
  const gap = 46;
  const h = 210;
  const standing = Array.from({ length: count }, () => rand() > 0.25);
  return (
    <g fill={p.ink}>
      {standing.map((full, i) => {
        const cx = x + i * gap;
        const ch = full ? h : 40 + rand() * 90;
        return (
          <g key={i}>
            <rect x={cx - 11} y={base - ch} width={22} height={ch} />
            {full && <rect x={cx - 16} y={base - ch - 10} width={32} height={10} />}
          </g>
        );
      })}
      {/* entablature over the first run of standing columns */}
      <rect x={x - 18} y={base - h - 30} width={gap * 3 + 36} height={20} />
      <rect x={x - 26} y={base} width={gap * (count - 1) + 52} height={14} />
      <rect x={x - 40} y={base + 14} width={gap * (count - 1) + 80} height={10} />
    </g>
  );
}

function Skyline({ base, p, seed }: { base: number; p: Palette; seed: number }) {
  const rand = rng(seed);
  const shapes: JSX.Element[] = [];
  let x = 40;
  let i = 0;
  while (x < W - 40) {
    const w = 34 + rand() * 40;
    const h = 40 + rand() * 60;
    shapes.push(
      <g key={i++}>
        <rect x={r1(x)} y={r1(base - h)} width={r1(w)} height={r1(h)} />
        <path d={`M${r1(x - 4)},${r1(base - h)} L${r1(x + w / 2)},${r1(base - h - 16)} L${r1(x + w + 4)},${r1(base - h)} Z`} />
        {rand() > 0.4 && <rect x={r1(x + w / 2 - 4)} y={r1(base - h + 14)} width={8} height={12} fill={p.glint} opacity={0.6} />}
      </g>
    );
    x += w + 4;
  }
  return (
    <g fill={p.ink}>
      {/* minaret */}
      <rect x={300} y={base - 230} width={14} height={230} />
      <rect x={294} y={base - 170} width={26} height={8} />
      <path d={`M300,${base - 230} L307,${base - 280} L314,${base - 230} Z`} />
      {/* dome */}
      <path d={`M200,${base - 90} A62,62 0 0 1 324,${base - 90} Z`} />
      <rect x={196} y={base - 92} width={132} height={92} />
      {/* clock tower */}
      <rect x={560} y={base - 170} width={34} height={170} />
      <path d={`M556,${base - 170} L577,${base - 200} L598,${base - 170} Z`} />
      <circle cx={577} cy={base - 140} r={8} fill={p.glint} opacity={0.7} />
      {shapes}
    </g>
  );
}

function Chimneys({ base, p, seed }: { base: number; p: Palette; seed: number }) {
  const rand = rng(seed);
  const items = Array.from({ length: 9 }, (_, i) => ({
    x: 30 + i * 92 + (rand() - 0.5) * 40,
    h: 110 + rand() * 150,
    w: 34 + rand() * 26,
  }));
  return (
    <g>
      {items.map((c, i) => (
        <g key={i} fill={p.near}>
          <path d={`M${r1(c.x - c.w)},${base} C${r1(c.x - c.w * 0.5)},${r1(base - c.h * 0.4)} ${r1(c.x - c.w * 0.32)},${r1(base - c.h * 0.8)} ${r1(c.x - c.w * 0.25)},${r1(base - c.h)} L${r1(c.x + c.w * 0.25)},${r1(base - c.h)} C${r1(c.x + c.w * 0.32)},${r1(base - c.h * 0.8)} ${r1(c.x + c.w * 0.5)},${r1(base - c.h * 0.4)} ${r1(c.x + c.w)},${base} Z`} />
          <ellipse cx={r1(c.x)} cy={r1(base - c.h - 6)} rx={r1(c.w * 0.42)} ry={9} fill={p.ink} />
        </g>
      ))}
    </g>
  );
}

function Balloons({ p, seed }: { p: Palette; seed: number }) {
  const rand = rng(seed);
  const colours = ["#FAA529", "#5175BA", "#F5F0E4", "#D2601F", "#0B4E9D"];
  return (
    <g>
      {Array.from({ length: 7 }, (_, i) => {
        const s = 0.35 + rand() * 0.75;
        const x = 60 + rand() * 680;
        const y = 60 + rand() * 200;
        return (
          <g key={i} transform={`translate(${r1(x)} ${r1(y)}) scale(${r1(s * 10) / 10})`} opacity={0.6 + s * 0.4}>
            <path fill={colours[i % colours.length]} d="M0,-40 C26,-40 34,-18 30,0 C26,16 12,26 6,34 L-6,34 C-12,26 -26,16 -30,0 C-34,-18 -26,-40 0,-40 Z" />
            <path fill={p.ink} opacity={0.18} d="M0,-40 C10,-30 12,10 6,34 L0,34 Z" />
            <rect x={-5} y={40} width={10} height={8} fill={p.ink} />
            <path stroke={p.ink} strokeWidth={1} d="M-6,34 L-4,40 M6,34 L4,40" />
          </g>
        );
      })}
    </g>
  );
}

function Terminal({ base, p }: { base: number; p: Palette }) {
  return (
    <g>
      <path fill={p.near} d={`M60,${base} L60,${base - 90} Q400,${base - 150} 740,${base - 90} L740,${base} Z`} />
      {Array.from({ length: 16 }, (_, i) => (
        <rect key={i} x={84 + i * 40} y={base - 80} width={26} height={60} fill={p.glint} opacity={0.35 + (i % 3) * 0.12} />
      ))}
      <rect x={640} y={base - 210} width={20} height={130} fill={p.near} />
      <rect x={622} y={base - 236} width={56} height={30} fill={p.near} />
      <rect x={628} y={base - 228} width={44} height={12} fill={p.glint} opacity={0.6} />
      {/* aircraft */}
      <g transform="translate(200 150) rotate(-8)" fill={p.ink}>
        <rect x={-60} y={-6} width={120} height={12} rx={6} />
        <path d="M-10,0 L-40,-40 L-26,-40 L20,0 Z M-10,0 L-40,40 L-26,40 L20,0 Z M-52,0 L-64,-20 L-56,-20 L-44,0 Z" />
      </g>
    </g>
  );
}

export function SceneArt({
  kind,
  tone = "day",
  seed = 1,
  label,
  className = "",
}: {
  kind: SceneKind;
  tone?: SceneTone;
  seed?: number;
  /** Accessible description. Omit for purely decorative use. */
  label?: string;
  className?: string;
}) {
  const p = PALETTES[tone];
  const rand = rng(seed * 9973 + kind.length);
  const id = `sc-${kind}-${tone}-${seed}`;

  const horizon =
    kind === "boat" ? 330 : kind === "valley" || kind === "canyon" ? 420 : kind === "mountains" ? 430 : 370;
  const hasSea = ["coast", "boat", "ruins", "oldtown"].includes(kind);
  const sunX = 220 + rand() * 360;
  const sunY = tone === "day" ? 120 + rand() * 40 : horizon - 70 - rand() * 60;

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="xMidYMid slice"
      className={`block h-full w-full ${className}`}
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      focusable="false"
    >
      <defs>
        <linearGradient id={`${id}-sky`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={p.sky[0]} />
          <stop offset="0.55" stopColor={p.sky[1]} />
          <stop offset="1" stopColor={p.sky[2]} />
        </linearGradient>
        <linearGradient id={`${id}-sea`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={p.sea[0]} />
          <stop offset="1" stopColor={p.sea[1]} />
        </linearGradient>
        <radialGradient id={`${id}-glow`}>
          <stop offset="0" stopColor={p.sun} stopOpacity="0.85" />
          <stop offset="1" stopColor={p.sun} stopOpacity="0" />
        </radialGradient>
      </defs>

      <rect width={W} height={H} fill={`url(#${id}-sky)`} />
      <circle cx={r1(sunX)} cy={r1(sunY)} r={170} fill={`url(#${id}-glow)`} />
      <circle cx={r1(sunX)} cy={r1(sunY)} r={tone === "day" ? 34 : 46} fill={p.sun} />
      {tone === "night" &&
        Array.from({ length: 40 }, (_, i) => (
          <circle key={i} cx={r1(rand() * W)} cy={r1(rand() * horizon * 0.7)} r={rand() * 1.4 + 0.3} fill="#F5F0E4" opacity={0.7} />
        ))}

      {kind === "valley" && <Balloons p={p} seed={seed * 31 + 1} />}

      {/* far and middle ranges */}
      <path d={ridge(rand, horizon - 40, kind === "mountains" ? 260 : 120, 0.55, 6, hasSea ? horizon + 2 : H)} fill={p.far} />
      {!hasSea && <path d={ridge(rand, horizon + 10, kind === "mountains" ? 160 : 80, 0.5, 6)} fill={p.mid} />}

      {hasSea && (
        <>
          <path d={ridge(rand, horizon - 4, 60, 0.5, 6, horizon + 2)} fill={p.mid} />
          <rect y={horizon} width={W} height={H - horizon} fill={`url(#${id}-sea)`} />
          <SeaGlints cx={sunX} top={horizon} p={p} seed={seed * 31 + 2} />
        </>
      )}

      {kind === "coast" && (
        <>
          <path fill={p.near} d={`M-20,${H} L-20,${horizon - 70} C120,${horizon - 90} 200,${horizon - 20} 300,${horizon + 60} C340,${horizon + 100} 380,${H - 60} 420,${H} Z`} />
          <Pine x={110} y={horizon - 64} s={2.1} fill={p.ink} />
          <Pine x={236} y={horizon - 12} s={1.5} fill={p.ink} />
          <Cypress x={36} y={horizon - 70} s={1.2} fill={p.ink} />
        </>
      )}

      {kind === "boat" && <Gulet x={480} y={horizon + 130} s={1.2} p={p} />}

      {kind === "ruins" && (
        <>
          <path fill={p.near} d={`M-20,${H} L-20,${horizon + 90} C200,${horizon + 70} 600,${horizon + 80} 820,${horizon + 110} L820,${H} Z`} />
          <Columns x={150} base={horizon + 96} p={p} seed={seed * 31 + 3} />
          <Cypress x={640} y={horizon + 100} s={1.6} fill={p.ink} />
          <Cypress x={690} y={horizon + 104} s={1.2} fill={p.ink} />
        </>
      )}

      {kind === "oldtown" && (
        <>
          <Skyline base={horizon + 20} p={p} seed={seed * 31 + 4} />
          <rect y={horizon + 20} width={W} height={14} fill={p.ink} />
          <Gulet x={620} y={horizon + 120} s={0.5} p={p} />
        </>
      )}

      {kind === "mountains" && (
        <>
          <path d={ridge(rand, horizon + 90, 70, 0.5, 6)} fill={p.near} />
          <path stroke={p.glint} strokeWidth={4} fill="none" opacity={0.6} d={`M520,${H} C420,${H - 60} 640,${horizon + 70} 480,${horizon + 40} S380,${horizon - 10} 430,${horizon - 40}`} />
          <Pine x={110} y={H - 40} s={1.5} fill={p.ink} />
          <Cypress x={720} y={H - 30} s={1.8} fill={p.ink} />
        </>
      )}

      {kind === "valley" && (
        <>
          <Chimneys base={H - 60} p={p} seed={seed * 31 + 5} />
          <rect y={H - 62} width={W} height={62} fill={p.ink} />
        </>
      )}

      {kind === "canyon" && (
        <>
          <path fill={p.near} d={`M-20,${H} L-20,80 C120,140 180,300 330,${H} Z`} />
          <path fill={p.near} d={`M820,${H} L820,60 C660,160 620,320 470,${H} Z`} />
          <path fill={p.glint} opacity={0.55} d={`M330,${H} C360,${H - 80} 420,${horizon + 60} 400,${horizon + 10} L412,${horizon + 10} C440,${horizon + 60} 430,${H - 80} 470,${H} Z`} />
          <Pine x={70} y={150} s={0.8} fill={p.ink} />
          <Pine x={740} y={140} s={0.9} fill={p.ink} />
        </>
      )}

      {kind === "waterfall" && (
        <>
          <path fill={p.near} d={`M-20,${H} L-20,250 L820,230 L820,${H} Z`} />
          {Array.from({ length: 12 }, (_, i) => (
            <rect key={i} x={300 + i * 16} y={240} width={8 + (i % 3) * 2} height={H - 300} fill={p.glint} opacity={0.45 + (i % 4) * 0.12} />
          ))}
          <rect y={H - 70} width={W} height={70} fill={`url(#${id}-sea)`} />
          <ellipse cx={400} cy={H - 70} rx={200} ry={20} fill={p.glint} opacity={0.5} />
          <Pine x={120} y={250} s={1.2} fill={p.ink} />
          <Pine x={660} y={232} s={1} fill={p.ink} />
        </>
      )}

      {kind === "airport" && <Terminal base={H - 120} p={p} />}
    </svg>
  );
}
