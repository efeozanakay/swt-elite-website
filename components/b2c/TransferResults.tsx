"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { IconArrow, IconBag, IconCheck, IconClock, IconInfo, IconUsers } from "@/components/b2c/Icons";
import { TransferSearchForm } from "@/components/b2c/TransferSearchForm";
import { Photo } from "@/components/Photo";
import { PRICE_PLACEHOLDER, PROTOTYPE, RESULTS, SEARCH, SERVICES } from "@/lib/b2c/copy";
import { locationById, locationLabel, type TransferLocation } from "@/lib/b2c/demo/locations";
import { formatDate } from "@/lib/b2c/locale";
import { areaImageFor, tourDestinationFor } from "@/lib/b2c/cross-sell";
import { B2CImage } from "@/components/b2c/B2CImage";
import {
  searchFromParams,
  searchToQuery,
  timeLabel,
  validateSearch,
  type TransferSearch,
} from "@/lib/b2c/transfer-search";

type ServiceId = "shared" | "private";

const PHOTOS: Record<ServiceId, { src: string; alt: string; position: string }> = {
  shared: {
    src: "/images/operations/fleet-mixed-vehicle-lineup.png",
    alt: "SWT Elite minibuses and coaches parked by the coast",
    position: "30% 60%",
  },
  private: {
    src: "/images/operations/transportation-airport-vito.png",
    alt: "A private SWT Elite van outside an airport terminal",
    position: "50% 60%",
  },
};

