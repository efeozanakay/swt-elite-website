import type { Metadata } from "next";
import Link from "next/link";
import { Faq } from "@/components/b2c/Faq";
import { IconArrow, IconCheck } from "@/components/b2c/Icons";
import { RouteShortcuts } from "@/components/b2c/RouteShortcuts";
import { B2CImage } from "@/components/b2c/B2CImage";
import { SectionIntro } from "@/components/b2c/SectionIntro";
import { TransferSearchForm } from "@/components/b2c/TransferSearchForm";
import { TravelShell } from "@/components/b2c/TravelShell";
import { Photo } from "@/components/Photo";
import { Reveal } from "@/components/Reveal";
import { AirportMeetingPicker } from "@/components/b2c/AirportMeetingPicker";
import { LicenceLine } from "@/components/b2c/LicenceLine";
import { SupportBlock } from "@/components/b2c/SupportBlock";
import { DEPARTURE_PICKUP, FLIGHT_MONITORING } from "@/lib/b2c/business";
import { MEETING, PRICE_PLACEHOLDER, PROTOTYPE, SERVICES, TRANSFERS } from "@/lib/b2c/copy";
import { TOURS as TOUR_LIST } from "@/lib/b2c/demo/tours";

export const metadata: Metadata = {
  title: TRANSFERS.meta.title,
  description: TRANSFERS.meta.description,
  alternates: { canonical: "/transfers" },
  openGraph: {
    title: TRANSFERS.meta.title,
    description: TRANSFERS.meta.description,
    url: "/transfers",
    type: "website",
    locale: "en_GB",
    siteName: "SWT Elite",
  },
};

const SERVICE_PHOTOS = {
  shared: {
    src: "/images/operations/fleet-mixed-vehicle-lineup.png",
    alt: "SWT Elite minibuses and coaches parked in a row by the coast at sunset",
    position: "30% 60%",
  },
  private: {
    src: "/images/operations/transportation-airport-vito.png",
    alt: "A private SWT Elite van with its driver outside an airport terminal",
    position: "50% 60%",
  },
};

