import { Photo } from "@/components/Photo";
import { Reveal } from "@/components/Reveal";

export function OperationalProof() {
  return (
    <section className="on-dark bg-charcoal py-24 md:py-28 lg:py-32">
      {/*
        Two columns from md. Stacked, this was the single most expensive
        section at tablet: 1027px against 558px at 1024, because the
        3:2 photograph took the full 753px width and pushed the statistic
        a whole screen away from its own evidence. Splitting at md puts
        the two back beside each other and gives the photo ~344px, which
        is close to the ~430px it already gets in the 6-col at 1024.
      */}
      <div className="edge wrap grid grid-cols-1 gap-12 md:grid-cols-12 md:items-start md:gap-8">
        <Reveal className="md:col-span-6">
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
          className="md:col-span-6 md:col-start-7 md:pt-2"
        >
          <Photo
            src="/images/operations/operational-scale-real-fleet-lineup.png"
            alt="Real SWT partner fleet lineup demonstrating operational scale"
            aspect="3 / 2"
            position="55% 68%"
            className="lg:ml-auto lg:max-w-[650px]"
            // measured 327 / 321 / 425 / 601 / 608 at 375 / 768 / 1024 / 1440 / 1920
          sizes="(min-width: 1440px) 608px, (min-width: 768px) 42vw, calc(100vw - 48px)"
          />
        </Reveal>
      </div>
    </section>
  );
}