export function TransferResults() {
  const params = useSearchParams();
  const router = useRouter();
  const search = useMemo(() => searchFromParams(new URLSearchParams(params.toString())), [params]);
  const from = locationById(search.from);
  const to = locationById(search.to);
  const complete = Boolean(from && to && search.date);
  // A bookmarked search can go stale (a date now in the past); open the
  // editor straight away rather than comparing services for a trip that
  // cannot happen.
  const [editing, setEditing] = useState(false);
  const [selected, setSelected] = useState<ServiceId | null>(null);
  const [mounted, setMounted] = useState(false);
  const summaryRef = useRef<HTMLDivElement>(null);
  const editButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    setMounted(true);
    if (complete && Object.keys(validateSearch(search)).length) setEditing(true);
  }, [complete, search]);

  const applySearch = (next: TransferSearch) => {
    router.replace(`/transfers/results?${searchToQuery(next)}`, { scroll: false });
    setEditing(false);
    setSelected(null);
    requestAnimationFrame(() => editButtonRef.current?.focus());
  };

  // Dates are formatted with the visitor's Intl data, which need not
  // match the build machine's, so nothing locale-formatted is rendered
  // before mount.
  if (!mounted) return <div className="min-h-[70vh] bg-charcoal" aria-busy="true" />;

  if (!complete) {
    return (
      <section className="bg-ivory pb-24 pt-[calc(var(--header-h)+4rem)]">
        <div className="edge wrap">
          <p className="eyebrow mb-6">{RESULTS.eyebrow}</p>
          <h1 className="font-display text-display text-ink">{RESULTS.missing.title}</h1>
          <p className="mt-4 max-w-xl font-sans text-body-lg text-graphite">{RESULTS.missing.body}</p>
          <div className="mt-10 border border-graphite/15 bg-ivory p-5 shadow-[0_40px_80px_-40px_rgba(21,19,15,0.35)] sm:p-7">
            <TransferSearchForm initial={search} onSearch={applySearch} />
          </div>
        </div>
      </section>
    );
  }

  const hotelSide = from!.kind === "airport" ? to! : from!;
  const tourDestination = tourDestinationFor(hotelSide.id);
  const areaImage = areaImageFor(hotelSide.id);
  const pax = search.adults + search.children;

  return (
    <>
      {/* ---------------- Journey summary ---------------- */}
      <section aria-labelledby="results-title" className="on-dark relative overflow-hidden bg-charcoal pb-10 pt-[calc(var(--header-h)+2.5rem)] text-ivory">
        {/* The destination, quietly: on the right half behind the heading,
            fading into the charcoal so it sets the scene without
            competing with the summary or the options below. */}
        {areaImage && (
          <div aria-hidden="true" className="absolute inset-y-0 right-0 w-full opacity-35 lg:w-[58%] lg:opacity-70">
            <B2CImage name={areaImage} alt="" sizes="(min-width: 1024px) 58vw, 100vw" />
            <div className="absolute inset-0 bg-gradient-to-r from-charcoal via-charcoal/60 to-charcoal/10" />
            <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/30 to-charcoal/40" />
          </div>
        )}
        <div className="edge wrap relative">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div className="min-w-0">
              <p className="eyebrow mb-4">{RESULTS.eyebrow}</p>
              <h1 id="results-title" className="font-display text-display">
                <span className="sr-only">{RESULTS.title}: </span>
                <span className="block">{from!.name}</span>
                <span className="flex items-center gap-3 text-ivory/90">
                  <IconArrow size={28} className="shrink-0 text-brand-amber" />
                  <span className="italic">{to!.name}</span>
                </span>
              </h1>
            </div>
            <button
              ref={editButtonRef}
              type="button"
              onClick={() => setEditing((v) => !v)}
              aria-expanded={editing}
              aria-controls="edit-search"
              className="btn-outline self-start lg:self-auto"
            >
              {editing ? RESULTS.closeEdit : RESULTS.edit}
            </button>
          </div>

          <dl className="mt-8 grid grid-cols-2 gap-px border border-ivory/15 bg-ivory/15 lg:grid-cols-4">
            <Leg
              label={search.trip === "return" ? RESULTS.outbound : SEARCH.oneWay}
              from={from!}
              to={to!}
              date={search.date}
              time={search.time}
            />
            {search.trip === "return" && search.returnDate ? (
              <Leg label={RESULTS.return} from={to!} to={from!} date={search.returnDate} time={search.returnTime} />
            ) : (
              <SummaryCell term={RESULTS.return} value="Not added" />
            )}
            <SummaryCell term={SEARCH.passengers} value={RESULTS.passengers(search.adults, search.children)} />
            <SummaryCell term="Journey type" value={search.trip === "return" ? SEARCH.roundTrip : SEARCH.oneWay} />
          </dl>
        </div>
      </section>

      {/* ---------------- Edit panel ---------------- */}
      <div id="edit-search" hidden={!editing} className="border-b border-graphite/15 bg-bone">
        <div className="edge wrap py-8">
          {/* Remount when the URL changes so the form starts from the
              search actually being shown. */}
          <TransferSearchForm key={params.toString()} initial={search} onSearch={applySearch} submitLabel={SEARCH.update} />
        </div>
      </div>

      {/* ---------------- Options ---------------- */}
      <section aria-labelledby="options-title" className="bg-ivory py-14 text-ink lg:py-20">
        <div className="edge wrap grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <div className="flex flex-wrap items-baseline justify-between gap-4">
              <h2 id="options-title" className="font-display text-display-sm">{RESULTS.title}</h2>
              <p className="font-sans text-small text-graphite">{PROTOTYPE.pricing}</p>
            </div>
            <div className="mt-8 grid gap-6 md:grid-cols-2">
              {(["shared", "private"] as const).map((id) => (
                <ServiceOption
                  key={id}
                  id={id}
                  pax={pax}
                  isReturn={search.trip === "return"}
                  selected={selected === id}
                  onSelect={() => {
                    setSelected(id);
                    // On small screens the summary sits below the cards;
                    // bring it into view so the selection has a visible result.
                    if (window.matchMedia("(max-width: 1023px)").matches) {
                      summaryRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
                    }
                  }}
                />
              ))}
            </div>
          </div>

          <aside aria-labelledby="summary-title" className="lg:col-span-4">
            <div ref={summaryRef} tabIndex={-1} className="border border-graphite/20 bg-white/60 p-6 focus:outline-none lg:sticky lg:top-[calc(var(--header-h)+24px)]">
              <h2 id="summary-title" className="eyebrow text-ink">{RESULTS.summary}</h2>
              <div aria-live="polite">
                {selected ? (
                  <>
                    <div className="mt-5 flex items-start justify-between gap-4 border-b border-graphite/15 pb-5">
                      <div>
                        <p className="font-display text-[1.5rem] leading-tight">{SERVICES[selected].name}</p>
                        {search.trip === "return" && <p className="mt-1 font-sans text-small text-graphite">{RESULTS.bothLegs}</p>}
                      </div>
                      <button type="button" onClick={() => setSelected(null)} className="link-quiet shrink-0 text-small">
                        {RESULTS.change}
                      </button>
                    </div>
                    <dl className="divide-y divide-graphite/15 font-sans text-small">
                      <Row term={search.trip === "return" ? RESULTS.outbound : "Journey"} value={`${locationLabel(from!)} → ${locationLabel(to!)}`} />
                      <Row term="Date" value={`${formatDate(search.date, "long")}${search.time ? `, ${search.time}` : ""}`} />
                      {search.trip === "return" && search.returnDate && (
                        <>
                          <Row term={RESULTS.return} value={`${locationLabel(to!)} → ${locationLabel(from!)}`} />
                          <Row term="Date" value={`${formatDate(search.returnDate, "long")}${search.returnTime ? `, ${search.returnTime}` : ""}`} />
                        </>
                      )}
                      <Row term={SEARCH.passengers} value={RESULTS.passengers(search.adults, search.children)} />
                      <Row term={SERVICES[selected].priceBasis} value={PRICE_PLACEHOLDER} />
                    </dl>
                  </>
                ) : (
                  <p className="mt-5 font-sans text-body text-graphite">{RESULTS.noSelection}</p>
                )}
              </div>
              <button type="button" disabled className="btn-action mt-6 w-full" aria-describedby="booking-note">
                {RESULTS.continueLater}
              </button>
              <p id="booking-note" className="mt-4 flex gap-2 font-sans text-small text-graphite">
                <IconInfo size={18} className="mt-0.5 shrink-0" />
                {PROTOTYPE.booking}
              </p>
            </div>
          </aside>
        </div>
      </section>

      {/* ---------------- Cross-sell ---------------- */}
      {tourDestination && (
        <section aria-labelledby="xsell-title" className="bg-bone py-16 text-ink lg:py-20">
          <div className="edge wrap">
            <div className="grid overflow-hidden border border-graphite/15 bg-ivory md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
              {areaImage && (
                <div className="relative aspect-[16/9] md:aspect-auto md:min-h-[16rem]">
                  <B2CImage name={areaImage} sizes="(min-width: 768px) 40vw, 100vw" />
                </div>
              )}
              <div className="flex flex-col items-start justify-center gap-6 border-t-2 border-brand-amber p-6 sm:p-10 md:border-l-2 md:border-t-0">
                <div className="max-w-lg">
                  <p className="eyebrow mb-3">{RESULTS.crossSellEyebrow}</p>
                  <h2 id="xsell-title" className="font-display text-display-sm">{RESULTS.crossSell(hotelSide.name)}</h2>
                  <p className="mt-3 font-sans text-body text-graphite">{RESULTS.crossSellBody}</p>
                </div>
                <Link href={`/tours?destination=${encodeURIComponent(tourDestination)}#discover`} className="btn-outline">
                  {RESULTS.crossSellCta}
                  <IconArrow size={16} />
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Mobile: keep the choice visible once made, without covering
          the cards before it is. */}
      {selected && <div aria-hidden="true" className="h-20 lg:hidden" />}
      {selected && (
        <div className="fixed inset-x-0 bottom-0 z-40 border-t border-graphite/20 bg-ivory/95 backdrop-blur-sm lg:hidden">
          <div className="edge flex items-center justify-between gap-4 py-3">
            <p className="min-w-0 font-sans text-small">
              <span className="block truncate font-medium text-ink">{SERVICES[selected].name}</span>
              <span className="text-graphite">{SERVICES[selected].priceBasis} {PRICE_PLACEHOLDER}</span>
            </p>
            <button
              type="button"
              className="btn-outline shrink-0 px-4 py-2.5"
              onClick={() => {
                summaryRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
                summaryRef.current?.focus({ preventScroll: true });
              }}
            >
              {RESULTS.summary}
            </button>
          </div>
        </div>
      )}
    </>
  );
}

