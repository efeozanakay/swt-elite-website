import { Photo } from "@/components/Photo";
import { Reveal } from "@/components/Reveal";

const CAPABILITIES = [
  "Real-time coordination",
  "Flight monitoring",
  "Vehicle dispatch",
  "Guest assistance",
  "Rapid issue resolution",
];

export function OperationsCentre() {
  return (
    <section className="on-dark bg-charcoal py-28 md:py-32 lg:py-36">
      {/* full-bleed immersive panel, text anchored top-left — deliberately
          distinct from Capability 03's bottom-left overlay and Fleet's
          text-free band, so the three cinematic moments don't repeat. */}
      <Reveal>
        <div className="relative w-full">
          <Photo
            src="/images/operations/operations-centre-24-7.png"
            alt="SWT operations staff coordinating live transfers in the 24/7 operations centre"
            aspect="3 / 2"
            position="50% 40%"
            className="min-h-[440px] sm:min-h-0"
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-charcoal/85 via-charcoal/15 to-transparent" />
          <div className="edge wrap absolute inset-x-0 top-0 pt-10 md:pt-14 lg:pt-20">
            <p className="eyebrow mb-6 flex items-center gap-3">
              <span
                className="h-1.5 w-1.5 bg-swt-orange"
                aria-hidden="true"
              />
              Operations — Coordinating Now
            </p>
            <p className="font-display italic text-stat leading-none text-ivory">
              24/7
            </p>
            {/*
              Deliberately left at the item step rather than promoted to
              `display` with the other section titles. This section's
              heading weight is carried by the 24/7 stat directly above
              it at 80-118px; a 47px line under that would compete with
              it rather than support it. The same reasoning applies to
              OperationalProof, where the stat is itself the h2.
            */}
            <h2 className="mt-6 max-w-md font-display text-display-sm text-ivory">
              Always on the ground.
            </h2>
          </div>
        </div>
      </Reveal>

      <div className="edge wrap mt-12 lg:mt-16">
        <Reveal delay={100}>
          <ul className="flex flex-wrap gap-x-3 gap-y-2 border-t border-ivory/15 pt-8">
            {CAPABILITIES.map((item, i) => (
              <li
                key={item}
                className="flex items-center font-sans text-small uppercase tracking-[0.08em] text-ivory/65"
              >
                {item}
                {i < CAPABILITIES.length - 1 && (
                  <span className="ml-3 text-ivory/50" aria-hidden="true">
                    /
                  </span>
                )}
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
