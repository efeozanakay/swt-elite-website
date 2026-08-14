import { Photo } from "@/components/Photo";
import { Reveal } from "@/components/Reveal";

export function OperationalProof() {
  return (
    <section className="on-dark bg-charcoal py-24 sm:py-32">
      <div className="edge wrap grid grid-cols-1 gap-16 lg:grid-cols-12 lg:items-start lg:gap-8">
        <Reveal className="lg:col-span-6">
          <p className="eyebrow mb-8">Operational Scale</p>
          <h2 className="font-display italic text-stat text-ivory">
            300,000+
          </h2>
          <p className="mt-4 font-sans text-small uppercase tracking-[0.14em] text-ivory/60">
            Guest Movements Coordinated
          </p>
          <p className="mt-10 max-w-lg font-sans text-body-lg text-ivory/75">
            Across a fleet of 200+ vehicles and 6 destination teams,
            coordinated from a single operations centre.
          </p>
        </Reveal>

        {/* Aspect adjusted from the original 1:1 square to 3:2 — the
            approved fleet-lineup photo is landscape and needs width to
            read as a "lineup"; a square crop would lose that. Column
            widened (3→6 span, matching the text column) so the photo
            reads as strong visual proof; the statistic's own type scale
            keeps it the dominant element regardless of column width. */}
        <Reveal
          delay={120}
          className="lg:col-span-6 lg:col-start-7 lg:pt-2"
        >
          <Photo
            src="/images/operations/operational-scale-real-fleet-lineup.png"
            alt="Real SWT partner fleet lineup demonstrating operational scale"
            aspect="3 / 2"
            position="55% 68%"
            className="lg:ml-auto lg:max-w-[650px]"
            sizes="(min-width: 1024px) 650px, 100vw"
          />
        </Reveal>
      </div>
    </section>
  );
}