function Leg({ label, from, to, date, time }: { label: string; from: TransferLocation; to: TransferLocation; date: string; time: string }) {
  return (
    <div className="col-span-2 bg-charcoal p-4 sm:col-span-1 sm:p-5">
      <dt className="font-sans text-[0.6875rem] uppercase tracking-[0.14em] text-stone">{label}</dt>
      <dd className="mt-2 font-sans text-body text-ivory">{formatDate(date, "long")}</dd>
      <dd className="mt-1 font-sans text-small text-ivory/70">
        {timeLabel(from)}: {time || RESULTS.timeTbc}
      </dd>
      <dd className="sr-only">
        {from.name} to {to.name}
      </dd>
    </div>
  );
}

function SummaryCell({ term, value }: { term: string; value: string }) {
  return (
    <div className="bg-charcoal p-4 sm:p-5">
      <dt className="font-sans text-[0.6875rem] uppercase tracking-[0.14em] text-stone">{term}</dt>
      <dd className="mt-2 font-sans text-body text-ivory">{value}</dd>
    </div>
  );
}

function Row({ term, value }: { term: string; value: string }) {
  return (
    <div className="flex justify-between gap-4 py-3">
      <dt className="shrink-0 text-graphite">{term}</dt>
      <dd className="text-right text-ink">{value}</dd>
    </div>
  );
}