export default function TransfersPage() {
  return (
    <TravelShell current="transfers">
      {/* ---------------- Hero + search ---------------- */}
      <section aria-labelledby="hero-title" className="relative bg-ivory">
        <div className="on-dark relative flex min-h-[560px] flex-col justify-end overflow-hidden bg-charcoal pb-28 pt-[calc(var(--header-h)+3rem)] md:min-h-[640px] lg:h-[88svh] lg:max-h-[920px] lg:pb-56">
          {/* Both services in one frame: a shared minibus and a private van
              at the kerb. The vehicles sit right of centre, so the focal
              point keeps them in shot on narrow screens while the sunset
              sky on the left carries the headline under a scrim. */}
          <B2CImage name="airport-transfer-sunset" alt={TRANSFERS.hero.imageAlt} sizes="100vw" priority focus="66% 70%" />
          {/* Scrim weighted to the type only: a left-side gradient that has
              faded out before the vehicles, and a short top band for the
              header. Kept light so the sunset and both vehicles read. */}
          <div aria-hidden="true" className="absolute inset-y-0 left-0 w-full bg-gradient-to-r from-charcoal/80 via-charcoal/40 to-transparent lg:w-[70%]" />
          <div aria-hidden="true" className="absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-charcoal/45 to-transparent" />
          <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-charcoal/55 to-transparent" />
          {/* The white minibus sits directly behind the body copy at desktop
              widths. A soft local pool of shade behind the text block,
              rather than a heavier full-width scrim, keeps the copy at
              reading contrast without dimming the rest of the frame. */}
          {/* Below lg the copy spans the full width and crosses the van, so
              the whole frame takes an even shade instead. */}
          <div aria-hidden="true" className="absolute inset-0 bg-charcoal/35 lg:hidden" />
          <div aria-hidden="true" className="absolute inset-0 hidden lg:block bg-[radial-gradient(ellipse_48%_42%_at_22%_58%,rgba(21,19,15,0.72),transparent_100%)]" />
          <div className="edge wrap relative w-full">
            <Reveal immediate className="max-w-3xl">
              <p className="eyebrow mb-6 flex items-center gap-3">
                <span className="h-1.5 w-1.5 bg-brand-amber" aria-hidden="true" />
                {TRANSFERS.hero.eyebrow}
              </p>
              <h1 id="hero-title" className="font-display text-hero-sm text-ivory sm:text-hero lg:text-display-lg">
                {TRANSFERS.hero.title[0]}
                <br />
                <span className="italic">{TRANSFERS.hero.title[1]}</span>
              </h1>
              <p className="mt-6 max-w-lg font-sans text-body-lg text-ivory/85">{TRANSFERS.hero.body}</p>
            </Reveal>
          </div>
        </div>

        {/* The search panel overlaps the photograph so the page's single
            most important control is above the fold at every width. */}
        <div id="search" className="edge wrap relative z-20 -mt-16 pb-16 lg:-mt-40">
          <div className="border border-graphite/15 bg-ivory p-5 shadow-[0_40px_80px_-40px_rgba(21,19,15,0.55)] sm:p-7 lg:p-8">
            <h2 className="sr-only">Search transfers</h2>
            <TransferSearchForm readUrl />
          </div>
          <ul className="mt-6 flex flex-wrap gap-x-8 gap-y-3 font-sans text-small text-graphite">
            {TRANSFERS.assurances.map((t) => (
              <li key={t} className="flex items-center gap-2">
                <IconCheck size={16} className="text-brand-navy" />
                {t}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ---------------- Shared vs private ---------------- */}
      <section aria-labelledby="compare-title" className="bg-ivory pb-24 pt-12 text-ink md:pb-28 lg:pb-32">
        <div className="edge wrap">
          <SectionIntro
            id="compare-title"
            eyebrow={TRANSFERS.compare.eyebrow}
            title={TRANSFERS.compare.title}
            body={TRANSFERS.compare.body}
          />
          <div className="mt-14 grid gap-6 lg:grid-cols-2">
            {[SERVICES.shared, SERVICES.private].map((svc, i) => {
              const photo = SERVICE_PHOTOS[svc.id];
              return (
                <Reveal key={svc.id} delay={i * 100}>
                  <article className="flex h-full flex-col border border-graphite/20 bg-white/50">
                    <Photo src={photo.src} alt={photo.alt} aspect="16 / 9" position={photo.position} sizes="(min-width: 1024px) 50vw, 100vw" />
                    <div className="flex flex-1 flex-col p-6 sm:p-8">
                      <div className="flex flex-wrap items-start justify-between gap-6">
                        <div>
                          <h3 className="font-display text-display-sm">{svc.name}</h3>
                          <p className="mt-2 font-sans text-body text-graphite">{svc.tagline}</p>
                        </div>
                        <PriceTag basis={svc.priceBasis} />
                      </div>
                      <ul className="mt-6 grid gap-3 sm:grid-cols-2">
                        {svc.features.map((f) => (
                          <li key={f} className="flex gap-3 font-sans text-body text-ink">
                            <IconCheck size={18} className="mt-1 shrink-0 text-brand-navy" />
                            {f}
                          </li>
                        ))}
                      </ul>
                      <p className="mt-auto pt-8 font-sans text-small text-graphite">
                        <span className="font-medium uppercase tracking-[0.12em] text-ink">{TRANSFERS.compare.bestFor}</span>
                        <span className="mx-2" aria-hidden="true">·</span>
                        {svc.bestFor}
                      </p>
                    </div>
                  </article>
                </Reveal>
              );
            })}
          </div>
          <p className="mt-6 font-sans text-small text-graphite">{PROTOTYPE.pricing}</p>
        </div>
      </section>

      {/* ---------------- How it works ---------------- */}
      <section aria-labelledby="how-title" className="on-dark bg-charcoal py-24 text-ivory md:py-28 lg:py-32">
        <div className="edge wrap grid items-center gap-14 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <Reveal>
              <Photo
                src="/images/operations/ground-handling-meet-greet.png"
                alt="An SWT Elite representative holding a welcome sign in an airport arrivals hall"
                aspect="4 / 5"
                position="62% 50%"
                sizes="(min-width: 1024px) 40vw, 100vw"
              />
            </Reveal>
          </div>
          <div className="lg:col-span-7">
            <SectionIntro id="how-title" eyebrow={TRANSFERS.how.eyebrow} title={TRANSFERS.how.title} />
            <ol className="mt-12 border-t border-ivory/15">
              {/* li > Reveal, not Reveal > li: an <ol> may only contain
                  <li> children, and the wrapper div broke that. */}
              {TRANSFERS.how.steps.map((step, i) => (
                <li key={step.name} className="border-b border-ivory/15">
                  <Reveal delay={i * 80} className="grid grid-cols-[3rem_1fr] gap-x-4 py-6 sm:grid-cols-[4rem_14rem_1fr] sm:items-baseline">
                    <span className="font-display text-display-sm text-brand-amber">{String(i + 1).padStart(2, "0")}</span>
                    <h3 className="font-display text-[1.375rem] leading-snug">{step.name}</h3>
                    <p className="col-start-2 mt-2 font-sans text-body text-ivory/70 sm:col-start-3 sm:mt-0">{step.detail}</p>
                  </Reveal>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* ---------------- Airport meeting points ---------------- */}
      <section id="meeting" aria-labelledby="meeting-title" className="bg-ivory py-20 text-ink md:py-24">
        <div className="edge wrap">
          <SectionIntro id="meeting-title" eyebrow={MEETING.eyebrow} title={MEETING.title} body={MEETING.body} />
          <div className="mt-10 border-t border-graphite/20 pt-8">
            <AirportMeetingPicker />
          </div>
          <p className="mt-8 max-w-2xl font-sans text-small text-graphite">{FLIGHT_MONITORING} {DEPARTURE_PICKUP}</p>
        </div>
      </section>

      {/* ---------------- Popular routes ---------------- */}
      <section aria-labelledby="routes-title" className="bg-bone py-24 text-ink md:py-28 lg:py-32">
        <div className="edge wrap">
          <SectionIntro
            id="routes-title"
            eyebrow={TRANSFERS.destinations.eyebrow}
            title={TRANSFERS.destinations.title}
            body={TRANSFERS.destinations.body}
          />
          <Reveal delay={80} className="mt-12">
            <RouteShortcuts />
          </Reveal>
          <p className="mt-6 font-sans text-small text-graphite">
            {TRANSFERS.destinations.note} {PROTOTYPE.imagery}
          </p>
        </div>
      </section>

      {/* ---------------- Why ---------------- */}
      <section aria-labelledby="why-title" className="bg-ivory py-24 text-ink md:py-28 lg:py-32">
        <div className="edge wrap">
          <SectionIntro id="why-title" eyebrow={TRANSFERS.why.eyebrow} title={TRANSFERS.why.title} body={TRANSFERS.why.body} />
          <Reveal delay={80}>
            <ul className="mt-14 grid border-t border-graphite/20 sm:grid-cols-2 lg:grid-cols-4">
              {TRANSFERS.why.items.map((item, i) => (
                <li
                  key={item.name}
                  className={`border-b border-graphite/20 py-8 sm:pr-8 lg:border-b-0 ${
                    i % 2 === 1 ? "sm:border-l sm:pl-8" : ""
                  } ${i > 0 ? "lg:border-l lg:pl-8" : ""}`}
                >
                  <span className="block h-px w-8 bg-brand-amber" aria-hidden="true" />
                  <h3 className="mt-6 font-display text-[1.375rem] leading-snug">{item.name}</h3>
                  <p className="mt-3 font-sans text-body text-graphite">{item.detail}</p>
                </li>
              ))}
            </ul>
          </Reveal>
          <LicenceLine className="mt-10" />
        </div>
      </section>

      {/* ---------------- Tours cross-sell ---------------- */}
      <section aria-labelledby="stay-title" className="on-dark relative overflow-hidden bg-charcoal text-ivory">
        {/* Full-bleed landscape behind the bridge to Tours: the page turns
            from getting there to being there. */}
        <B2CImage name="lycian-coast-ruins-sunset" alt="" sizes="100vw" focus="55% 50%" />
        <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-r from-charcoal/90 via-charcoal/65 to-charcoal/30" />
        <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-charcoal/70 via-transparent to-charcoal/40" />
        <div className="edge wrap relative grid items-center gap-12 py-24 lg:grid-cols-12 lg:py-32">
          <div className="lg:col-span-5">
            <SectionIntro
              id="stay-title"
              eyebrow={TRANSFERS.tours.eyebrow}
              title={TRANSFERS.tours.title}
              body={TRANSFERS.tours.body}
            />
            <Link href="/tours" className="btn-action mt-10">
              {TRANSFERS.tours.cta}
              <IconArrow size={16} />
            </Link>
          </div>
          <ul className="grid grid-cols-3 gap-3 lg:col-span-7">
            {TOUR_LIST.filter((t) => t.featured).slice(0, 3).map((t, i) => (
              <li key={t.id} className={i === 1 ? "translate-y-8" : ""}>
                <Link href={`/tours?tour=${t.id}`} className="group block">
                  <span className="relative block aspect-[3/4] overflow-hidden ring-1 ring-ivory/15">
                    <span className="absolute inset-0 transition-transform duration-700 ease-editorial group-hover:scale-[1.04]">
                      <B2CImage name={t.image} alt="" sizes="(min-width: 1024px) 260px, 33vw" />
                    </span>
                  </span>
                  <span className="mt-3 block font-sans text-[0.6875rem] uppercase tracking-[0.14em] text-ivory/75">{t.destination}</span>
                  <span className="mt-1 block font-display text-[1.0625rem] leading-snug sm:text-[1.25rem]">{t.title}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <Faq eyebrow={TRANSFERS.faq.eyebrow} title={TRANSFERS.faq.title} items={TRANSFERS.faq.items} />

      <SupportBlock />
    </TravelShell>
  );
}

function PriceTag({ basis }: { basis: string }) {
  return (
    <div className="text-right">
      <p className="font-sans text-[0.6875rem] uppercase tracking-[0.14em] text-graphite">{basis}</p>
      <p className="mt-1 font-display text-display-sm text-ink" aria-label={`${basis}: not shown in this preview`}>
        {PRICE_PLACEHOLDER}
      </p>
    </div>
  );
}
