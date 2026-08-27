import { Reveal } from "@/components/Reveal";

const HUB = { name: "Antalya", x: 480, y: 230 };

const SPOKES = [
  { name: "Istanbul", x: 160, y: 70, anchor: "middle", dx: 0, dy: -16 },
  { name: "Izmir", x: 90, y: 230, anchor: "end", dx: -14, dy: 4 },
  { name: "Bodrum", x: 150, y: 370, anchor: "middle", dx: 0, dy: 22 },
  { name: "Dalaman", x: 360, y: 390, anchor: "middle", dx: 0, dy: 22 },
  { name: "Cappadocia", x: 800, y: 140, anchor: "start", dx: 14, dy: 4 },
] as const;

const CITIES = [
  { name: "Antalya", region: "Mediterranean Coast — Base" },
  { name: "Istanbul", region: "Marmara" },
  { name: "Izmir", region: "Aegean" },
  { name: "Bodrum", region: "Aegean Coast" },
  { name: "Dalaman", region: "Aegean Coast" },
  { name: "Cappadocia", region: "Central Anatolia" },
];

export function Coverage() {
  return (
    <section id="coverage" className="bg-ivory py-28 sm:py-36">
      <div className="edge wrap">
        <Reveal className="max-w-2xl">
          <p className="eyebrow mb-6">Coverage</p>
          <h2 className="font-display text-display text-ink">
            One Partner. Across Türkiye.
          </h2>
        </Reveal>

        {/* Abstract operational network — a hub-and-spoke schematic
            centred on the Antalya base, not a geographic map. Node
            positions are illustrative only; see dev note below. */}
        <Reveal delay={80} className="mt-16 hidden sm:block">
          <svg
            viewBox="0 0 960 420"
            className="h-auto w-full text-graphite"
            role="img"
            aria-label="Schematic operational network centred on the Antalya base, connecting to Istanbul, Izmir, Bodrum, Dalaman and Cappadocia"
          >
            <circle
              cx={HUB.x}
              cy={HUB.y}
              r={70}
              className="fill-none stroke-graphite/10"
            />
            <circle
              cx={HUB.x}
              cy={HUB.y}
              r={140}
              className="fill-none stroke-graphite/10"
            />

            {SPOKES.map((s) => (
              <line
                key={s.name}
                x1={HUB.x}
                y1={HUB.y}
                x2={s.x}
                y2={s.y}
                className="stroke-graphite/25"
                strokeWidth={1}
              />
            ))}

            {SPOKES.map((s) => (
              <g key={s.name}>
                <circle
                  cx={s.x}
                  cy={s.y}
                  r={4}
                  className="fill-ivory stroke-ink"
                  strokeWidth={1}
                />
                <text
                  x={s.x + s.dx}
                  y={s.y + s.dy}
                  textAnchor={s.anchor}
                  className="fill-ink font-sans text-[13px] uppercase tracking-[0.08em]"
                >
                  {s.name}
                </text>
              </g>
            ))}

            <rect
              x={HUB.x - 5}
              y={HUB.y - 5}
              width={10}
              height={10}
              className="fill-swt-orange"
            />
            <text
              x={HUB.x}
              y={HUB.y + 28}
              textAnchor="middle"
              className="fill-ink font-sans text-[13px] font-medium uppercase tracking-[0.1em]"
            >
              {HUB.name} — Base
            </text>
          </svg>
        </Reveal>

        <Reveal delay={120}>
          <dl className="mt-16 grid grid-cols-2 gap-x-8 gap-y-10 border-t border-graphite/20 pt-10 sm:mt-10 sm:grid-cols-3 lg:grid-cols-6">
            {CITIES.map((city) => (
              <div key={city.name}>
                <dt className="font-display text-display-sm text-ink">
                  {city.name}
                </dt>
                <dd className="mt-2 font-sans text-small uppercase tracking-[0.08em] text-graphite">
                  {city.region}
                </dd>
              </div>
            ))}
          </dl>
          <p className="mt-10 max-w-lg font-sans text-small italic text-graphite/70">
            Operational network shown schematically relative to our Antalya base.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