function ServiceOption({
  id,
  pax,
  isReturn,
  selected,
  onSelect,
}: {
  id: ServiceId;
  pax: number;
  isReturn: boolean;
  selected: boolean;
  onSelect: () => void;
}) {
  const svc = SERVICES[id];
  const photo = PHOTOS[id];
  const [open, setOpen] = useState(false);
  const facts =
    id === "shared"
      ? [
          { icon: IconUsers, term: "Seats", value: `${pax} ${pax === 1 ? "seat" : "seats"} in a shared vehicle` },
          { icon: IconClock, term: "Journey", value: "Waiting time and extra stops possible" },
          { icon: IconBag, term: RESULTS.luggageCapacity, value: RESULTS.luggageTbc },
        ]
      : [
          { icon: IconUsers, term: RESULTS.passengerCapacity, value: RESULTS.capacityFor(pax) },
          { icon: IconClock, term: "Journey", value: "Direct, no other stops" },
          { icon: IconBag, term: RESULTS.luggageCapacity, value: RESULTS.luggageTbc },
        ];

  return (
    <article
      aria-labelledby={`svc-${id}`}
      className={`relative flex flex-col border bg-white/60 transition-[border-color,box-shadow] duration-300 ${
        selected ? "border-ink shadow-[0_0_0_1px_theme(colors.ink)]" : "border-graphite/20 hover:border-graphite/45"
      }`}
    >
      {selected && <span aria-hidden="true" className="absolute inset-x-0 top-0 z-10 h-1 bg-brand-amber" />}
      <Photo src={photo.src} alt={photo.alt} aspect="16 / 9" position={photo.position} sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw" />
      <div className="flex flex-1 flex-col p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 id={`svc-${id}`} className="font-display text-[1.625rem] leading-tight">{svc.name}</h3>
            <p className="mt-1 font-sans text-body text-graphite">{svc.tagline}</p>
          </div>
          {selected && (
            <span className="demo-tag shrink-0 border-ink bg-ink py-1 text-ivory">
              <IconCheck size={12} /> {RESULTS.selected}
            </span>
          )}
        </div>

        <ul className="mt-5 space-y-2.5">
          {svc.features.map((f) => (
            <li key={f} className="flex gap-2.5 font-sans text-small text-ink">
              <IconCheck size={16} className="mt-0.5 shrink-0 text-brand-navy" />
              {f}
            </li>
          ))}
        </ul>

        <dl className="mt-5 space-y-3 border-t border-graphite/15 pt-5 font-sans text-small">
          {facts.map(({ icon: Icon, term, value }) => (
            <div key={term} className="flex gap-3">
              <Icon size={18} className="mt-0.5 shrink-0 text-graphite" />
              <div>
                <dt className="text-graphite">{term}</dt>
                <dd className="text-ink">{value}</dd>
              </div>
            </div>
          ))}
        </dl>

        <button
          type="button"
          aria-expanded={open}
          aria-controls={`svc-${id}-details`}
          onClick={() => setOpen((v) => !v)}
          className="mt-5 inline-flex items-center gap-2 self-start font-sans text-small font-medium text-brand-navy underline-offset-4 hover:underline"
        >
          {open ? RESULTS.hideDetails : RESULTS.details}
          <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden="true" className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`}>
            <path d="M1 3l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.25" />
          </svg>
        </button>
        <dl id={`svc-${id}-details`} hidden={!open} className="mt-4 space-y-3 bg-bone/70 p-4 font-sans text-small">
          {svc.details.map((d) => (
            <div key={d.term}>
              <dt className="font-medium text-ink">{d.term}</dt>
              <dd className="mt-0.5 text-graphite">{d.detail}</dd>
            </div>
          ))}
        </dl>

        <div className="mt-auto flex items-end justify-between gap-4 pt-6">
          <div>
            <p className="font-sans text-[0.6875rem] uppercase tracking-[0.14em] text-graphite">{svc.priceBasis}</p>
            <p className="mt-1 font-display text-[1.75rem] leading-none" aria-label={`${svc.priceBasis}: not shown in this preview`}>
              {PRICE_PLACEHOLDER}
            </p>
            {isReturn && <p className="mt-1 font-sans text-[0.75rem] text-graphite">{RESULTS.bothLegs}</p>}
          </div>
          <button
            type="button"
            aria-pressed={selected}
            onClick={onSelect}
            className={selected ? "btn-outline border-ink bg-ink px-5 py-3 text-ivory hover:bg-ink" : "btn-action px-5 py-3"}
          >
            {selected ? RESULTS.selected : RESULTS.select}
            <span className="sr-only"> {svc.name}</span>
          </button>
        </div>
      </div>
    </article>
  );
}
